<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:000022,50:001242,100:005E7C&height=220&section=header&text=Beasiswa%20Knowledge%20Base&fontSize=40&fontColor=ffffff&fontAlignY=38&desc=Platform%20Pengetahuan%20Terpusat%20Beasiswa%20Mahasiswa%20Indonesia&descFontSize=17&descAlignY=60" alt="Header Banner" width="100%" />

<a href="https://git.io/typing-svg">
  <img src="https://readme-typing-svg.demolab.com?font=Instrument+Sans&weight=600&size=20&duration=2500&pause=1200&color=0094C6&center=true&vCenter=true&width=620&height=46&lines=Eksplorasi+peluang+beasiswa+nasional+dan+global;Panduan+dokumen+lengkap+hingga+lolos+seleksi;Basis+pengetahuan+Knowledge+Management+Kelompok+5+UNKLAB" alt="Typing SVG" />
</a>

<br/>

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![JavaScript](https://img.shields.io/badge/Vanilla_JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![JSON Data](https://img.shields.io/badge/Articles-22_Entri-005E7C?style=for-the-badge&logo=json&logoColor=white)](#struktur-data)
[![Status](https://img.shields.io/badge/Status-Completed-success?style=for-the-badge)](#)
[![University](https://img.shields.io/badge/UNKLAB-Kelompok_5-001242?style=for-the-badge&logo=google-scholar&logoColor=white)](https://www.unklab.ac.id/)

</div>

---

## Ringkasan Proyek

Beasiswa Knowledge Base menyediakan repositori pengetahuan terstruktur untuk mahasiswa yang mencari beasiswa. Platform ini menyatukan informasi program beasiswa, kriteria kelayakan, persiapan berkas, strategi wawancara, dan pengalaman nyata penerima beasiswa dalam satu antarmuka web.

Kelompok 5 menyusun proyek ini sebagai tugas akhir mata kuliah Knowledge Management di Universitas Klabat (UNKLAB).

```
Arsitektur Sistem:
HTML5 + Tailwind CSS (Play CDN) + Vanilla JavaScript + Flat-File JSON
```

---

## Fitur Utama

| Modul | Deskripsi |
| :--- | :--- |
| **Pencarian Real-Time** | Mesin pencari memfilter judul, ringkasan, teks artikel, dan kata kunci |
| **Navigasi Kategori** | 5 rumpun pengetahuan dengan pengelompokan topik |
| **Detail Artikel** | Tampilan membaca dengan estimasi waktu baca dan daftar isi dinamis |
| **Sinkronisasi URL** | Kueri pencarian dan pilihan kategori tersimpan pada parameter tautan (`?q=` & `?category=`) |
| **Basis Tanya Jawab** | Halaman FAQ memuat jawaban pertanyaan beasiswa beserta rujukan dokumen |
| **Responsif** | Tata letak menyesuaikan layar ponsel, tablet, dan desktop |

---

## 5 Rumpun Pengetahuan

```
Rumpun Pengetahuan
├── 01. Scholarship Information (Program, kuota, pendanaan)
├── 02. Application Guide (Esai, CV, surat rekomendasi)
├── 03. Eligibility & Requirements (IPK, bahasa, kualifikasi)
├── 04. Selection Preparation (Tes tertulis, psikotes, wawancara)
└── 05. Scholarship Experience (Tips penerima, studi kasus)
```

---

## Struktur Direktori

```
websitekm/
├── index.html            <- Halaman beranda dengan pencarian hero
├── categories.html       <- Daftar 5 rumpun kategori
├── library.html          <- Katalog 22 artikel dengan filter
├── detail.html           <- Halaman membaca artikel (?id=xxx)
├── faq.html              <- 8 pertanyaan dan jawaban umum
├── about.html            <- Latar belakang proyek dan anggota tim
├── Knowledge Base.md     <- Dokumen naskah mentah pengetahuan
├── Panduan.md            <- Panduan teknis proyek
├── README.md             <- Dokumentasi repositori
│
└── assets/
    ├── css/              <- Berkas gaya tambahan
    ├── data/
    │   ├── categories.json <- Definisi 5 kategori
    │   └── knowledge.json  <- Basis data 22 artikel beasiswa (12 Explicit & 10 Tacit)
    ├── js/
    │   ├── app.js             <- Pengambilan data dan perender antarmuka
    │   ├── categories.js      <- Logika halaman kategori
    │   ├── detail.js          <- Logika perender artikel dan daftar isi
    │   ├── home.js            <- Logika halaman utama
    │   ├── library.js         <- Sistem filter dan pencarian katalog
    │   ├── search.js          <- Modul utilitas pencarian
    │   └── tailwind-config.js <- Skema warna dan tipografi Instrument Sans
    └── images/                <- Aset media visual
```

---

## Panduan Menjalankan

Aplikasi membaca data melalui `fetch()` ke berkas JSON lokal. Browser memblokir `fetch()` jika Anda membuka berkas HTML menggunakan protokol `file://`. Jalankan aplikasi menggunakan server lokal.

### Opsi 1: VS Code Live Server

1. Buka folder proyek di VS Code.
2. Pasang ekstensi **Live Server**.
3. Klik kanan `index.html`, lalu pilih **Open with Live Server**.
4. Buka tautan `http://127.0.0.1:5500/` di peramban Anda.

### Opsi 2: Python HTTP Server

Buka terminal di direktori proyek dan jalankan perintah ini:

```bash
python -m http.server 8000
```

Akses aplikasi melalui peramban di `http://localhost:8000`.

### Opsi 3: Node.js (npx)

```bash
npx serve .
```

---

## Struktur Data

<details>
<summary><strong>Klik untuk melihat skema objek artikel (knowledge.json)</strong></summary>

```json
{
  "id": "001",
  "title": "Judul Artikel",
  "slug": "judul-artikel",
  "categoryId": "CAT001",
  "subCategory": "Subkategori",
  "description": "Ringkasan pengantar artikel.",
  "keywords": ["beasiswa", "persyaratan"],
  "content": {
    "overview": "Paragraf pengantar.",
    "sections": [
      {
        "heading": "Nama Subjudul",
        "body": "Penjelasan materi."
      }
    ],
    "tips": [
      "Poin strategi pertama.",
      "Poin strategi kedua."
    ],
    "notes": "Peringatan atau catatan penting."
  },
  "source": {
    "name": "Penyedia Beasiswa Resmi",
    "type": "Official Website",
    "url": "https://example.org"
  }
}
```

</details>

---

## Tim Pengembang

Proyek ini merupakan hasil kerja Kelompok 5 mata kuliah Knowledge Management Universitas Klabat:

| Inisial | Nama Anggota | Peran |
| :---: | :--- | :--- |
| **SM** | Marcello Bryan Sijadi | Membantu Project |
| **WF** | Florencia Nikita Naftalia Wangke | Pengumpul Pengetahuan Explicit |
| **AL** | Leticia Lisi Alow | Pewawancara Tacit Knowledge |
| **GH** | Gracia Nathalia Hutabarat | Pewawancara Tacit Knowledge |
| **TT** | Tamariska Brigita Tumewan | Penulis Konten dan Editor Web |
| **VD** | Vallerian Dava Dayoh | Pengembang Web dan UI/UX |

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:005E7C,50:001242,100:000022&height=120&section=footer" width="100%" />

<sub>Universitas Klabat &bull; Fakultas Ilmu Komputer &bull; Knowledge Management Kelompok 5</sub>

</div>
