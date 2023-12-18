/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      borderWidth: {
        1: '1px',
      },
      divideWidth: {
        1: '1px',
      },
    },
  },
  daisyui: {
    themes: ['bumblebee'],
  },
  plugins: [require('daisyui')],
};
