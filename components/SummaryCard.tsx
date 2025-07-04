import React, { useMemo } from 'react';

interface SummaryCardProps {
  title: string;
  amount: number;
  isDifference?: boolean;
  tooltip?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, isDifference = false, tooltip }) => {

  const { colorClass, sign } = useMemo(() => {
    if (!isDifference) {
      return { colorClass: 'text-cyan-400', sign: '' };
    }
    if (amount === 0) {
      return { colorClass: 'text-green-400', sign: '' };
    }
    if (amount > 0) {
      return { colorClass: 'text-yellow-400', sign: '+' };
    }
    return { colorClass: 'text-red-400', sign: '' };
  }, [amount, isDifference]);

  const formattedAmount = useMemo(() => {
    return `${sign}${amount.toLocaleString('ja-JP')}円`;
  }, [amount, sign]);

  return (
    <div className="flex justify-between items-center bg-gray-700/50 p-3 rounded-lg">
       <div className="flex items-center gap-2">
         <span className="text-gray-300 text-sm sm:text-base">{title}</span>
         {tooltip && (
          <div className="relative group flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 cursor-help"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-1.5 bg-gray-900 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {tooltip}
            </div>
          </div>
         )}
       </div>
       <span className={`font-mono font-bold text-lg ${colorClass}`}>
         {formattedAmount}
       </span>
     </div>
  );
};

export default SummaryCard;
