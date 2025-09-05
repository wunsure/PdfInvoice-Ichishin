import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      <main>
        {/* Outlet 是 react-router 的一個組件，
            它會渲染當前匹配到的子路由頁面 (例如 Home, InvoiceFormPage 等) */}
        <Outlet /> 
      </main>
    </div>
  );
};

export default MainLayout;