
import { Denomination } from './types';

export const DENOMINATIONS: Denomination[] = [
  { label: '10,000円札', value: 10000, type: 'bill' },
  { label: '5,000円札', value: 5000, type: 'bill' },
  { label: '2,000円札', value: 2000, type: 'bill' },
  { label: '1,000円札', value: 1000, type: 'bill' },
  { label: '500円玉', value: 500, type: 'coin' },
  { label: '100円玉', value: 100, type: 'coin' },
  { label: '50円玉', value: 50, type: 'coin' },
  { label: '10円玉', value: 10, type: 'coin' },
  { label: '5円玉', value: 5, type: 'coin' },
  { label: '1円玉', value: 1, type: 'coin' },
];
