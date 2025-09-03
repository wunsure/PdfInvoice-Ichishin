import React from "react";
import type { Invoice, InvoiceItem } from "../../types/invoice";
import TableHeaderCell from "./TableHeaderCell";
import CustomTextLines from "./CustomTextLines";

type Props = {
  data: Invoice;
  primaryColor?: string;
};

const InvoiceAmountInfo: React.FC<Props> = ({ data, primaryColor = "#00b050" }) => {

  // --- (计算逻辑保持不变) ---
  let subtotalInclusive = 0;
  let subtotalExclusive = 0;

  data.items.forEach((item: InvoiceItem) => {
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

  const hasExclusiveItems = subtotalExclusive > 0;
  const hasInclusiveItems = subtotalInclusive > 0;

  let taxTypeText = '';
  if (hasInclusiveItems && hasExclusiveItems) {
    taxTypeText = '税込 / 税抜';
  } else if (hasInclusiveItems) {
    taxTypeText = '税込';
  } else if (hasExclusiveItems) {
    taxTypeText = '税抜';
  }

  return (
     <>
    <div className="flex justify-between items-start mb-4">
      {/* 左侧：金额概要 */}
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
                ご請求金額
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

      {/* 右侧：银行账户信息 */}
      <div className="w-1/2 pl-4">
         <table className="w-full text-left">
           <tbody>
             <tr>
               <TableHeaderCell primaryColor={primaryColor} className="w-1/3 !text-center">
                 振込先口座
               </TableHeaderCell>
               {/* 👇 --- 这里的显示方式需要彻底改变 --- 👇 */}
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
    </div>
    <CustomTextLines 
        lines={noteLines}
        fontSize="9px"
        color="#555555"
        containerClassName="mt-4"
        lineHeight="0.75"
        marginBottom="4rem"
      />
    </>
  );
};

export default InvoiceAmountInfo;