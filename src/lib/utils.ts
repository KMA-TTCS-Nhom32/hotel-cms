import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatCurrency(numberString: string | number) {
  return Number(numberString).toLocaleString('vi', {
    style: 'currency',
    currency: 'VND',
  });
}
