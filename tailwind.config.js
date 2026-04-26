/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        display: ['Inter', 'ui-sans-serif'],
      },
      colors: {
        bg: '#EEF2FF',
        surface: '#FFFFFF',
        sidebar: '#0D0F14',
        'sidebar-hover': '#161B24',
        accent: {
          mint:    '#BBFBEF',
          sky:     '#BAE5FF',
          peach:   '#FFDED0',
          lavender:'#DDD5FF',
          yellow:  '#FFEFB8',
          rose:    '#FFD0DF',
        },
        'accent-deep': {
          mint:    '#00C48C',
          sky:     '#0098FF',
          peach:   '#FF6B2B',
          lavender:'#7C5CFC',
          yellow:  '#F5A623',
          rose:    '#FF3D71',
        },
        muted: '#8B95A8',
        border: '#E4E8F0',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        card: '0 2px 16px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.10)',
        glow: '0 0 24px rgba(0,196,140,0.25)',
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulse2: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        counter: {
          '0%':   { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'fade-up':       'fade-up 0.5s ease forwards',
        'fade-in':       'fade-in 0.4s ease forwards',
        'pulse2':        'pulse2 2s ease-in-out infinite',
        shimmer:         'shimmer 2s linear infinite',
        counter:         'counter 0.3s ease forwards',
      },
    },
  },
  plugins: [],
}

