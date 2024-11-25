/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neutralLighter: 'var(--color-neutral-lighter)',
        neutral: 'var(--color-neutral)',
        neutralDarker: 'var(--color-neutral-darker)',
        neutralDark: 'var(--color-neutral-dark)',

        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
        textPrimary: 'var(--color-text-primary)',
        textSecondary: 'var(--color-text-secondary)',
        neutralWhite: 'var(--color-neutral-white)',
        surfaceUser: 'var(--color-surface-user)',
        hoverButton: 'var(--color-hoverButton)',

        danger: 'var(--color-danger)',
        hoverDanger: 'var(--color-hoverDanger)',
        edit: 'var(--color-edit)',
        hoverEdit: 'var(--color-hoverEdit)',
        success: 'var(--color-success)',
        hoverSuccess: 'var(--color-hoverSuccess)',
        warning: 'var(--color-warning)',
        green001: 'var(--color-green-001)',
        green002: 'var(--color-green-002)',
        red001: 'var(--color-red-001)',
        red002: 'var(--color-red-002)',
      }
    },
  },
  plugins: [],
}

