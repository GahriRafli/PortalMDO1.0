const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screen: {
      'xxl': {'min': '1920px'}
    },
    extend: {
      screens: {
        'print': { 'raw': 'print' },
        'xxl': {'min': '1920px'}
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        rose: colors.rose,
        cyan: colors.cyan,
        emerald: colors.emerald,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
  corePlugins: {
    preflight: true // <== disable this!
  },
};
