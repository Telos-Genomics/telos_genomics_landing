// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

import netlify from '@astrojs/netlify';

import partytown from '@astrojs/partytown';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [svelte(), partytown({
    config: {
      // Reenvía llamadas de dataLayer y gtag al worker
      forward: ['dataLayer.push', 'gtag']
    },
  })],
  adapter: netlify(),
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      noExternal: ['@lucide/svelte']
    }
  },
});