var flattenColorPalette = require('tailwindcss/lib/util/flattenColorPalette').default;

module.exports = {
    darkMode: 'media',
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    theme: {
        extend: {
            'animation': {
                'gradient-x': 'gradient-x 15s ease infinite',
                'gradient-y': 'gradient-y 15s ease infinite',
                'gradient-xy': 'gradient-xy 15s ease infinite',
            },
            'keyframes': {
                'gradient-y': {
                    '0%, 100%': {
                        'background-size': '400% 400%',
                        'background-position': 'center top'
                    },
                    '50%': {
                        'background-size': '200% 200%',
                        'background-position': 'center center'
                    }
                },
                'gradient-x': {
                    '0%, 100%': {
                        'background-size': '200% 200%',
                        'background-position': 'left center'
                    },
                    '50%': {
                        'background-size': '200% 200%',
                        'background-position': 'right center'
                    }
                },
                'gradient-xy': {
                    '0%, 100%': {
                        'background-size': '400% 400%',
                        'background-position': 'left center'
                    },
                    '50%': {
                        'background-size': '200% 200%',
                        'background-position': 'right center'
                    }
                }
            }
        }
    },
    variants: {
        extend: {
            backgroundPosition: ['hover'],
        },
    },
    plugins: [
        ({addUtilities, e, theme, variants}) => {
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
            require('tailwind-scrollbar');
        },
  ],
}