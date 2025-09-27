
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}', // Adicionado para componentes na raiz
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Cores base do design system
        'brand-dark-blue': '#081A34',
        'brand-medium-blue': '#0C264A',
        'brand-light-blue': '#112A4C',
        'brand-card-start': '#1D3557',
        'brand-card-end': '#274D84',
        'brand-text-light': '#C9D7F2',
        'brand-text-icon': '#8FAAD9',

        // Cores de ação
        'brand-green-neon': '#3ECF8E',
        'brand-action-blue-light': '#2979FF',
        'brand-action-blue-medium': '#1D62D9',
        'brand-cyan': '#42A5F5',
        'brand-alert-orange': '#FFA726',
        'brand-logo-green': '#32CD32',
        'brand-alert-red': '#FF0000',

        // Cores de fundo e texto padrão
        background: '#061325', // Um fundo geral escuro
        foreground: '#FFFFFF',
        'white': '#FFFFFF',
        'black': '#000000',
        'atlantis': '#83cf47',
        'starship': '#c3f548',
        'denim': '#0e7ed9',
        'heather': '#b8c5d0',
        'mallard': '#27471f',
        'shuttle-gray': '#59606b',
        'malibu': '#71befa',
        'apple': '#4da444',
        'venice-blue': '#064a8a',
      },
      backgroundImage: {
        'gradient-sidebar': 'linear-gradient(to bottom, #081A34, #0C264A)',
        'gradient-card': 'linear-gradient(to bottom right, #1D3557, #274D84)',
        'gradient-button-bar': 'linear-gradient(to right, #2979FF, #1D62D9)',
        'gradient-green-diet': 'linear-gradient(to bottom, #83cf47, #27471f)',
      },
      boxShadow: {
        'avatar': '0px 2px 6px rgba(0,0,0,0.25)',
        'card': '0px 4px 12px rgba(0,0,0,0.25)',
      },
    },
  },
  plugins: [],
};

export default config;