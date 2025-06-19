export interface Product {
  id: string;
  name: string;
  category: string;
  unitPrice: number;
  expirationDate: Date;
  quantityInStock: number;
  createdAt: Date;
  updatedAt: Date;
}
