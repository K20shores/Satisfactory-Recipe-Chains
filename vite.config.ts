import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { version } from './package.json';

export default defineConfig({
  plugins: [vue()],
  base: process.env.VITE_BASE_URL,
  define: {
    'import.meta.env.PACKAGE_VERSION': JSON.stringify(version),
  },
})