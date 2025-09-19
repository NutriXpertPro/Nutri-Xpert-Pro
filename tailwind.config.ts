// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(0, 0%, 0%)', // preto
        foreground: 'hsl(0, 0%, 100%)', // branco
      },
    },
  },
  plugins: [],
}

export default config