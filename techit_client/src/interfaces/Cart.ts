import Product from "./Product";

export default interface Cart {
  id?: string;
  userId: string;
  products: Product[];
  active: boolean;
}
