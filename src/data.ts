import { Product } from './types';

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Leather Notebook',
    description: 'High-quality A5 dotted notebook, perfect for bullet journaling and daily notes.',
    price: 350,
    category: 'Books',
    imageUrl: 'https://images.unsplash.com/photo-1531346878377-a541e4a0ecce?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    name: 'Crystal Desk Lamp',
    description: 'Elegant crystal LED lamp with touch control. Great for study tables.',
    price: 899,
    category: 'Fancy Items',
    imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    name: 'Luxury Fountain Pen Set',
    description: 'Professional fountain pen set with 3 elegant ink colors. Ideal for gifting.',
    price: 550,
    category: 'Stationery',
    imageUrl: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '4',
    name: 'Kids Superhero Backpack',
    description: 'Colorful, waterproof and durable backpack for kids.',
    price: 650,
    category: 'Fancy Items',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '5',
    name: 'Story Book Collection (Set of 5)',
    description: 'Engaging moral stories for kids with beautiful illustrations.',
    price: 499,
    category: 'Books',
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '6',
    name: 'Premium Gift Box',
    description: 'Customizable assorted gift box for birthdays and anniversaries.',
    price: 1200,
    category: 'Gifts',
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800'
  }
];

export const CATEGORIES = ['All', 'Books', 'Stationery', 'Fancy Items', 'Gifts'];
