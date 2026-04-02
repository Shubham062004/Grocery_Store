
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, AlertTriangle, Check, X } from 'lucide-react';

interface InventoryTableProps {
  products: any[];
  onUpdateStock: (productId: string, newStockLevel: number) => void;
  onDeleteProduct: (productId: string) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ 
  products, 
  onUpdateStock,
  onDeleteProduct
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<number>(0);
  
  const filteredItems = products.filter(item => {
    if (searchTerm.trim() === '') return true;
    const searchTermLower = searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(searchTermLower) || 
      item.category.toLowerCase().includes(searchTermLower)
    );
  });
  
  const startEditing = (item: any) => {
    setEditingProductId(item.id || item._id);
    setEditingValue(item.countInStock);
  };
  
  const saveEdit = (productId: string) => {
    onUpdateStock(productId, editingValue);
    setEditingProductId(null);
  };
  
  const cancelEdit = () => {
    setEditingProductId(null);
  };
  
  return (
    <div className="bg-card text-card-foreground rounded-lg border border-border shadow-sm">
      <div className="p-4 border-b border-border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h3 className="text-lg font-semibold">Inventory Items</h3>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
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
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Product</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Category</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Stock</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Price</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredItems.map(item => {
              const productId = item.id || item._id;
              const isLowStock = item.countInStock < 10;
              
              return (
                <tr key={productId} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="h-10 w-10 rounded-md object-cover bg-muted"
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.unit} • {item.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{item.category}</td>
                  <td className="px-4 py-3">
                    {editingProductId === productId ? (
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
                            onClick={() => saveEdit(productId)}
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
                        <span className={`font-medium ${item.countInStock === 0 ? 'text-red-500' : isLowStock ? 'text-amber-500' : 'text-green-500'}`}>
                          {item.countInStock}
                        </span>
                        {item.countInStock === 0 ? (
                          <X className="h-4 w-4 text-red-500" />
                        ) : isLowStock ? (
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        ) : (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">₹{item.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {editingProductId !== productId && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => startEditing(item)}
                        >
                          Update Stock
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onDeleteProduct(productId)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No products found.
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
