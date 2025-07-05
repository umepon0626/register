
import React from 'react';
import { DENOMINATIONS } from '../constants';
import type { Denomination, DenominationCount } from '../types';

interface CashCounterProps {
  counts: DenominationCount;
  setCounts: React.Dispatch<React.SetStateAction<DenominationCount>>;
  totalCash: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(value);
};

// For Enter key navigation, this defines the order
const orderedDenominations = DENOMINATIONS.map(d => d.value);

export const CashCounter: React.FC<CashCounterProps> = ({ counts, setCounts, totalCash }) => {
  const handleCountChange = (value: number, key: number) => {
    setCounts(prev => ({ ...prev, [key]: value }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, value: Denomination) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const currentIndex = orderedDenominations.indexOf(value);
      const nextIndex = currentIndex + 1;
      
      if (nextIndex < orderedDenominations.length) {
        const nextDenominationValue = orderedDenominations[nextIndex];
        const nextInput = document.getElementById(`denomination-input-${nextDenominationValue}`);
        nextInput?.focus();
      } else {
        // Focus the next logical input outside this component
        const pcSalesInput = document.getElementById('pc-sales-input');
        pcSalesInput?.focus();
      }
    }
  };

  const bills = DENOMINATIONS.filter(d => !d.isCoin);
  const coins = DENOMINATIONS.filter(d => d.isCoin);

  const renderInputs = (items: typeof bills) => {
    return items.map(({ value, label }) => (
      <div key={value} className="flex items-center space-x-4">
        <label htmlFor={`denomination-input-${value}`} className="w-28 text-stone-600 font-medium text-right">{label}</label>
        <input
          id={`denomination-input-${value}`}
          type="number"
          min="0"
          value={counts[value] === 0 ? '' : counts[value]}
          onChange={(e) => handleCountChange(parseInt(e.target.value) || 0, value)}
          onKeyDown={(e) => handleKeyDown(e, value as Denomination)}
          className="flex-1 w-full px-3 py-2 bg-pink-50/60 border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 text-right"
          placeholder="0"
        />
        <span className="w-24 text-stone-500 text-right">
          {formatCurrency(counts[value] * value)}
        </span>
      </div>
    ));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-pink-100 overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-stone-800 mb-1">💰 レジ内現金</h2>
        <p className="text-stone-500 mb-6">各金種の枚数を入力してください。</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-stone-700 border-b-2 border-pink-200 pb-2 mb-4">紙幣</h3>
                {renderInputs(bills)}
            </div>
            <div className="space-y-4">
                 <h3 className="text-lg font-semibold text-stone-700 border-b-2 border-pink-200 pb-2 mb-4">硬貨</h3>
                {renderInputs(coins)}
            </div>
        </div>
      </div>
      <div className="bg-pink-100/60 px-6 py-4 border-t border-pink-200">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-stone-700">現金合計</span>
          <span className="text-2xl font-bold text-pink-600 tracking-tight">
            {formatCurrency(totalCash)}
          </span>
        </div>
      </div>
    </div>
  );
};