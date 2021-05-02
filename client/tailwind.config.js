var flattenColorPalette = require('tailwindcss/lib/util/flattenColorPalette').default;

module.exports = {
  darkMode: 'media',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    ({ addUtilities, e, theme, variants }) => {
      const colors = flattenColorPalette(theme('borderColor'));
      delete colors['default'];

      const colorMap = Object.keys(colors)
          .map(color => ({
            [`.border-t-${color}`]: {borderTopColor: colors[color]},
            [`.border-r-${color}`]: {borderRightColor: colors[color]},
            [`.border-b-${color}`]: {borderBottomColor: colors[color]},
            [`.border-l-${color}`]: {borderLeftColor: colors[color]},
          }));
      const utilities = Object.assign({}, ...colorMap);

      addUtilities(utilities, variants('borderColor'));
    },
  ],
}