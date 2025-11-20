/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
  colors: {
    primary: {
      DEFAULT: '#140172', // azul violáceo institucional
      dark: '#0f015a',
      light: '#2a1c9c',
    },
    accent: '#2a1c9c',    // mismo tono que primary-400 (nada de turquesa)
    bg: '#f5f7fb',
    text: '#0f172a',
    button: '#140172',
  },
  boxShadow: {
    card: '0 10px 30px rgba(0,0,0,0.06)',
  },
  borderRadius: {
    btn: '9999px',
  },
},

  },
  plugins: [],
}
