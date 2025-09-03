/**
 * 開票人信息 (Issuer)
 * 包含了所有關於開票公司的靜態信息。
 */
export interface BankInfo {
  bankName: string;      // 金融機関名
  branchName: string;    // 支店名
  accountType: '普通' | '当座'; // 種別 (限定为两个选项)
  accountNumber: string; // 番号
  accountHolder: string; // 口座名義
}

export interface IssuerInfo {
  id: string; // 唯一ID, e.g., 'issuer-uuid-1'
  name: string;
  postalCode: string;
  address: string;
  phone: string;
  fax?: string;
  bankInfo:BankInfo;
  registrationNumber?: string; // (可選) 日本インボイス制度登録番号
}

/**
 * 客戶信息 (Client)
 * 包含了所有關於客戶公司的靜態信息。
 */
export interface ClientInfo {
  id: string; // 唯一ID, e.g., 'client-uuid-1'
  clientName: string; // 会社名
  customerName?: string; // 担当者名
  postalCode?: string;
  address?: string;
  phone?: string;
  fax?: string;
} 

/**
 * 請求項目 (Item)
 * 請求書中的單行項目。
 */
export interface InvoiceItem {
  id: string; // 唯一ID, e.g., 'item-uuid-1'
  description: string;
  quantity: number;
  unitPrice: number;
  tax?: '税込' | '税抜'; // 限定稅種，更安全
}

/**
 * 請求書 (Invoice)
 * 這是核心的數據對象，它不直接存儲 Issuer 和 Client 的詳細信息，
 * 而是通過 ID 引用它們，或者直接嵌入對象。
 * 為了簡單起見，我們先用嵌入對象的方式。
 */
export interface Invoice {

  id: string; // 請求書本身的唯一ID, e.g., 'invoice-uuid-1'
  invoiceNumber: string; // 請求書番号
  date: string; // 発行日
  invoiceTitle?: string;
  // 直接嵌入完整的 Issuer 和 Client 對象
  // 這樣做的好處是，即使以後 Issuer 或 Client 的信息更新了，舊的 Invoice 記錄也不會改變。
  issuer: IssuerInfo;
  client: ClientInfo;

  items: InvoiceItem[];
  note?: string;

  customTextLines?: {
    text: string;
    fontSize?: string;
    color?: string;
  }[];
}


