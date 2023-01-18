/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    extend: {
      screens: {},
      colors: {
        blue: '#1fb6ff',
        purple: '#7e5bef',
        pink: '#ff49db',
        orange: '#ff7849',
        green: '#13ce66',
        yellow: '#ffc82c',
        'gray-dark': '#273444',
        gray: '#8492a6',
        'gray-light': '#d3dce6',
        // color pallette
        primary: '#00b7eb',
        accent: '#ff7849',
      },
      spacing: {
        128: '32rem',
        144: '36rem',
      },
      borderRadius: {},
      backdropBrightness: {
        95: '.95',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')({ strategy: 'class' })],
};
