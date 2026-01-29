/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    screens: {
      'sm': '300px',
      'lg': '800px',
      'xl': '1400px',
    },
    extend: {
      scale: {
        '85': '0.85',
      }
    },
  },
  plugins: [],
}

