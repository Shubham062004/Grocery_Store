
import React from 'react';
import { InventoryItem, getStockStatus } from '@/types/inventory';

interface InventorySummaryProps {
  inventory: InventoryItem[];
  onFilterChange: (filter: string) => void;
  activeFilter: string;
}

const InventorySummary: React.FC<InventorySummaryProps> = ({ 
  inventory, 
  onFilterChange,
  activeFilter
}) => {
  const totalItems = inventory.length;
  const inStockItems = inventory.filter(item => item.currentStock > 0 && getStockStatus(item) !== 'Low').length;
  const lowStockItems = inventory.filter(item => getStockStatus(item) === 'Low').length;
  const outOfStockItems = inventory.filter(item => item.currentStock === 0).length;
  
  const handleFilterClick = (filter: string) => {
    onFilterChange(filter);
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 reveal reveal-from-bottom">
      <div 
        className={`border cursor-pointer rounded-lg p-6 ${activeFilter === 'all' 
          ? 'border-primary bg-primary/5 text-primary-foreground dark:text-foreground' 
          : 'border-border bg-card text-card-foreground'} hover:bg-primary/5 transition-all`}
        onClick={() => handleFilterClick('all')}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="font-medium mb-2">Total Items</div>
          <div className="text-4xl font-bold">{totalItems}</div>
        </div>
      </div>
      
      <div 
        className={`border cursor-pointer rounded-lg p-6 ${activeFilter === 'inStock' 
          ? 'border-green-500 bg-green-500/5 text-green-700 dark:text-green-400' 
          : 'border-border bg-card text-card-foreground'} hover:bg-green-500/5 transition-all`}
        onClick={() => handleFilterClick('inStock')}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="font-medium mb-2">In Stock Items</div>
          <div className="text-4xl font-bold text-green-500">{inStockItems}</div>
        </div>
      </div>
      
      <div 
        className={`border cursor-pointer rounded-lg p-6 ${activeFilter === 'lowStock' 
          ? 'border-amber-500 bg-amber-500/5 text-amber-700 dark:text-amber-400' 
          : 'border-border bg-card text-card-foreground'} hover:bg-amber-500/5 transition-all`} 
        onClick={() => handleFilterClick('lowStock')}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="font-medium mb-2">Low Stock Items</div>
          <div className="text-4xl font-bold text-amber-500">{lowStockItems}</div>
        </div>
      </div>
      
      <div 
        className={`border cursor-pointer rounded-lg p-6 ${activeFilter === 'outOfStock' 
          ? 'border-red-500 bg-red-500/5 text-red-700 dark:text-red-400' 
          : 'border-border bg-card text-card-foreground'} hover:bg-red-500/5 transition-all`}
        onClick={() => handleFilterClick('outOfStock')}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="font-medium mb-2">Out of Stock Items</div>
          <div className="text-4xl font-bold text-red-500">{outOfStockItems}</div>
        </div>
      </div>
    </div>
  );
};

export default InventorySummary;
