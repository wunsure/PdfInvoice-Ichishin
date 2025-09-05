import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import type { Invoice, DocumentItem } from '../types/document';
import { v4 as uuidv4 } from 'uuid';

export const useInvoiceForm = (id?: string) => {
  const isEditMode = Boolean(id);
  const { issuers, clients, invoices, addInvoice, updateInvoice, deleteInvoice } = useData();
  const navigate = useNavigate();
  const [invoiceData, setInvoiceData] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isEditMode) {
      const existingInvoice = invoices.find((inv) => inv.id === id);
      if (existingInvoice) {
        setInvoiceData(existingInvoice);
      } else {
       
        navigate("/");
      }
    } else {
      // 确保 issuers 和 clients 加载后再创建新 invoice
      if (issuers.length > 0 && clients.length > 0) {
        setInvoiceData({
          id: uuidv4(),
          invoiceNumber: '',
          date: new Date().toISOString().split("T")[0],
          issuer: issuers[0],
          client: clients[0],
          items: [{ id: uuidv4(), description: "", quantity: 1, unitPrice: 0, tax: "税込" }],
          note: "お振込手数料は貴社にてご負担をお願いいたします。",
          invoiceTitle: "請求書",
        });
      }
    }
    setIsLoading(false);
  }, [id, isEditMode, invoices, navigate, issuers, clients]);

  const handleInvoiceDataChange = (field: keyof Invoice, value: string) => {
    setInvoiceData((prev) => (prev ? { ...prev, [field]: value } : null));
  };
  
  const handleDateChange = (date: Date | undefined) => {
    if (date && invoiceData) {
      const formattedDate = date.toISOString().split('T')[0];
      setInvoiceData({ ...invoiceData, date: formattedDate });
    }
  };

  const handleIssuerChange = (issuerId: string) => {
    const selectedIssuer = issuers.find((issuer) => issuer.id === issuerId);
    if (selectedIssuer) {
      setInvoiceData((prev) => (prev ? { ...prev, issuer: selectedIssuer } : null));
    }
  };

  const handleClientChange = (clientId: string) => {
    const selectedClient = clients.find((client) => client.id === clientId);
    if (selectedClient) {
      setInvoiceData((prev) => (prev ? { ...prev, client: selectedClient } : null));
    }
  };

  const handleItemChange = (itemId: string, field: keyof DocumentItem, value: string | number) => {
    setInvoiceData((prev) => {
      if (!prev) return null;
      const updatedItems = prev.items.map((item) => {
        if (item.id === itemId) {
          const processedValue = (field === "quantity" || field === "unitPrice") 
            ? (isNaN(Number(value)) ? 0 : Number(value)) 
            : value;
          return { ...item, [field]: processedValue };
        }
        return item;
      });
      return { ...prev, items: updatedItems };
    });
  };

  const addItem = () => {
    const newItem: DocumentItem = { id: uuidv4(), description: "", quantity: 1, unitPrice: 0, tax: "税込" };
    setInvoiceData((prev) => (prev ? { ...prev, items: [...prev.items, newItem] } : null));
  };

  const removeItem = (itemId: string) => {
    setInvoiceData((prev) => (prev ? { ...prev, items: prev.items.filter((item) => item.id !== itemId) } : null));
  };

  const handleSave = () => {
    if (!invoiceData) return;
    if (!invoiceData.invoiceNumber) {
      alert("請求書番号を入力してください。");
      return;
    }
    if (invoiceData.items.length === 0) {
      alert("請求項目を少なくとも1つ追加してください。");
      return;
    }

    if (isEditMode) {
      updateInvoice(invoiceData);
      alert("請求書が更新されました！");
    } else {
      addInvoice(invoiceData);
      alert("請求書が保存されました！");
    }
    navigate("/");
  };

   // 👇 2. 新增 handleDelete 函數
  const handleDelete = () => {
    // 確保在編輯模式下且有 invoiceData
    if (!isEditMode || !invoiceData) return;

    // 弹出二次确认对话框
    if (window.confirm("本当にこの請求書を削除しますか？この操作は取り消せません。")) {
      deleteInvoice(invoiceData.id);
      alert("請求書が削除されました。");
      navigate("/"); // 删除后返回首页
    }
  };

  return {
    isLoading,
    isEditMode,
    invoiceData,
    issuers, // 将 issuers 和 clients 透传出去给 UI 使用
    clients,
    handleInvoiceDataChange,
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