
import React, { useState, useMemo, useCallback } from 'react';
import { BILLS, COINS } from './constants';
import CurrencyInputRow from './components/CurrencyInputRow';
import SummaryCard from './components/SummaryCard';
import InputField from './components/InputField';

const App: React.FC = () => {
  const [counts, setCounts] = useState<Record<number, number>>(() => {
    const allDenominations = [...BILLS, ...COINS];
    return allDenominations.reduce((acc, denomination) => {
      acc[denomination] = 0;
      return acc;
    }, {} as Record<number, number>);
  });

  const [recordedSalesStr, setRecordedSalesStr] = useState('0');
  const [expensesStr, setExpensesStr] = useState('0');
  const [initialCashStr, setInitialCashStr] = useState('73430');

  const handleCountChange = useCallback((denomination: number, count: number) => {
    setCounts(prevCounts => ({
      ...prevCounts,
      [denomination]: count,
    }));
  }, []);

  const { totalCashInRegister, netCashSales, difference } = useMemo(() => {
    const totalCashInRegister = [...BILLS, ...COINS].reduce((sum, denomination) => {
      return sum + (counts[denomination] || 0) * denomination;
    }, 0);

    const recordedSales = parseFloat(recordedSalesStr) || 0;
    const expenses = parseFloat(expensesStr) || 0;
    const initialCash = parseFloat(initialCashStr) || 0;

    const netCashSales = totalCashInRegister - initialCash + expenses;
    const difference = netCashSales - recordedSales;

    return { totalCashInRegister, netCashSales, difference };
  }, [counts, recordedSalesStr, expensesStr, initialCashStr]);
  
  const resetAll = useCallback(() => {
    setCounts(prev => Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}));
    setRecordedSalesStr('0');
    setExpensesStr('0');
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400">現金売上確認</h1>
            <p className="text-gray-400 mt-1">レジ締め作業を迅速かつ正確に</p>
          </div>
          <button
            onClick={resetAll}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M21 21v-5h-5"/></svg>
            リセット
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Cash Counting */}
          <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 border-b-2 border-gray-700 pb-3 text-cyan-300">現金集計</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <h3 className="text-xl font-medium text-gray-300 mb-4">紙幣</h3>
                <div className="space-y-3">
                  {BILLS.map(bill => (
                    <CurrencyInputRow
                      key={bill}
                      denomination={bill}
                      count={counts[bill]}
                      onCountChange={handleCountChange}
                      isBill={true}
                    />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-300 mb-4">硬貨</h3>
                <div className="space-y-3">
                  {COINS.map(coin => (
                    <CurrencyInputRow
                      key={coin}
                      denomination={coin}
                      count={counts[coin]}
                      onCountChange={handleCountChange}
                      isBill={false}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inputs and Summary */}
          <div className="space-y-8">
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold mb-6 border-b-2 border-gray-700 pb-3 text-cyan-300">データ入力</h2>
              <div className="space-y-4">
                <InputField
                  id="recorded-sales"
                  label="PC上の売上"
                  value={recordedSalesStr}
                  onChange={e => setRecordedSalesStr(e.target.value)}
                />
                <InputField
                  id="expenses"
                  label="現金での出費"
                  value={expensesStr}
                  onChange={e => setExpensesStr(e.target.value)}
                />
                <InputField
                  id="initial-cash"
                  label="当初の準備金"
                  value={initialCashStr}
                  onChange={e => setInitialCashStr(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold mb-6 border-b-2 border-gray-700 pb-3 text-cyan-300">集計結果</h2>
              <div className="space-y-4">
                <SummaryCard title="レジ内の現金合計" amount={totalCashInRegister} />
                <SummaryCard 
                    title="純粋な売上金額" 
                    amount={netCashSales}
                    tooltip="(現金合計 - 準備金) + 出費"
                 />
                <SummaryCard title="差額" amount={difference} isDifference={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
