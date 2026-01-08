import Product from "./Product";

export default interface Cart {
  _id?: string;
  userId: string;
  products: CartProduct[];
  isActive: boolean;
}

export interface CartProduct {
  productId: string;
  quantity: number;
}
