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
          DEFAULT: '#ef4444',
          hover: '#dc2626',
        },
        secondary: '#6b7280',
      },
      spacing: {
        'section': '2rem',
        'container': '1.5rem',
      },
      borderRadius: {
        'container': '0.75rem',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s infinite',
      },
      fontFamily: {
        'black': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
