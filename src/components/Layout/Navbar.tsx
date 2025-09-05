import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useData, themes, ThemeName } from "../../context/DataContext";
import { Button } from "@/components/ui/button";
import { Check, Settings, User, FileText, Menu, X } from "lucide-react"; // 引入一些圖標

const ThemeSwitcher: React.FC<{ layout?: 'horizontal' | 'vertical' }> = ({ layout = 'horizontal' }) => {
  const { theme, changeTheme } = useData();

  const containerClasses = layout === 'vertical' 
    ? 'flex flex-col items-start gap-1 w-full' // 垂直佈局，減小 gap
    : 'flex items-center gap-2';

  return (
    <div className={containerClasses}>
      {themes.map((t) => {
        // 如果是垂直佈局，渲染一個完整的按鈕行
        if (layout === 'vertical') {
          return (
            <button
              key={t.name}
              onClick={() => changeTheme(t.name as ThemeName)}
              className="w-full flex items-center gap-3 p-2 rounded-md text-sm hover:bg-accent"
            >
              <div
                className="w-5 h-5 rounded-full"
                style={{ backgroundColor: `hsl(${t.color})` }}
              />
              <span className="capitalize">{t.name}</span>
              {theme === t.name && <Check className="w-4 h-4 text-primary ml-auto" />}
            </button>
          );
        }

        // 否則（水平佈局），渲染原來的小圓點
        return (
          <button
            key={t.name}
            onClick={() => changeTheme(t.name as ThemeName)}
            className="w-6 h-6 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-transform hover:scale-110"
            style={{ backgroundColor: `hsl(${t.color})` }}
            aria-label={`Switch to ${t.name} theme`}
          >
            {theme === t.name && <Check className="w-4 h-4 text-white m-auto" />}
          </button>
        );
      })}
    </div>
  );
};
// 👆 --- 修改結束 --- 👆

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-background shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 左側：Logo 或應用名稱 */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-primary">
              PdfInvoice
            </Link>
          </div>

          {/* 右側：功能按鈕和設置 */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/issuers">
              <Button variant="ghost" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                発行者管理
              </Button>
            </Link>
            <Link to="/clients">
              <Button variant="ghost" size="sm">
                <User className="mr-2 h-4 w-4" />
                顧客管理
              </Button>
            </Link>{" "}
            {/* 👈 修正點 2: 移除了錯誤的 "-" 符號 */}
            <div className="flex items-center gap-2 border-l pl-4">
              <Settings className="h-5 w-5 text-muted-foreground" />
              <ThemeSwitcher />
            </div>
          </div>

          {/* 👇 5. 移動端漢堡按鈕：僅在小於 md 的屏幕上顯示 */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-primary focus:outline-none" // 移除了 hover:bg-accent
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 👇 6. 移動端下拉菜單 */}
      {isMenuOpen && (
        <div className="md:hidden absolute w-full bg-background shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/issuers"
              onClick={() => setIsMenuOpen(false)} // 點擊鏈接後關閉菜單
              className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-accent"
            >
              <FileText className="mr-3 h-5 w-5" /> 開票者管理
            </Link>
            <Link
              to="/clients"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-accent"
            >
              <User className="mr-3 h-5 w-5" /> 顧客管理
            </Link>
            <div className="pt-2">
    <div className="border-t pt-3">
        <div className="flex items-center px-3 mb-3">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <span className="ml-3 text-base font-medium">テーマカラー</span>
        </div>
        <div className="pl-8"> {/* 稍微縮進，讓佈局更好看 */}
            <ThemeSwitcher layout="vertical" /> {/* 👈 關鍵點：傳入 vertical 屬性 */}
        </div>
    </div>
</div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
