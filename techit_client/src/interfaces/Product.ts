export default interface Product {
  id?: string;
  _id?: string;  // MongoDB uses _id
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  quantity?: number;
}
