/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        whatsapp: {
          'dark-bg-primary': '#111b21',
          'dark-bg-secondary': '#202c33',
          'dark-bg-tertiary': '#2a3942',
          'accent': '#00a884',
        },
        'gold-accent': '#DAA520', // A nice vibrant gold
        'sky-blue': '#87CEEB', // Added sky blue color
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'], // Set Manrope as the primary sans-serif font
        manrope: ['Manrope', 'sans-serif'], // Also add a specific manrope class
        script: ['Dancing Script', 'cursive'], // Add Dancing Script
      },
    },
  },
  plugins: [],
}
