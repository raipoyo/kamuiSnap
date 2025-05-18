/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#F9FAFB',
        accent: '#FF4060',
        secondary: '#0EA5E9',
      },
      animation: {
        'scale-like': 'scale-like 200ms ease-in-out',
        'fade-out': 'fade-out 3s ease-in-out',
      },
      keyframes: {
        'scale-like': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};