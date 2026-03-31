import { useState, useEffect, useCallback } from 'react';
import { InventoryItem, getStockStatus } from '@/types/inventory';
import { productService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export const useInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const { toast } = useToast();
  
  const loadInventory = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await productService.getAll();
      
      // Map products to inventory items
      const inventoryItems: InventoryItem[] = data.map((product: any) => ({
        id: product._id || product.id,
        productId: product._id || product.id,
        name: product.name,
        category: product.category,
        unit: product.unit || 'units',
        currentStock: product.countInStock || 0,
        minStockLevel: 10,
        maxStockLevel: 100,
        lastRestocked: product.updatedAt,
        price: product.price,
        costPrice: product.price * 0.7,
        image: product.image
      }));

      setInventory(inventoryItems);
    } catch (error: any) {
      console.error("Failed to load inventory from API:", error);
      toast({
        title: "Error Loading Inventory",
        description: error.response?.data?.message || "Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);
  
  const updateStockLevel = async (itemId: string, newStockLevel: number) => {
    try {
      await productService.update(itemId, { countInStock: newStockLevel });
      await loadInventory();
      toast({
        title: "Stock Updated",
        description: "The inventory has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "Could not update stock level.",
        variant: "destructive",
      });
    }
  };
  
  const addInventoryItem = async (productData: any) => {
    try {
      await productService.create(productData);
      await loadInventory();
      toast({
        title: "Product Added",
        description: `${productData.name} has been added to inventory.`,
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Failed to Add Product",
        description: error.response?.data?.message || "Please check the product details.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  const updateInventoryItem = async (itemId: string, updatedData: Partial<InventoryItem>) => {
    try {
      // Map frontend fields back to backend fields
      const backendData: any = { ...updatedData };
      if (updatedData.currentStock !== undefined) {
        backendData.countInStock = updatedData.currentStock;
      }
      
      await productService.update(itemId, backendData);
      await loadInventory();
      toast({
        title: "Inventory Updated",
        description: "The item has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "Could not update inventory item.",
        variant: "destructive",
      });
    }
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
    getItemsByCategory,
    refreshInventory: loadInventory
  };
};
