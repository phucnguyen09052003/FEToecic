/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      irish: ['irish-grover'],
    },
    extend: {
      colors: {
        blue1: '#03045e',
        blue2: '#0077b6',
        blue3:'#00b4d8',
        blue4:'#90e0ef',
        blue5:'#caf0f8'
      },
    },
   
  },
  plugins: [],
}

