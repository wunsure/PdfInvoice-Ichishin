import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import type { Invoice } from '../../types/document';

// 注册一个支持中文的字体
Font.register({
  family: 'Noto Sans JP',
  src: '/NotoSansJP-VariableFont_wght.ttf' // 👈 确保这里的文件名和你放入public文件夹的文件名完全一致
});

// 定义PDF内部的样式
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Noto Sans JP', // 应用字体
    padding: 30,
    fontSize: 10,
    color: '#333',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 10,
  },
  companyInfo: {
    textAlign: 'right',
  },
  table: {
    width: '100%',
    border: '1px solid #000',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '20%',
    borderBottom: '1px solid #000',
    backgroundColor: '#f0f0f0',
    padding: 5,
  },
  tableCol: {
    width: '20%',
    borderBottom: '1px solid #000',
    padding: 5,
  }
});

type Props = {
  data: Invoice;
}

const InvoiceDocument: React.FC<Props> = ({ data }) => {
  const totalAmount = data.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.invoiceTitle}>{data.invoiceTitle || '請求書'}</Text>
          <Text>{data.date}</Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 }}>
          <View>
            <Text>{data.client.clientName} 様</Text>
            <Text>〒{data.client.postalCode}</Text>
            <Text>{data.client.address}</Text>
          </View>
          <View style={styles.companyInfo}>
            <Text>{data.issuer.name}</Text>
            <Text>〒{data.issuer.postalCode}</Text>
            <Text>{data.issuer.address}</Text>
            <Text>Tel: {data.issuer.phone}</Text>
          </View>
        </View>
        
        <View>
            <Text style={{fontSize: 18, marginBottom: 10}}>ご請求金額: ¥{totalAmount.toLocaleString()}</Text>
        </View>

        {/* 表格 */}
        <View style={styles.table}>
          <View style={[styles.tableRow, { fontWeight: 'bold' }]}>
            <Text style={[styles.tableColHeader, {width: '40%'}]}>品番・品名</Text>
            <Text style={styles.tableColHeader}>単価</Text>
            <Text style={styles.tableColHeader}>数量</Text>
            <Text style={styles.tableColHeader}>金額</Text>
          </View>
          {data.items.map(item => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={[styles.tableCol, {width: '40%'}]}>{item.description}</Text>
              <Text style={styles.tableCol}>¥{item.unitPrice.toLocaleString()}</Text>
              <Text style={styles.tableCol}>{item.quantity}</Text>
              <Text style={styles.tableCol}>¥{(item.unitPrice * item.quantity).toLocaleString()}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default InvoiceDocument;