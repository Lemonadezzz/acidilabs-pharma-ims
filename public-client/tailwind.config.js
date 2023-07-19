/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#fb5607",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // disables tailwind resets
  },
};
