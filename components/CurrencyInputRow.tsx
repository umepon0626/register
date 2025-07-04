
import React, { useMemo } from 'react';

interface CurrencyInputRowProps {
  denomination: number;
  count: number;
  onCountChange: (denomination: number, count: number) => void;
  isBill: boolean;
}

const CurrencyInputRow: React.FC<CurrencyInputRowProps> = ({ denomination, count, onCountChange, isBill }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onCountChange(denomination, isNaN(value) || value < 0 ? 0 : value);
  };

  const subtotal = useMemo(() => denomination * count, [denomination, count]);
  const formattedDenomination = useMemo(() => denomination.toLocaleString('ja-JP'), [denomination]);
  const formattedSubtotal = useMemo(() => subtotal.toLocaleString('ja-JP'), [subtotal]);

  const Icon: React.FC<{isBill: boolean}> = ({ isBill }) => (
    <div className={`w-6 h-6 flex items-center justify-center rounded ${isBill ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
      {isBill ? 
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="12" x="2" y="6" rx="2" /><circle cx="12" cy="12" r="2" /></svg>
        :
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v12" /><path d="M16 8v2a2 2 0 0 1-2 2H8" /></svg>
      }
    </div>
  );

  return (
    <div className="grid grid-cols-12 gap-2 items-center">
      <label htmlFor={`denom-${denomination}`} className="col-span-4 flex items-center gap-2 text-gray-300 text-sm sm:text-base">
        <Icon isBill={isBill} />
        {formattedDenomination}円
      </label>
      <div className="col-span-3">
        <input
          type="number"
          id={`denom-${denomination}`}
          value={count === 0 ? '' : count}
          onChange={handleInputChange}
          placeholder="0"
          className="w-full bg-gray-700 border border-gray-600 rounded-md py-1.5 px-2 text-right text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors"
          min="0"
          step="1"
        />
      </div>
      <span className="col-span-1 text-center text-gray-400 text-sm sm:text-base">枚</span>
      <span className="col-span-4 text-right text-gray-100 font-mono text-sm sm:text-base pr-1">
        {formattedSubtotal}円
      </span>
    </div>
  );
};

export default React.memo(CurrencyInputRow);
