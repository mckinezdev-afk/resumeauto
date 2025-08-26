import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


export default defineConfig({
    plugins: [vue()],
    server: {
        port: 5173,
        proxy: {
            // Proxy API calls during local dev to avoid CORS issues
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                secure: false
            }
        }
    }
})