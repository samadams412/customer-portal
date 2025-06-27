import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


/**
 * Formats a number as a currency string (e.g., $12.34).
 * @param price The number to format.
 * @param options Intl.NumberFormatOptions for currency formatting.
 * @returns Formatted currency string.
 */
export function formatPrice(
  price: number,
  options: {
    currency?: 'USD' | 'EUR' | 'GBP'; // Extend as needed
    notation?: Intl.NumberFormatOptions['notation'];
  } = {}
) {
  const { currency = 'USD', notation = 'standard' } = options;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation,
  }).format(price);
}
