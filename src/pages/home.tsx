import React from 'react';
import { Link } from 'react-router-dom';
import { useData, themes, ThemeName } from '../context/DataContext'; // 👈 导入所需的一切
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FilePenLine, PlusCircle, Check } from 'lucide-react'; // 👈 导入图标

// 主题切换器组件
const ThemeSwitcher: React.FC = () => {
  const { theme, changeTheme } = useData();

  return (
    <div className="flex items-center gap-2">
      {themes.map(t => (
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
}

const Home: React.FC = () => {
  // 👇 现在 invoices 会被下面的 Table 使用
  const { invoices } = useData();

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">請求書ダッシュボード</h1>
            <p className="text-muted-foreground">全ての請求書をここで管理します。</p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <div className="h-6 w-px bg-border" />
            <Link to="/issuers"><Button variant="outline">開票者管理</Button></Link>
            <Link to="/clients"><Button variant="outline">顧客管理</Button></Link>
            <Link to="/invoice/new"><Button><PlusCircle className="mr-2 h-4 w-4" /> 新規作成</Button></Link>
          </div>
        </header>

        {/* 👇 --- Card, Table, Badge, FilePenLine 都在这里被使用了 --- 👇 */}
        <Card>
          <CardHeader>
            <CardTitle>最近の請求書</CardTitle>
            <CardDescription>
              {invoices.length > 0 
                ? `現在 ${invoices.length} 件の請求書があります。`
                : '請求書はまだありません。'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">請求書番号</TableHead>
                  <TableHead>顧客名</TableHead>
                  <TableHead>発行日</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead className="text-right">金額</TableHead>
                  <TableHead className="w-[100px] text-center">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.length > 0 ? (
                  invoices.map((invoice) => {
                    const totalAmount = invoice.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

                    return (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                        <TableCell>{invoice.client.clientName}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>
                          <Badge variant="outline">下書き</Badge>
                        </TableCell>
                        <TableCell className="text-right">¥{totalAmount.toLocaleString()}</TableCell>
                        <TableCell className="text-center">
                          <Link to={`/invoice/edit/${invoice.id}`}>
                            <Button className="no-theme" variant="ghost" size="icon" >
                              <FilePenLine className="h-4 w-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      請求書はまだありません。「新規作成」から始めましょう！
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;