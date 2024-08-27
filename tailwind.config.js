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
          light: '#DAE0B7',
          DEFAULT: '#AAB17D',
          dark: '#AAB17D',
        },
        secondary: {
          light: '#C8D7D4',
          DEFAULT: '#91A69F',
          dark: '#73837D',
        },
      },
    },
  },
  plugins: [],
}