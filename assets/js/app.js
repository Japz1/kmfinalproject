/**
 * app.js — Shared utilities for the Scholarship Knowledge Base
 */

/* ============================================================
   DATA LOADING
   ============================================================ */
let _categoriesCache = null;
let _knowledgeCache  = null;

async function loadCategories() {
  if (_categoriesCache) return _categoriesCache;
  const res = await fetch('assets/data/categories.json');
  if (!res.ok) throw new Error('Failed to load categories.json');
  _categoriesCache = await res.json();
  return _categoriesCache;
}

async function loadKnowledge() {
  if (_knowledgeCache) return _knowledgeCache;
  const res = await fetch('assets/data/knowledge.json');
  if (!res.ok) throw new Error('Failed to load knowledge.json');
  _knowledgeCache = await res.json();
  return _knowledgeCache;
}

/* ============================================================
   ICONS (inline SVG helpers — Lucide-compatible paths)
   ============================================================ */
const Icons = {
  'graduation-cap': `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
  'file-text': `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  'clipboard-check': `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="m9 12 2 2 4-4"/></svg>`,
  'target': `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  'users': `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  'search': `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  'arrow-right': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  'book-open': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  'calendar': `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  'link': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  'alert-circle': `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  'x-circle': `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
  'info': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  'menu': `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
};

function icon(name, size) {
  const svg = Icons[name] || '';
  if (size) return svg.replace(/width="\d+"/, `width="${size}"`).replace(/height="\d+"/, `height="${size}"`);
  return svg;
}

/* ============================================================
   NAV & FOOTER INJECTION
   ============================================================ */
function getCurrentPage() {
  const path = window.location.pathname;
  if (path.endsWith('index.html') || path === '/' || path.endsWith('/')) return 'home';
  if (path.includes('categories')) return 'categories';
  if (path.includes('library')) return 'library';
  if (path.includes('detail')) return 'detail';
  if (path.includes('faq')) return 'faq';
  if (path.includes('about')) return 'about';
  return '';
}

/* ============================================================
   SHARED TAILWIND CLASS RECIPES
   Dipakai ulang oleh markup yang dirender lewat JS.
   ============================================================ */
const BTN = {
  primary: 'inline-flex items-center justify-center gap-2 min-h-[44px] rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-primary-dark transition duration-200 hover:bg-accent-strong hover:shadow-md active:scale-[.98]',
  primarySm: 'inline-flex items-center justify-center gap-2 w-full min-h-[38px] rounded-md bg-accent px-4 py-2 text-[0.8125rem] font-semibold text-primary-dark transition duration-200 hover:bg-accent-strong active:scale-[.98]',
  outlineSm: 'inline-flex items-center justify-center gap-2 w-full min-h-[38px] rounded-md border-[1.5px] border-primary px-4 py-2 text-[0.8125rem] font-semibold text-primary transition duration-200 hover:bg-primary hover:text-white active:scale-[.98]',
  reload: 'inline-flex items-center justify-center gap-2 min-h-[38px] rounded-md border-[1.5px] border-primary px-4 py-2 text-[0.8125rem] font-semibold text-primary transition duration-200 hover:bg-primary hover:text-white active:scale-[.98]',
};

const NAV_LINK = 'inline-flex items-center min-h-[40px] rounded-full px-3.5 py-2 text-sm font-medium text-muted transition-colors max-md:w-full max-md:min-h-[46px] max-md:rounded-sm max-md:px-4 hover:bg-surface-alt hover:text-primary max-md:hover:bg-surface-alt max-md:hover:text-primary';
const NAV_LINK_ACTIVE = 'inline-flex items-center min-h-[40px] rounded-full px-3.5 py-2 text-sm font-semibold bg-primary text-white max-md:w-full max-md:min-h-[46px] max-md:rounded-sm max-md:px-4';

function injectNavbar() {
  const page = getCurrentPage();

  const nav = document.getElementById('navbar');
  if (!nav) return;

  const link = (href, label, isActive) =>
    `<a href="${href}" class="${isActive ? NAV_LINK_ACTIVE : NAV_LINK}">${label}</a>`;

  nav.innerHTML = `
    <div class="container">
      <div class="flex items-center justify-between gap-4 py-3">
        <a href="index.html" class="flex items-center gap-2.5 font-display text-[1.08rem] font-bold leading-[1.15] tracking-[-0.02em] text-primary">
          <span class="shrink-0 text-accent-strong">${icon('graduation-cap', 28)}</span>
          <span>
            <span class="block">Beasiswa KB</span>
            <span class="block font-sans text-[0.65rem] font-medium tracking-[0.04em] text-muted">Knowledge Base</span>
          </span>
        </a>

        <nav class="hidden md:flex md:items-center md:gap-1 max-md:absolute max-md:inset-x-0 max-md:top-full max-md:z-40 max-md:flex-col max-md:gap-0.5 max-md:border-b max-md:border-line max-md:bg-white max-md:p-4 max-md:shadow-md"
             id="navMenu" aria-label="Navigasi utama">
          ${link('index.html', 'Beranda', page === 'home')}
          ${link('categories.html', 'Kategori', page === 'categories')}
          ${link('library.html', 'Perpustakaan', page === 'library' || page === 'detail')}
          ${link('faq.html', 'FAQ', page === 'faq')}
          ${link('about.html', 'Tentang', page === 'about')}
        </nav>

        <button class="inline-flex h-11 w-11 flex-col items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-alt md:hidden"
                id="navToggle" aria-label="Buka menu navigasi" aria-expanded="false" aria-controls="navMenu">
          <span class="block h-0.5 w-[21px] rounded bg-current"></span>
          <span class="mt-[5px] block h-0.5 w-[21px] rounded bg-current"></span>
          <span class="mt-[5px] block h-0.5 w-[21px] rounded bg-current"></span>
        </button>
      </div>
    </div>
  `;

  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');

  function closeMenu() {
    menu.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  menu.querySelectorAll('a').forEach(linkEl => {
    if (linkEl.className.includes('bg-primary')) linkEl.setAttribute('aria-current', 'page');
    linkEl.addEventListener('click', closeMenu);
  });

  toggle.addEventListener('click', function () {
    const open = menu.classList.toggle('nav-open');
    this.setAttribute('aria-expanded', String(open));
    this.setAttribute('aria-label', open ? 'Tutup menu navigasi' : 'Buka menu navigasi');
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && menu.classList.contains('nav-open')) {
      closeMenu();
      toggle.focus();
    }
  });

  document.addEventListener('click', function (event) {
    if (!menu.classList.contains('nav-open')) return;
    if (menu.contains(event.target) || toggle.contains(event.target)) return;
    closeMenu();
  });
}

function injectFooter() {
  const footer = document.getElementById('footer');
  if (!footer) return;

  const footerLink = (href, label) =>
    `<li><a href="${href}" class="w-fit text-sm text-white/70 transition-colors hover:text-white">${label}</a></li>`;

  footer.innerHTML = `
    <div class="container">
      <div class="grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr] md:gap-8 lg:py-14 lg:gap-10">
        <div>
          <div class="mb-2 font-display text-[1.15rem] font-bold tracking-[-0.02em] text-white">Beasiswa Knowledge Base</div>
          <p class="max-w-[34ch] text-sm leading-[1.65] text-white/70">Platform pengetahuan terpusat untuk membantu mahasiswa memahami proses pencarian dan pengajuan beasiswa di Indonesia.</p>
        </div>
        <div>
          <div class="mb-4 text-xs font-bold uppercase tracking-[0.11em] text-accent-light">Navigasi</div>
          <ul class="flex flex-col gap-2">
            ${footerLink('index.html', 'Beranda')}
            ${footerLink('categories.html', 'Kategori')}
            ${footerLink('library.html', 'Perpustakaan')}
            ${footerLink('faq.html', 'FAQ')}
            ${footerLink('about.html', 'Tentang')}
          </ul>
        </div>
        <div>
          <div class="mb-4 text-xs font-bold uppercase tracking-[0.11em] text-accent-light">Kategori</div>
          <ul class="flex flex-col gap-2">
            ${footerLink('library.html?category=CAT001', 'Scholarship Information')}
            ${footerLink('library.html?category=CAT002', 'Application Guide')}
            ${footerLink('library.html?category=CAT003', 'Eligibility &amp; Requirements')}
            ${footerLink('library.html?category=CAT004', 'Selection Preparation')}
            ${footerLink('library.html?category=CAT005', 'Scholarship Experience')}
          </ul>
        </div>
      </div>
      <div class="flex flex-wrap items-center justify-between gap-2 border-t border-white/15 py-6 text-center text-[0.8125rem] leading-relaxed text-white/70 max-md:justify-center">
        <span>Konten ini merupakan materi edukasi berbasis referensi umum dan sumber resmi. Verifikasi selalu melalui penyedia beasiswa resmi.</span>
        <span>&copy; 2026 Beasiswa KB — Tugas Kelompok 5 Knowledge Management, UNKLAB</span>
      </div>
    </div>
  `;
}

/* ============================================================
   RENDERING HELPERS
   ============================================================ */
const categoryColors = {
  CAT001: '#001242',
  CAT002: '#005E7C',
  CAT003: '#007BA6',
  CAT004: '#00456E',
  CAT005: '#0086B8',
};

function getCategoryColor(category, fallbackId) {
  if (category && category.color) return category.color;
  const id = (category && category.id) || fallbackId;
  return categoryColors[id] || '#001242';
}

function categoryBadgeHtml(category, fallbackId) {
  const color = getCategoryColor(category, fallbackId);
  const name = (category && category.name) || fallbackId || '';
  // 8-digit hex adds a soft tinted background from the category colour.
  return `<span class="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold leading-tight" style="background:${color}14;color:${color}">${escapeHtml(name)}</span>`;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
}

/* Tampilkan/sembunyikan tombol (x) pada kolom pencarian. */
/* ============================================================
   UTILITY FUNCTIONS
   ============================================================ */
function debounce(func, delay) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

function toggleClearButton(clearEl, visible) {
  if (!clearEl) return;
  clearEl.classList.toggle('hidden', !visible);
  clearEl.classList.toggle('flex', visible);
}

function renderKnowledgeCard(item, category) {
  const href = `detail.html?id=${encodeURIComponent(item.id)}`;
  return `
    <article class="flex flex-col gap-3.5 rounded-lg border border-line bg-white p-6 transition duration-200 hover:-translate-y-[3px] hover:border-[rgba(0,94,124,0.38)] hover:shadow-md">
      <div>${categoryBadgeHtml(category, item.categoryId)}</div>
      <h3 class="font-display text-[1.06rem] font-semibold leading-snug tracking-[-0.015em] text-primary">
        <a href="${href}" class="transition-colors hover:text-navy">${escapeHtml(item.title)}</a>
      </h3>
      <p class="line-clamp-3 flex-1 text-sm leading-relaxed text-muted">${escapeHtml(item.description)}</p>
      <div class="mt-auto flex items-center justify-between gap-2 border-t border-line pt-2.5">
        <span class="flex items-center gap-1.5 text-xs text-muted">${icon('calendar')} ${formatDate(item.publishedAt)}</span>
        <a href="${href}" class="inline-flex min-h-[36px] items-center gap-1 py-1 text-[0.8125rem] font-semibold text-navy transition-all duration-200 hover:gap-2 hover:text-primary max-md:min-h-[44px]"
           aria-label="Baca artikel ${escapeHtml(item.title)}">
          Baca ${icon('arrow-right')}
        </a>
      </div>
    </article>
  `;
}

function renderCategoryCard(cat, count) {
  const bg = getCategoryColor(cat);
  return `
    <a href="library.html?category=${encodeURIComponent(cat.id)}" aria-label="Jelajahi kategori ${escapeHtml(cat.name)}"
       class="flex min-h-full flex-col gap-3 rounded-lg border border-line bg-white p-5 transition duration-200 hover:-translate-y-1 hover:border-[rgba(0,94,124,0.45)] hover:shadow-md">
      <div class="flex h-[46px] w-[46px] items-center justify-center rounded-[14px] text-white shadow-[0_6px_14px_-8px_rgba(0,2,18,0.45)]" style="background:${bg}">
        ${icon(cat.icon)}
      </div>
      <div class="font-display text-[1.02rem] font-semibold leading-snug tracking-[-0.015em] text-primary">${escapeHtml(cat.name)}</div>
      <p class="flex-1 text-[0.84rem] leading-[1.55] text-muted">${escapeHtml(cat.description)}</p>
      <span class="flex items-center gap-1.5 text-xs font-semibold text-muted">${icon('book-open', 14)} ${count} artikel</span>
    </a>
  `;
}

function renderLoadingState() {
  return `
    <div class="col-span-full flex items-center justify-center gap-3 py-12 text-sm text-muted">
      <span class="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-line border-t-navy"></span>
      Memuat data...
    </div>
  `;
}

function renderEmptyState(msg, desc, showClear) {
  return `
    <div class="col-span-full flex flex-col items-center gap-3 px-6 py-14 text-center text-muted">
      <span class="h-12 w-12 opacity-35">${icon('x-circle', 48)}</span>
      <div class="font-display text-[1.1rem] font-semibold text-ink">${msg}</div>
      ${desc ? `<p class="max-w-[36ch] text-[0.9rem]">${desc}</p>` : ''}
      ${showClear ? `<button class="${BTN.reload}" onclick="clearFilters()">Hapus Filter</button>` : ''}
    </div>
  `;
}

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ============================================================
   URL PARAM HELPERS
   ============================================================ */
function getParam(name) {
  return new URLSearchParams(window.location.search).get(name) || '';
}

/* ============================================================
   SEARCH HELPERS
   ============================================================ */
function matchesSearch(item, query, category) {
  if (!query) return true;

  // Every word must appear somewhere. This makes multi-word searches
  // order-independent: "lpdp beasiswa" and "beasiswa lpdp" both work.
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  const haystack = [
    item.title,
    item.description,
    item.categoryId,
    category?.name || '',
    category?.slug || '',
    ...(item.keywords || []),
    item.content?.overview || '',
    ...(item.content?.sections || []).map(s => s.heading + ' ' + s.body),
    ...(item.content?.tips || []),
    item.content?.notes || '',
  ].join(' ').toLowerCase();

  return tokens.every(token => haystack.includes(token));
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  injectNavbar();
  injectFooter();
});

