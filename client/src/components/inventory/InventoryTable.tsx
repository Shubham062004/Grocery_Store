
import React, { useState } from 'react';
import { InventoryItem, getStockStatus } from '@/types/inventory';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ChevronUp, ChevronDown, AlertTriangle, Check, X } from 'lucide-react';
import { format } from 'date-fns';

interface InventoryTableProps {
  inventory: InventoryItem[];
  onUpdateStock: (itemId: string, newStockLevel: number) => void;
  activeFilter?: string; // Make the activeFilter prop optional
}

const InventoryTable: React.FC<InventoryTableProps> = ({ 
  inventory, 
  onUpdateStock,
  activeFilter = 'all' // Provide a default value
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof InventoryItem>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<number>(0);
  
  // Filter inventory items based on search term (using the smart search approach)
  const filteredItems = inventory.filter(item => {
    if (searchTerm.trim() === '') return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    
    // Check if search matches full text
    if (item.name.toLowerCase().includes(searchTermLower) || 
        item.category.toLowerCase().includes(searchTermLower)) {
      return true;
    }
    
    // Check for initials matching (e.g., "dhw" matches "Dettol Hand Wash")
    const words = item.name.split(' ');
    const initials = words.map(word => word[0]?.toLowerCase() || '').join('');
    return initials.includes(searchTermLower);
  });
  
  // Sort filtered items
  const sortedItems = [...filteredItems].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    } else {
      // @ts-ignore - We know these are comparable values
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
  });
  
  const handleSort = (field: keyof InventoryItem) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const startEditing = (item: InventoryItem) => {
    setEditingItemId(item.id);
    setEditingValue(item.currentStock);
  };
  
  const saveEdit = (itemId: string) => {
    onUpdateStock(itemId, editingValue);
    setEditingItemId(null);
  };
  
  const cancelEdit = () => {
    setEditingItemId(null);
  };
  
  const renderSortIcon = (field: keyof InventoryItem) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };
  
  const getStockStatusClass = (item: InventoryItem) => {
    if (item.currentStock === 0) return 'text-red-500 dark:text-red-400';
    const status = getStockStatus(item);
    return status === 'Low' 
      ? 'text-amber-500 dark:text-amber-400' 
      : 'text-green-500 dark:text-green-400';
  };
  
  return (
    <div className="bg-card text-card-foreground rounded-lg border border-border shadow-sm">
      <div className="p-4 border-b border-border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h3 className="text-lg font-semibold">Inventory Items</h3>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or initials..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                <button 
                  className="flex items-center gap-1" 
                  onClick={() => handleSort('name')}
                >
                  Product {renderSortIcon('name')}
                </button>
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                <button 
                  className="flex items-center gap-1" 
                  onClick={() => handleSort('category')}
                >
                  Category {renderSortIcon('category')}
                </button>
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                <button 
                  className="flex items-center gap-1" 
                  onClick={() => handleSort('currentStock')}
                >
                  Stock {renderSortIcon('currentStock')}
                </button>
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                <button 
                  className="flex items-center gap-1" 
                  onClick={() => handleSort('price')}
                >
                  Price {renderSortIcon('price')}
                </button>
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                <button 
                  className="flex items-center gap-1" 
                  onClick={() => handleSort('lastRestocked')}
                >
                  Last Restocked {renderSortIcon('lastRestocked')}
                </button>
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedItems.map(item => {
              const stockStatus = getStockStatus(item);
              return (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="h-10 w-10 rounded-md object-cover bg-muted"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = "https://images.unsplash.com/photo-1518770660439-4636190af475";
                        }}
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.unit}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{item.category}</td>
                  <td className="px-4 py-3">
                    {editingItemId === item.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          className="w-20 h-8"
                          value={editingValue}
                          onChange={(e) => setEditingValue(parseInt(e.target.value) || 0)}
                          min={0}
                        />
                        <div className="flex gap-1">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 w-8 p-0" 
                            onClick={() => saveEdit(item.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-destructive" 
                            onClick={cancelEdit}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${getStockStatusClass(item)}`}>
                          {item.currentStock}
                        </span>
                        {item.currentStock === 0 ? (
                          <X className="h-4 w-4 text-red-500" />
                        ) : stockStatus === 'Low' ? (
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        ) : (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">₹{item.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {format(new Date(item.lastRestocked), 'dd MMM yyyy')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {editingItemId !== item.id && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => startEditing(item)}
                        className="transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
                      >
                        Update Stock
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
            {sortedItems.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No inventory items found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;
