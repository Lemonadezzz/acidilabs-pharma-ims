/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#317159",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // disables tailwind resets
  },
};
