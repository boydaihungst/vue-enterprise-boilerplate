const colors = require('windicss/colors');
module.exports = {
  purge: {
    content: [('./src/**/*.html', './src/**/*.vue', './src/**/*.jsx')],
    options: {
      keyframes: true,
      fontFace: true,
    },
  },
  darkMode: 'class',
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('windicss/plugin/typography'),
    require('windicss/plugin/forms'),
    require('windicss/plugin/aspect-ratio'),
    require('windicss/plugin/line-clamp'),
    // require('tailwind-scrollbar'),
    // require('tailwindcss-question-mark'),
  ],
};
