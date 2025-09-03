import React from 'react';
import type { ClientInfo } from '../../types/invoice';

type Props = {
  client: Omit<ClientInfo, 'id'>;
  onFormChange: (field: keyof Omit<ClientInfo, 'id'>, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

const ClientForm: React.FC<Props> = ({ client, onFormChange, onSave, onCancel }) => {
  return (
    <div className="flex flex-col max-h-[80vh] overflow-y-auto">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold">顧客情報</h2>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">顧客名</label>
          <input
            type="text"
            id="clientName"
            value={client.clientName}
            onChange={(e) => onFormChange('clientName', e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">担当者名</label>
          <input
            type="text"
            id="customerName"
            value={client.customerName || ''}
            onChange={(e) => onFormChange('customerName', e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">郵便番号</label>
          <input
            type="text"
            id="postalCode"
            value={client.postalCode || ''}
            onChange={(e) => onFormChange('postalCode', e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">住所</label>
          <input
            type="text"
            id="address"
            value={client.address || ''}
            onChange={(e) => onFormChange('address', e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">電話番号</label>
          <input
            type="text"
            id="phone"
            value={client.phone || ''}
            onChange={(e) => onFormChange('phone', e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 border-t flex justify-end space-x-4">
        <button onClick={onCancel} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">キャンセル</button>
        <button onClick={onSave} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">保存</button>
      </div>
    </div>
  );
};

export default ClientForm;