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
          50: '#ebf3fd',
          100: '#d7e7fb',
          200: '#aecff7',
          300: '#86b7f3',
          400: '#5d9fef',
          500: '#3498db',
          600: '#2980b9',
          700: '#1e5f87',
          800: '#144055',
          900: '#0a2023',
        },
        secondary: {
          500: '#9b59b6',
          600: '#8e44ad',
        },
        danger: {
          500: '#e74c3c',
          600: '#c0392b',
        },
        success: {
          500: '#27ae60',
          600: '#229954',
        },
        warning: {
          500: '#f39c12',
          600: '#e67e22',
        }
      },
      fontFamily: {
        sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
    },
  },
  plugins: [],
}