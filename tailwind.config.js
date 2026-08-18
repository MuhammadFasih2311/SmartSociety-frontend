/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0f0e17',
          light: '#1a1932',
          dark: '#0a0a10',
        },
        secondary: {
          DEFAULT: '#1a1a2e',
          light: '#2a2a4a',
        },
        accent: {
          DEFAULT: '#ff8906',
          light: '#ffa94d',
          dark: '#e07c05',
        },
        success: '#0a9396',
        warning: '#e9d8a6',
        danger: '#e63946',
        text: {
          DEFAULT: '#fffffe',
          muted: '#94a1b2',
        },
        card: '#16162e',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'gradient': 'gradient 3s ease infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #0f0e17 0%, #1a1932 100%)',
        'gradient-accent': 'linear-gradient(135deg, #ff8906 0%, #ffa94d 100%)',
      },
      boxShadow: {
        'glow': '0 0 40px rgba(255, 137, 6, 0.15)',
        'glow-lg': '0 0 60px rgba(255, 137, 6, 0.25)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 12px 48px rgba(255, 137, 6, 0.15)',
      },
    },
  },
  plugins: [],
}