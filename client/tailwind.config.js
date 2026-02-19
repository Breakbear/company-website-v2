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
          50: '#fff7eb',
          100: '#ffe3b8',
          200: '#ffd08a',
          300: '#ffbc57',
          400: '#ffa625',
          500: '#f48b00',
          600: '#cf7200',
          700: '#a45a00',
          800: '#7d4500',
          900: '#5a3200',
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
