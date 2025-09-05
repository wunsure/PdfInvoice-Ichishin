import React from "react";
import type { Invoice, Quotation, DocumentItem } from "../../types/document"; // 👈 为 item 添加类型
import TableHeaderCell from "./TableHeaderCell";
import TdCell from "./TdCell";

type Props = {
  data: Invoice| Quotation;
  primaryColor?: string;
};

const MIN_BODY_ROWS = 8;

const DocumentBody: React.FC<Props> = ({ data, primaryColor = "#00b050" }) => {
  const items = data.items;
  const emptyRowsCount = Math.max(0, MIN_BODY_ROWS - items.length);

  const emptyRows = Array.from({ length: emptyRowsCount }).map((_, index) => (
    <tr key={`empty-${index}`} className="h-8">
      <TdCell primaryColor={primaryColor} rowIndex={items.length + index}></TdCell>
      <TdCell primaryColor={primaryColor} rowIndex={items.length + index}></TdCell>
      <TdCell primaryColor={primaryColor} rowIndex={items.length + index}></TdCell>
      <TdCell primaryColor={primaryColor} rowIndex={items.length + index}></TdCell>
      <TdCell primaryColor={primaryColor} rowIndex={items.length + index}></TdCell>
    </tr>
  ));

  return (
    <div className="mb-6">
      <table
        className="w-full text-sm border-collapse"
        style={{ borderColor: primaryColor, borderStyle: "solid", borderWidth: "2px" }}
      >
        <thead>
          {/* 表头顺序：品番・品名, 単価, 数量, 金額, 税区分 */}
          <tr>
            <TableHeaderCell primaryColor={primaryColor} className="w-1/2">品番・品名</TableHeaderCell>
            <TableHeaderCell primaryColor={primaryColor} className="w-[10%]">単価</TableHeaderCell>
            <TableHeaderCell primaryColor={primaryColor} className="w-[10%]">数量</TableHeaderCell>
            <TableHeaderCell primaryColor={primaryColor} className="w-[15%]">金額</TableHeaderCell>
            <TableHeaderCell primaryColor={primaryColor} className="w-[15%]">税区分</TableHeaderCell>
          </tr>
        </thead>
        <tbody>
          {items.map((item: DocumentItem, index: number) => ( // 👈 为 item 添加明确类型
            <tr key={item.id} className="h-8">
              {/* 👇 修正这里的列顺序和内容，以匹配表头 👇 */}
              {/* 1. 品番・品名 */}
              <TdCell primaryColor={primaryColor} rowIndex={index}>{item.description}</TdCell>
              {/* 2. 単価 */}
              <TdCell primaryColor={primaryColor} rowIndex={index} className="text-right">
                {item.unitPrice.toLocaleString()}
              </TdCell>
              {/* 3. 数量 */}
              <TdCell primaryColor={primaryColor} rowIndex={index}>{item.quantity}</TdCell>
              {/* 4. 金額 */}
              <TdCell primaryColor={primaryColor} rowIndex={index} className="text-right">
                {(item.quantity * item.unitPrice).toLocaleString()}
              </TdCell>
              {/* 5. 税区分 */}
              <TdCell primaryColor={primaryColor} rowIndex={index}>
                {item.tax}
              </TdCell>
            </tr>
          ))}
          {/* 渲染填充的空行 */}
          {emptyRows}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentBody;