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
          800: '#0f1829',
          900: '#0b1220',
          950: '#080d18',
        },
        frost: '#eaf6ff',
      },
      fontFamily: {
        display: ['Montserrat', 'system-ui', 'sans-serif'],
        sans: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 4px 16px rgba(0, 0, 0, 0.35)',
        'ice-glow': '0 1px 2px rgba(0, 0, 0, 0.3)',
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