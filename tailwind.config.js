const { tailwindLayouts } = require('tailwind-layouts');
const tailwindLogical = require('tailwindcss-logical');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        'surface-50': 'var(--surface-50)',
      },
    },
  },
  plugins: [tailwindLayouts, tailwindLogical],
};
