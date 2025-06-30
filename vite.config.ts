import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'; // 1. 引入 React 插件
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 載入環境變數 (與你原來的程式碼相同)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // 2. 加入 React 插件
    plugins: [react()],
    
    // 3. 設定基礎路徑為相對路徑，解決部署後的空白頁問題
    base: './', 

    // 4. 定義環境變數 (可選，但保持與你現有程式碼兼容)
    // 這樣你在程式碼中就可以繼續使用 process.env.GEMINI_API_KEY
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },

    // 你的別名設定 (保持不變)
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'), // 建議指向 src 而不是根目錄
      }
    }
  };
});