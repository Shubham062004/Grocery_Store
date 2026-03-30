import React, { createContext, useContext, useState, useEffect } from 'react';
import { orderService } from '@/services/api';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  unit: string;
  description?: string;
  expiration?: string;
  ingredients?: string;
  nutritionalInfo?: Record<string, string>;
  dietaryInfo?: string;
  packagingInfo?: string;
  storageInstructions?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  totalPrice: number;
  qualifiesForFreeDelivery: boolean;
  deliveryFee: number;
  amountAwayFromFreeDelivery: number;
  shippingAddress: string;
  paymentMethod: string;
  checkout: () => Promise<any>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Constants
const DELIVERY_THRESHOLD = 150;
const STANDARD_DELIVERY_FEE = 40;
const CART_STORAGE_KEY = 'grocery-cart-items';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [qualifiesForFreeDelivery, setQualifiesForFreeDelivery] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(STANDARD_DELIVERY_FEE);
  const [amountAwayFromFreeDelivery, setAmountAwayFromFreeDelivery] = useState(DELIVERY_THRESHOLD);
  const [shippingAddress, setShippingAddress] = useState('123 Main St, Mumbai, India');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  // Load cart from localStorage on initial mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [items]);
  
  // Calculate totals whenever cart items change
  useEffect(() => {
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const price = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    
    setTotalItems(itemCount);
    setTotalPrice(price);
    
    // Check for free delivery qualification
    const qualifies = price >= DELIVERY_THRESHOLD;
    setQualifiesForFreeDelivery(qualifies);
    setDeliveryFee(qualifies ? 0 : STANDARD_DELIVERY_FEE);
    setAmountAwayFromFreeDelivery(Math.max(0, DELIVERY_THRESHOLD - price));
  }, [items]);

  const addToCart = (product: Product) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // If product already in cart, increment quantity
        return prevItems.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // Otherwise add new item with quantity 1
        return [...prevItems, { product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const checkout = async () => {
    const orderData = {
      orderItems: items.map(item => ({
        name: item.product.name,
        qty: item.quantity,
        image: item.product.image,
        price: item.product.price,
        product: item.product.id
      })),
      shippingAddress: {
        address: shippingAddress,
        city: 'Mumbai',
        postalCode: '400001',
        country: 'India'
      },
      paymentMethod,
      totalPrice: totalPrice + (totalPrice * 0.18) // Including tax
    };

    try {
      const { data } = await orderService.create(orderData);
      
      // Save for confirmation page as expected by current UI
      localStorage.setItem('last-order', JSON.stringify({
        id: data._id,
        items,
        total: totalPrice,
        date: new Date().toLocaleDateString(),
        address: shippingAddress,
        paymentMethod
      }));

      clearCart();
      return data;
    } catch (error) {
      console.error('Checkout failed:', error);
      throw error;
    }
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isCartOpen,
      openCart,
      closeCart,
      totalItems,
      totalPrice,
      qualifiesForFreeDelivery,
      deliveryFee,
      amountAwayFromFreeDelivery,
      shippingAddress,
      paymentMethod,
      checkout
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
