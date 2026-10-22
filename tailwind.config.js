/**
 * DESIGN SYSTEM — single source of truth.
 * Components only use semantic tokens (brand, accent, ink, surface, …), never raw hex values.
 * Loaded by Tailwind v4 through `@config` in src/assets/main.css.
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        // Electric violet — primary
        brand: {
          50: '#f3f1ff',
          100: '#e9e5ff',
          200: '#d6cfff',
          300: '#b9acff',
          400: '#9a85ff',
          500: '#7c5cff',
          600: '#6a3df5',
          700: '#5b2ed8',
          800: '#4a27ae',
          900: '#3e2589',
          950: '#251552',
        },
        // Hot coral-pink — gradient partner & highlights
        accent: {
          50: '#fff1f6',
          100: '#ffe4ee',
          200: '#ffc9dd',
          300: '#ff9fc3',
          400: '#ff6ba2',
          500: '#ff3d84',
          600: '#ed1768',
          700: '#c80d55',
        },
        // Fresh mint — success / in stock
        mint: { 50: '#ecfdf7', 100: '#d1fae9', 500: '#10c98f', 600: '#0aa574', 700: '#0a835d' },
        // Sunny amber — warnings / low stock
        sun: { 50: '#fff9eb', 100: '#ffefc6', 500: '#f5a50b', 600: '#d98606', 700: '#b06306' },
        // Errors / out of stock
        danger: { 50: '#fff1f1', 100: '#ffe0e0', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c' },
        // Text
        ink: { DEFAULT: '#14102b', soft: '#5a5675', faint: '#8b87a6' },
        // Backgrounds & borders
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f7f6fd',
          sunken: '#efedfa',
          line: '#e6e3f4',
          dark: '#120d2b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: { xl: '0.9rem', '2xl': '1.25rem', '3xl': '1.75rem' },
      boxShadow: {
        soft: '0 1px 2px rgb(20 16 43 / 0.04), 0 8px 24px -8px rgb(20 16 43 / 0.10)',
        lift: '0 2px 4px rgb(20 16 43 / 0.05), 0 20px 40px -12px rgb(60 30 160 / 0.25)',
        glow: '0 8px 30px -6px rgb(124 92 255 / 0.55)',
        ring: '0 0 0 4px rgb(124 92 255 / 0.18)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #7c5cff 0%, #b45cff 45%, #ff3d84 100%)',
        'brand-soft': 'linear-gradient(135deg, #f3f1ff 0%, #ffe4ee 100%)',
        aurora:
          'radial-gradient(60% 50% at 15% 10%, rgb(124 92 255 / 0.28) 0%, transparent 70%), radial-gradient(50% 45% at 90% 5%, rgb(255 61 132 / 0.22) 0%, transparent 70%), radial-gradient(45% 40% at 60% 95%, rgb(16 201 143 / 0.16) 0%, transparent 70%)',
        'ink-gradient': 'linear-gradient(160deg, #1a1240 0%, #120d2b 60%, #0d0920 100%)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(14px)' }, '100%': { opacity: '1', transform: 'none' } },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'scale-in': { '0%': { opacity: '0', transform: 'scale(0.96)' }, '100%': { opacity: '1', transform: 'none' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      },
      animation: {
        'fade-up': 'fade-up 0.55s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.25s ease-out both',
        'scale-in': 'scale-in 0.2s ease-out both',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
}
