/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/**/*.html',
    './public/**/*.ejs',
    './src/**/*.js',
    './src/**/*.ejs',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1f2937',
        secondary: '#4b5563',
        accent: '#6366f1',
      },
    },
  },
  plugins: [],
};