/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./index.html",
  "./src/**/*.{js}"
],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'), require('daisyui'),
],
}

