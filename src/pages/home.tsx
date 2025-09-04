import React from "react";
import { Link } from "react-router-dom";
import { useData, themes, ThemeName } from "../context/DataContext"; // 👈 导入所需的一切
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
//import { Badge } from "@/components/ui/badge";
import { FilePenLine, PlusCircle, Check } from "lucide-react"; // 👈 导入图标

// 主题切换器组件
const ThemeSwitcher: React.FC = () => {
  const { theme, changeTheme } = useData();

  return (
    <div className="flex items-center justify-center gap-2">
      {themes.map((t) => (
        <button
          key={t.name}
          onClick={() => changeTheme(t.name as ThemeName)}
          className="w-6 h-6 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
          style={{ backgroundColor: `hsl(${t.color})` }}
        >
          {theme === t.name && <Check className="w-4 h-4 text-white m-auto" />}
        </button>
      ))}
    </div>
  );
};

const Home: React.FC = () => {
  // 👇 现在 invoices 会被下面的 Table 使用
  const { invoices } = useData();

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className=" text-2xl sm:text-3xl font-bold tracking-tight text-primary">
              請求書ダッシュボード
            </h1>
            <p className="text-muted-foreground">
              全ての請求書をここで管理します。
            </p>
          </div>
          <div className="w-full md:w-auto flex flex-col items-stretch md:items-end gap-2">
            {/* 1. 主题切换器现在默认宽度为100%，在大屏幕上自适应宽度 */}
            <div className="p-2 border rounded-lg bg-background w-full md:w-auto">
              <ThemeSwitcher />
            </div>
            {/* 1. 用一个新的 div 包裹两个管理按钮 */}
            <div className="grid grid-cols-2 gap-2 w-full md:w-auto">
              <Link to="/issuers" className="col-span-1">
                <Button variant="outline" className="w-full">
                  開票者管理
                </Button>
              </Link>
              <Link to="/clients" className="col-span-1">
                <Button variant="outline" className="w-full">
                  顧客管理
                </Button>
              </Link>
              {/* 2. Make the "新規作成" button span both columns */}
              <Link to="/invoice/new" className="col-span-2">
                <Button className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" /> 新規作成
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* 👇 --- Card, Table, Badge, FilePenLine 都在这里被使用了 --- 👇 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center md:text-left">
              最近の請求書
            </CardTitle>
            <CardDescription className="text-center md:text-left">
              {invoices.length > 0
                ? `現在 ${invoices.length} 件の請求書があります。`
                : "請求書はまだありません。"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table className="hidden md:table">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">請求書番号</TableHead>
                  <TableHead>顧客名</TableHead>
                  <TableHead>発行日</TableHead>
                  <TableHead className="text-right">金額</TableHead>
                  <TableHead className="w-[100px] text-center">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => {
                  const totalAmount = invoice.items.reduce(
                    (sum, item) => sum + item.quantity * item.unitPrice,
                    0
                  );
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        {invoice.invoiceNumber}
                      </TableCell>
                      <TableCell>{invoice.client.clientName}</TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell className="text-right">
                        ¥{totalAmount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <Link to={`/invoice/edit/${invoice.id}`}>
                          <Button variant="ghost" size="icon">
                            <FilePenLine className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* 移动端：使用卡片列表 */}
            <div className="md:hidden space-y-4">
              {invoices.map((invoice) => {
                const totalAmount = invoice.items.reduce(
                  (sum, item) => sum + item.quantity * item.unitPrice,
                  0
                );
                return (
                  <Link
                    key={invoice.id}
                    to={`/invoice/edit/${invoice.id}`}
                    className="border rounded-lg p-4 flex flex-col gap-4 active:bg-gray-100"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {invoice.client.clientName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {invoice.invoiceNumber}
                        </p>
                      </div>
                      {/* 图标已被移除 */}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">発行日</p>
                        <p className="text-gray-900">{invoice.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground">金額</p>
                        <p className="font-semibold text-gray-900">
                          ¥{totalAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {invoices.length === 0 && (
              <div className="text-center h-24 flex items-center justify-center">
                請求書はまだありません。「新規作成」から始めましょう！
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
