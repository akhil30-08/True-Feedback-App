import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const baseURI =
  process.env.NODE_ENV === 'production'
    ? 'https://true-feedback-app.vercel.app'
    : 'http://localhost:3000';
