import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path" // 1. 导入 Node.js 的 path 模块


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // 👇 2. 在 define 中添加 'global'
    'global': 'globalThis',
    'process.env': {},
    'process': {
      'title': 'browser'
    }
  },
  // 2. 添加 resolve.alias 配置
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})