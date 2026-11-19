/**
 * categories.js — Logic for categories.html
 */

document.addEventListener('DOMContentLoaded', async () => {
  await loadCategoriesPage();
});

async function loadCategoriesPage() {
  const grid = document.getElementById('categoriesGrid');
  if (!grid) return;

  grid.innerHTML = renderLoadingState();

  try {
    const [categories, knowledge] = await Promise.all([loadCategories(), loadKnowledge()]);

    const counts = {};
    knowledge.forEach(k => {
      counts[k.categoryId] = (counts[k.categoryId] || 0) + 1;
    });

    // Update total count in header
    const totalEl = document.getElementById('totalCategories');
    if (totalEl) totalEl.textContent = categories.length;

    grid.innerHTML = categories
      .map((cat, index) => renderCategoryCardLarge(cat, counts[cat.id] || 0, knowledge, index, categories.length))
      .join('');

  } catch (err) {
    console.error('Failed to load categories:', err);
    grid.innerHTML = renderEmptyState(
      'Kategori belum bisa dimuat',
      'Periksa koneksi Anda, lalu muat ulang halaman ini.',
      false
    );
  }
}

function renderCategoryCardLarge(cat, count, knowledge, index, total) {
  const bg = getCategoryColor(cat);

  // Kartu terakhir dengan jumlah ganjil melebar penuh menutup grid,
  // dan bagian tubuhnya dibagi dua kolom agar tidak setengah kosong.
  const isWide = index === total - 1 && total % 2 === 1;

  // Sample article titles for this category (up to 3)
  const samples = knowledge
    .filter(k => k.categoryId === cat.id)
    .slice(0, 3)
    .map(k => `
      <li class="flex items-start gap-2 text-[0.8125rem] leading-[1.5] text-ink">
        <span class="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-full bg-accent"></span>
        ${escapeHtml(k.title)}
      </li>
    `)
    .join('');

  return `
    <div class="${isWide ? 'md:col-span-2' : ''} flex h-full flex-col gap-6 rounded-lg border border-line bg-white p-7 transition duration-200 hover:-translate-y-0.5 hover:shadow-md md:flex-row md:items-start">
      <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border" style="background:${bg}20;border-color:${bg}30">
        <div class="flex h-11 w-11 items-center justify-center rounded-[14px] text-white" style="background:${bg}">
          ${icon(cat.icon)}
        </div>
      </div>
      <div class="flex-1 ${isWide ? 'md:grid md:grid-cols-2 md:items-start md:gap-x-10' : ''}">
        <div class="mb-2 flex flex-wrap items-center justify-between gap-3 ${isWide ? 'md:col-span-2' : ''}">
          <h2 class="text-[1.0625rem] font-bold text-primary">${escapeHtml(cat.name)}</h2>
          <span class="flex items-center gap-1.5 text-xs font-semibold text-muted">${icon('book-open', 14)} ${count} artikel</span>
        </div>
        <p class="mb-4 text-sm leading-[1.55] text-muted ${isWide ? 'md:mb-0' : ''}">${escapeHtml(cat.description)}</p>
        ${samples ? `<ul class="mb-4 flex flex-col gap-1.5 ${isWide ? 'md:mb-0' : ''}">${samples}</ul>` : ''}
        <a href="library.html?category=${encodeURIComponent(cat.id)}"
           class="inline-flex min-h-[38px] items-center gap-1.5 rounded-md border-[1.5px] px-4 py-2 text-[0.8125rem] font-semibold transition duration-200 hover:opacity-80 active:scale-[.98] ${isWide ? 'md:justify-self-start' : ''}"
           style="border-color:${bg};color:${bg}">
          Jelajahi Kategori ${icon('arrow-right', 14)}
        </a>
      </div>
    </div>
  `;
}

