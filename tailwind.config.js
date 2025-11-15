/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neutral palette
        slate: {
          50: '#FFF8E7',   // Warm cream
          100: '#FBF1DB',  // Light cream
          200: '#E5E7EB',  // Soft gray
          600: '#4B5563',  // Medium gray
          700: '#374151',  // Dark gray
          800: '#1E293B',  // Darker slate
          900: '#0F172A',  // Near black
        },
        // Sage Green (Primary)
        emerald: {
          50: '#F2F6EA',   // Very light sage
          100: '#E8EED8',  // Light sage
          200: '#DCE6C3',  // Soft sage
          300: '#CFDDAE',  // Medium-light sage
          400: '#A7B87B',  // Mid sage
          500: '#2D5A27',  // Primary sage green
          600: '#254C22',  // Dark sage
          700: '#1E3D1B',  // Darker sage
          900: '#0F1E0D',  // Deep sage
        },
        // Brand Blue
        violet: {
          50: '#EAF2F8',   // Very light blue
          100: '#D8E6F2',  // Light blue
          200: '#BBD2E6',  // Soft blue
          400: '#5E8FB5',  // Mid blue
          500: '#2D5B7E',  // Primary brand blue
          600: '#244A65',  // Dark blue
          900: '#0F1E2A',  // Deep blue
        },
        // Terracotta (Accent)
        amber: {
          50: '#FEF8F5',   // Very light terracotta
          100: '#F5E0D9',  // Light terracotta
          400: '#E59C84',  // Mid terracotta
          500: '#CC7357',  // Primary terracotta
          600: '#B35F46',  // Dark terracotta
        },
      },
      fontFamily: {
        // Using system fonts for COPPA compliance
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'hero': '0 20px 40px -12px rgba(45, 90, 39, 0.25)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'bounce-in': 'bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      keyframes: {
        'bounce-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.3)',
          },
          '50%': {
            opacity: '0.9',
            transform: 'scale(1.05)',
          },
          '70%': {
            transform: 'scale(0.97)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
      },
    },
  },
  plugins: [],
}
