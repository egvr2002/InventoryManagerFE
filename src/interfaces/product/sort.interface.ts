export interface Sort {
  field: string;
  order: Order;
}

export type Order = "asc" | "desc";
