/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e40af', // Biru Tua untuk kepercayaan & keamanan
        accent: '#f97316', // Oranye Cerah untuk energi & harapan
        secondary: '#0f172a', // Hitam untuk otoritas & profesionalisme
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        optional: {
          brown: '#a0522d', // Cokelat untuk stabilitas
          green: '#14532d', // Hijau Tua untuk keamanan & kedamaian
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'text-shimmer': 'text-shimmer 2s ease-in-out infinite',
        'slide-in-right': 'slide-in-right 0.8s ease-out',
        'slide-in-bottom': 'slide-in-bottom 0.8s ease-out',
        'scale-in': 'scale-in 0.6s ease-out',
        'cyber-pulse': 'cyber-pulse 2s ease-in-out infinite',
        'hologram': 'hologram 3s ease-in-out infinite',
        'wave': 'wave 2s ease-in-out infinite',
        'levitate': 'levitate 4s ease-in-out infinite',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'text-shimmer': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-bottom': {
          '0%': { transform: 'translateY(50%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'cyber-pulse': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)' },
        },
        'hologram': {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' },
        },
        'wave': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(5deg)' },
          '75%': { transform: 'rotate(-5deg)' },
        },
        'levitate': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(1deg)' },
        },
      },
    },
  },
  plugins: [],
}
