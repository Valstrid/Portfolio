// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://valstrid.github.io',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
});
