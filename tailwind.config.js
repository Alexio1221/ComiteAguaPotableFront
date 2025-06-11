/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0077B6',     // Azul agua
        secondary: '#CAF0F8',   // Celeste claro
        accent: '#90BE6D',      // Verde suave
        textdark: '#333333',    // Gris oscuro
      },
    },
  },
  plugins: [],
};
