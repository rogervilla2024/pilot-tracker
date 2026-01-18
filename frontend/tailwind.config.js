/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pilot: {
          // Vintage aviation brown palette
          dark: '#92400e',
          brown: '#a16207',
          tan: '#ca8a04',
          gold: '#d97706',
          // Cream palette
          cream: '#fef3c7',
          'cream-light': '#fffbeb',
          'cream-dark': '#fde68a',
          // Sky accent
          sky: '#0ea5e9',
          'sky-light': '#38bdf8',
          'sky-dark': '#0284c7',
          // Additional aviation colors
          leather: '#78350f',
          copper: '#b45309',
          brass: '#eab308',
        },
      },
      fontFamily: {
        'display': ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        'body': ['Helvetica Neue', 'Arial', 'sans-serif'],
        'mono': ['Courier New', 'monospace'],
      },
      boxShadow: {
        'vintage': '0 4px 6px -1px rgba(120, 53, 15, 0.2), 0 2px 4px -2px rgba(120, 53, 15, 0.1)',
        'vintage-lg': '0 10px 15px -3px rgba(120, 53, 15, 0.25), 0 4px 6px -4px rgba(120, 53, 15, 0.1)',
        'vintage-inner': 'inset 0 2px 4px 0 rgba(120, 53, 15, 0.15)',
        'glow-gold': '0 0 20px rgba(217, 119, 6, 0.4)',
        'glow-sky': '0 0 20px rgba(14, 165, 233, 0.4)',
      },
      backgroundImage: {
        'leather-texture': 'linear-gradient(135deg, #92400e 0%, #78350f 50%, #92400e 100%)',
        'cream-gradient': 'linear-gradient(180deg, #fffbeb 0%, #fef3c7 100%)',
        'sky-gradient': 'linear-gradient(180deg, #0ea5e9 0%, #0284c7 100%)',
        'brass-gradient': 'linear-gradient(180deg, #eab308 0%, #ca8a04 50%, #a16207 100%)',
      },
      animation: {
        'propeller': 'propeller 0.5s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'compass': 'compass 4s ease-in-out infinite',
      },
      keyframes: {
        propeller: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        compass: {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%': { transform: 'rotate(5deg)' },
        },
      },
      borderRadius: {
        'vintage': '0.5rem',
      },
    },
  },
  plugins: [],
}
