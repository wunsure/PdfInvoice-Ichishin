import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Invoice, IssuerInfo, ClientInfo } from '../types/invoice';
import { initialInvoices, initialIssuers, initialClients } from '../data/initialData';

/* =========================
   原始代碼保留：主題顏色數據
========================= */
export const themes = [
  { name: 'slate', color: '240 5.9% 10%' },
  { name: 'green', color: '142.1 76.2% 36.3%' },
  { name: 'blue', color: '221.2 83.2% 53.3%' },
  { name: 'orange', color: '24.6 95% 53.1%' },
];
export type ThemeName = 'slate' | 'green' | 'blue' | 'orange';

/* =========================
   原始代碼保留：DataContext類型定義
========================= */
interface DataContextType {
  invoices: Invoice[];
  issuers: IssuerInfo[];
  clients: ClientInfo[];
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  updateInvoice: (updatedInvoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
  addIssuer: (issuerData: Omit<IssuerInfo, 'id'>) => void;
  updateIssuer: (updatedIssuer: IssuerInfo) => void;
  deleteIssuer: (id: string) => void;
  addClient: (clientData: Omit<ClientInfo, 'id'>) => void;
  updateClient: (updatedClient: ClientInfo) => void;
  deleteClient: (id: string) => void;
  theme: ThemeName;
  changeTheme: (themeName: ThemeName) => void;
}

const DataContext = createContext<DataContextType | null>(null);

/* =========================
   原始代碼保留：useStickyState自定義hook
========================= */
function useStickyState<T>(defaultValue: T, key: string): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null
      ? JSON.parse(stickyValue)
      : defaultValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

/* =========================
   原始代碼保留：DataProvider 組件
========================= */
export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [invoices, setInvoices] = useStickyState<Invoice[]>(initialInvoices, 'invoices_data');
  const [issuers, setIssuers] = useStickyState<IssuerInfo[]>(initialIssuers, 'issuers_data');
  const [clients, setClients] = useStickyState<ClientInfo[]>(initialClients, 'clients_data');

  /* =========================
     修改/新增：theme 狀態初始化
     原本只有 setTheme，這裡新增 effect 來修改 CSS 變量
  ========================== */
  const [theme, setTheme] = useStickyState<ThemeName>('slate', 'app_theme');

  // 👇 新增：動態修改 --primary CSS 變量
  useEffect(() => {
    // 找到對應的顏色值
    const selectedTheme = themes.find(t => t.name === theme);
    if (selectedTheme) {
      document.documentElement.style.setProperty('--primary', selectedTheme.color);
    }
  }, [theme]);

  /* =========================
     原始代碼保留：改變主題的函數
========================= */
  const changeTheme = (themeName: ThemeName) => {
    setTheme(themeName);
  };

  /* =========================
     原始代碼保留：增刪改函數
========================= */
  const addInvoice = (invoiceData: Omit<Invoice, 'id'>) => {
    const newInvoice = { ...invoiceData, id: uuidv4() };
    setInvoices((prev: Invoice[]) => [...prev, newInvoice]);
  };

  const updateInvoice = (updatedInvoice: Invoice) => {
    setInvoices((prevInvoices: Invoice[]) => 
      prevInvoices.map(invoice => 
        invoice.id === updatedInvoice.id ? updatedInvoice : invoice
      )
    );
  };

  const deleteInvoice = (id: string) => {
    setInvoices((prev: Invoice[]) => prev.filter(inv => inv.id !== id));
  };

  const addIssuer = (issuerData: Omit<IssuerInfo, 'id'>) => {
    const newIssuer = { ...issuerData, id: uuidv4() };
    setIssuers((prev: IssuerInfo[]) => [...prev, newIssuer]);
  };

  const updateIssuer = (updatedIssuer: IssuerInfo) => {
    setIssuers((prev: IssuerInfo[]) => 
      prev.map(issuer => 
        issuer.id === updatedIssuer.id ? updatedIssuer : issuer
      )
    );
  };

  const deleteIssuer = (id: string) => {
    setIssuers((prev: IssuerInfo[]) => prev.filter(issuer => issuer.id !== id));
  };

  const addClient = (clientData: Omit<ClientInfo, 'id'>) => {
    const newClient = { ...clientData, id: uuidv4() };
    setClients((prev: ClientInfo[]) => [...prev, newClient]);
  };

  const updateClient = (updatedClient: ClientInfo) => {
    setClients((prev: ClientInfo[]) => 
      prev.map(client => 
        client.id === updatedClient.id ? updatedClient : client
      )
    );
  };

  const deleteClient = (id: string) => {
    setClients((prev: ClientInfo[]) => prev.filter(client => client.id !== id));
  };

  /* =========================
     原始代碼保留：提供 value 給 context
========================= */
  const value = {
    invoices,
    issuers,
    clients,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    addIssuer,
    updateIssuer,
    deleteIssuer,
    addClient,
    updateClient,
    deleteClient,
    theme,
    changeTheme,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

/* =========================
   原始代碼保留：useData Hook
========================= */
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};