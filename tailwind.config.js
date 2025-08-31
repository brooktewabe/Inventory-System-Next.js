/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      gridTemplateColumns: {
        "70-30": "70% 28%",
      },
      colors: {
        background: "#217FBE",
      },
      fontSize: {
        'xs': '0.75rem',
        'xxs': '0.625rem',
      },
    },
  },
  plugins: [],
}