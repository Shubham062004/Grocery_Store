import { Product } from '@/context/CartContext';

// Export product categories
export const productCategories = ['Dairy', 'Bakery', 'Beverages', 'Snacks', 'Fruits', 'Vegetables'];

// Check if there are custom products in localStorage
const loadCustomProducts = (): Product[] => {
  try {
    const customProducts = localStorage.getItem('custom-products');
    if (customProducts) {
      return JSON.parse(customProducts);
    }
  } catch (error) {
    console.error('Error loading custom products:', error);
  }
  return [];
};

// Base products
export const baseProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Milk (1L)',
    price: 60,
    image: 'https://images.unsplash.com/photo-1563720379700-4918ba56c99c?auto=format&fit=crop&q=80&w=500&h=500',
    category: 'Dairy',
    unit: '1L'
  },
  {
    id: 'prod-2',
    name: 'Bread (400g)',
    price: 40,
    image: 'https://images.unsplash.com/photo-1546845245-5968033e7cc1?auto=format&fit=crop&q=80&w=500&h=500',
    category: 'Bakery',
    unit: '400g'
  },
  {
    id: 'prod-3',
    name: 'Eggs (12)',
    price: 90,
    image: 'https://images.unsplash.com/photo-1615886799489-b300b04caaff?auto=format&fit=crop&q=80&w=500&h=500',
    category: 'Dairy',
    unit: '12'
  },
  {
    id: 'prod-4',
    name: 'Potato Chips (200g)',
    price: 55,
    image: 'https://images.unsplash.com/photo-1599491558638-55539a96d368?auto=format&fit=crop&q=80&w=500&h=500',
    category: 'Snacks',
    unit: '200g'
  },
  {
    id: 'prod-5',
    name: 'Coca-Cola (2L)',
    price: 80,
    image: 'https://images.unsplash.com/photo-1622541863375-c5e9c3b989ca?auto=format&fit=crop&q=80&w=500&h=500',
    category: 'Beverages',
    unit: '2L'
  },
  {
    id: 'prod-6',
    name: 'Apples (1kg)',
    price: 120,
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&q=80&w=500&h=500',
    category: 'Fruits',
    unit: '1kg'
  },
  {
    id: 'prod-7',
    name: 'Carrots (500g)',
    price: 45,
    image: 'https://images.unsplash.com/photo-1560181927-9ce54892b798?auto=format&fit=crop&q=80&w=500&h=500',
    category: 'Vegetables',
    unit: '500g'
  },
  {
    id: 'prod-8',
    name: 'Chocolate Cake (500g)',
    price: 250,
    image: 'https://images.unsplash.com/photo-1616549937036-95c5343515ca?auto=format&fit=crop&q=80&w=500&h=500',
    category: 'Bakery',
    unit: '500g'
  },
  {
    id: 'prod-9',
    name: 'Orange Juice (1L)',
    price: 110,
    image: 'https://images.unsplash.com/photo-1548589317-14754a399834?auto=format&fit=crop&q=80&w=500&h=500',
    category: 'Beverages',
    unit: '1L'
  },
  {
    id: 'prod-10',
    name: 'Mixed Nuts (250g)',
    price: 180,
    image: 'https://images.unsplash.com/photo-1608686268482-9f519b1c3a5d?auto=format&fit=crop&q=80&w=500&h=500',
    category: 'Snacks',
    unit: '250g'
  }
];

// Get all products including custom ones
export const allProducts: Product[] = [...baseProducts, ...loadCustomProducts()];

// Helper function to refresh product list (called after adding new products)
export const refreshProducts = (): Product[] => {
  const custom = loadCustomProducts();
  return [...baseProducts, ...custom];
};
