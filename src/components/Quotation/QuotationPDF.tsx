import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import type { Quotation, DocumentItem } from '../../types/document';

// --- 註冊字體 (保持不變) ---
Font.register({
  family: 'Noto Sans JP',
  src: '/fonts/NotoSansJP-VariableFont_wght.ttf'
});

// --- 修正後的 StyleSheet ---
const styles = StyleSheet.create({
  page: { fontFamily: 'Noto Sans JP', fontSize: 9, backgroundColor: '#fff', padding: 40 },
  header: { textAlign: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 700, marginBottom: 8 },
  metaInfoContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  clientInfo: { width: '55%' },
  clientNameTo: { fontSize: 14, fontWeight: 'bold', borderBottomWidth: 1, paddingBottom: 4, marginBottom: 8 },
  clientAddress: { lineHeight: 1.4 },
  issuerInfo: { width: '40%', textAlign: 'right', lineHeight: 1.4 },
  issuerName: { fontWeight: 'bold' },
  // 👇 修正點 1: 為左右分欄佈局準備樣式
  amountInfoContainer: {
    flexDirection: 'row', // 使用 flex 佈局讓內容並排
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  amountSummary: { // 左側金額概要
    width: '50%', // 佔據一半寬度
    borderWidth: 1,
  },
  amountSummaryRow: {
    flexDirection: 'row',
  },
  amountLabelCell: {
    width: '33.33%',
    padding: 8,
    textAlign: 'left',
    color: 'white',
    fontSize: 10,
  },
  amountValueCell: {
    width: '66.67%',
    padding: 8,
    textAlign: 'right',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountValueText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  // 👇 修正點 2: 修正主體表格的邊框策略和列寬
  table: { width: '100%', borderWidth: 1, borderBottomWidth: 0 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1 },
  tableHeader: { color: 'white', fontWeight: 'bold', fontSize: 9, borderBottomWidth: 1 },
  tableCell: { padding: 6, borderRightWidth: 1 },
  col_desc: { width: '45%' },
  col_price: { width: '15%', textAlign: 'right' }, // 調整寬度
  col_qty: { width: '10%', textAlign: 'center' },
  col_total: { width: '15%', textAlign: 'right' }, // 調整寬度
  col_tax: { width: '15%', textAlign: 'center', borderRightWidth: 0 }, // 稅區分列
  
  // 總計表格的樣式 (保持不變)
  totalTable: { width: '50%', marginLeft: 'auto', marginTop: 16, borderWidth: 1, },
  totalRow: { flexDirection: 'row', borderTopWidth: 1 },
  totalLabelCell: { width: '40%', padding: 6, color: 'white', fontSize: 9, fontWeight: 'bold' },
  totalValueCell: { width: '60%', borderLeftWidth: 1, padding: 6, textAlign: 'right', fontSize: 9, },

  footerContainer: { borderWidth: 1, marginTop: 24, padding: 16, minHeight: 64 },
  footerImage: { position: 'absolute', bottom: 0, left: 0, width: '100%' }
});

type Props = {
  data: Quotation;
  primaryColor?: string;
}

const QuotationPDF: React.FC<Props> = ({ data, primaryColor = "#2A8E3D" }) => {
  // --- 計算邏輯 (保持不變) ---
  const { items } = data;
  let subtotalBeforeTax = 0;
  let totalTax = 0;
  items.forEach(item => {
    const price = item.unitPrice || 0;
    const qty = item.quantity || 0;
    const itemTotal = price * qty;
    if (item.tax === '税抜') {
      subtotalBeforeTax += itemTotal;
      totalTax += itemTotal * 0.1;
    } else {
      const itemSubtotal = itemTotal * 100 / 110;
      subtotalBeforeTax += itemSubtotal;
      totalTax += itemTotal - itemSubtotal;
    }
  });
  subtotalBeforeTax = Math.round(subtotalBeforeTax);
  totalTax = Math.round(totalTax);
  const totalAmountWithTax = subtotalBeforeTax + totalTax;
  const MIN_BODY_ROWS = 8;
  const emptyRowsCount = Math.max(0, MIN_BODY_ROWS - items.length);
  const emptyRows = Array.from({ length: emptyRowsCount });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{...styles.header, borderTopWidth: 12, borderTopColor: primaryColor}} fixed />
        
        {/* ... (頁眉和公司信息保持不變) ... */}
        <View style={styles.header} fixed>
          <Text style={{...styles.title, color: primaryColor}}>{data.quotationTitle || '見積書'}</Text>
          <Text>{data.date || ''}</Text>
          <Text>見積番号: {data.quotationNumber || ''}</Text>
        </View>
        <View style={styles.metaInfoContainer} fixed>
           <View style={styles.clientInfo}>
            <Text style={{...styles.clientNameTo, borderBottomColor: primaryColor}}>{data.client?.clientName || ''} 様</Text>
            <Text style={styles.clientAddress}>
              {(data.client?.postalCode) ? `〒${data.client.postalCode}\n` : ''}
              {data.client?.address || ''}
            </Text>
          </View>
          <View style={styles.issuerInfo}>
            <Text style={styles.issuerName}>{data.issuer?.name || ''}</Text>
            <Text>
              {(data.issuer?.postalCode) ? `〒${data.issuer.postalCode}` : ''} {data.issuer?.address || ''}{'\n'}
              {(data.issuer?.phone) ? `Tel: ${data.issuer.phone}`: ''}{(data.issuer?.fax) ? ` / Fax: ${data.issuer.fax}` : ''}
            </Text>
          </View>
        </View>

        {/* 👇 修正點 1: 使用新的 Flex 佈局，讓金額概要只佔一半寬度 */}
        <View style={styles.amountInfoContainer}>
          <View style={{...styles.amountSummary, borderColor: primaryColor}}>
            <View style={styles.amountSummaryRow}>
              <Text style={{...styles.amountLabelCell, backgroundColor: primaryColor}}>お見積金額</Text>
              <View style={styles.amountValueCell}>
                <Text style={{...styles.amountValueText, color: primaryColor}}>¥{totalAmountWithTax.toLocaleString()}</Text>
              </View>
            </View>
          </View>
          {/* 另一半空間留空 */}
          <View style={{width: '50%'}} />
        </View>
        
        {/* 👇 修正點 2 & 3: 應用新的單線邊框策略和五列表格 */}
        <View style={{...styles.table, borderColor: primaryColor, borderBottomWidth: 1}}>
          <View style={{...styles.tableRow, ...styles.tableHeader, backgroundColor: primaryColor, borderBottomColor: primaryColor}}>
            <Text style={{...styles.tableCell, ...styles.col_desc, borderTopWidth: 0, borderRightColor: '#fff' }}>品番・品名</Text>
            <Text style={{...styles.tableCell, ...styles.col_price, borderTopWidth: 0, borderRightColor: '#fff'}}>単価</Text>
            <Text style={{...styles.tableCell, ...styles.col_qty, borderTopWidth: 0, borderRightColor: '#fff'}}>数量</Text>
            <Text style={{...styles.tableCell, ...styles.col_total, borderTopWidth: 0, borderRightColor: '#fff'}}>金額</Text>
            <Text style={{...styles.tableCell, ...styles.col_tax, borderTopWidth: 0, borderRightWidth: 0 }}>税区分</Text>
          </View>
          {items.map((item: DocumentItem) => (
            <View key={item.id} style={{...styles.tableRow, borderBottomColor: primaryColor}}>
              <Text style={{...styles.tableCell, ...styles.col_desc, borderColor: primaryColor}}>{item.description || ''}</Text>
              <Text style={{...styles.tableCell, ...styles.col_price, borderColor: primaryColor}}>¥{(item.unitPrice || 0).toLocaleString()}</Text>
              <Text style={{...styles.tableCell, ...styles.col_qty, borderColor: primaryColor}}>{item.quantity || 0}</Text>
              <Text style={{...styles.tableCell, ...styles.col_total, borderColor: primaryColor}}>{((item.unitPrice || 0) * (item.quantity || 0)).toLocaleString()}</Text>
              <Text style={{...styles.tableCell, ...styles.col_tax, borderColor: primaryColor}}>{item.tax}</Text>
            </View>
          ))}
          {emptyRows.map((_, index) => (
             <View key={`empty-${index}`} style={{...styles.tableRow, borderBottomColor: primaryColor}}>
                <Text style={{...styles.tableCell, ...styles.col_desc, borderColor: primaryColor}}></Text>
                <Text style={{...styles.tableCell, ...styles.col_price, borderColor: primaryColor}}></Text>
                <Text style={{...styles.tableCell, ...styles.col_qty, borderColor: primaryColor}}></Text>
                <Text style={{...styles.tableCell, ...styles.col_total, borderColor: primaryColor}}></Text>
                <Text style={{...styles.tableCell, ...styles.col_tax, borderColor: primaryColor}}></Text>
             </View>
          ))}
        </View>
          
        <View style={{...styles.totalTable, borderColor: primaryColor}}>
            <View style={{...styles.totalRow, borderColor: primaryColor}}>
              <Text style={{...styles.totalLabelCell, backgroundColor: primaryColor}}>小計（税抜）</Text>
              <Text style={{...styles.totalValueCell, borderColor: primaryColor}}>{subtotalBeforeTax.toLocaleString()}</Text>
            </View>
            <View style={{...styles.totalRow, borderColor: primaryColor}}>
              <Text style={{...styles.totalLabelCell, backgroundColor: primaryColor}}>消費税</Text>
              <Text style={{...styles.totalValueCell, borderColor: primaryColor}}>{totalTax.toLocaleString()}</Text>
            </View>
            <View style={{...styles.totalRow, borderColor: primaryColor}}>
              <Text style={{...styles.totalLabelCell, backgroundColor: primaryColor, borderTopWidth:0}}>合計</Text>
              <Text style={{...styles.totalValueCell, borderColor: primaryColor, fontWeight: 'bold'}}>{totalAmountWithTax.toLocaleString()}</Text>
            </View>
        </View>

        <View style={{...styles.footerContainer, borderColor: primaryColor, backgroundColor: '#f7fcf8'}}>
          <Text>{data.note || " "}</Text>
        </View>
        
        <Image style={styles.footerImage} src="/FooterImage.png" fixed />
      </Page>
    </Document>
  );
};

export default QuotationPDF;