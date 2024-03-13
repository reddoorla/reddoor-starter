/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  safelist: [
    "justify-center",
    "justify-start",
    "justify-end",
    "justify-between",
    "justify-around",
     "sm:justify-center",
     "sm:justify-start",
     "sm:justify-end", 
     "hidden",
     "aspect-square",
     "aspect-video",
     "aspect-[16/9]",
     "aspect-[4/3]",
     "translate-y-1"
  ],
  theme: {
    screens: {
      sm: '560px',
      md: '768px',
      lg: '1024px',
      xl: '1340px',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000',
      white: '#fff',
      light:'#C2D1D9',
      dark: '#424B5A',
    },
    extend: {
      transitionTimingFunction: {
        'in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
      }
    },
  },
  plugins: [],
}

