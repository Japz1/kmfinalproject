/**
 * home.js — Logic for index.html
 */

document.addEventListener('DOMContentLoaded', async () => {
  setupHeroSearch();
  await loadHomeData();
});

/* ---- Hero search ---- */
function setupHeroSearch() {
  const input = document.getElementById('heroSearch');
  const clear = document.getElementById('heroSearchClear');
  if (!input) return;

  input.addEventListener('input', () => {
    toggleClearButton(clear, input.value.length > 0);
  });

  clear.addEventListener('click', () => {
    input.value = '';
    toggleClearButton(clear, false);
    input.focus();
  });

  const form = document.getElementById('heroSearchForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (q) {
      window.location.href = `library.html?q=${encodeURIComponent(q)}`;
    } else {
      window.location.href = 'library.html';
    }
  });
}

/* ---- Main data loading ---- */
async function loadHomeData() {
  showHomeLoading();

  try {
    const [categories, knowledge] = await Promise.all([loadCategories(), loadKnowledge()]);

    renderFeaturedCategories(categories, knowledge);
    renderFeaturedKnowledge(knowledge, categories);
    renderLatestKnowledge(knowledge, categories);
    renderStats(categories, knowledge);
  } catch (err) {
    console.error('Failed to load home data:', err);
    showError('Periksa koneksi Anda, lalu muat ulang halaman ini.');
  }
}

/* ---- Stats ---- */
const STAT_ITEM = 'bg-white px-5 py-6 text-center';
const STAT_NUMBER = 'font-display text-[2.15rem] font-bold leading-none tracking-[-0.04em] text-primary';
const STAT_LABEL = 'mt-1.5 text-[0.8125rem] text-muted';

function renderStats(categories, knowledge) {
  const el = document.getElementById('statsStrip');
  if (!el) return;
  el.innerHTML = `
    <div class="${STAT_ITEM}">
      <div class="${STAT_NUMBER}">${knowledge.length}</div>
      <div class="${STAT_LABEL}">Total Artikel</div>
    </div>
    <div class="${STAT_ITEM}">
      <div class="${STAT_NUMBER}">${categories.length}</div>
      <div class="${STAT_LABEL}">Kategori</div>
    </div>
    <div class="${STAT_ITEM}">
      <div class="${STAT_NUMBER}">100%</div>
      <div class="${STAT_LABEL}">Gratis &amp; Terbuka</div>
    </div>
    <div class="${STAT_ITEM}">
      <div class="${STAT_NUMBER}">ID</div>
      <div class="${STAT_LABEL}">Bahasa Indonesia</div>
    </div>
  `;
}

/* ---- Featured Categories ---- */
function renderFeaturedCategories(categories, knowledge) {
  const el = document.getElementById('featuredCategories');
  if (!el) return;

  const counts = {};
  knowledge.forEach(k => {
    counts[k.categoryId] = (counts[k.categoryId] || 0) + 1;
  });

  el.innerHTML = categories
    .map(cat => renderCategoryCard(cat, counts[cat.id] || 0))
    .join('');
}

/* ---- Featured Knowledge ---- */
function renderFeaturedKnowledge(knowledge, categories) {
  const el = document.getElementById('featuredKnowledge');
  if (!el) return;

  const catMap = {};
  categories.forEach(c => { catMap[c.id] = c; });

  const featured = knowledge.filter(k => k.featured).slice(0, 3);
  if (featured.length === 0) {
    el.innerHTML = renderEmptyState('Belum ada artikel unggulan', '', false);
    return;
  }

  el.innerHTML = featured.map(item => renderKnowledgeCard(item, catMap[item.categoryId])).join('');
}

/* ---- Latest Knowledge ---- */
function renderLatestKnowledge(knowledge, categories) {
  const el = document.getElementById('latestKnowledge');
  if (!el) return;

  const catMap = {};
  categories.forEach(c => { catMap[c.id] = c; });

  const latest = [...knowledge]
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, 6);

  el.innerHTML = latest.map(item => renderKnowledgeCard(item, catMap[item.categoryId])).join('');
}

function showHomeLoading() {
  ['featuredCategories', 'featuredKnowledge', 'latestKnowledge'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = renderLoadingState();
  });

  const stats = document.getElementById('statsStrip');
  if (stats) {
    stats.innerHTML = Array.from({ length: 4 }, () => `
      <div class="${STAT_ITEM}">
        <div class="${STAT_NUMBER}">—</div>
        <div class="${STAT_LABEL}">Memuat…</div>
      </div>
    `).join('');
  }
}

function showError(msg) {
  const containers = ['featuredCategories', 'featuredKnowledge', 'latestKnowledge'];
  containers.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.innerHTML = `
        <div class="col-span-full flex flex-col items-center gap-3 px-6 py-14 text-center text-muted">
          <div class="font-display text-[1.1rem] font-semibold text-ink">Konten belum bisa dimuat</div>
          <p class="max-w-[36ch] text-[0.9rem]">${escapeHtml(msg)}</p>
          <button class="${BTN.reload}" onclick="location.reload()">Muat Ulang</button>
        </div>
      `;
    }
  });
}

