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
