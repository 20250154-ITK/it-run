/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        luna: {
          50:  '#e8f8fb',
          100: '#a7ebf2',
          200: '#54acbf',
          300: '#26658c',
          400: '#023859',
          500: '#011c40',
        },
      },
    },
  },
  plugins: [],
}
