/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        terracotta: {
          DEFAULT: '#C4795A',
          50: '#FBF5F2',
          100: '#F6EAE4',
          500: '#C4795A',
          600: '#B06546',
          700: '#945136',
        },
        sage: {
          DEFAULT: '#5C7A6B',
          50: '#F3F6F4',
          100: '#E4ECE7',
          500: '#5C7A6B',
          600: '#4A6456',
          700: '#3A5044',
        },
        champagne: '#F4EBE1',
        charcoal: '#1A1817'
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
