import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'; // <- 確認這行存在

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);