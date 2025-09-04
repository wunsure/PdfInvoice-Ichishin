/**
 * @file InvoiceFormPage.tsx
 * @description 这个页面组件作为“容器”或“视图层”。
 * 它的主要职责是：
 * 1. 渲染表单和发票预览的 UI 结构。
 * 2. 从 `useInvoiceForm` Hook 获取所有业务逻辑和状态。
 * 3. 将从 Hook 中获取的状态和事件处理函数绑定到对应的 UI 组件上。
 * 4. 管理纯粹与视图相关的状态，例如预览区域的缩放比例。
 * 通过这种方式，我们将复杂的业务逻辑与视图渲染清晰地分离开来。
 */
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from "react-router-dom";
import { useInvoiceForm } from '../hooks/useInvoiceForm';
import { downloadPdf } from '../lib/pdfGenerator';
import Invoice from '../components/Invoice/Invoice';
import type { IssuerInfo, ClientInfo, InvoiceItem } from '../types/invoice';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from '@/components/ui/date-picker';
import { ArrowLeft, Download, Trash } from "lucide-react";

const InvoiceFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    isLoading,
    isEditMode,
    invoiceData,
    issuers,
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
  } = useInvoiceForm(id);

  // --- 视图相关的状态和逻辑 ---
  const [scale, setScale] = useState(0.55);
  const previewComponentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkSize = () => {
      setScale(window.matchMedia('(max-width: 1023px)').matches ? 0.35 : 0.55);
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const handleDownload = () => {
    if (previewComponentRef.current && invoiceData?.invoiceNumber) {
      downloadPdf(previewComponentRef.current, `請求書-${invoiceData.invoiceNumber}`);
    } else {
      alert("PDFを生成するための情報が不足しています。");
    }
  };
  
  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.3));
  // --- 视图逻辑结束 ---

  if (isLoading || !invoiceData) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-gray-100">
      {/* 左侧表单区域 (JSX 结构基本不变) */}
      <div className="w-full lg:w-1/2 p-4 lg:p-8 overflow-y-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-primary">
            {isEditMode ? "請求書編集" : "新規請求書作成"}
          </h1>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">請求書番号</Label>
              <Input
                id="invoiceNumber"
                value={invoiceData.invoiceNumber}
                onChange={(e) => handleInvoiceDataChange("invoiceNumber", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>発行日</Label>
              <DatePicker 
                date={new Date(invoiceData.date)}
                setDate={handleDateChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>開票者 (Issuer)</Label>
            <Select value={invoiceData.issuer.id} onValueChange={handleIssuerChange}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {issuers.map((issuer: IssuerInfo) => (
                  <SelectItem key={issuer.id} value={issuer.id}>{issuer.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>顧客 (Client)</Label>
            <Select value={invoiceData.client.id} onValueChange={handleClientChange}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {clients.map((client: ClientInfo) => (
                  <SelectItem key={client.id} value={client.id}>{client.clientName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">請求項目</h2>
            <div className="space-y-4">
              {invoiceData.items.map((item: InvoiceItem) => (
                <div key={item.id} className="p-4 border rounded-lg bg-white space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor={`item-desc-${item.id}`}>品番・品名</Label>
                    <Input
                      id={`item-desc-${item.id}`}
                      placeholder="例：Webサイト制作"
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor={`item-price-${item.id}`}>単価</Label>
                      <Input
                        id={`item-price-${item.id}`}
                        type="number"
                        placeholder="10000"
                        value={item.unitPrice || ""}
                        onChange={(e) => handleItemChange(item.id, "unitPrice", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`item-qty-${item.id}`}>数量</Label>
                      <Input
                        id={`item-qty-${item.id}`}
                        type="number"
                        placeholder="1"
                        value={item.quantity || ""}
                        onChange={(e) => handleItemChange(item.id, "quantity", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`item-tax-${item.id}`}>税区分</Label>
                      <Select
                        value={item.tax}
                        onValueChange={(value) => handleItemChange(item.id, "tax", value || "税込")}
                      >
                        <SelectTrigger id={`item-tax-${item.id}`}><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="税込">税込</SelectItem>
                          <SelectItem value="税抜">税抜</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (window.confirm('本当にこの項目を削除しますか？')) {
                        removeItem(item.id)
                      }
                    }}
                    className="w-full mt-2"
                  >
                    <Trash className="mr-2 h-4 w-4" /> 削除
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" onClick={addItem} className="mt-4 w-full">
              + 行を追加
            </Button>
          </div>
          <div className="pt-6">
            <Button onClick={handleSave} className="w-full">保存</Button>
            {/* 👇 2. 新增刪除按鈕，僅在編輯模式下顯示 */}
            {isEditMode && (
              <Button 
                onClick={handleDelete} 
                variant="destructive" 
                className="w-full mt-4"
              >
                この請求書を削除
              </Button>
            )}
          </div>
        </div>
      </div>
      

      {/* 右侧预览区域 (JSX 结构基本不变) */}
      <div className="w-full lg:w-1/2 relative flex flex-col h-screen">
        <div className="absolute top-4 right-8 z-10 flex space-x-2 bg-white p-2 rounded-lg shadow-md">
          <button onClick={handleZoomOut} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-lg font-bold">-</button>
          <span className="px-3 py-1 text-sm flex items-center">{Math.round(scale * 100)}%</span>
          <button onClick={handleZoomIn} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-lg font-bold">+</button>
          <button onClick={handleDownload} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 flex items-center">
            <Download className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-grow overflow-auto p-4 lg:p-8 flex justify-center items-center">
          <div ref={previewComponentRef} style={{ transform: `scale(${scale})`, transformOrigin: "center center", transition: "transform 0.2s" }}>
            <Invoice data={invoiceData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceFormPage;