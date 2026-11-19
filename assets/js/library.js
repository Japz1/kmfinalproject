/**
 * library.js — Logic for library.html
 */

let _allKnowledge   = [];
let _allCategories  = [];
let _activeCategory = '';
let _searchQuery    = '';

document.addEventListener('DOMContentLoaded', async () => {
  await initLibrary();
});

async function initLibrary() {
  const grid = document.getElementById('knowledgeGrid');
  if (!grid) return;

  grid.innerHTML = renderLoadingState();

  try {
    [_allCategories, _allKnowledge] = await Promise.all([loadCategories(), loadKnowledge()]);
  } catch (err) {
    console.error('Library load error:', err);
    grid.innerHTML = renderEmptyState(
      'Artikel belum bisa dimuat',
      'Periksa koneksi Anda, lalu muat ulang halaman ini.',
      false
    );
    return;
  }

  // Read URL params
  _activeCategory = getParam('category');
  _searchQuery    = getParam('q');

  // Ignore an unknown category id instead of showing a confusing empty state.
  if (_activeCategory && !_allCategories.some(cat => cat.id === _activeCategory)) {
    _activeCategory = '';
  }

  // Build filter buttons
  buildFilterBar();

  // Build search bar
  setupSearch();

  // Render
  renderLibrary();

  // Update total count
  updateTotalCount();

  // Normalise the URL (e.g. remove an unknown category id).
  syncUrl();
}

/* ---- Filter bar ---- */
function filterBtnClass(isActive) {
  return isActive
    ? 'filter-btn inline-flex min-h-[38px] items-center whitespace-nowrap rounded-full border-[1.5px] border-primary bg-primary px-2.5 py-1.5 text-[0.75rem] font-semibold text-white max-md:min-h-[44px] sm:px-4 sm:py-2 sm:text-[0.8125rem]'
    : 'filter-btn inline-flex min-h-[38px] items-center whitespace-nowrap rounded-full border-[1.5px] border-line bg-white px-2.5 py-1.5 text-[0.75rem] font-medium text-muted transition-colors hover:border-navy hover:text-navy max-md:min-h-[44px] sm:px-4 sm:py-2 sm:text-[0.8125rem]';
}

function paintFilterButtons() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    const isActive = btn.dataset.cat === _activeCategory;
    btn.className = filterBtnClass(isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });
}

function buildFilterBar() {
  const bar = document.getElementById('filterBar');
  if (!bar) return;

  const allBtn = `<button class="${filterBtnClass(!_activeCategory)}" data-cat="" aria-pressed="${!_activeCategory}" onclick="setCategory('')">Semua Artikel</button>`;
  const catBtns = _allCategories.map(cat =>
    `<button class="${filterBtnClass(_activeCategory === cat.id)}" data-cat="${cat.id}" aria-pressed="${_activeCategory === cat.id}" onclick="setCategory('${cat.id}')">${escapeHtml(cat.name)}</button>`
  ).join('');

  bar.innerHTML = allBtn + catBtns;
}

/* ---- Search ---- */
function setupSearch() {
  const input = document.getElementById('librarySearch');
  const clear = document.getElementById('librarySearchClear');
  if (!input) return;

  if (_searchQuery) {
    input.value = _searchQuery;
    toggleClearButton(clear, true);
  }

  const debouncedRender = debounce(() => {
    renderLibrary();
    updateTotalCount();
    syncUrl();
  }, 300);

  input.addEventListener('input', () => {
    _searchQuery = input.value.trim();
    toggleClearButton(clear, _searchQuery.length > 0);
    debouncedRender();
  });

  clear.addEventListener('click', () => {
    _searchQuery = '';
    input.value = '';
    toggleClearButton(clear, false);
    renderLibrary();
    updateTotalCount();
    syncUrl();
    input.focus();
  });
}

/* ---- Public actions ---- */
function setCategory(catId) {
  _activeCategory = catId;
  paintFilterButtons();
  renderLibrary();
  updateTotalCount();
  syncUrl();
}

function clearFilters() {
  _searchQuery = '';
  _activeCategory = '';
  const input = document.getElementById('librarySearch');
  if (input) { input.value = ''; }
  const clear = document.getElementById('librarySearchClear');
  if (clear) toggleClearButton(clear, false);
  paintFilterButtons();
  renderLibrary();
  updateTotalCount();
  syncUrl();
}

function syncUrl() {
  const params = new URLSearchParams();
  if (_activeCategory) params.set('category', _activeCategory);
  if (_searchQuery) params.set('q', _searchQuery);
  const query = params.toString();
  const nextUrl = window.location.pathname + (query ? `?${query}` : '');
  window.history.replaceState(null, '', nextUrl);
}

/* ---- Render ---- */
function renderLibrary() {
  const grid = document.getElementById('knowledgeGrid');
  if (!grid) return;

  const catMap = {};
  _allCategories.forEach(c => { catMap[c.id] = c; });

  let results = _allKnowledge;

  if (_activeCategory) {
    results = results.filter(k => k.categoryId === _activeCategory);
  }

  if (_searchQuery) {
    results = results.filter(k => matchesSearch(k, _searchQuery, catMap[k.categoryId]));
  }

  if (results.length === 0) {
    const hasFilter = _activeCategory || _searchQuery;
    grid.innerHTML = renderEmptyState(
      hasFilter ? 'Tidak ada artikel yang cocok' : 'Belum ada artikel',
      hasFilter ? 'Coba kata kunci lain atau hapus filter yang aktif.' : 'Artikel akan segera tersedia.',
      hasFilter
    );
    return;
  }

  grid.innerHTML = results.map(item => renderKnowledgeCard(item, catMap[item.categoryId])).join('');
}

function updateFilterStatus() {
  const status = document.getElementById('libraryFilterStatus');
  const clearBtn = document.getElementById('libraryClearFilters');
  const hasFilter = Boolean(_activeCategory || _searchQuery);

  if (clearBtn) {
    clearBtn.classList.toggle('hidden', !hasFilter);
    clearBtn.classList.toggle('inline-flex', hasFilter);
  }

  if (!status) return;

  if (!hasFilter) {
    status.textContent = 'Menampilkan seluruh koleksi';
    return;
  }

  const cat = _allCategories.find(c => c.id === _activeCategory);
  const bits = [];
  if (cat) bits.push(`Kategori: ${cat.name}`);
  if (_searchQuery) bits.push(`Pencarian: “${_searchQuery}”`);
  status.textContent = bits.join(' · ');
}

function updateTotalCount() {
  const el = document.getElementById('totalCount');
  if (!el) return;

  let count = _allKnowledge.length;

  if (_activeCategory || _searchQuery) {
    let filtered = _allKnowledge;
    if (_activeCategory) filtered = filtered.filter(k => k.categoryId === _activeCategory);
    if (_searchQuery) {
      const catMap = {};
      _allCategories.forEach(c => { catMap[c.id] = c; });
      filtered = filtered.filter(k => matchesSearch(k, _searchQuery, catMap[k.categoryId]));
    }
    count = filtered.length;
  }

  el.textContent = count;
  updateFilterStatus();
}

