/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './*.{html,js}',
    './src/**/*.{js,html}',
    './services/**/*.html',
    './projects/**/*.html',
    './journal/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette extracted from the original logo & stylesheet:
        // gold #d4af37, charcoal #1e2229, dark #141414 (mehrazsanjshargh.ir)
        paper: 'rgb(var(--c-paper) / <alpha-value>)',
        paper2: 'rgb(var(--c-paper2) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        inksoft: 'rgb(var(--c-inksoft) / <alpha-value>)',
        muted: 'rgb(var(--c-muted) / <alpha-value>)',
        gold: 'rgb(var(--c-gold) / <alpha-value>)',
        golddeep: 'rgb(var(--c-golddeep) / <alpha-value>)',
        dark: 'rgb(var(--c-dark) / <alpha-value>)',
        charcoal: 'rgb(var(--c-charcoal) / <alpha-value>)',
        steel: 'rgb(var(--c-steel) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Vazirmatn', 'Segoe UI', 'Tahoma', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Courier New"', 'monospace'],
      },
      fontSize: {
        // Persian display scale (fluid, tuned for Vazirmatn)
        display: ['clamp(2.75rem, 6vw, 5.25rem)', { lineHeight: '1.15', letterSpacing: '0' }],
        h1: ['clamp(2.1rem, 4.2vw, 3.4rem)', { lineHeight: '1.2' }],
        h2: ['clamp(1.6rem, 3vw, 2.5rem)', { lineHeight: '1.3' }],
        h3: ['clamp(1.25rem, 2.2vw, 1.65rem)', { lineHeight: '1.45' }],
        lead: ['clamp(1.05rem, 1.6vw, 1.3rem)', { lineHeight: '1.9' }],
      },
      maxWidth: {
        content: '75rem', // 1200px editorial column
      },
      transitionTimingFunction: {
        elegant: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
