// =================================================================
// 保持不變：您詳細的 BankInfo, IssuerInfo, ClientInfo 定義
// =================================================================

export interface BankInfo {
  bankName: string;
  branchName: string;
  accountType: '普通' | '当座';
  accountNumber: string;
  accountHolder: string;
}

export interface IssuerInfo {
  id: string;
  name: string;
  postalCode: string;
  address: string;
  phone: string;
  fax?: string;
  bankInfo: BankInfo;
  registrationNumber?: string;
}

export interface ClientInfo {
  id:string;
  clientName: string;
  customerName?: string;
  postalCode?: string;
  address?: string;
  phone?: string;
  fax?: string;
}

// =================================================================
// 修改點：將 InvoiceItem 重命名為更通用的 DocumentItem
// =================================================================
export interface DocumentItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  tax: '税込' | '税抜'; // 將 tax 設置為必填，這對計算邏輯更安全
}

// =================================================================
// 新增：基礎單據類型 BaseDocument，包含所有通用字段
// =================================================================
interface BaseDocument {
  id: string;
  date: string;
  issuer: IssuerInfo;
  client: ClientInfo;
  items: DocumentItem[];
  note?: string;
  customTextLines?: {
    text: string;
    fontSize?: string;
    color?: string;
  }[];
}

// =================================================================
// 修改點：讓 Invoice 繼承 BaseDocument，並只保留自己的專屬屬性
// =================================================================
export interface Invoice extends BaseDocument {
  invoiceTitle?: string;
  invoiceNumber: string;
}

// =================================================================
// 新增：創建 Quotation 類型，同樣繼承 BaseDocument
// =================================================================
export interface Quotation extends BaseDocument {
  quotationTitle?: string;
  quotationNumber: string;
  validUntil?: string; // (可選) 為見積書增加一個專屬的“有效期”字段
}