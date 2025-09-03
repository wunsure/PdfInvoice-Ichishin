import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Modal from 'react-modal';
import ClientForm from '../components/Client/ClientForm'; // 👈 导入我们刚创建的表单
import type { ClientInfo } from '../types/invoice';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Modal 初始化
Modal.setAppElement('#root');

const ClientManagementPage: React.FC = () => {
  // 1. 从 useData 中获取所有需要的函数
  const { clients, addClient, updateClient, deleteClient } = useData();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 2. 创建 state 来管理正在编辑的客户数据
  const [currentClient, setCurrentClient] = useState<ClientInfo | Omit<ClientInfo, 'id'>>({
    clientName: '', customerName: '', postalCode: '', address: '', phone: ''
  });

  // 3. 区分“新建”和“编辑”的打开方式
  const openNewModal = () => {
    setCurrentClient({ clientName: '', customerName: '', postalCode: '', address: '', phone: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (client: ClientInfo) => {
    setCurrentClient(JSON.parse(JSON.stringify(client)));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFormChange = (field: keyof Omit<ClientInfo, 'id'>, value: string) => {
    setCurrentClient(prev => ({ ...prev, [field]: value }));
  };

  // 4. 更新保存逻辑，区分新建和编辑
  const handleSave = () => {
    if (!currentClient.clientName) {
      alert('顧客名を入力してください。');
      return;
    }
    if ('id' in currentClient) {
      updateClient(currentClient as ClientInfo);
    } else {
      addClient(currentClient);
    }
    closeModal();
  };

  // 5. 新增删除逻辑
  const handleDelete = (id: string) => {
    if (window.confirm('本当にこの顧客情報を削除しますか？')) {
      deleteClient(id);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-primary">顧客情報管理</h1>
        </div>
        <Button onClick={openNewModal}>
          + 新規追加
        </Button>
      </div>

      <div className="bg-white shadow-md rounded-lg">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">顧客名</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">担当者名</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{client.clientName}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{client.customerName}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                  {/* 6. 绑定 "编辑" 和 "删除" 按钮 */}
                  <button onClick={() => openEditModal(client)} className="text-indigo-600 hover:text-indigo-900">編集</button>
                  <button onClick={() => handleDelete(client.id)} className="text-red-600 hover:text-red-900 ml-4">削除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 集成模态框和表单 */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Client Form Modal"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full"
      >
        <ClientForm 
          client={currentClient as Omit<ClientInfo, 'id'>}
          onFormChange={handleFormChange}
          onSave={handleSave}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};

export default ClientManagementPage;