import React from 'react';
import type { HistoryEntry } from '../types';
import { TrashIcon } from './icons';

interface HistoryTableProps {
  history: HistoryEntry[];
  onClearHistory: () => void;
  onDeleteEntry: (id: string) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(value);
};

const formatTimestamp = (isoString: string) => {
    return new Date(isoString).toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const HistoryTable: React.FC<HistoryTableProps> = ({ history, onClearHistory, onDeleteEntry }) => {

    const handleClearClick = () => {
        if (window.confirm('本当にすべての履歴を削除しますか？この操作は元に戻せません。')) {
            onClearHistory();
        }
    }

    const handleDeleteEntryClick = (id: string) => {
        if (window.confirm('この履歴を1件削除しますか？')) {
            onDeleteEntry(id);
        }
    }

    if (history.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-lg shadow-sky-100 p-6">
                 <h2 className="text-2xl font-bold text-stone-800 mb-4">📜 保存履歴</h2>
                 <div className="text-center py-10">
                    <p className="text-stone-500 text-lg">保存された履歴はありません。</p>
                 </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg shadow-sky-100 p-6">
            <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-stone-800">📜 保存履歴</h2>
                <button
                    onClick={handleClearClick}
                    className="px-4 py-2 bg-rose-500 text-white font-semibold rounded-lg shadow-md hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all"
                >
                    履歴を全削除
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left table-auto">
                    <thead className="bg-sky-50 text-sky-800">
                        <tr>
                            <th className="px-4 py-3 font-semibold rounded-tl-lg">日時</th>
                            <th className="px-4 py-3 font-semibold text-right">現金合計</th>
                            <th className="px-4 py-3 font-semibold text-right">PC売上</th>
                            <th className="px-4 py-3 font-semibold text-right">純売上(現金)</th>
                            <th className="px-4 py-3 font-semibold text-right">差額</th>
                            <th className="px-4 py-3 font-semibold text-center rounded-tr-lg">削除</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-sky-100">
                        {history.map(entry => (
                            <tr key={entry.id} className="hover:bg-sky-50/50 transition-colors">
                                <td className="px-4 py-3 text-stone-600 whitespace-nowrap">{formatTimestamp(entry.timestamp)}</td>
                                <td className="px-4 py-3 text-stone-800 font-mono text-right">{formatCurrency(entry.totalCash)}</td>
                                <td className="px-4 py-3 text-stone-800 font-mono text-right">{formatCurrency(entry.pcSales)}</td>
                                <td className="px-4 py-3 text-stone-800 font-mono text-right">{formatCurrency(entry.netCashSales)}</td>
                                <td className={`px-4 py-3 font-mono font-bold text-right ${entry.difference === 0 ? 'text-teal-600' : 'text-rose-600'}`}>
                                    {formatCurrency(entry.difference)}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <button 
                                        onClick={() => handleDeleteEntryClick(entry.id)}
                                        className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                                        aria-label={`${formatTimestamp(entry.timestamp)}の履歴を削除`}
                                    >
                                        <TrashIcon className="h-5 w-5"/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};