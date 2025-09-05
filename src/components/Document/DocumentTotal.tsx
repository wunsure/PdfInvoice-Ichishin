import React from "react";
import type { Invoice, Quotation, DocumentItem } from "../../types/document";
import TdCell from "./TdCell";
import TableHeaderCell from "./TableHeaderCell";

type Props = { 
  data: Invoice| Quotation;
  primaryColor?: string;
};

const DocumentTotal: React.FC<Props> = ({ data, primaryColor = "#00b050" }) => {

  // 👇 --- 全新的、正确的计算逻辑 --- 👇

  let subtotalBeforeTax = 0; // 所有项目的税前总金额
  let totalTax = 0;          // 所有项目的总税额

  // 1. 遍历所有项目
  data.items.forEach((item: DocumentItem) => {
    const itemTotal = item.unitPrice * item.quantity;
    
    if (item.tax === '税抜') {
      // 对于【税抜】(外税):
      // - 项目本身的价格就是税前价格，直接累加到税前总金额
      subtotalBeforeTax += itemTotal;
      // - 税额是项目价格的10%，累加到总税额
      totalTax += itemTotal * 0.1;
    } else { 
      // 对于【税込】(内税):
      // - 项目价格是含税的，我们需要从中计算出税前部分
      const itemSubtotal = itemTotal * 100 / 110;
      subtotalBeforeTax += itemSubtotal;
      // - 税额是含税价和税前价的差值
      totalTax += itemTotal - itemSubtotal;
    }
  });

  // 2. 四舍五入，避免小数点问题
  subtotalBeforeTax = Math.round(subtotalBeforeTax);
  totalTax = Math.round(totalTax);

  // 3. 计算最终合计
  const totalAmount = subtotalBeforeTax + totalTax;
  
  // 👆 --- 计算逻辑结束 --- 👆

  return (
    <div className="w-1/2 ml-auto mt-4">
      <table
        className="w-full border text-center table-fixed"
        style={{
          borderColor: primaryColor,
          borderWidth: "2px",
        }}
      >
        <tbody>
          <tr className="h-4">
            <TableHeaderCell primaryColor={primaryColor} className="w-1/3">
              小計（税抜）
            </TableHeaderCell>
            <TdCell primaryColor={primaryColor} className="text-right pr-2">{subtotalBeforeTax.toLocaleString()}</TdCell>
            <TdCell primaryColor={primaryColor}></TdCell>
          </tr>
          <tr className="h-4">
            <TableHeaderCell primaryColor={primaryColor}>消費税</TableHeaderCell>
            <TdCell primaryColor={primaryColor} className="text-right pr-2">{totalTax.toLocaleString()}</TdCell>
            <TdCell primaryColor={primaryColor}></TdCell>
          </tr>
          <tr className="h-4">
            <TableHeaderCell primaryColor={primaryColor} className="font-bold">
              合計
            </TableHeaderCell>
            <TdCell primaryColor={primaryColor} className="font-bold text-right pr-2">
              {totalAmount.toLocaleString()}
            </TdCell>
            <TdCell primaryColor={primaryColor}></TdCell>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DocumentTotal;