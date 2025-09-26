/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563EB", // Primary Blue
          hover: "#1D4ED8",
        },
        // Define other colors from our design spec
      },
    },
  },
  plugins: [],
};