/**
 * tailwind-config.js — Konfigurasi Tailwind (Play CDN) untuk Beasiswa Knowledge Base.
 * Harus dimuat SETELAH <script src="https://cdn.tailwindcss.com"></script>.
 */

tailwind.config = {
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.1rem', lg: '2rem' },
      screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1200px' },
    },
    extend: {
      colors: {
        // Palet dari "shade of blue": #000022 #001242 #0094C6 #005E7C
        primary: { DEFAULT: '#001242', dark: '#000022', light: '#002F62' },
        navy: '#005E7C',
        accent: { light: '#5CC8EA', DEFAULT: '#0094C6', strong: '#0086B8', ink: '#005E7C' },
        paper: '#F2F7FA',
        surface: { DEFAULT: '#FFFFFF', alt: '#E4EDF5' },
        ink: '#08182B',
        muted: '#4E6478',
        line: '#D3E1EC',
      },
      fontFamily: {
        display: ['"Instrument Sans"', '"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['"Instrument Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0, 2, 18, .06)',
        md: '0 14px 34px -18px rgba(0, 18, 66, .30)',
        lg: '0 28px 68px -28px rgba(0, 18, 66, .35)',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '18px',
        xl: '28px',
      },
    },
  },
};

/* ============================================================
   BASE LAYER — aturan global kecil yang sulit diekspresikan
   sebagai utility class (fokus keyboard, seleksi, reduced motion).
   ============================================================ */
(function () {
  const css = `
    html { scroll-behavior: smooth; }

    :focus-visible {
      outline: 3px solid rgba(0, 148, 198, .55);
      outline-offset: 3px;
      border-radius: 4px;
    }

    ::selection { background: #0094C6; color: #000022; }

    /* Sembunyikan tombol clear bawaan browser — UI menyediakan tombol sendiri. */
    input[type="search"]::-webkit-search-cancel-button,
    input[type="search"]::-webkit-search-decoration {
      -webkit-appearance: none;
      appearance: none;
      display: none;
    }

    /* Menu mobile dibuka lewat class ini (ID menang atas hidden bawaan). */
    #navMenu.nav-open { display: flex; }

    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
      *, *::before, *::after {
        animation-duration: .01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: .01ms !important;
        scroll-behavior: auto !important;
      }
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();
