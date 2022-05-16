import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';

export default defineConfig({
  base: '/calculator/', 
  plugins: [eslintPlugin()],
});