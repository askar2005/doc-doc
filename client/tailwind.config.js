/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B0F1A',
        card: '#111827',
        primary: '#8B5CF6',
        secondary: '#22D3EE',
        accent: '#38BDF8'
      },
      boxShadow: {
        neon: '0 0 0 1px rgba(56,189,248,0.18), 0 0 40px rgba(139,92,246,0.22)'
      }
    }
  },
  plugins: []
};

