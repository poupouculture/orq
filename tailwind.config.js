/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // './index.html',
    // './src/**/*. {vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {}
  },
  plugins: [
    '@tailwindcss/forms',
    'tailwindcss/base',
    'tailwindcss/components',
    'tailwindcss/utilities'

  ]
}
