/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        card: '#111118',
        primary: {
          light: '#8b5cf6',
          DEFAULT: '#7c3aed',
        },
        accent: '#06b6d4',
      },
      fontFamily: {
        heading: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
      }
    },
  },
  plugins: [],
}
