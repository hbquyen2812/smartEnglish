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
          DEFAULT: '#0f172a', // Đen than (Nút bấm, Header)
          hover: '#1e293b',
        },
        background: '#f8fafc', // Xám nền web
        surface: '#ffffff',    // Nền card
        border: '#e2e8f0',     // Viền mờ
        accent: {
          green: '#22c55e',    // Beginner / Success
          yellow: '#fbbf24',   // Intermediate
          red: '#ef4444',      // Advanced / Error
          purple: '#8b5cf6',   // Quiz icon
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
      }
    },
  },
  plugins: [],
}