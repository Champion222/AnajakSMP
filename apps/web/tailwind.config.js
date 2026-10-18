/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#F5C542',
          bright: '#FFD84D',
          deep: '#D99A16',
          dark: '#B37D0B',
          glow: 'rgba(245, 197, 66, 0.25)',
        },
        brand: {
          bg: '#0B0B0F',
          secondary: '#14141B',
          card: '#1B1B24',
          'card-hover': '#23232E',
          border: '#343440',
          'border-light': '#4A4A5A',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#B8B8C4',
          muted: '#7A7A8A',
        },
        status: {
          success: '#37D67A',
          error: '#FF5B63',
          warning: '#FFAA33',
          info: '#3B82F6',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(245, 197, 66, 0.2)',
        'gold-glow-lg': '0 0 40px rgba(245, 197, 66, 0.35)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
