
import { useState, useEffect } from 'react';
import { allProducts } from '@/data/products';
import { InventoryItem, getStockStatus } from '@/types/inventory';

// Convert sample products to inventory items with random stock levels
const generateInventoryItems = (): InventoryItem[] => {
  return allProducts.map(product => {
    const currentStock = Math.floor(Math.random() * 100);
    const minStockLevel = 10;
    const maxStockLevel = 80;
    
    return {
      id: `inv-${product.id}`,
      productId: product.id,
      name: product.name,
      category: product.category,
      unit: product.unit,
      currentStock,
      minStockLevel,
      maxStockLevel,
      lastRestocked: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString(),
      price: product.price,
      costPrice: product.price * 0.7, // Assuming 30% margin
      image: product.image
    };
  });
};

import { productService } from '@/services/api';

export const useInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  
  useEffect(() => {
    // Fetch products from the backend API
    const loadInventory = async () => {
      setIsLoading(true);
      try {
        const { data } = await productService.getAll();
        
        // Map products to inventory items
        const inventoryItems: InventoryItem[] = data.map((product: any) => ({
          id: `inv-${product._id}`,
          productId: product._id,
          name: product.name,
          category: product.category,
          unit: product.unit,
          currentStock: product.countInStock || 0,
          minStockLevel: 10,
          maxStockLevel: 100,
          lastRestocked: product.updatedAt,
          price: product.price,
          costPrice: product.price * 0.7,
          image: product.image
        }));

        setInventory(inventoryItems);
      } catch (error) {
        console.error("Failed to load inventory from API:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInventory();
  }, []);
  
  const updateStockLevel = (itemId: string, newStockLevel: number) => {
    setInventory(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, currentStock: newStockLevel, lastRestocked: new Date().toISOString() } 
          : item
      )
    );
  };
  
  const addInventoryItem = (item: Omit<InventoryItem, 'productId' | 'unit' | 'maxStockLevel' | 'costPrice' | 'image'>) => {
    const newItem: InventoryItem = {
      ...item,
      productId: `prod-${Date.now()}`,
      unit: 'unit',
      maxStockLevel: item.minStockLevel * 3,
      costPrice: item.price * 0.7,
      image: ''
    };
    
    setInventory(prev => [...prev, newItem]);
  };
  
  const updateInventoryItem = (itemId: string, updatedData: Partial<InventoryItem>) => {
    setInventory(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, ...updatedData }
          : item
      )
    );
  };
  
  const getLowStockItems = () => {
    return inventory.filter(item => getStockStatus(item) === 'Low');
  };
  
  const getItemsByCategory = (category: string) => {
    return inventory.filter(item => item.category === category);
  };
  
  return {
    inventory,
    isLoading,
    activeFilter,
    setActiveFilter,
    updateStockLevel,
    addInventoryItem,
    updateInventoryItem,
    getLowStockItems,
    getItemsByCategory
  };
};
