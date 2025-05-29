import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format tanggal dari ISO string ke format yang lebih mudah dibaca
export function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Format waktu dari ISO string
export function formatTime(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(dateString).toLocaleTimeString('id-ID', options);
}
