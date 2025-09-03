import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Invoice from '../components/Invoice/Invoice';
import { Button } from '@/components/ui/button';
import { Download, ArrowLeft } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const InvoiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { invoices } = useData();
  const printAreaRef = useRef<HTMLDivElement>(null);

  const currentInvoice = invoices.find((invoice) => invoice.id === id);

  // 👇 --- 唯一的修改在这里 --- 👇
  const handleDownloadPdf = () => {
    const input = printAreaRef.current;
    if (!input) return;

    // 提高截图清晰度
    html2canvas(input, { scale: 2, useCORS: true })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('portrait', 'mm', 'a4');
        const pdfWidth = 210;
        const pdfHeight = 297;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`請求書-${currentInvoice?.invoiceNumber || 'invoice'}.pdf`);
      });
  };

  if (!currentInvoice) {
    return <div>請求書が見つかりません。</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-[210mm] mx-auto mb-4 flex justify-between items-center">
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> 戻る
          </Button>
        </Link>
        
        <Button onClick={handleDownloadPdf}>
          <Download className="mr-2 h-4 w-4" />
          PDFとしてダウンロード
        </Button>
      </div>

      {/* 这个页面没有缩放，所以 ref 直接放在这里 */}
      <div ref={printAreaRef}>
        <Invoice data={currentInvoice} />
      </div>
    </div>
  );
};

export default InvoiceDetailPage;