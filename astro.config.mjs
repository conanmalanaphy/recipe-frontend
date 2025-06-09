// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [
    svelte(),
  ],
  vite: {
    plugins: [tailwindcss()]
  },
  adapter: node({
    mode: 'standalone'
  }),
  // *** ADD THIS SERVER CONFIGURATION BLOCK ***
  server: {
    host: '0.0.0.0', // IMPORTANT: Binds the server to all network interfaces
    port: Number(process.env.PORT) || 4321 // IMPORTANT: Uses Render's injected PORT env var, or fallbacks to 4321 for local dev
  }
  // *** END ADDED BLOCK ***
});