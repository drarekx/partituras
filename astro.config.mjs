import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'http://localhost:4321',
  server: {
    host: '0.0.0.0',
    port: 4321,
  },
});
