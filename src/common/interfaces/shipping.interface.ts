export interface Shipping {
  id: number;
  name: string;
  price: string;
  discount: string;
  currency: string;
  delivery_range: {
    min: number;
    max: number;
  };
  company: {
    id: number;
    name: string;
  };
}
