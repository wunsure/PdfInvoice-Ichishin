import React from "react";
import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // 👈 1. 導入 Tabs 組件
import { PlusCircle, FilePenLine, FilePlus, FilePlus2 } from "lucide-react";
import type { Invoice, Quotation } from "../types/document"; // 👈 導入 Quotation 類型

// 👇 2. 創建一個可複用的組件來渲染列表，避免代碼重複
// 它可以接收 Invoice 或 Quotation 數組
const DocumentList: React.FC<{ documents: (Invoice | Quotation)[], type: 'invoice' | 'quotation' }> = ({ documents, type }) => {
  if (documents.length === 0) {
    const message = type === 'invoice' ? "請求書はまだありません。" : "見積書はまだありません。";
    return (
      <div className="text-center h-24 flex items-center justify-center text-muted-foreground">
        {message} 「新規作成」から始めましょう！
      </div>
    );
  }

  // 計算總金額的函數
  const calculateTotal = (items: { quantity: number; unitPrice: number; }[]) => {
    // 這裡我們需要處理稅額，使其與 InvoiceTotal 組件的計算邏輯一致
    let subtotalBeforeTax = 0;
    let totalTax = 0;
    items.forEach(item => {
      const itemTotal = item.unitPrice * item.quantity;
      // @ts-ignore - 'tax' might not exist on all items if types are loose, but our DocumentItem requires it
      if (item.tax === '税抜') {
        subtotalBeforeTax += itemTotal;
        totalTax += itemTotal * 0.1;
      } else { 
        const itemSubtotal = itemTotal * 100 / 110;
        subtotalBeforeTax += itemSubtotal;
        totalTax += itemTotal - itemSubtotal;
      }
    });
    return Math.round(subtotalBeforeTax + totalTax);
  };

  return (
    <>
      {/* 桌面端表格 */}
      <Table className="hidden md:table">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">{type === 'invoice' ? '請求書番号' : '見積書番号'}</TableHead>
            <TableHead>顧客名</TableHead>
            <TableHead>発行日</TableHead>
            <TableHead className="text-right">合計金額 (税込)</TableHead>
            <TableHead className="w-[100px] text-center">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell className="font-medium">
                {'invoiceNumber' in doc ? doc.invoiceNumber : doc.quotationNumber}
              </TableCell>
              <TableCell>{doc.client.clientName}</TableCell>
              <TableCell>{doc.date}</TableCell>
              <TableCell className="text-right">
                ¥{calculateTotal(doc.items).toLocaleString()}
              </TableCell>
              <TableCell className="text-center">
                <Link to={`/${type}/edit/${doc.id}`}>
                  <Button variant="ghost" size="icon">
                    <FilePenLine className="h-4 w-4" />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* 移動端卡片列表 */}
      <div className="md:hidden space-y-4">
        {documents.map((doc) => (
          <Link
            key={doc.id}
            to={`/${type}/edit/${doc.id}`}
            className="border rounded-lg p-4 flex flex-col gap-4 active:bg-gray-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-900">{doc.client.clientName}</p>
                <p className="text-sm text-muted-foreground">
                  {'invoiceNumber' in doc ? doc.invoiceNumber : doc.quotationNumber}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">発行日</p>
                <p className="text-gray-900">{doc.date}</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground">合計金額 (税込)</p>
                <p className="font-semibold text-gray-900">
                  ¥{calculateTotal(doc.items).toLocaleString()}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};


const Home: React.FC = () => {
  // 👇 3. 從 useData 中同時獲取 invoices 和 quotations
  const { invoices, quotations } = useData();

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
              ダッシュボード
            </h1>
            <p className="text-muted-foreground">
              全てのドキュメントをここで管理します。
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button><PlusCircle className="mr-2 h-4 w-4" /> 新規作成</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild><Link to="/invoice/new" className="w-full"><FilePlus className="mr-2 h-4 w-4" />請求書を作成</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/quotation/new" className="w-full"><FilePlus2 className="mr-2 h-4 w-4" />見積書を作成</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* 👇 4. 使用 Tabs 組件來包裹列表 */}
        <Card>
          <CardHeader>
            <CardTitle>ドキュメント一覧</CardTitle>
            <CardDescription>
              請求書 ({invoices.length}件)・見積書 ({quotations.length}件)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="invoices" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="invoices">請求書</TabsTrigger>
                <TabsTrigger value="quotations">見積書</TabsTrigger>
              </TabsList>
              <TabsContent value="invoices" className="mt-4">
                <DocumentList documents={invoices} type="invoice" />
              </TabsContent>
              <TabsContent value="quotations" className="mt-4">
                <DocumentList documents={quotations} type="quotation" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;