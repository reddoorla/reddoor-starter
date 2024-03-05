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
  ],
  theme: {
    screens: {
      sm: '560px',
      md: '768px',
      lg: '1024px',
      xl: '1340px',
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

