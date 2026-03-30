
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InventorySummary from '@/components/inventory/InventorySummary';
import LowStockItems from '@/components/inventory/LowStockItems';
import InventoryTable from '@/components/inventory/InventoryTable';
import ProductManager from '@/components/inventory/ProductManager';
import { useInventory } from '@/hooks/use-inventory';

const Manager = () => {
  const { inventory, isLoading, activeFilter, setActiveFilter, updateStockLevel } = useInventory();
  const [activeTab, setActiveTab] = useState('overview');
  
  const handleUpdateStock = (itemId: string, newStockLevel: number) => {
    updateStockLevel(itemId, newStockLevel);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-gray-900">
      <Header />
      
      <main className="flex-grow pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Store Manager</h1>
            <p className="text-muted-foreground">
              Manage inventory, track sales, and add new products to the menu.
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InventorySummary 
                  inventory={inventory} 
                  onFilterChange={setActiveFilter}
                  activeFilter={activeFilter}
                />
                <div className="md:col-span-2">
                  <LowStockItems maxItems={10} />
                </div>
              </div>
            </TabsContent>
            
            {/* Inventory Tab */}
            <TabsContent value="inventory">
              <div className="space-y-4">
                <div className="bg-card rounded-lg p-4 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Inventory Management</h2>
                  <InventoryTable 
                    inventory={inventory} 
                    onUpdateStock={handleUpdateStock}
                    activeFilter={activeFilter}
                  />
                </div>
              </div>
            </TabsContent>
            
            {/* Products Tab */}
            <TabsContent value="products">
              <div className="space-y-6">
                <div className="bg-card rounded-lg p-6 shadow-sm mb-6">
                  <h2 className="text-xl font-semibold mb-4">Product Management</h2>
                  <p className="text-muted-foreground mb-6">
                    Add new products to make them available in the customer menu.
                    New products will be immediately visible to customers.
                  </p>
                  
                  <ProductManager />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Manager;
