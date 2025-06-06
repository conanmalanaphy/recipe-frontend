/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx,svelte}', // Make sure all relevant file types are here
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')], // <--- IMPORTANT: Ensure this is present
  // No prefix: 'tw-' here
};