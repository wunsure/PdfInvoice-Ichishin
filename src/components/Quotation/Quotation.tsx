import React from "react";
import type { Quotation as QuotationType  } from "../../types/document"; 
import DocumentHeader from "../Document/DocumentHeader";
import DocumentCompanyInfo from "../Document/DocumentCompanyInfo";
import DocumentAmountInfo from "../Document/DocumentAmountInfo";
import DocumentBody from "../Document/DocumentBody";
import DocumentTotal from "../Document/DocumentTotal";
import DocumentFooter from "../Document/DocumentFooter";
import { DEFAULT_PRIMARY_COLOR } from "../../config";

type Props = {
  data: QuotationType 
  primaryColor?: string;
};

const Quotation: React.FC<Props> = ({
  data,
  primaryColor = DEFAULT_PRIMARY_COLOR,
}) => {
  return (
    <div
      className="bg-white mx-auto my-8 p-16 border shadow-lg relative"
      style={{ width: "210mm", height: "297mm", borderColor: primaryColor }}
    >
      {/* 子组件会接收到完整的 data 对象 */}
      <DocumentHeader data={data} primaryColor={primaryColor} title={data.quotationTitle || "見積書"} />
      <DocumentCompanyInfo data={data} primaryColor={primaryColor} />
      <DocumentAmountInfo data={data} primaryColor={primaryColor} totalLabel="お見積金額" showBankInfo={false} showNoteLines={false}/>
      <DocumentBody data={data} primaryColor={primaryColor} />
      <DocumentTotal data={data} primaryColor={primaryColor} />
      <DocumentFooter data={data} primaryColor={primaryColor} />

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

export default Quotation;