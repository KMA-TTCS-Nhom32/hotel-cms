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

export function formatDateTime(date: string | Date) {
  return new Date(date).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
