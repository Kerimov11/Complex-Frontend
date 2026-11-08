/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ice: {
          50: '#eff9ff',
          100: '#dcf2ff',
          200: '#b8e6ff',
          300: '#8ad9ff',
          400: '#5bc8fb',
          500: '#38b6f0',
          600: '#1f96d3',
          700: '#1878ab',
          800: '#18658d',
          900: '#0d5375',
        },
        night: {
          800: '#101a30',
          900: '#0a1122',
          950: '#060b18',
        },
        frost: '#eaf6ff',
      },
      fontFamily: {
        display: ['Montserrat', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px rgba(2, 12, 27, 0.45)',
        'ice-glow': '0 0 40px rgba(91, 200, 251, 0.25)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'float': 'float 7s ease-in-out infinite',
        'shine': 'shine 6s linear infinite',
        'drift': 'drift 18s ease-in-out infinite alternate',
      },
      keyframes: {
        pulseSoft: {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shine: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        drift: {
          '0%': { transform: 'translateX(-2%)' },
          '100%': { transform: 'translateX(2%)' },
        },
      },
    },
  },
  plugins: [],
}