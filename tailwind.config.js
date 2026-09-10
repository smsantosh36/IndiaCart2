/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0F172A',
        paper: '#F6F5F1',
        mango: '#FF6B35',
        teal: '#0E7C7B',
        muted: '#6B7280',
        line: '#E4E1D8'
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
};
