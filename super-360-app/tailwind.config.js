/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Great Lakes Chennai Color Palette
        primary: {
          DEFAULT: '#0091c4',
          dark: '#2296d0',
          light: '#58c0e8'
        },
        secondary: {
          DEFAULT: '#595959',
          light: '#f2f2f2',
          border: '#d9d9d9'
        },
        accent: {
          green: '#58a72c',
          red: '#ff0000',
          blue: '#2563EB',
          teal: '#0891B2'
        },
        greatlakes: {
          blue: '#0091c4',
          darkblue: '#2296d0',
          gray: {
            light: '#f3f1f1',
            medium: '#d9d9d9',
            dark: '#595959',
            darker: '#212529'
          }
        }
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        playfair: ['Playfair Display', 'serif']
      },
      fontSize: {
        'hero': '42px',
        'heading': '30px',
        'subheading': '20px'
      },
      spacing: {
        'header': '94px',
        'header-mobile': '60px'
      }
    },
  },
  plugins: [],
}
