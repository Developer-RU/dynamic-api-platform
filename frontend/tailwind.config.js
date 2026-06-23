/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        dark: {
          bg: 'rgb(var(--dap-bg) / <alpha-value>)',
          card: 'rgb(var(--dap-card) / <alpha-value>)',
          border: 'rgb(var(--dap-border) / <alpha-value>)',
          hover: 'rgb(var(--dap-hover) / <alpha-value>)',
          text: 'rgb(var(--dap-text) / <alpha-value>)',
          muted: 'rgb(var(--dap-muted) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
