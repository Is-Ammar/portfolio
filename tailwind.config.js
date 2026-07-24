/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--bg-rgb) / <alpha-value>)',
        'bg-elev-1': 'rgb(var(--bg-elev-1-rgb) / <alpha-value>)',
        'bg-elev-2': 'rgb(var(--bg-elev-2-rgb) / <alpha-value>)',
        surface: 'rgb(var(--surface-rgb) / <alpha-value>)',
        'text-strong': 'rgb(var(--text-strong-rgb) / <alpha-value>)',
        text: 'rgb(var(--text-rgb) / <alpha-value>)',
        'text-muted': 'rgb(var(--text-muted-rgb) / <alpha-value>)',
        accent: 'rgb(var(--accent-rgb) / <alpha-value>)',
        'accent-2': 'rgb(var(--accent-2-rgb) / <alpha-value>)',
        'accent-3': 'rgb(var(--accent-3-rgb) / <alpha-value>)',
        line: 'rgb(var(--line-rgb) / <alpha-value>)',
        'line-strong': 'rgb(var(--line-strong-rgb) / <alpha-value>)',
        focus: 'rgb(var(--focus-rgb) / <alpha-value>)',
      },
      opacity: {
        18: '.18',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        glow: 'var(--glow)',
        card: 'var(--shadow)',
      },
    },
  },
  plugins: [],
};
