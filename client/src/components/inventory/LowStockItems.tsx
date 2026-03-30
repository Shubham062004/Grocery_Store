
import React from 'react';
import { useInventory } from '@/hooks/use-inventory';
import { AlertCircle } from 'lucide-react';

export interface LowStockItemsProps {
  maxItems?: number;
}

const LowStockItems: React.FC<LowStockItemsProps> = ({ maxItems }) => {
  const { getLowStockItems } = useInventory();
  const lowStockItems = getLowStockItems();
  
  // Display only up to maxItems if provided
  const displayItems = maxItems ? lowStockItems.slice(0, maxItems) : lowStockItems;
  
  if (lowStockItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        All items are well stocked
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {displayItems.map(item => (
        <div key={item.id} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.currentStock} units left</p>
            </div>
          </div>
          <div className="text-sm text-amber-600 dark:text-amber-400 font-medium">
            Restock
          </div>
        </div>
      ))}
    </div>
  );
};

export default LowStockItems;
