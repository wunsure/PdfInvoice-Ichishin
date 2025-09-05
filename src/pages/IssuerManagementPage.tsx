import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Modal from 'react-modal';
import IssuerForm from '../components/Issuer/IssuerForm';
import type { IssuerInfo, BankInfo } from '../types/document';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

Modal.setAppElement('#root');

const IssuerManagementPage: React.FC = () => {
  const { issuers, addIssuer, updateIssuer, deleteIssuer } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIssuer, setCurrentIssuer] = useState<IssuerInfo | Omit<IssuerInfo, 'id'>>({
    name: '', postalCode: '', address: '', phone: '', 
    bankInfo: { bankName: '', branchName: '', accountType: '普通', accountNumber: '', accountHolder: '' }
  });

  const openNewModal = () => {
    setCurrentIssuer({
      name: '', postalCode: '', address: '', phone: '', 
      bankInfo: { bankName: '', branchName: '', accountType: '普通', accountNumber: '', accountHolder: '' }
    });
    setIsModalOpen(true);
  };

  const openEditModal = (issuer: IssuerInfo) => {
    setCurrentIssuer(JSON.parse(JSON.stringify(issuer)));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 👇 --- 修正这里的类型处理逻辑 --- 👇
  const handleFormChange = (
  field: keyof Omit<IssuerInfo, 'id' | 'bankInfo'> | `bankInfo.${keyof BankInfo}`, 
  value: string
) => {
  setCurrentIssuer(prev => {
    // 确保 prev 状态存在，如果不存在则直接返回，避免后续操作出错
    if (!prev) return prev; 

    // 使用类型守卫来区分 prev 是否包含 id
    const baseIssuer = 'id' in prev 
      ? { ...prev } 
      : { ...prev, id: '' }; // 如果是新建状态，临时补充一个id以统一类型

    if (field.startsWith('bankInfo.')) {
      const bankField = field.split('.')[1] as keyof BankInfo;
      const newBankInfo = {
        ...baseIssuer.bankInfo,
        [bankField]: value,
      };

      // 特殊处理 accountType 以满足 '普通' | '当座' 的类型
      if (bankField === 'accountType') {
        newBankInfo.accountType = value === '当座' ? '当座' : '普通';
      }
      
      return { ...baseIssuer, bankInfo: newBankInfo };
    } else {
      // 这里的 field 类型已经是安全的了，无需 as 断言
      return { ...baseIssuer, [field]: value };
    }
  });
};



  const handleSave = () => {
    if (!currentIssuer.name) {
      alert('名称を入力してください。');
      return;
    }
    if ('id' in currentIssuer) {
      updateIssuer(currentIssuer as IssuerInfo);
    } else {
      addIssuer(currentIssuer);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('本当にこの開票者情報を削除しますか？')) {
      deleteIssuer(id);
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
          <h1 className="text-3xl font-bold text-primary">開票者情報管理</h1>
        </div>
        <Button onClick={openNewModal}>
          + 新規追加
        </Button>
      </div>

      <div className="bg-white shadow-md rounded-lg">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">名称</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">住所</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
            </tr>
          </thead>
          <tbody>
            {issuers.map(issuer => (
              <tr key={issuer.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm"><p>{issuer.name}</p></td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm"><p>{issuer.address}</p></td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                  <button onClick={() => openEditModal(issuer)} className="text-indigo-600 hover:text-indigo-900">編集</button>
                  <button onClick={() => handleDelete(issuer.id)} className="text-red-600 hover:text-red-900 ml-4">削除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Issuer Form Modal"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full"
      >
        <IssuerForm 
          issuer={currentIssuer as Omit<IssuerInfo, 'id'>}
          onFormChange={handleFormChange}
          onSave={handleSave}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};

export default IssuerManagementPage;