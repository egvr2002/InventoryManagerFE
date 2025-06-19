import type {Page} from "./page.interface";

export interface PaginatedResponse<T> {
  content: T[];
  page: Page;
}
