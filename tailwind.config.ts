import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          bg: '#0b1021',
          card: '#11172d',
          text: '#e5ecff',
          accent: '#7dd3fc'
        },
        paper: {
          bg: '#f7f4ef',
          card: '#ffffff',
          text: '#1f2937',
          accent: '#e11d48'
        },
        neon: {
          bg: '#0b0f1a',
          card: '#111827',
          text: '#e0f2fe',
          accent: '#a855f7'
        }
      },
      boxShadow: {
        glow: '0 0 25px rgba(124, 58, 237, 0.35)'
      },
      keyframes: {
        drift: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
          '100%': { transform: 'translateY(0px)' }
        }
      },
      animation: {
        drift: 'drift 8s ease-in-out infinite'
      }
    }
  },
  plugins: []
};

export default config;
