/**
 * detail.js — Logic for detail.html
 */

document.addEventListener('DOMContentLoaded', async () => {
  await loadDetailPage();
});

async function loadDetailPage() {
  const articleId = getParam('id');
  const main = document.getElementById('detailMain');
  if (!main) return;

  if (!articleId) {
    renderNotFound(main, 'ID artikel tidak ditemukan dalam URL.');
    return;
  }

  main.innerHTML = renderLoadingState();

  try {
    const [categories, knowledge] = await Promise.all([loadCategories(), loadKnowledge()]);

    const catMap = {};
    categories.forEach(c => { catMap[c.id] = c; });

    const article = knowledge.find(k => k.id === articleId);

    if (!article) {
      renderNotFound(main, `Artikel dengan ID "${escapeHtml(articleId)}" tidak ditemukan.`);
      return;
    }

    const category = catMap[article.categoryId];

    // Update page title and description
    document.title = `${article.title} — Beasiswa Knowledge Base`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', article.description || '');

    // Render breadcrumb in header
    renderBreadcrumb(article, category);

    // Render article body
    renderArticle(main, article, category);

    // Render sidebar
    renderSidebar(knowledge, catMap, article);

  } catch (err) {
    console.error('Detail page error:', err);
    renderNotFound(main, 'Artikel belum bisa dimuat. Periksa koneksi Anda, lalu muat ulang halaman ini.');
  }
}

/* ---- Breadcrumb ---- */
function renderBreadcrumb(article, category) {
  const el = document.getElementById('breadcrumb');
  if (!el) return;
  const sep = '<span class="opacity-40" aria-hidden="true">/</span>';
  const crumbLink = (href, label) => `<a href="${href}" class="transition-colors hover:text-white">${label}</a>`;
  el.innerHTML = `
    ${crumbLink('index.html', 'Beranda')}
    ${sep}
    ${crumbLink('library.html', 'Perpustakaan')}
    ${sep}
    ${category ? `${crumbLink(`library.html?category=${encodeURIComponent(category.id)}`, escapeHtml(category.name))}${sep}` : ''}
    <span aria-current="page" class="text-white/90">${escapeHtml(article.title)}</span>
  `;
}

/* ---- Reading time ---- */
function estimateReadingTime(article) {
  const c = article.content || {};
  const text = [
    c.overview || '',
    ...(c.sections || []).map(s => `${s.heading} ${s.body}`),
    ...(c.tips || []),
    c.notes || '',
  ].join(' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/* ---- Article body ---- */
function renderArticle(container, article, category) {
  const c = article.content || {};
  const readingMinutes = estimateReadingTime(article);

  const sectionHeading = 'mb-3 border-b border-line pb-2 font-display text-[1.15rem] font-semibold leading-snug tracking-[-0.015em] text-primary';

  const sectionsHtml = (c.sections || [])
    .map((s, index) => `
      <section id="section-${index + 1}" class="mb-8 scroll-mt-24 last:mb-0">
        <h2 class="${sectionHeading}">${escapeHtml(s.heading)}</h2>
        <p class="text-[0.9688rem] leading-[1.75] text-ink">${escapeHtml(s.body)}</p>
      </section>
    `).join('');

  const tipsHtml = (c.tips && c.tips.length)
    ? `<section class="mb-8 last:mb-0">
        <h2 class="${sectionHeading}">Tips &amp; Rekomendasi</h2>
        <ul class="mt-2 flex flex-col gap-2.5">
          ${c.tips.map(t => `
            <li class="flex gap-2.5 text-[0.9688rem] leading-[1.6] text-ink">
              <span class="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-strong"></span>
              ${escapeHtml(t)}
            </li>
          `).join('')}
        </ul>
      </section>`
    : '';

  const notesHtml = c.notes
    ? `<div class="mt-5 flex gap-3 rounded-md border border-[#B9DFF0] bg-[#EAF7FD] p-5">
        <span class="shrink-0 text-[#005E7C]" aria-hidden="true">${icon('alert-circle', 20)}</span>
        <div>
          <h2 class="mb-1.5 text-[0.72rem] font-bold uppercase tracking-[0.06em] text-[#005E7C]">Catatan Penting</h2>
          <p class="text-[0.9rem] leading-[1.6] text-[#003A55]">${escapeHtml(c.notes)}</p>
        </div>
      </div>`
    : '';

  const src = article.source || {};
  const verifiedDate = src.dateVerified ? formatDate(src.dateVerified) : '';
  const sourceHtml = `
    <div class="mt-9 flex gap-3 rounded-md border border-line bg-paper p-5">
      <span class="shrink-0 text-muted" aria-hidden="true">${icon('link', 18)}</span>
      <div class="min-w-0">
        <div class="mb-1.5 text-[0.72rem] font-bold uppercase tracking-[0.06em] text-muted">Sumber Informasi</div>
        <div class="text-[0.9rem] font-semibold text-ink">${escapeHtml(src.name || 'Tidak tersedia')}</div>
        <div class="mt-1 text-[0.8125rem] text-muted">Jenis: ${escapeHtml(src.type || '')}${verifiedDate ? ' &nbsp;|&nbsp; Diverifikasi: ' + escapeHtml(verifiedDate) : ''}</div>
        ${src.url ? `<a href="${escapeHtml(src.url)}" target="_blank" rel="noopener" class="mt-1 inline-block break-all text-[0.8125rem] text-navy transition-colors hover:text-primary hover:underline">${escapeHtml(src.url)}</a>` : ''}
      </div>
    </div>
  `;

  container.innerHTML = `
    <article class="rounded-lg border border-line bg-white p-6 shadow-sm sm:p-11">
      <div class="mb-6 flex flex-wrap items-center gap-3">
        ${categoryBadgeHtml(category, article.categoryId)}
        <span class="inline-flex items-center gap-1.5 text-[0.78rem] text-muted">${icon('book-open', 14)} ${readingMinutes} menit baca</span>
      </div>
      <h1 class="mb-3 max-w-[22ch] font-display text-[clamp(1.45rem,3.5vw,2.05rem)] font-bold leading-[1.12] tracking-[-0.03em] text-primary text-balance">${escapeHtml(article.title)}</h1>
      <p class="mb-4 max-w-[62ch] text-[0.9688rem] leading-[1.65] text-muted text-pretty">${escapeHtml(article.description)}</p>
      <div class="mb-7 flex items-center gap-1.5 text-[0.8125rem] text-muted">${icon('calendar')} ${formatDate(article.publishedAt)}</div>

      <div class="max-w-[68ch]">
        ${c.overview ? `<blockquote class="mb-8 rounded-r-sm border-l-[3px] border-accent bg-paper px-5 py-4 text-[0.9688rem] leading-[1.7] text-muted">${escapeHtml(c.overview)}</blockquote>` : ''}
        ${sectionsHtml}
        ${tipsHtml}
        ${notesHtml}
      </div>

      ${sourceHtml}
    </article>
  `;
}

/* ---- Sidebar ---- */
const SIDEBAR_CARD = 'rounded-lg border border-line bg-white p-5 shadow-sm';
const SIDEBAR_TITLE = 'mb-4 border-b border-line pb-2.5 font-display text-[0.95rem] font-semibold tracking-[-0.01em] text-primary';

function renderSidebar(knowledge, catMap, currentArticle) {
  const sidebar = document.getElementById('detailSidebar');
  if (!sidebar) return;

  // Related: same category, exclude current
  const related = knowledge
    .filter(k => k.categoryId === currentArticle.categoryId && k.id !== currentArticle.id)
    .slice(0, 5);

  // Category info
  const cat = catMap[currentArticle.categoryId];
  const bg = getCategoryColor(cat, currentArticle.categoryId);

  const categoryCard = cat ? `
    <div class="${SIDEBAR_CARD}">
      <div class="${SIDEBAR_TITLE}">Kategori Ini</div>
      <div class="mb-4 flex items-center gap-3">
        <div class="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[12px] text-white" style="background:${bg}" aria-hidden="true">${icon(cat.icon, 18)}</div>
        <div class="min-w-0">
          <div class="text-sm font-semibold text-primary">${escapeHtml(cat.name)}</div>
          <div class="text-xs leading-[1.45] text-muted">${escapeHtml(cat.description)}</div>
        </div>
      </div>
      <a href="library.html?category=${encodeURIComponent(cat.id)}" class="${BTN.primarySm}">
        Lihat Semua ${icon('arrow-right', 14)}
      </a>
    </div>
  ` : '';

  // Table of contents for long article pages.
  const sections = (currentArticle.content && currentArticle.content.sections) || [];
  const tocHtml = sections.length ? `
    <nav class="${SIDEBAR_CARD}" aria-label="Daftar isi artikel">
      <div class="${SIDEBAR_TITLE}">Daftar Isi</div>
      <ol class="flex flex-col gap-2.5">
        ${sections.map((s, i) => `
          <li class="flex gap-2 text-[0.84rem] leading-[1.45]">
            <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-paper text-[0.68rem] font-bold text-muted">${i + 1}</span>
            <a href="#section-${i + 1}" class="text-ink transition-colors hover:text-navy">${escapeHtml(s.heading)}</a>
          </li>
        `).join('')}
      </ol>
    </nav>
  ` : '';

  const relatedHtml = related.length
    ? `<div class="${SIDEBAR_CARD}">
        <div class="${SIDEBAR_TITLE}">Artikel Terkait</div>
        ${related.map((item, i) => `
          <a href="detail.html?id=${encodeURIComponent(item.id)}" class="group flex items-start gap-3 border-b border-line py-3 last:border-0">
            <span class="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-paper text-[0.6875rem] font-bold text-muted">${i + 1}</span>
            <span class="text-[0.84rem] font-semibold leading-[1.45] text-ink transition-colors group-hover:text-navy">${escapeHtml(item.title)}</span>
          </a>
        `).join('')}
      </div>`
    : '';

  const backHtml = `
    <div class="${SIDEBAR_CARD}">
      <a href="library.html" class="${BTN.primarySm}">
        ${icon('book-open', 14)} Ke Perpustakaan
      </a>
    </div>
  `;

  sidebar.innerHTML = categoryCard + tocHtml + relatedHtml + backHtml;
}

/* ---- Not Found ---- */
function renderNotFound(container, msg) {
  container.innerHTML = `
    <div class="col-span-full flex flex-col items-center gap-4 rounded-xl border border-line bg-white px-8 py-16 text-center">
      <span class="h-12 w-12 text-muted opacity-30">${icon('x-circle', 48)}</span>
      <div class="font-display text-[1.3rem] font-semibold text-primary">Artikel Tidak Ditemukan</div>
      <p class="max-w-[36ch] break-words text-[0.9688rem] text-muted">${escapeHtml(msg)}</p>
      <a href="library.html" class="${BTN.primary}">Kembali ke Perpustakaan</a>
    </div>
  `;
}

