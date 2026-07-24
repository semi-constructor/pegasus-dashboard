import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number | string): string {
  if (num === null || num === undefined) return "0";
  const parsed = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(parsed)) return "0";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(parsed);
}
