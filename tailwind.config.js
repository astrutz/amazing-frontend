/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    fontFamily: {
      sans: ['Inter var', 'sans-serif'],
    },
    extend: {
      colors: {
        'amazing-bordeaux': '#5F2234',
        'amazing-bordeaux-dark': '#210d11',
        'amazing-bordeaux-light': '#aa6b7e',
      },
      boxShadow: {
        inputs: '0 0 0 .2rem #aa6b7e',
      },
    },
  },
  plugins: [],
};
