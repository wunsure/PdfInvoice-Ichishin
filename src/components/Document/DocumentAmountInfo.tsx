import React from "react";
import type { DocumentItem, Invoice, Quotation } from "../../types/document";
import TableHeaderCell from "./TableHeaderCell";
import CustomTextLines from "./CustomTextLines";

// 👇 1. 在 Props 中添加兩個新的可選屬性
type Props = {
  data: Invoice | Quotation;
  primaryColor?: string;
  totalLabel: string;
  showAmountSummary?: boolean; // 控制是否顯示金額概要
  showBankInfo?: boolean;      // 控制是否顯示銀行信息
   showNoteLines?: boolean;
};

// 👇 2. 在組件參數中接收新屬性，並設置默認值為 true
const DocumentAmountInfo: React.FC<Props> = ({ 
  data, 
  primaryColor = "#00b050",
  totalLabel, 
  showAmountSummary = true, 
  showBankInfo = true,
   showNoteLines = true,
}) => {

  // --- (您的計算邏輯保持不變) ---
  let subtotalInclusive = 0;
  let subtotalExclusive = 0;
  data.items.forEach((item: DocumentItem) => {
    const itemTotal = item.unitPrice * item.quantity;
    if (item.tax === '税抜') {
      subtotalExclusive += itemTotal;
    } else {
      subtotalInclusive += itemTotal;
    }
  });
  const taxFromExclusive = subtotalExclusive * 0.1;
  const totalAmount = subtotalExclusive + taxFromExclusive + subtotalInclusive;
  const noteLines = [
    { text: '１、請求明細をご確認のうえ、お振込期日までに上記口座へお振込をお願いいたします' },
    { text: '２、お振込手数料はお客様にご負担をお願いいたします' }
  ];
  let taxTypeText = '';
  if (subtotalInclusive > 0 && subtotalExclusive > 0) {
    taxTypeText = '税込 / 税抜';
  } else if (subtotalInclusive > 0) {
    taxTypeText = '税込';
  } else if (subtotalExclusive > 0) {
    taxTypeText = '税抜';
  }

  return (
     <>
    <div className="flex justify-between items-start mb-4">
      {/* 👇 3. 用 showAmountSummary 屬性來包裹左側的 table */}
      {showAmountSummary && (
        <div className="w-1/2">
          <table 
            className="w-full text-center"
            style={{
              border: `2px solid ${primaryColor}`
            }}
          >
            <tbody>
              <tr>
                <TableHeaderCell primaryColor={primaryColor} className="w-1/3">
                   {totalLabel} 
                </TableHeaderCell>
                <td className="w-2/3 text-2xl font-bold text-right pr-4 align-middle">
                  ¥{Math.round(totalAmount).toLocaleString()}
                </td>
              </tr>
              <tr>
                <TableHeaderCell primaryColor={primaryColor} className="w-1/3"></TableHeaderCell>
                <td className="w-2/3 text-xs font-bold text-right pr-4 align-middle">
                  ({taxTypeText})
                </td>  
              </tr> 
              <tr>
                <TableHeaderCell primaryColor={primaryColor} className="w-1/3"></TableHeaderCell>
                <td className="w-2/3 text-xs font-bold text-right pr-4 align-middle">
                
                </td>  
              </tr>        
            </tbody>
          </table>
        </div>
      )}

      {/* 👇 4. 用 showBankInfo 屬性來包裹右側的 table */}
      {showBankInfo && (
        // 👇 動態調整寬度：如果左側不顯示，右側就佔滿全部寬度
        <div className={showAmountSummary ? "w-1/2 pl-4" : "w-full"}>
           <table className="w-full text-left"
           style={{
              border: `2px solid ${primaryColor}`
            }}
           >
             <tbody>
               <tr>
                 <TableHeaderCell primaryColor={primaryColor} className="w-1/3 !text-center">
                   振込先口座
                 </TableHeaderCell>
                 <td 
                  className="border text-xs p-2"
                  style={{borderColor: primaryColor}}
                 >
                   <div className="space-y-1">
                     <p>{data.issuer.bankInfo.bankName} {data.issuer.bankInfo.branchName}</p>
                     <p>({data.issuer.bankInfo.accountType}) {data.issuer.bankInfo.accountNumber}</p>
                     <p>{data.issuer.bankInfo.accountHolder}</p>
                   </div>
                 </td>
               </tr>
             </tbody>
           </table>
        </div>
      )}
    </div>
    {showNoteLines && (
    <CustomTextLines 
        lines={noteLines}
        fontSize="9px"
        color="#555555"
        containerClassName="mt-4"
        lineHeight="0.75"
        marginBottom="4rem"
      />
      )}
    </>
  );
};

export default DocumentAmountInfo;