
export interface InventoryItem {
  id: string;
  productId: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  lastRestocked: string;
  price: number;
  costPrice: number;
  image: string;
}

export type StockStatus = 'Low' | 'Good' | 'Excess';

export function getStockStatus(item: InventoryItem): StockStatus {
  if (item.currentStock <= item.minStockLevel) {
    return 'Low';
  } else if (item.currentStock > item.maxStockLevel) {
    return 'Excess';
  } else {
    return 'Good';
  }
}
