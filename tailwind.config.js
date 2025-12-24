/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Fredoka-Regular'],
        fredoka: ['Fredoka-Regular'],
        'fredoka-bold': ['Fredoka-Bold'],
        'fredoka-semibold': ['Fredoka-SemiBold'],
        'fredoka-medium': ['Fredoka-Medium'],
        'fredoka-light': ['Fredoka-Light'],
      },
    },
  },

  plugins: [],
};
