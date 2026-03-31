import React, { useState, useEffect } from 'react';
import { useInventory } from '@/hooks/use-inventory';
import InventorySummary from '@/components/inventory/InventorySummary';
import InventoryTable from '@/components/inventory/InventoryTable';
import LowStockItems from '@/components/inventory/LowStockItems';
import AddItemModal from '@/components/inventory/AddItemModal';
import { useToast } from '@/hooks/use-toast';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { Package, Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { InventoryItem } from '@/types/inventory';

const Inventory = () => {
  const { inventory, isLoading, updateStockLevel, addInventoryItem } = useInventory();
  const { toast } = useToast();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
  
  useEffect(() => {
    let result = [...inventory];
    
    switch (activeFilter) {
      case 'inStock':
        result = result.filter(item => item.currentStock > 0 && item.currentStock > item.minStockLevel);
        break;
      case 'lowStock':
        result = result.filter(item => item.currentStock <= item.minStockLevel && item.currentStock > 0);
        break;
      case 'outOfStock':
        result = result.filter(item => item.currentStock === 0);
        break;
    }
    
    if (searchTerm.trim() !== '') {
      const searchTermLower = searchTerm.toLowerCase();
      
      result = result.filter(item => {
        if (item.name.toLowerCase().includes(searchTermLower) || 
            item.category.toLowerCase().includes(searchTermLower)) {
          return true;
        }
        
        const words = item.name.split(' ');
        const initials = words.map(word => word[0]?.toLowerCase() || '').join('');
        return initials.includes(searchTermLower);
      });
    }
    
    setFilteredInventory(result);
  }, [inventory, activeFilter, searchTerm]);
  
  const handleUpdateStock = async (itemId: string, newStockLevel: number) => {
    await updateStockLevel(itemId, newStockLevel);
  };
  
  const handleAddItem = () => {
    setIsAddModalOpen(true);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-background text-foreground transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground animate-pulse">Loading inventory data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-16 bg-background text-foreground transition-colors duration-300">
      <div className="container px-6 md:px-8 py-8">
        <div className="mb-6 animate-fade-in reveal reveal-from-bottom">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">Inventory Management</h1>
              <p className="text-muted-foreground">
                Manage your grocery store inventory items
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search inventory..."
                  className="pl-9 pr-4"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Button onClick={handleAddItem} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </div>
          </div>
        </div>
        
        <InventorySummary 
          inventory={inventory} 
          onFilterChange={setActiveFilter}
          activeFilter={activeFilter}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 animate-fade-in reveal reveal-from-bottom" style={{ animationDelay: "0.1s" }}>
            <InventoryTable 
              inventory={filteredInventory} 
              onUpdateStock={handleUpdateStock} 
            />
          </div>
          
          <div className="animate-fade-in reveal reveal-from-right" style={{ animationDelay: "0.2s" }}>
            <div className="bg-card border rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Low Stock Alerts
              </h2>
              <LowStockItems />
            </div>
          </div>
        </div>
      </div>
      
      <AddItemModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={addInventoryItem}
      />
      
      <div className="fixed bottom-6 right-6 z-50">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Inventory;
