const { tailwindLayouts, defaultOptions } = require('tailwind-layouts');
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
  plugins: [
    tailwindLayouts({
      ...defaultOptions,
      useLogicalProperties: true,
      classNames: {
        ...defaultOptions.classNames,
        cluster: 'amazing-cluster',
        sidebar: 'amazing-sidebar',
        switcher: 'amazing-switcher',
        cover: 'amazing-cover',
        grid: 'amazing-grid',
        frame: 'amazing-frame',
        reel: 'amazing-reel',
        imposter: 'amazing-imposter',
        icon: 'amazing-icon',
        stack: 'amazing-stack',
      },
    }),
    tailwindLogical,
  ],
};
