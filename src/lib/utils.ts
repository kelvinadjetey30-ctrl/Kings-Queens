import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function formatGHS(n: number) { return `GHS ${n.toFixed(2)}`; }
export function toWaLink(phone: string, text?: string) {
  const digits = phone.replace(/\D/g, '');
  const intl = digits.startsWith('0') ? `233${digits.slice(1)}` : digits.startsWith('233') ? digits : `233${digits}`;
  return `https://wa.me/${intl}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}
export function isGhanaPhone(p: string) { return /^0[0-9]{9}$/.test(p.replace(/\s/g, '')); }
export function generateOrderId() { return `ELT-${Math.floor(10000 + Math.random() * 90000)}`; }
