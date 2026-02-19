/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fffaf0',
          100: '#fdf0c3',
          200: '#f9e08b',
          300: '#f4cf4b',
          400: '#e1bd3f',
          500: '#d4af37',
          600: '#b68f1f',
          700: '#8f6f19',
          800: '#6e5415',
          900: '#4a390f',
        },
        industrial: {
          50: '#f5f7fa',
          100: '#d8e0ea',
          200: '#b3c0d0',
          300: '#8698ad',
          400: '#5f7389',
          500: '#45586c',
          600: '#314050',
          700: '#232d39',
          800: '#171f29',
          900: '#0f141c',
          950: '#080b12',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'Noto Sans SC', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
