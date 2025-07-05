
import React, { useState } from 'react';
import type { Transaction } from '../types';
import { PlusCircleIcon, MinusCircleIcon, TrashIcon } from './icons';

interface TransactionsProps {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  pcSales: number;
  setPcSales: React.Dispatch<React.SetStateAction<number>>;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('ja-JP').format(value);
};

export const Transactions: React.FC<TransactionsProps> = ({
  transactions,
  setTransactions,
  pcSales,
  setPcSales
}) => {
  const [amount, setAmount] = useState<number | ''>('');

  const addTransaction = (type: 'deposit' | 'expense') => {
    if (!amount) {
      alert('金額を入力してください。');
      return;
    }
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      amount: Number(amount),
      type,
    };
    setTransactions(prev => [...prev, newTransaction]);
    setAmount('');
  };

  const removeTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-purple-100 p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-stone-800 mb-4">📋 売上とその他取引</h2>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label htmlFor="pc-sales-input" className="w-32 text-stone-600 font-medium shrink-0">PC上の売上金額</label>
            <div className="relative flex-grow">
                 <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-500">¥</span>
                <input
                    id="pc-sales-input"
                    type="number"
                    value={pcSales === 0 ? '' : pcSales}
                    onChange={(e) => setPcSales(parseInt(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2 bg-purple-50/60 border border-purple-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                    placeholder="例: 125000"
                />
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-purple-200 pt-6">
         <h3 className="text-xl font-bold text-stone-700 mb-4">過不足の調整</h3>
        <div className="space-y-3 mb-4">
          {transactions.map(t => (
            <div key={t.id} className={`flex items-center p-3 rounded-lg ${t.type === 'expense' ? 'bg-orange-50 text-orange-800' : 'bg-teal-50 text-teal-800'}`}>
              {t.type === 'expense' ? <MinusCircleIcon className="h-5 w-5 mr-3 text-orange-400 shrink-0"/> : <PlusCircleIcon className="h-5 w-5 mr-3 text-teal-500 shrink-0"/>}
              <span className="flex-grow font-medium">{t.type === 'expense' ? 'レジ内に多い' : 'レジ内に少ない'}</span>
              <span className="font-mono font-semibold mx-4">{t.type === 'expense' ? '-' : '+'} {formatCurrency(t.amount)} 円</span>
              <button onClick={() => removeTransaction(t.id)} className="text-stone-400 hover:text-rose-600 transition-colors">
                <TrashIcon className="h-5 w-5"/>
              </button>
            </div>
          ))}
          {transactions.length === 0 && <p className="text-stone-400 text-center py-4">調整入力はありません</p>}
        </div>

        <div className="bg-purple-100/50 p-4 rounded-lg border border-purple-200">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
                <div className="flex-grow">
                    <label htmlFor="transaction-amount" className="block text-sm font-medium text-stone-600 mb-1">金額</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-500">¥</span>
                        <input id="transaction-amount" type="number" value={amount} onChange={e => setAmount(e.target.value === '' ? '' : parseInt(e.target.value))} className="w-full pl-7 pr-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" placeholder="例: 3000" />
                    </div>
                </div>
                <div className="flex justify-end items-end space-x-3 shrink-0">
                    <button onClick={() => addTransaction('expense')} className="flex items-center justify-center px-4 py-2 bg-orange-400 text-white font-semibold rounded-lg shadow-md hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 transition-all w-full sm:w-auto">
                        <MinusCircleIcon className="w-5 h-5 mr-2" />レジ内に多い
                    </button>
                    <button onClick={() => addTransaction('deposit')} className="flex items-center justify-center px-4 py-2 bg-teal-400 text-white font-semibold rounded-lg shadow-md hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400 transition-all w-full sm:w-auto">
                        <PlusCircleIcon className="w-5 h-5 mr-2" />レジ内に少ない
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};