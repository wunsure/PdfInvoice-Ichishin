import { v4 as uuidv4 } from 'uuid';
// 👇 1. 确保这里也导入了 Invoice 类型
import type { IssuerInfo, ClientInfo, Invoice, InvoiceItem } from '../types/invoice';

// ==================================================================
// 1. 獨立的開票人數據 (Issuers)
// ==================================================================
export const initialIssuers: IssuerInfo[] = [
  {
    id: uuidv4(),
    name: '株式会社ABC',
    postalCode: '123-4567',
    address: '東京都新宿区西新宿2-8-1',
    phone: '03-1234-5678',
    fax: '03-1234-5679',
    bankInfo: {
      bankName: '三菱UFJ銀行',
      branchName: '新宿支店',
      accountType: '普通',
      accountNumber: '1234567',
      accountHolder: '株式会社ABC',
    },
  },
  {
    id: uuidv4(),
    name: '株式会社DEF',
    postalCode: '107-0062',
    address: '東京都港区南青山3-1-1',
    phone: '03-2345-6789',
    fax: '03-2345-6790',
    bankInfo: {
      bankName: '三菱UFJ銀行',
      branchName: '青山支店',
      accountType: '当座',
      accountNumber: '7654321',
      accountHolder: '株式会社DEF',
    },
  },
];

// ==================================================================
// 2. 獨立的客戶數據 (Clients)
// ==================================================================
export const initialClients: ClientInfo[] = [
  {
    id: uuidv4(),
    clientName: '株式会社クライアントA',
    customerName: '山田 太郎',
    postalCode: '160-0023',
    address: '東京都新宿区西新宿1-2-3',
    phone: '03-5555-5555',
    fax: '03-5555-5556',
  },
  {
    id: uuidv4(),
    clientName: '株式会社クライアントB',
    customerName: '佐藤 花子',
    postalCode: '100-0005',
    address: '東京都千代田区丸の内2-3-4',
    phone: '03-6666-6666',
    fax: '03-6666-6667',
  },
];

// ==================================================================
// 3. (可選) 服務/商品項目模板 (Item Templates)
// ==================================================================
export const initialItemTemplates: Omit<InvoiceItem, 'id'>[] = [
    { description: '商品A', unitPrice: 1000, quantity: 1, tax: '税込' },
    { description: '商品B', unitPrice: 2000, quantity: 1, tax: '税込' },
    { description: 'サービスC', unitPrice: 1500, quantity: 1, tax: '税込' },
];

// 👇 ==================================================================
// 👇 4. 初始的請求書數據 (Invoices) - (这部分被删除了，需要加回来)
// 👇 ==================================================================
export const initialInvoices: Invoice[] = [
  {
    id: uuidv4(),
    invoiceNumber: 'INV-2025-001',
    date: '2025-09-01',
    invoiceTitle: '請求書',
    issuer: initialIssuers[0], 
    client: initialClients[0],
    items: [
      { id: uuidv4(), description: '商品A', unitPrice: 1000, quantity: 2, tax: '税込' },
      { id: uuidv4(), description: '商品B', unitPrice: 2000, quantity: 1, tax: '税込' },
    ],
    note: 'これはサンプル請求書です。',
  },
  {
    id: uuidv4(),
    invoiceNumber: 'INV-2025-002',
    date: '2025-09-02',
    invoiceTitle: '請求書',
    issuer: initialIssuers[1],
    client: initialClients[1],
    items: [
      { id: uuidv4(), description: 'サービスC', unitPrice: 1500, quantity: 3, tax: '税込' },
    ],
    note: '振込手数料はご負担ください。',
  },
];