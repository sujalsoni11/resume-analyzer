/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: '#F2EFE4',
        'dark-teal': '#0D3333',
        'lime': '#C8FF00',
        'lime-dark': '#A3D400',
        'teal-800': '#0A2525',
        'teal-900': '#071A1A',
      },
      fontFamily: {
        display: ['Big Shoulders Display', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'dot-grid': 'radial-gradient(circle, #0D3333 1px, transparent 1px)',
        'dot-grid-light': 'radial-gradient(circle, rgba(13,51,51,0.15) 1px, transparent 1px)',
      },
      backgroundSize: {
        'dot-sm': '20px 20px',
        'dot-md': '30px 30px',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-lime': 'pulseLime 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        pulseLime: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(200, 255, 0, 0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(200, 255, 0, 0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}
