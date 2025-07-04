
import React, { useState, useMemo, useCallback } from 'react';
import { DENOMINATIONS } from './constants';
import { Denomination } from './types';

// --- Helper Components (defined outside App to prevent re-creation) ---

interface DenominationRowProps {
  denomination: Denomination;
  count: number;
  onCountChange: (value: number, count: number) => void;
}

const DenominationRow: React.FC<DenominationRowProps> = ({ denomination, count, onCountChange }) => {
  const subtotal = denomination.value * count;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCount = parseInt(e.target.value, 10) || 0;
    onCountChange(denomination.value, Math.max(0, newCount));
  };

  return (
    <div className="grid grid-cols-3 items-center gap-4 py-3 border-b border-slate-700">
      <div className="text-slate-300 font-medium">{denomination.label}</div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={count === 0 ? '' : count}
          onChange={handleInputChange}
          placeholder="0"
          className="w-full bg-slate-800 border border-slate-600 rounded-md px-3 py-1.5 text-right text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
        />
        <span className="text-slate-400 text-sm">枚/個</span>
      </div>
      <div className="text-right text-lg font-mono text-slate-200">
        ¥{subtotal.toLocaleString()}
      </div>
    </div>
  );
};

interface ResultsPanelProps {
    expectedSales: number;
    payouts: number;
    cashTotal: number;
    difference: number;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ expectedSales, payouts, cashTotal, difference }) => {
    const expectedCashInRegister = expectedSales - payouts;

    const getDifferenceInfo = () => {
        if (expectedSales === 0 && cashTotal === 0 && payouts === 0) {
            return {
                text: '入力待ち',
                bgColor: 'bg-slate-700',
                textColor: 'text-slate-300',
                message: 'まず売上や現金の情報を入力してください。'
            };
        }
        if (difference === 0) {
            return {
                text: '一致',
                bgColor: 'bg-emerald-500/20',
                textColor: 'text-emerald-400',
                message: '素晴らしい！金額は完全に一致しています。'
            };
        }
        if (difference > 0) {
            return {
                text: '過剰',
                bgColor: 'bg-amber-500/20',
                textColor: 'text-amber-400',
                message: `レジの現金が ¥${difference.toLocaleString()} 多いです。`
            };
        }
        return {
            text: '不足',
            bgColor: 'bg-rose-500/20',
            textColor: 'text-rose-400',
            message: `レジの現金が ¥${Math.abs(difference).toLocaleString()} 不足しています。`
        };
    };

    const diffInfo = getDifferenceInfo();

    return (
        <div className="bg-slate-800/50 rounded-lg p-6 flex flex-col gap-4 h-full">
            <h2 className="text-xl font-bold text-white border-b border-slate-700 pb-3">集計結果</h2>
            <div className="flex justify-between items-center text-md">
                <span className="text-slate-400">PC上の売上</span>
                <span className="font-mono text-white">¥{expectedSales.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-md">
                <span className="text-slate-400">支払い（経費など）</span>
                <span className="font-mono text-amber-400">- ¥{payouts.toLocaleString()}</span>
            </div>
             <div className="border-t border-slate-700 my-1"></div>
            <div className="flex justify-between items-center text-md font-semibold">
                <span className="text-slate-300">あるべき現金</span>
                <span className="font-mono text-white">¥{expectedCashInRegister.toLocaleString()}</span>
            </div>
             <div className="flex justify-between items-center text-md">
                <span className="text-slate-400">レジ内の現金合計</span>
                <span className="font-mono text-white">¥{cashTotal.toLocaleString()}</span>
            </div>
            <div className="border-t border-slate-700 my-2"></div>
            <div className={`p-4 rounded-lg flex flex-col items-center justify-center text-center ${diffInfo.bgColor}`}>
                <span className={`text-sm font-bold uppercase tracking-wider ${diffInfo.textColor}`}>{diffInfo.text}</span>
                 <p className={`text-4xl font-mono font-bold mt-1 ${diffInfo.textColor}`}>
                    {difference >= 0 ? '+' : '-'} ¥{Math.abs(difference).toLocaleString()}
                </p>
                <p className="mt-3 text-slate-300 text-sm">{diffInfo.message}</p>
            </div>
        </div>
    )
}

const ResetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 9a9 9 0 0114.65-4.65l-2.34 2.34A5.98 5.98 0 0012 8a6 6 0 00-6 6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 15a9 9 0 01-14.65 4.65l2.34-2.34A5.98 5.98 0 0012 16a6 6 0 006-6" />
    </svg>
);


// --- Main App Component ---

function App() {
  const [expectedSales, setExpectedSales] = useState<number>(0);
  const [payouts, setPayouts] = useState<number>(0);
  const [counts, setCounts] = useState<{ [key: number]: number }>(
    DENOMINATIONS.reduce((acc, den) => ({ ...acc, [den.value]: 0 }), {})
  );

  const handleSalesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value.replace(/,/g, ''), 10) || 0;
    setExpectedSales(Math.max(0, value));
  };
  
  const handlePayoutsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value.replace(/,/g, ''), 10) || 0;
    setPayouts(Math.max(0, value));
  };

  const handleCountChange = useCallback((value: number, count: number) => {
    setCounts(prevCounts => ({
      ...prevCounts,
      [value]: count,
    }));
  }, []);
  
  const handleReset = () => {
      setExpectedSales(0);
      setPayouts(0);
      setCounts(DENOMINATIONS.reduce((acc, den) => ({ ...acc, [den.value]: 0 }), {}));
  };

  const cashTotal = useMemo(() => {
    return DENOMINATIONS.reduce((sum, den) => {
      return sum + (counts[den.value] || 0) * den.value;
    }, 0);
  }, [counts]);
  
  const difference = useMemo(() => {
      const expectedCashInRegister = expectedSales - payouts;
      return cashTotal - expectedCashInRegister;
  }, [cashTotal, expectedSales, payouts]);

  const billDenominations = DENOMINATIONS.filter(d => d.type === 'bill');
  const coinDenominations = DENOMINATIONS.filter(d => d.type === 'coin');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">レジ締めチェッカー</h1>
              <p className="text-slate-400 mt-1">日々のレジ締め作業を、素早く、正確に。</p>
          </div>
          <button 
            onClick={handleReset}
            className="flex items-center bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 ease-in-out shadow-md hover:shadow-lg"
          >
              <ResetIcon />
              リセット
          </button>
        </header>
        
        <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Left Side: Cash Input */}
          <div className="lg:col-span-3 bg-slate-800/50 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white border-b border-slate-700 pb-3 mb-4">レジ内現金入力</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <div>
                    <h3 className="text-lg font-semibold text-cyan-400 mb-2">紙幣</h3>
                    <div className="flex flex-col gap-2">
                        {billDenominations.map(den => (
                            <DenominationRow 
                                key={den.value} 
                                denomination={den} 
                                count={counts[den.value] || 0}
                                onCountChange={handleCountChange}
                            />
                        ))}
                    </div>
                </div>
                 <div className="mt-6 md:mt-0">
                    <h3 className="text-lg font-semibold text-cyan-400 mb-2">硬貨</h3>
                     <div className="flex flex-col gap-2">
                        {coinDenominations.map(den => (
                            <DenominationRow 
                                key={den.value} 
                                denomination={den} 
                                count={counts[den.value] || 0}
                                onCountChange={handleCountChange}
                            />
                        ))}
                    </div>
                </div>
            </div>
          </div>
          
          {/* Right Side: Sales & Results */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="bg-slate-800/50 rounded-lg p-6 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-3">PC上の売上入力</h2>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">¥</span>
                    <input 
                        type="text"
                        value={expectedSales === 0 ? '' : expectedSales.toLocaleString()}
                        onChange={handleSalesChange}
                        placeholder="0"
                        className="w-full bg-slate-800 border border-slate-600 rounded-md pl-8 pr-4 py-3 text-2xl font-mono text-right text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                    />
                </div>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-6 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-3">支払い（経費など）入力</h2>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">¥</span>
                    <input 
                        type="text"
                        value={payouts === 0 ? '' : payouts.toLocaleString()}
                        onChange={handlePayoutsChange}
                        placeholder="0"
                        className="w-full bg-slate-800 border border-slate-600 rounded-md pl-8 pr-4 py-3 text-2xl font-mono text-right text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                    />
                </div>
            </div>

            <ResultsPanel 
                expectedSales={expectedSales}
                payouts={payouts}
                cashTotal={cashTotal}
                difference={difference}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
