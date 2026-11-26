# Beasiswa Knowledge Base

> Platform pengetahuan terpusat tentang beasiswa untuk mahasiswa.
> Dikembangkan sebagai proyek akhir mata kuliah Knowledge Management, Kelompok 5 — Universitas Klabat (UNKLAB).

---

## Daftar Isi

- [Deskripsi](#deskripsi)
- [Fitur](#fitur)
- [Struktur File](#struktur-file)
- [Cara Menjalankan Secara Lokal](#cara-menjalankan-secara-lokal)
- [Cara Memperbarui Data JSON](#cara-memperbarui-data-json)
- [Cara Deploy ke GitHub Pages](#cara-deploy-ke-github-pages)
- [Keterbatasan](#keterbatasan)

---

## Deskripsi

Beasiswa Knowledge Base adalah aplikasi web statis yang menyediakan informasi terstruktur tentang:
- Program beasiswa yang tersedia di Indonesia
- Panduan aplikasi dan persiapan dokumen
- Persyaratan kelayakan beasiswa
- Persiapan tahap seleksi dan wawancara
- Pengalaman dan pelajaran dari penerima beasiswa

Aplikasi dibangun menggunakan HTML5, Tailwind CSS, dan Vanilla JavaScript tanpa framework atau backend.

---

## Fitur

| Fitur | Keterangan |
|-------|------------|
| Home Page | Pengenalan, statistik, artikel unggulan, dan artikel terbaru |
| Categories Page | Jelajahi 5 kategori pengetahuan |
| Knowledge Library | Semua artikel dengan pencarian dan filter kategori |
| Knowledge Detail | Artikel lengkap dengan daftar isi, waktu baca, dan artikel terkait |
| Halaman FAQ | 8 pertanyaan umum dengan tautan ke artikel panduan terkait |
| Pencarian Real-time | Cari berdasarkan judul, deskripsi, konten, dan kata kunci |
| Filter Kategori | Filter artikel berdasarkan kategori |
| URL Dapat Dibagikan | Pencarian dan filter tersimpan di URL (`?q=` dan `?category=`) |
| Desain Responsif | Bekerja di desktop, tablet, dan ponsel |

---

## Struktur File

```
websitekm/
├── index.html          — Halaman beranda
├── categories.html     — Halaman semua kategori
├── library.html        — Perpustakaan artikel
├── detail.html         — Detail artikel (pakai ?id=xxx)
├── faq.html            — Pertanyaan yang sering diajukan
├── about.html          — Tentang proyek
│
├── assets/
│   ├── js/
│   │   ├── app.js             — Utilitas bersama (data loading, navbar, footer, rendering)
│   │   ├── tailwind-config.js — Tema Tailwind (warna, font, bayangan) + aturan dasar
│   │   ├── home.js            — Logika halaman beranda
│   │   ├── categories.js      — Logika halaman kategori
│   │   ├── library.js         — Logika perpustakaan (search + filter)
│   │   ├── detail.js          — Logika halaman detail artikel
│   │   └── search.js          — Placeholder modul pencarian global
│   │
│   ├── data/
│   │   ├── categories.json — Data kategori
│   │   └── knowledge.json  — Data artikel pengetahuan
│   │
│   └── images/             — Folder untuk gambar (opsional)
│
└── README.md
```

> **Styling:** Seluruh tampilan memakai **Tailwind CSS (Play CDN)** + Google Fonts, jadi butuh koneksi internet saat membuka halaman. Tema (palet biru `#000022` / `#001242` / `#005E7C` / `#0094C6`, font sans **Instrument Sans** untuk judul dan isi) didefinisikan di `assets/js/tailwind-config.js`.

---

## Cara Menjalankan Secara Lokal

> **Penting:** Aplikasi menggunakan `fetch()` untuk membaca file JSON. `fetch()` tidak berfungsi jika file HTML dibuka langsung dari file system (`file://`). Harus dijalankan melalui server HTTP lokal.

### Opsi 1: VS Code Live Server (Direkomendasikan)

1. Install ekstensi **Live Server** di VS Code.
2. Buka folder `websitekm/` di VS Code.
3. Klik kanan `index.html` → **Open with Live Server**.
4. Browser akan membuka `http://127.0.0.1:5500/`.

### Opsi 2: Python HTTP Server

```bash
# Masuk ke folder proyek
cd "D:\Semester 7\Knowledge Management\websitekm"

# Python 3
python -m http.server 8000

# Buka browser: http://localhost:8000
```

### Opsi 3: Node.js (npx serve)

```bash
npx serve websitekm
```

---

## Cara Memperbarui Data JSON

### Sumber Konten

Naskah sumber proyek ada di `Knowledge Base.md` (10 entri hasil wawancara, 8 pertanyaan FAQ, dan profil kelompok). File itu adalah materi mentah; yang tampil di situs dibaca dari `assets/data/knowledge.json`, `assets/data/categories.json`, serta isi `faq.html` dan `about.html`.

### Menambah Artikel Baru

Buka `assets/data/knowledge.json` dan tambahkan objek baru di akhir array:

```json
{
  "id": "026",
  "title": "Judul Artikel Baru",
  "slug": "judul-artikel-baru",
  "categoryId": "CAT001",
  "subCategory": "Sub-kategori opsional",
  "description": "Deskripsi singkat artikel.",
  "keywords": ["kata kunci 1", "kata kunci 2"],
  "content": {
    "overview": "Ringkasan artikel.",
    "sections": [
      {
        "heading": "Judul Bagian",
        "body": "Isi penjelasan bagian ini."
      }
    ],
    "tips": [
      "Tips pertama.",
      "Tips kedua."
    ],
    "notes": "Catatan penting."
  },
  "source": {
    "name": "Nama Sumber",
    "type": "Official Website",
    "url": "https://example.com",
    "dateVerified": "2026-11-11"
  },
  "contributor": "Nama kontributor (opsional)",
  "featured": false,
  "publishedAt": "2026-11-11"
}
```

**Aturan ID:** Gunakan format `"001"`, `"002"`, dst. ID harus unik. Saat ini tersedia 22 artikel (ID `001`–`012` untuk Pengetahuan Explicit dan `016`–`025` untuk Pengetahuan Tacit), jadi penambahan berikutnya dapat melanjutkan nomor ID yang tersedia.

**Entri dari wawancara (tacit knowledge):** isi `source.type` dengan `"Community Reference (Tacit Knowledge)"`, tulis nama narasumber di `source.name`, dan cantumkan kontributor di field `contributor` serta `content.notes`.

**categoryId yang valid:**
- `"CAT001"` — Scholarship Information
- `"CAT002"` — Application Guide
- `"CAT003"` — Eligibility & Requirements
- `"CAT004"` — Selection Preparation
- `"CAT005"` — Scholarship Experience

**Tandai sebagai unggulan:** Set `"featured": true` untuk menampilkan di halaman beranda.

---

### Menambah Kategori Baru

Buka `assets/data/categories.json` dan tambahkan:

```json
{
  "id": "CAT006",
  "name": "Nama Kategori",
  "slug": "nama-kategori",
  "description": "Deskripsi kategori.",
  "icon": "book-open",
  "color": "#123456"
}
```

Lalu tambahkan kategori baru tersebut ke data. Warna badge dan ikon diambil otomatis dari field `color`, jadi tidak perlu menambah CSS baru.

Jika ingin tetap menyediakan warna cadangan untuk data lama tanpa field `color`, perbarui objek `categoryColors` di `assets/js/app.js`:

```js
CAT006: '#007BA6',
```

---

## Cara Deploy ke GitHub Pages

1. **Buat repository GitHub baru** (mis. `beasiswa-knowledge-base`).

2. **Upload semua file** ke repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Beasiswa Knowledge Base"
   git remote add origin https://github.com/username/beasiswa-knowledge-base.git
   git push -u origin main
   ```

3. **Aktifkan GitHub Pages:**
   - Buka repository di GitHub.
   - Klik **Settings** → **Pages**.
   - Di bagian **Source**, pilih branch `main` dan folder `/ (root)`.
   - Klik **Save**.

4. **Akses website** di: `https://username.github.io/beasiswa-knowledge-base/`

> **Catatan:** GitHub Pages mendukung file statis (HTML, CSS, JS, JSON) secara langsung. Tidak perlu konfigurasi tambahan.

---

## Keterbatasan

| Keterbatasan | Penjelasan |
|-------------|------------|
| Tidak ada backend | Data hanya dari JSON lokal — tidak ada CMS atau database |
| Tidak ada autentikasi | Semua konten bersifat publik |
| Tidak ada fitur komentar | Tidak ada interaksi pengguna |
| Konten awal merupakan sample | Harus diganti dengan hasil riset/wawancara yang terverifikasi sebelum submit final |
| `fetch()` butuh server | Tidak bisa dibuka langsung dengan double-click file HTML |
| Pencarian tidak full-text | Pencarian berbasis string matching, bukan indexing canggih |

---

## Lisensi

Proyek ini dikembangkan untuk keperluan akademis (tugas kelompok Knowledge Management).  
Konten artikel bersumber dari referensi publik yang telah dicantumkan dalam setiap artikel.

---

*Dibuat dengan HTML, Tailwind CSS, dan Vanilla JavaScript. Tidak ada framework, tidak ada backend.*

