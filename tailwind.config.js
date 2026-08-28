/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#dbe6fe',
          200: '#bed0fd',
          300: '#91b0fb',
          400: '#5f88f7',
          500: '#3b63f0',
          600: '#2745e3',
          700: '#2136c4',
          800: '#212f9e',
          900: '#212c7d',
        },
      },
    },
  },
  plugins: [],
};
