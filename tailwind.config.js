/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      },
      colors: {
        notion: {
          bg: {
            primary: 'var(--bg-primary)',
            secondary: 'var(--bg-secondary)',
            sidebar: 'var(--bg-sidebar)',
            hover: 'var(--bg-hover)',
            active: 'var(--bg-active)',
            input: 'var(--bg-input)',
            callout: 'var(--bg-callout)',
            'table-header': 'var(--bg-table-header)',
            'table-row': 'var(--bg-table-row)',
            toggle: 'var(--bg-toggle)',
          },
          text: {
            primary: 'var(--text-primary)',
            secondary: 'var(--text-secondary)',
            muted: 'var(--text-muted)',
            placeholder: 'var(--text-placeholder)',
          },
          border: {
            DEFAULT: 'var(--border)',
            light: 'var(--border-light)',
          },
          divider: 'var(--divider)',
          green: {
            primary: 'var(--green-primary)',
            dark: 'var(--green-dark)',
            light: 'var(--green-light)',
            muted: 'var(--green-muted)',
          },
          // Notion block colors
          red: { DEFAULT: '#EB5757', bg: '#FBE4E4' },
          orange: { DEFAULT: '#E07C2A', bg: '#FAEBDD' },
          yellow: { DEFAULT: '#DFAB01', bg: '#FBF3DB' },
          blue: { DEFAULT: '#2F80ED', bg: '#DDEBF1' },
          purple: { DEFAULT: '#9B51E0', bg: '#EAE4F2' },
          pink: { DEFAULT: '#E255A1', bg: '#F4DFEB' },
          brown: { DEFAULT: '#8C6E54', bg: '#E9E5E3' },
          gray: { DEFAULT: '#9B9A97', bg: '#EBECED' },
        },
      },
      spacing: {
        sidebar: '248px',
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
      },
    },
  },
  plugins: [],
}
