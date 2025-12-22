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
        'neon-blue': '#00BFFF',
        'neon-cyan': '#00FFFF',
        whatsapp: {
          'dark-bg-primary': '#111b21',
          'dark-bg-secondary': '#202c33',
          'dark-bg-tertiary': '#2a3942',
          'accent': '#00a884',
        },
        'gold-accent': '#DAA520',
        'sky-blue': '#87CEEB',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        script: ['Dancing Script', 'cursive'],
      },
      keyframes: {
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      animation: {
        gradient: 'gradient 15s ease infinite',
      },
    },
  },
  plugins: [],
}
