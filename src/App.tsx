import React, { useEffect } from "react"; // 👈 1. 导入 useEffect
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; 
import Home from "./pages/home";
import InvoiceDetailPage from "./pages/InvoiceDetailPage";
import InvoiceFormPage from "./pages/InvoiceFormPage"; 
import IssuerManagementPage from "./pages/IssuerManagementPage";
import ClientManagementPage from "./pages/ClientManagementPage";
import { DataProvider, useData, themes } from './context/DataContext'; // 👈 2. 导入 useData 和 themes

// 👇 3. 创建一个新的内部组件来处理主题逻辑
const AppContent: React.FC = () => {
  const { theme } = useData();

  useEffect(() => {
    const root = window.document.documentElement;
    const themeColor = themes.find(t => t.name === theme)?.color;

    if (themeColor) {
      root.style.setProperty('--primary', themeColor);
      // Shadcn/UI 的主色调前景通常是白色，我们可以固定下来
      root.style.setProperty('--primary-foreground', '0 0% 98%');
    }
  }, [theme]); // 👈 这个 effect 会在 theme 变化时重新运行

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/invoice" element={<Navigate to="/invoice/new" replace />} />
      <Route path="/invoice/new" element={<InvoiceFormPage />} /> 
      <Route path="/invoice/edit/:id" element={<InvoiceFormPage />} /> 
      <Route path="/invoice/:id" element={<InvoiceDetailPage />} /> 
      <Route path="/issuers" element={<IssuerManagementPage />} />
      <Route path="/clients" element={<ClientManagementPage />} />
    </Routes>
  );
}

const App: React.FC = () => {
  return (
    <DataProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </DataProvider>
  );
};

export default App;