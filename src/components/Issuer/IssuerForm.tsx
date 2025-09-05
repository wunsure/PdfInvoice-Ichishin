import React from 'react';
import type { IssuerInfo, BankInfo } from '../../types/document';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// 👇 我们没有用到 Textarea，所以可以删除它来消除“未使用”的警告
// import { Textarea } from "@/components/ui/textarea"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  issuer: Omit<IssuerInfo, 'id'>;
  onFormChange: (
    field: keyof Omit<IssuerInfo, 'id' | 'bankInfo'> | `bankInfo.${keyof BankInfo}`, 
    value: string
  ) => void;
  onSave: () => void;
  onCancel: () => void;
};

const IssuerForm: React.FC<Props> = ({ issuer, onFormChange, onSave, onCancel }) => {
  return (
    <div className="flex flex-col max-h-[80vh] overflow-y-auto">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold">開票者情報</h2>
      </div>

      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">名称</Label>
          {/* 👇 为所有 onChange 的事件参数 'e' 添加类型 */}
          <Input id="name" type="text" value={issuer.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFormChange('name', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postalCode">郵便番号</Label>
          <Input id="postalCode" type="text" value={issuer.postalCode} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFormChange('postalCode', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">住所</Label>
          <Input id="address" type="text" value={issuer.address} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFormChange('address', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">電話番号</Label>
          <Input id="phone" type="text" value={issuer.phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFormChange('phone', e.target.value)} />
        </div>
        
        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">銀行情報</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">金融機関名</Label>
              <Input id="bankName" type="text" value={issuer.bankInfo.bankName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFormChange('bankInfo.bankName', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="branchName">支店名</Label>
              <Input id="branchName" type="text" value={issuer.bankInfo.branchName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFormChange('bankInfo.branchName', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountType">種別</Label>
              {/* 👇 为 onValueChange 的参数 'value' 添加 string 类型 */}
              <Select value={issuer.bankInfo.accountType} onValueChange={(value: string) => onFormChange('bankInfo.accountType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="種別を選択..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="普通">普通</SelectItem>
                  <SelectItem value="当座">当座</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountNumber">番号</Label>
              <Input id="accountNumber" type="text" value={issuer.bankInfo.accountNumber} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFormChange('bankInfo.accountNumber', e.target.value)} />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="accountHolder">口座名義</Label>
              <Input id="accountHolder" type="text" value={issuer.bankInfo.accountHolder} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFormChange('bankInfo.accountHolder', e.target.value)} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 border-t flex justify-end space-x-4">
        <Button variant="outline" onClick={onCancel}>キャンセル</Button>
        <Button onClick={onSave}>保存</Button>
      </div>
    </div>
  );
};

export default IssuerForm;