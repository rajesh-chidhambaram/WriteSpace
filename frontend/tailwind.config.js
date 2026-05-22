module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette for WriteSpace
        'cream': '#FBF8F3',
        'warm-white': '#FDFBF7',
        'soft-beige': '#E5D7C8',
        'sage-green': '#C4B5A0',
        'light-peach': '#F5E6D3',
        'pale-lavender': '#E8E2F0',
        'neutral-gray': '#8B8680',
        'dark-gray': '#3E3937',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'display': ['Poppins', 'sans-serif'],
        'mono': ['Manrope', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
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
      },
    },
  },
  plugins: [],
}
