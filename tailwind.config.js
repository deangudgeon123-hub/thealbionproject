/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      colors: {
        albion: {
          blue: '#00247D', // Union Jack Blue
          red: '#CF142B',   // Union Jack Red (muted)
          navy: '#0f172a',  // Deep Slate
          light: '#f8fafc', // Off white
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}