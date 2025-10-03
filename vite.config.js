import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      crypto: 'crypto-js', // Alias untuk mengarahkan crypto ke crypto-js
    },
  },
  optimizeDeps: {
    include: ['sweetalert2', 'js-crypto-hmac', 'crypto-js'],
  },
});
