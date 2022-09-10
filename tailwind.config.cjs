/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  safelist: [
    'correct-choice',
    'wrong-choice',
    'border-red-500'
  ],
  theme: {
    extend: {}
  },
  plugins: []
}
