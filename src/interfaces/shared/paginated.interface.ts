import type {Page} from "./page.interface";

export interface Paginated<T> {
  content: T[];
  page: Page;
}
