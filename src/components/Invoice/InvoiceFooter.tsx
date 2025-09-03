// src/components/Invoice/InvoiceFooter.tsx
import React from "react";
import type { Invoice } from "../../types/invoice";

type Props = {
  data: Invoice;
  primaryColor?: string;
};

const InvoiceFooter: React.FC<Props> = ({ data, primaryColor = "#00b050" }) => {
  return (
    <table
      className="w-full border mt-6"
      style={{ borderColor: primaryColor }}
    >
      <tbody>
        <tr>
          <td
            className="border px-4 py-4 text-left text-xs"
            style={{ borderColor: primaryColor, backgroundColor: "#F3FAF3" }}
          >
            <div className="min-h-[64px] flex items-start">
              {data.note || "無"}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default InvoiceFooter;