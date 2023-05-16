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
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic':
				'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				gradientBlue: 'rgb(200,0,36); linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%);',
			},
			colors: {
			},
		},
		fontFamily: {
			inter: ['Inter', 'sans-serif'],
		},
	},
	plugins: [],
};
