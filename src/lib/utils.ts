import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPaginationNumbers(currentPage: number, totalPages: number) {
  // Show all pages if total pages is less or equal than 4.
  // 1, 2, 3, 4
  if (totalPages <= 4) {
    return Array.from({length: totalPages}, (_, i) => i + 1);
  }

  // Show the current page if it's between 0 and 3, then only show
  // the last pages
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // Show the last pages if the current page is near to the last page.
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // Show the current page and it's neighbours if it's in the middle.
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
