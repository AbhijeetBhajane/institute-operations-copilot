/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#FDFBF7',
          100: '#FAF7F2', // Warm off-white
          200: '#F0EAE1',
          300: '#E2D8C9',
          400: '#C7B7A0',
          800: '#1D1E24',
          900: '#121316', // Night shift background
          950: '#0C0D0F',
        },
        ink: {
          DEFAULT: '#14213D', // Deep ink
          light: '#23385E',
          muted: '#52607B',
          subtle: '#8895A7',
          dark: '#E2E8F0',
        },
        saffron: {
          DEFAULT: '#F5A623', // Marigold / Saffron accent
          light: '#F8BC5C',
          dark: '#D98207',
          soft: '#FEF6E9',
        },
        teal: {
          DEFAULT: '#0F766E', // Deep teal secondary
          light: '#14B8A6',
          dark: '#115E59',
          soft: '#F0FDFA',
        },
        risk: {
          DEFAULT: '#E63946', // Crimson red for risk
          light: '#F87171',
          soft: '#FEF2F2',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        receipt: '0 4px 20px -2px rgba(20, 33, 61, 0.1), 0 0 0 1px rgba(20, 33, 61, 0.05)',
        stamp: '0 8px 30px -4px rgba(245, 166, 35, 0.25), 0 0 0 1px rgba(245, 166, 35, 0.3)',
      },
    },
  },
  plugins: [],
};
