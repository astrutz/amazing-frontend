/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    fontFamily: {
      sans: [
        'Inter var',
        'sans-serif'
      ]
    },
    extend: {
      colors: {
        'amazing-bordeaux': '#5F2234'
      },
    },
  },
  plugins: [],
}
