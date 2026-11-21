import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const extraAllowedHosts = (process.env.VITE_ADDITIONAL_ALLOWED_HOSTS || '')
  .split(',')
  .map((host) => host.trim())
  .filter(Boolean)

const allowedHosts = extraAllowedHosts.length ? extraAllowedHosts : undefined

// Makes dist/index.html openable by double-click (file://).
// Browsers block <script type="module"> over file://, so the build is emitted
// as a single classic IIFE script and the module/crossorigin attributes are removed.
const fileProtocolFriendly = () => ({
  name: 'file-protocol-friendly',
  apply: 'build',
  enforce: 'post',
  transformIndexHtml(html) {
    return html
      .replace(/<script type="module" crossorigin/g, '<script defer')
      .replace(/<script type="module"/g, '<script defer')
      .replace(/<link rel="stylesheet" crossorigin/g, '<link rel="stylesheet"')
  },
})

export default defineConfig({
  base: './',
  plugins: [react(), fileProtocolFriendly()],
  build: {
    rollupOptions: {
      output: {
        format: 'iife',
        inlineDynamicImports: true,
      },
    },
  },
  server: { host: '0.0.0.0', port: 3001, strictPort: true, allowedHosts },
  preview: { host: '0.0.0.0', port: 3001, strictPort: true, allowedHosts },
})
