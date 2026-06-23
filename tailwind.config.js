/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Courier New"', 'Consolas', 'Monaco', 'monospace'],
        display: ['"Courier New"', 'Consolas', 'Monaco', 'monospace'],
      },
      colors: {
        brand: {
          50: '#f0f0fa',
          100: '#d9d8f3',
          200: '#b8b6e9',
          300: '#8d8adb',
          400: '#6c68cd',
          500: '#4f4ab8',
          600: '#2F2E8B',
          700: '#282678',
          800: '#232164',
          900: '#1e1c54',
        },
      },
    },
  },
  plugins: [],
}
