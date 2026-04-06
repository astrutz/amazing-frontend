/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    fontFamily: {
      sans: ['Inter var', 'sans-serif'],
    },
    extend: {
      colors: {
        'amazing': '#5F2234',
        'amazing-dark': '#210d11',
        'amazing-light': '#aa6b7e',
        'amazing-accent': '#f43f5e',
        'amazing-text-primary': '#ffe4e6',
        'amazing-text-secondary': '#ffe4e680',
      },
      boxShadow: {
        inputs: '0 0 0 .2rem #aa6b7e',
      },
    },
  },
  plugins: [],
};
