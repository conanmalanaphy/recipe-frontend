// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Define the output type for the build
  output: 'static', // <--- ADD THIS: Ensures a static site build

  // Define the base URL for your deployed site
  // This is crucial for correctly linking assets (CSS, JS)
  base: '/', // <--- ADD THIS: Your site is deployed to the root of the Render domain

  // Define the directory for client-side assets relative to the build output
  build: {
    assets: '_astro', // <--- ADD THIS: Default for Astro, but good to be explicit
  },

  integrations: [svelte()],

  vite: {
    plugins: [tailwindcss()]
  }
});