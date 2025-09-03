import React from "react";
import type { Invoice } from "../../types/invoice";

type Props = {
  data: Invoice;
  primaryColor?: string;
};

const InvoiceCompanyInfo: React.FC<Props> = ({ data, primaryColor = "#00b050" }) => {
  const { client, issuer } = data;

  return (
    <div className="flex justify-between mb-12 text-sm items-start">
      {/* 左側：請求對象 */}
      <div className="w-1/2 flex flex-col space-y-2"> {/* 👈 1. 增加了 space-y-2 来提供间距 */}
        {/* 公司名 */}
        <div className="flex items-center client-name">
          <span
            className="inline-block"
            style={{
              borderBottom: `2px solid ${primaryColor}`,
              minWidth: "220px",
              textAlign: "center",
              padding: "4px 8px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            {client?.clientName || "　　　　"}
          </span>
          <span className="ml-2">様/御中</span>
        </div>

        {/* 邮编 */}
        <div className="flex items-center">
          <span className="font-bold">〒</span>
          <span className="ml-2 p-1">{client?.postalCode || "000-0000"}</span>
        </div>
        
        {/* 👇 2. 新增的地址显示行 👇 */}
        <div className="flex items-start">
          <span className="font-bold">住所:</span>
          <p className="ml-2">{client?.address || "（住所未入力）"}</p>
        </div>
        {/* 👆 添加结束 👆 */}
      </div>

      {/* 右側：公司資訊 (保持不变) */}
      <div className="text-sm text-gray-700 text-right space-y-1 w-64">
        <p>〒{issuer.postalCode}</p>
        <p className="break-words">{issuer.address}</p>
        <p className="font-bold text-base">{issuer.name}</p>
        <p className="whitespace-nowrap text-xs">
          Tel: {issuer.phone} / Fax: {issuer.fax}
        </p>
      </div>
    </div>
  );
};

export default InvoiceCompanyInfo;