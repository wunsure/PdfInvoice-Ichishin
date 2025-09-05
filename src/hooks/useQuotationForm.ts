// src/hooks/useQuotationForm.ts

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import type { Quotation, DocumentItem } from '../types/document'; 
import { v4 as uuidv4 } from 'uuid';

export const useQuotationForm = (id?: string) => {
  const isEditMode = Boolean(id);
  // 👇 1. 從 useData 中解構出所有 quotation 相關的函數
  const { 
    issuers, 
    clients, 
    quotations, // 用於編輯模式
    addQuotation, 
    updateQuotation, 
    deleteQuotation 
  } = useData();
  const navigate = useNavigate();
  const [quotationData, setQuotationData] = useState<Quotation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isEditMode) {
      // 👇 2. 完善編輯模式的邏輯
      const existingQuotation = quotations.find((q) => q.id === id);
      if (existingQuotation) {
        setQuotationData(existingQuotation);
      } else {
        // 如果找不到，靜默跳轉回首頁
        navigate("/");
      }
    } else {
      // 新建模式 (保持不變)
      if (issuers.length > 0 && clients.length > 0) {
        setQuotationData({
          id: uuidv4(),
          quotationNumber: '',
          quotationTitle: "見積書",
          date: new Date().toISOString().split("T")[0],
          issuer: issuers[0],
          client: clients[0],
          items: [{ id: uuidv4(), description: "", quantity: 1, unitPrice: 0, tax: "税抜" }],
          note: "有効期限：発行日より30日間",
        });
      }
    }
    setIsLoading(false);
  }, [id, isEditMode, navigate, issuers, clients, quotations]); // 👈 依賴項中加入 quotations

  // --- 所有 handle...Change, addItem, removeItem 函數保持不變 ---
  const handleQuotationDataChange = (field: keyof Quotation, value: string) => {
    setQuotationData((prev) => (prev ? { ...prev, [field]: value } : null));
  };
  const handleDateChange = (date: Date | undefined) => {
    if (date && quotationData) {
      const formattedDate = date.toISOString().split('T')[0];
      setQuotationData({ ...quotationData, date: formattedDate });
    }
  };
  const handleIssuerChange = (issuerId: string) => {
    const selectedIssuer = issuers.find((issuer) => issuer.id === issuerId);
    if (selectedIssuer) { setQuotationData((prev) => (prev ? { ...prev, issuer: selectedIssuer } : null)); }
  };
  const handleClientChange = (clientId: string) => {
    const selectedClient = clients.find((client) => client.id === clientId);
    if (selectedClient) { setQuotationData((prev) => (prev ? { ...prev, client: selectedClient } : null)); }
  };
  const handleItemChange = (itemId: string, field: keyof DocumentItem, value: string | number) => {
    setQuotationData((prev) => {
      if (!prev) return null;
      const updatedItems = prev.items.map((item) => {
        if (item.id === itemId) {
          const processedValue = (field === "quantity" || field === "unitPrice") ? (isNaN(Number(value)) ? 0 : Number(value)) : value;
          return { ...item, [field]: processedValue };
        }
        return item;
      });
      return { ...prev, items: updatedItems };
    });
  };
  const addItem = () => {
    const newItem: DocumentItem = { id: uuidv4(), description: "", quantity: 1, unitPrice: 0, tax: "税抜" };
    setQuotationData((prev) => (prev ? { ...prev, items: [...prev.items, newItem] } : null));
  };
  const removeItem = (itemId: string) => {
    setQuotationData((prev) => (prev ? { ...prev, items: prev.items.filter((item) => item.id !== itemId) } : null));
  };
  // --- 處理函數結束 ---

  // 👇 3. 解除 handleSave 和 handleDelete 的註釋，並實現真實邏輯
  const handleSave = () => {
    if (!quotationData) return;
    if (!quotationData.quotationNumber) {
      alert("見積書番号を入力してください。");
      return;
    }
    if (quotationData.items.length === 0) {
      alert("項目を少なくとも1つ追加してください。");
      return;
    }

    if (isEditMode) {
      updateQuotation(quotationData);
      alert("見積書が更新されました！");
    } else {
      addQuotation(quotationData);
      alert("見積書が保存されました！");
    }
    navigate("/");
  };
  
  const handleDelete = () => {
    if (!isEditMode || !quotationData) return;

    if (window.confirm("本当にこの見積書を削除しますか？この操作は取り消せません。")) {
      deleteQuotation(quotationData.id);
      alert("見積書が削除されました。");
      navigate("/");
    }
  };

  // return 語句保持不變，確保所有 handle 函數都被導出
  return {
    isLoading,
    isEditMode,
    quotationData,
    issuers,
    clients,
    handleQuotationDataChange,
    handleDateChange,
    handleIssuerChange,
    handleClientChange,
    handleItemChange,
    addItem,
    removeItem,
    handleSave,
    handleDelete,
  };
};