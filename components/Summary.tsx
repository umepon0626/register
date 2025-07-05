import React from 'react';
import { CheckCircleIcon, ExclamationCircleIcon } from './icons';

interface SummaryProps {
  totalCash: number;
  openingBalance: number;
  pcSales: number;
  totalExpenses: number;
  totalDeposits: number;
  netCashSales: number;
  difference: number;
  onSaveHistory: () => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(value);
};

const CalculationRow: React.FC<{ label: string; value: number; sign?: '+' | '-'; colorClass?: string; isBold?: boolean }> = 
  ({ label, value, sign, colorClass = 'text-stone-800', isBold = false }) => (
  <div className={`flex justify-between items-center py-2 ${isBold ? 'font-bold' : ''}`}>
    <div className="flex items-center">
      {sign && <span className={`mr-2 font-mono ${sign === '-' ? 'text-orange-500' : 'text-teal-500'}`}>{sign}</span>}
      <span className="text-stone-600">{label}</span>
    </div>
    <span className={`${colorClass} font-mono tracking-tighter`}>{formatCurrency(value)}</span>
  </div>
);

export const Summary: React.FC<SummaryProps> = ({
  totalCash,
  openingBalance,
  pcSales,
  totalExpenses,
  totalDeposits,
  netCashSales,
  difference,
  onSaveHistory
}) => {
  const isMatch = difference === 0 && pcSales > 0;
  const isNoPcSales = pcSales <= 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-amber-100 sticky top-8">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-stone-800 mb-4 text-center">✨ 計算結果</h2>
        
        <div className="space-y-1 border-b border-amber-200 pb-4 mb-4">
          <h3 className="font-bold text-lg text-stone-700 mb-2">純売上（現金ベース）</h3>
          <CalculationRow label="レジ内現金合計" value={totalCash} colorClass="text-stone-900" />
          {openingBalance > 0 && <CalculationRow label="初期レジ金" value={openingBalance} sign="-" colorClass="text-orange-500" />}
          {totalExpenses > 0 && <CalculationRow label="支出合計" value={totalExpenses} sign="-" colorClass="text-orange-500" />}
          {totalDeposits > 0 && <CalculationRow label="入金合計" value={totalDeposits} sign="+" colorClass="text-teal-500" />}
        </div>

        <div className="flex justify-between items-center py-3 bg-amber-100/60 rounded-lg px-4 mb-4">
          <span className="text-lg font-bold text-stone-800">純売上金額</span>
          <span className="text-2xl font-bold text-amber-600">{formatCurrency(netCashSales)}</span>
        </div>
        
        <div className="space-y-1 border-t border-amber-200 pt-4">
           <h3 className="font-bold text-lg text-stone-700 mb-2">PC売上との照合</h3>
           <CalculationRow label="純売上（現金）" value={netCashSales} colorClass="text-stone-900" />
           {pcSales > 0 && <CalculationRow label="PC上の売上" value={pcSales} sign="-" colorClass="text-orange-500" />}
        </div>

      </div>
      
      <div className={`p-6 rounded-b-2xl border-t-4
        ${isNoPcSales ? 'bg-sky-50 border-sky-400' :
          isMatch ? 'bg-teal-50 border-teal-400' : 'bg-rose-50 border-rose-400'}`}>
        <div className="text-center">
          <div className="flex items-center justify-center">
            {isNoPcSales ? 
                <span className="text-lg font-bold text-sky-800">PC売上を入力してください</span> :
              isMatch ? 
                <CheckCircleIcon className="w-8 h-8 mr-3 text-teal-500"/> :
                <ExclamationCircleIcon className="w-8 h-8 mr-3 text-rose-500"/>
            }
            <span className={`text-2xl font-bold
              ${isMatch ? 'text-teal-600' : 'text-rose-600'}
              ${isNoPcSales && 'hidden'}`}>
              差額
            </span>
          </div>
          <p className={`text-5xl font-bold tracking-tight mt-2 
            ${isNoPcSales ? 'text-sky-600' : 
              isMatch ? 'text-teal-600' : 'text-rose-600'}`}>
            {isNoPcSales ? formatCurrency(netCashSales) : formatCurrency(difference)}
          </p>
          {isMatch && <p className="mt-2 text-xl font-semibold text-teal-700">一致しました！🎉</p>}

          <div className="mt-6 text-center">
            <button
                onClick={onSaveHistory}
                disabled={isNoPcSales}
                className="px-6 py-3 bg-amber-400 text-white font-bold rounded-lg shadow-md hover:bg-amber-500 disabled:bg-stone-300 disabled:cursor-not-allowed disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400 transition-all"
            >
                この結果を保存する
            </button>
            {isNoPcSales && <p className="text-xs text-stone-400 mt-2">PC売上入力後に保存できます</p>}
        </div>
        </div>
      </div>
    </div>
  );
};
