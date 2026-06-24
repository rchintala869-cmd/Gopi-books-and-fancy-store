export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  address?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  deliveryMode: string;
  paymentMode: string;
  customerDetails: CustomerDetails;
  status?: 'Pending' | 'Shipped' | 'Delivered';
}
