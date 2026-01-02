/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient':
          'radial-gradient(circle at 20.7% 30.3%, rgba(30, 144, 231, 0.2) 0%, rgba(56, 113, 209, 0.2) 22.9%, rgba(38, 76, 140, 0.2) 76.7%, rgba(31, 63, 116, 0.2) 100.2%)',
      },
      colors: {},
      fontFamily: {
        playfair: ['"Playfair Display"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
