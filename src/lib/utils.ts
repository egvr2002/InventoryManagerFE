import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";

import type {Sort} from "@/interfaces/product/sort.interface";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPaginationNumbers(currentPage: number, totalPages: number) {
  if (totalPages <= 4) {
    return Array.from({length: totalPages}, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}

export function generateSortParams(sort: Sort[]): string {
  return sort.reduce(
    (acc, current) => acc + `&sort=${current.field},${current.order}`,
    "",
  );
}

export function formatCurrency(
  amount: number,
  currency = "USD",
  locale = "en-US",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDate(date: Date | string, locale = "en-US"): string {
  let dateObj: Date;

  if (typeof date === "string") {
    if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = date.split("-").map(Number);
      dateObj = new Date(year, month - 1, day);
    } else {
      dateObj = new Date(date);
    }
  } else {
    dateObj = date;
  }

  if (isNaN(dateObj.getTime())) {
    return "Invalid Date";
  }

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(dateObj);
}

export function getDaysUntilExpiration(
  expirationDate: Date | string,
): number | null {
  if (!expirationDate) return null;

  const today = new Date();
  let expDate: Date;

  if (typeof expirationDate === "string") {
    // Handle date strings that might be in YYYY-MM-DD format
    if (expirationDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = expirationDate.split("-").map(Number);
      expDate = new Date(year, month - 1, day); // month is 0-indexed
    } else {
      expDate = new Date(expirationDate);
    }
  } else {
    expDate = expirationDate;
  }

  const diffTime = expDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
