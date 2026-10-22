import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
        filmmaker: resolve(import.meta.dirname, 'filmmaker.html'),
        galeria: resolve(import.meta.dirname, 'galeria.html'),
        contato: resolve(import.meta.dirname, 'contato.html'),
      },
    },
  },
});
