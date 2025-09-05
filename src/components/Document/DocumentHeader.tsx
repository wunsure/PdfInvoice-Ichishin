import React from "react";
import type { Invoice, Quotation } from "../../types/document";


type Props = {
  data: Invoice | Quotation;
  primaryColor?: string;
  title: string
};

const DocumentHeader: React.FC<Props> = ({ data, title,primaryColor = "#00b050" }) => (
  <div className="mb-6">
    {/* ✅ 頂部彩色條使用 primaryColor */}
    <div className="w-full h-3 mb-4" style={{ backgroundColor: primaryColor }}></div>

    {/* 請求書標題 */}
    <h1
      className="text-3xl font-bold mb-2 text-center"
      style={{ color: primaryColor }}
    >
      {title}
    </h1>

    {/* 發票日期 */}
    <div className="text-sm text-gray-600 text-center">
      <p>{data.date}</p>
    </div>
  </div>
);

export default DocumentHeader;