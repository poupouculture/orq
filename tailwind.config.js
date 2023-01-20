/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{html,js,vue}"],
  theme: {
    extend: {
      colors: {
        primary: "#4b44f6",
        secondary: "#2e2e3a",
      },
    },
  },
  plugins: [],
};
