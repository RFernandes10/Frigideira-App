/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E67E22', // Laranja cenoura/terracota (mais apetitoso)
          dark: '#D35400',    // Laranja queimado
          light: '#F39C12',   // Mel/Ouro
        },
        secondary: {
          DEFAULT: '#27ae60', // Verde fresco (alface/ervas)
          dark: '#1e8449',
          light: '#FDFCF9',   // Fundo creme mais suave
        },
        accent: {
          brown: '#4A3728',   // Marrom café/madeira
          charcoal: '#2C3E50',
        }
      },
      boxShadow: {
        'soft': '0 10px 30px rgba(0, 0, 0, 0.05)',
        'card': '0 20px 40px rgba(0, 0, 0, 0.08)',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Poppins', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-subtle': 'bounceSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}
