/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  darkMode: 'class', // Or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'radial-gradient(circle at var(--random-percent) var(--random-percent), rgba(30, 144, 231, 1) 0%, rgba(56, 113, 209, 1) 22.9%, rgba(38, 76, 140, 1) 76.7%, rgba(31, 63, 116, 1) 100.2%)'
      },
      colors: {
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'sans-serif']
      }
    }
  },
  plugins: []
}
