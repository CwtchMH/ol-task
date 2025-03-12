import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { jest } from 'vite-plugin-jest' // Add this line
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), jest()], // Update this line
})
