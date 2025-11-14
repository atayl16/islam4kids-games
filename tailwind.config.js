/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        slate: {
          50: '#FFF8E7',
          100: '#FBF1DB',
          200: '#E5E7EB',
          600: '#4B5563',
          700: '#374151',
          800: '#1E293B',
          900: '#0F172A',
        },
        emerald: {
          50: '#F2F6EA',
          100: '#E8EED8',
          200: '#DCE6C3',
          300: '#CFDDAE',
          400: '#A7B87B',
          500: '#2D5A27',
          600: '#254C22',
          700: '#1E3D1B',
          900: '#0F1E0D',
        },
        violet: {
          50: '#EAF2F8',
          100: '#D8E6F2',
          200: '#BBD2E6',
          400: '#5E8FB5',
          500: '#2D5B7E',
          600: '#244A65',
          900: '#0F1E2A',
        },
        amber: {
          50: '#FEF8F5',
          100: '#F5E0D9',
          400: '#E59C84',
          500: '#CC7357',
          600: '#B35F46',
        },
      },
      fontFamily: {
        // Using system fonts for COPPA compliance - friendly, rounded system fonts
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ],
      },
      boxShadow: {
        hero: '0 25px 50px -12px rgba(45, 90, 39, 0.25)',
      },
      borderRadius: {
        '3xl': '1.5rem',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, rgba(244, 247, 234, 0.8), rgba(234, 242, 248, 0.8))',
      },
      keyframes: {
        'bounce-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.3)',
          },
          '50%': {
            opacity: '1',
            transform: 'scale(1.05)',
          },
          '70%': {
            transform: 'scale(0.9)',
          },
          '100%': {
            transform: 'scale(1)',
          },
        },
      },
      animation: {
        'bounce-in': 'bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
    },
  },
  plugins: [],
};
