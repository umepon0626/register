import React, { useState, useMemo, useEffect } from 'react';
import { CashCounter } from './components/CashCounter';
import { Transactions } from './components/Transactions';
import { Summary } from './components/Summary';
import { HistoryTable } from './components/HistoryTable';
import { DENOMINATIONS } from './constants';
import type { DenominationCount, Transaction, HistoryEntry } from './types';

const App: React.FC = () => {
  const [counts, setCounts] = useState<DenominationCount>(
    DENOMINATIONS.reduce((acc, d) => ({ ...acc, [d.value]: 0 }), {} as DenominationCount)
  );
  const openingBalance = 74450;
  const [pcSales, setPcSales] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Load history from localStorage on initial render
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('cashReconciliationHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage", error);
      // If parsing fails, clear the corrupted data
      localStorage.removeItem('cashReconciliationHistory');
    }
  }, []);


  const totalCash = useMemo(() => {
    return DENOMINATIONS.reduce((sum, d) => sum + counts[d.value] * d.value, 0);
  }, [counts]);

  const totalExpenses = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalDeposits = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const netCashSales = useMemo(() => {
    return totalCash - openingBalance - totalExpenses + totalDeposits;
  }, [totalCash, openingBalance, totalExpenses, totalDeposits]);

  const difference = useMemo(() => {
    // Only calculate difference if there's a PC sale amount, otherwise it's just cash sales
    return pcSales > 0 ? netCashSales - pcSales : 0;
  }, [netCashSales, pcSales]);

  const handleSaveHistory = () => {
    const newEntry: HistoryEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      totalCash,
      pcSales,
      netCashSales,
      difference,
    };
    
    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    try {
      localStorage.setItem('cashReconciliationHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Failed to save history to localStorage", error);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('cashReconciliationHistory');
    } catch (error) {
      console.error("Failed to clear history from localStorage", error);
    }
  };

  const handleDeleteHistoryEntry = (id: string) => {
    const updatedHistory = history.filter((entry) => entry.id !== id);
    setHistory(updatedHistory);
    try {
        localStorage.setItem('cashReconciliationHistory', JSON.stringify(updatedHistory));
    } catch (error) {
        console.error("Failed to update history in localStorage", error);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-stone-800 text-center tracking-tight">レジ締め</h1>
          <p className="text-center text-stone-500 mt-2 text-lg">今日のレジ締めをはじめましょう！</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <CashCounter counts={counts} setCounts={setCounts} totalCash={totalCash} />
            <Transactions
              transactions={transactions}
              setTransactions={setTransactions}
              pcSales={pcSales}
              setPcSales={setPcSales}
            />
          </div>
          <div className="lg:col-span-1">
            <Summary
              totalCash={totalCash}
              openingBalance={openingBalance}
              pcSales={pcSales}
              totalExpenses={totalExpenses}
              totalDeposits={totalDeposits}
              netCashSales={netCashSales}
              difference={difference}
              onSaveHistory={handleSaveHistory}
            />
          </div>
        </main>

        <footer className="mt-8">
          <HistoryTable
            history={history}
            onClearHistory={handleClearHistory}
            onDeleteEntry={handleDeleteHistoryEntry}
          />
        </footer>
      </div>
    </div>
  );
};

export default App;