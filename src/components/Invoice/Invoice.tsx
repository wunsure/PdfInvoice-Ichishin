import React from "react";
// 👇 修改这里：导入 Invoice 类型时，给它一个别名 InvoiceType，避免和组件名冲突
import type { Invoice as InvoiceType } from "../../types/invoice"; 
import InvoiceHeader from "./InvoiceHeader";
import InvoiceCompanyInfo from "./InvoiceCompanyInfo";
import InvoiceAmountInfo from "./InvoiceAmountInfo";
import InvoiceBody from "./InvoiceBody";
import InvoiceTotal from "./InvoiceTotal";
import InvoiceFooter from "./InvoiceFooter";
import { DEFAULT_PRIMARY_COLOR } from "../../config";

type Props = {
  // 👇 修改这里：使用我们起的别名 InvoiceType
  data: InvoiceType; 
  primaryColor?: string;
};

// 组件名保持为 Invoice 不变
const Invoice: React.FC<Props> = ({
  data,
  primaryColor = DEFAULT_PRIMARY_COLOR,
}) => {
  return (
    <div
      className="bg-white mx-auto my-8 p-16 border shadow-lg relative"
      style={{ width: "210mm", height: "297mm", borderColor: primaryColor }}
    >
      {/* 子组件会接收到完整的 data 对象 */}
      <InvoiceHeader data={data} primaryColor={primaryColor} />
      <InvoiceCompanyInfo data={data} primaryColor={primaryColor} />
      <InvoiceAmountInfo data={data} primaryColor={primaryColor} />
      <InvoiceBody data={data} primaryColor={primaryColor} />
      <InvoiceTotal data={data} primaryColor={primaryColor} />
      <InvoiceFooter data={data} primaryColor={primaryColor} />

      <div className="absolute bottom-0 left-0 w-full">
        <img
          src="/FooterImage.png"
          alt="Footer Decoration"
          className="w-full h-auto object-contain"
        />
      </div>
    </div>
  );
};

export default Invoice;