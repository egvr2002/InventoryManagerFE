export interface SearchFilters {
  name?: string;
  category?: string;
  availability?: Availability;
}

export type Availability = "in_stock" | "out_of_stock" | "all";
