import type { Denomination } from './types';

interface DenominationInfo {
  value: Denomination;
  label: string;
  isCoin: boolean;
}

export const DENOMINATIONS: DenominationInfo[] = [
  { value: 10000, label: '10,000円札', isCoin: false },
  { value: 5000, label: '5,000円札', isCoin: false },
  { value: 1000, label: '1,000円札', isCoin: false },
  { value: 500, label: '500円玉', isCoin: true },
  { value: 100, label: '100円玉', isCoin: true },
  { value: 50, label: '50円玉', isCoin: true },
  { value: 10, label: '10円玉', isCoin: true },
  { value: 5, label: '5円玉', isCoin: true },
  { value: 1, label: '1円玉', isCoin: true },
];
