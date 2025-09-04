import React, { createContext, useContext, useReducer, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Invoice, IssuerInfo, ClientInfo } from '../types/invoice';
import { initialInvoices, initialIssuers, initialClients } from '../data/initialData';

// --- 主题相关的定义 (无变化) ---
export const themes = [ 
  { name: 'green', color: '142.1 76.2% 36.3%' },
  { name: 'blue', color: '221.2 83.2% 53.3%' },
  { name: 'orange', color: '24.6 95% 53.1%' },
  { name: 'Charcoal Blue', color: '220 15% 20%' },
];
export type ThemeName = 'green' | 'blue' | 'orange'| 'Charcoal Blue' ;

// --- Context 类型定义 (无变化) ---
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

// --- useStickyState Hook (无变化) ---
function useStickyState<T>(defaultValue: T, key: string): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// =================================================================
// 👇 新增: 为 Invoices 定义 Action 类型
// =================================================================
type InvoiceAction =
  | { type: 'ADD'; payload: Omit<Invoice, 'id'> }
  | { type: 'UPDATE'; payload: Invoice }
  | { type: 'DELETE'; payload: { id: string } };

// =================================================================
// 👇 新增: Invoices 的 Reducer 函数
// 这个函数接收当前 state 和一个 action，然后返回新的 state。
// 所有与 invoices 相关的状态逻辑都集中在这里。
// =================================================================
const invoicesReducer = (state: Invoice[], action: InvoiceAction): Invoice[] => {
  switch (action.type) {
    case 'ADD':
      const newInvoice = { ...action.payload, id: uuidv4() };
      return [...state, newInvoice];
    case 'UPDATE':
      return state.map(invoice =>
        invoice.id === action.payload.id ? action.payload : invoice
      );
    case 'DELETE':
      return state.filter(invoice => invoice.id !== action.payload.id);
    default:
      return state;
  }
};

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  // =================================================================
  // 👇 修改: 使用 useReducer 管理 invoices 状态
  // =================================================================
  // 1. 定义一个初始化函数，用于从 localStorage 读取初始状态
  const initInvoices = (initialValue: Invoice[]) => {
    const stickyValue = window.localStorage.getItem('invoices_data');
    return stickyValue ? JSON.parse(stickyValue) : initialValue;
  };

  // 2. 使用 useReducer hook
  const [invoices, dispatchInvoices] = useReducer(invoicesReducer, initialInvoices, initInvoices);
  
  // 3. 使用 useEffect 将 invoices 的变化同步回 localStorage
  useEffect(() => {
    window.localStorage.setItem('invoices_data', JSON.stringify(invoices));
  }, [invoices]);


  // --- issuers 和 clients 状态管理 (无变化) ---
  const [issuers, setIssuers] = useStickyState<IssuerInfo[]>(initialIssuers, 'issuers_data');
  const [clients, setClients] = useStickyState<ClientInfo[]>(initialClients, 'clients_data');

  // --- 主题状态管理 (无变化) ---
  const [theme, setTheme] = useStickyState<ThemeName>('Charcoal Blue', 'app_theme');
  useEffect(() => {
    const selectedTheme = themes.find(t => t.name === theme);
    if (selectedTheme) {
      document.documentElement.style.setProperty('--primary', selectedTheme.color);
    }
  }, [theme]);
  const changeTheme = (themeName: ThemeName) => setTheme(themeName);


  // =================================================================
  // 👇 修改: 更新 invoices 的操作函数，现在它们 dispatch actions
  // 对外暴露的函数名和参数保持不变，因此使用这些函数的组件（如 useInvoiceForm）无需任何修改！
  // =================================================================
  const addInvoice = (invoiceData: Omit<Invoice, 'id'>) => {
    dispatchInvoices({ type: 'ADD', payload: invoiceData });
  };
  const updateInvoice = (updatedInvoice: Invoice) => {
    dispatchInvoices({ type: 'UPDATE', payload: updatedInvoice });
  };
  const deleteInvoice = (id: string) => {
    dispatchInvoices({ type: 'DELETE', payload: { id } });
  };


  // --- issuers 和 clients 的操作函数 (无变化) ---
  const addIssuer = (issuerData: Omit<IssuerInfo, 'id'>) => {
    const newIssuer = { ...issuerData, id: uuidv4() };
    setIssuers(prev => [...prev, newIssuer]);
  };
  const updateIssuer = (updatedIssuer: IssuerInfo) => {
    setIssuers(prev => prev.map(issuer => issuer.id === updatedIssuer.id ? updatedIssuer : issuer));
  };
  const deleteIssuer = (id: string) => {
    setIssuers(prev => prev.filter(issuer => issuer.id !== id));
  };
  const addClient = (clientData: Omit<ClientInfo, 'id'>) => {
    const newClient = { ...clientData, id: uuidv4() };
    setClients(prev => [...prev, newClient]);
  };
  const updateClient = (updatedClient: ClientInfo) => {
    setClients(prev => prev.map(client => client.id === updatedClient.id ? updatedClient : client));
  };
  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(client => client.id !== id));
  };


  // --- Context Provider 的 value (无变化) ---
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

// --- useData Hook (无变化) ---
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};