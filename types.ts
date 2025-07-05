export type Denomination = 10000 | 5000 | 1000 | 500 | 100 | 50 | 10 | 5 | 1;

export type DenominationCount = {
  [key in Denomination]: number;
};

export type TransactionType = 'expense' | 'deposit';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
}

export interface HistoryEntry {
  id: string;
  timestamp: string;
  totalCash: number;
  pcSales: number;
  netCashSales: number;
  difference: number;
}
