/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
        textPrimary: 'var(--color-text-primary)',
        textSecondary: 'var(--color-text-secondary)',
        surface: 'var(--color-surface)',
        surfaceUser: 'var(--color-surface-user)',
        hoverButton: 'var(--color-hoverButton)',
      }
    },
  },
  plugins: [],
}

