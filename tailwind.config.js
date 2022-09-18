const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      screens: {
        'print': { 'raw': 'print' },
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
