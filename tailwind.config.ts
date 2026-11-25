import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#263F12',
          'green-hover': '#1E320E',
          secondary: '#5D852D',
          muted: '#97A38A',
        },
        ivory: '#FAF9F0',
        surface: '#FFFFFF',
        ink: '#26351F',
        'ink-secondary': '#6B7165',
        border: '#DDE2D4',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Jost', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '4px',
        md: '6px',
      },
      maxWidth: {
        container: '1320px',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
