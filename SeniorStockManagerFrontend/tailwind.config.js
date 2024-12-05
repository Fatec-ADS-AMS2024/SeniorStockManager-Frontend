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
        neutralLight: 'var(--color-neutral-light)',

        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
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
        confirmation: 'var(--color-confirmation)',
        hoverConfirmation: 'var(--color-hoverConfirmation)',
        }
    },
  },
  plugins: [],
}

