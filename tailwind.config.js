/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    fontFamily: {
      sans: ['Inter var', 'sans-serif'],
    },
    extend: {
      colors: {
        'amazing': 'var(--color-amazing)',
        'amazing-dark': 'var(--color-amazing-dark)',
        'amazing-light': 'var(--color-amazing-light)',
        'amazing-accent': 'var(--color-amazing-accent)',
        'amazing-text-primary': 'var(--color-amazing-text-primary)',
        'amazing-text-secondary': 'var(--color-amazing-text-secondary)',
      },
      boxShadow: {
        inputs: '0 0 0 .2rem var(--shadow-color)',
      },
    },
  },
  plugins: [],
};
