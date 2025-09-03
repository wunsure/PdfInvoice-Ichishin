import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import { useNavigate, useParams, Link } from "react-router-dom";
import Invoice from '../components/Invoice/Invoice';
import type { Invoice as InvoiceType, InvoiceItem, IssuerInfo, ClientInfo } from '../types/invoice';
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Download } from "lucide-react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Trash } from 'lucide-react';

const InvoiceFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const { issuers, clients, invoices, addInvoice, updateInvoice } = useData();
  const navigate = useNavigate();
  const [invoiceData, setInvoiceData] = useState<InvoiceType | null>(null);
  const [scale, setScale] = useState(0.55);
  const previewComponentRef = useRef<HTMLDivElement>(null);

  
  
  
  const handleDownloadPdf = () => {
  const input = previewComponentRef.current;
  if (!input) return;

  // ✅ [新增] 導出模式：加上 class
  input.classList.add("export-mode");

  const originalTransform = input.style.transform;
  input.style.transform = "scale(1)";
  const originalTransformOrigin = input.style.transformOrigin;
  input.style.transformOrigin = "top left";

  const parentContainer = input.parentElement;
  let originalParentStyles: { [key: string]: string } = {};
  if (parentContainer) {
    originalParentStyles = {
      overflow: parentContainer.style.overflow,
      flexGrow: parentContainer.style.flexGrow,
      height: parentContainer.style.height,
      padding: parentContainer.style.padding,
    };
    parentContainer.style.overflow = "visible";
    parentContainer.style.flexGrow = "0";
    parentContainer.style.height = "auto";
    parentContainer.style.padding = "0";
  }

  input.offsetWidth;

  html2canvas(input, {
    scale: 4,
    useCORS: true,
    // ❌ 原來這裡有 y: -6 偏移，現在去掉了
  })
    .then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const a4Width_mm = 210;
      const a4Height_mm = 297;
      const imgWidth_px = canvas.width;
      const imgHeight_px = canvas.height;
      const imgRatio = imgWidth_px / imgHeight_px;

      let pdfImgWidth = a4Width_mm;
      let pdfImgHeight = a4Width_mm / imgRatio;
      if (pdfImgHeight > a4Height_mm) {
        pdfImgHeight = a4Height_mm;
        pdfImgWidth = a4Height_mm * imgRatio;
      }

      const pdf = new jsPDF("portrait", "mm", "a4");

      const xOffset = (a4Width_mm - pdfImgWidth) / 2;

      pdf.addImage(imgData, "PNG", xOffset, 0, pdfImgWidth, pdfImgHeight);

      pdf.save(`請求書-${invoiceData?.invoiceNumber || "invoice"}.pdf`);
    })
    .catch((err) => {
      console.error("PDF生成失败:", err);
      alert("PDF生成中にエラーが発生しました。");
    })
    .finally(() => {
      if (input) {
        input.style.transform = originalTransform;
        input.style.transformOrigin = originalTransformOrigin;

        // ✅ [新增] 導出完畢後移除 class
        input.classList.remove("export-mode");
      }
      if (parentContainer) {
        for (const key in originalParentStyles) {
          parentContainer.style[key as any] = originalParentStyles[key];
        }
      }
    });
};


  useEffect(() => {
    if (isEditMode) {
      const existingInvoice = invoices.find((inv: InvoiceType) => inv.id === id);
      if (existingInvoice) {
        setInvoiceData(existingInvoice);
      } else {
        alert("指定された請求書が見つかりません。");
        navigate("/");
      }
    } else {
      const blankInvoice: InvoiceType = {
        id: uuidv4(),
        invoiceNumber: ``,
        date: new Date().toISOString().split("T")[0],
        issuer: issuers[0],
        client: clients[0],
        items: [{ id: uuidv4(), description: "", quantity: 1, unitPrice: 0, tax: "税込" }],
        note: "お振込手数料は貴社にてご負担をお願いいたします。",
        invoiceTitle: "請求書",
      };
      setInvoiceData(blankInvoice);
    }
  }, [id, isEditMode, invoices, navigate, issuers, clients]);
  
  const handleInvoiceDataChange = (field: keyof InvoiceType, value: string) => {
    setInvoiceData((prev: InvoiceType | null) => (prev ? { ...prev, [field]: value } : null));
  };
  const handleIssuerChange = (issuerId: string) => {
    const selectedIssuer = issuers.find((issuer) => issuer.id === issuerId);
    if (selectedIssuer) {
      setInvoiceData((prev: InvoiceType | null) => (prev ? { ...prev, issuer: selectedIssuer } : null));
    }
  };
  const handleClientChange = (clientId: string) => {
    const selectedClient = clients.find((client) => client.id === clientId);
    if (selectedClient) {
      setInvoiceData((prev: InvoiceType | null) => (prev ? { ...prev, client: selectedClient } : null));
    }
  };
  const handleItemChange = (itemId: string, field: keyof InvoiceItem, value: string | number) => {
    setInvoiceData((prev: InvoiceType | null) => {
      if (!prev) return null;
      const updatedItems = prev.items.map((item: InvoiceItem) => {
        if (item.id === itemId) {
          let processedValue = value;
          if (field === "quantity" || field === "unitPrice") {
            const num = Number(value);
            processedValue = isNaN(num) ? 0 : num;
          }
          return { ...item, [field]: processedValue };
        }
        return item;
      });
      return { ...prev, items: updatedItems };
    });
  };
  const addItem = () => {
    const newItem: InvoiceItem = { id: uuidv4(), description: "", quantity: 1, unitPrice: 0, tax: "税込" };
    setInvoiceData((prev: InvoiceType | null) => (prev ? { ...prev, items: [...prev.items, newItem] } : null));
  };
  const removeItem = (itemId: string) => {
    setInvoiceData((prev: InvoiceType | null) => (prev ? { ...prev, items: prev.items.filter((item) => item.id !== itemId) } : null));
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
  const handleZoomIn = () => setScale((prev: number) => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setScale((prev: number) => Math.max(prev - 0.1, 0.3));

  if (!invoiceData) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="flex w-full h-screen bg-gray-100">
      <div className="w-1/2 p-8 overflow-y-auto">
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">請求書番号</Label>
              <Input
                id="invoiceNumber"
                value={invoiceData.invoiceNumber}
                onChange={(e) => handleInvoiceDataChange("invoiceNumber", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">発行日</Label>
              <Input
                type="date"
                id="date"
                value={invoiceData.date}
                onChange={(e) => handleInvoiceDataChange("date", e.target.value)}
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
            <div className="space-y-3">
              {invoiceData.items.map((item: InvoiceItem) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                  <Input
                    placeholder="品番・品名"
                    className="col-span-5"
                    value={item.description}
                    onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="単価"
                    className="col-span-2"
                    value={item.unitPrice || ""}
                    onChange={(e) => handleItemChange(item.id, "unitPrice", e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="数量"
                    className="col-span-2"
                    value={item.quantity || ""}
                    onChange={(e) => handleItemChange(item.id, "quantity", e.target.value)}
                  />
                  <div className="col-span-2">
                    <Select
                      value={item.tax}
                      onValueChange={(value) => handleItemChange(item.id, "tax", value || "税込")}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="税込">税込</SelectItem>
                        <SelectItem value="税抜">税抜</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    className="col-span-1 text-destructive hover:text-destructive"
                  >
                    <Trash className="h-4 w-4" />
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
          </div>
        </div>
      </div>
      <div className="w-1/2 relative flex flex-col">
        <div className="absolute top-4 right-8 z-10 flex space-x-2 bg-white p-2 rounded-lg shadow-md">
          <button onClick={handleZoomOut} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-lg font-bold">-</button>
          <span className="px-3 py-1 text-sm flex items-center">{Math.round(scale * 100)}%</span>
          <button onClick={handleZoomIn} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-lg font-bold">+</button>
          <button onClick={handleDownloadPdf} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 flex items-center">
            <Download className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-grow overflow-auto p-8 flex justify-center">
          <div ref={previewComponentRef} style={{ transform: `scale(${scale})`, transformOrigin: "top center", transition: "transform 0.2s" }}>
            <Invoice data={invoiceData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceFormPage;