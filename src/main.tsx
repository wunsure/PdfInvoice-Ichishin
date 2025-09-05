import { Buffer } from 'buffer'; // 👈 1. 導入 Buffer
window.Buffer = Buffer;         // 👈 2. 將它附加到 window 對象上
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'; // <- 確認這行存在

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);