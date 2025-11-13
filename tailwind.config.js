/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        slate: {
          50: '#FFF8E7',
          100: '#FBF1DB',
          600: '#4B5563',
          700: '#374151',
          800: '#1E293B',
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
          100: '#F5E0D9',
          400: '#E59C84',
          500: '#CC7357',
          600: '#B35F46',
        },
      },
      fontFamily: {
        sans: ['"Nunito Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
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
    },
  },
  plugins: [],
};
