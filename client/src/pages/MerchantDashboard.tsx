
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Package, Box, DollarSign, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { storeService, productService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import AddItemModal from '@/components/inventory/AddItemModal';
import InventoryTable from '@/components/inventory/InventoryTable';

const MerchantDashboard = () => {
  const [store, setStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchMerchantData = async () => {
    try {
      const { data: storeData } = await storeService.getMine();
      setStore(storeData);
      
      if (storeData) {
        const { data: productData } = await productService.getMyProducts();
        setProducts(productData);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        navigate('/create-store');
      } else {
        toast({
          title: "Error loading dashboard",
          description: "Could not fetch your store data.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchantData();
  }, [navigate, toast]);

  const handleUpdateStock = async (productId: string, newStockLevel: number) => {
    try {
      await productService.update(productId, { countInStock: newStockLevel });
      setProducts(products.map(p => (p.id === productId || p._id === productId) ? { ...p, countInStock: newStockLevel } : p));
      toast({ title: "Stock updated successfully" });
    } catch (error) {
      toast({ title: "Failed to update stock", variant: "destructive" });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.delete(productId);
        setProducts(products.filter(p => (p.id !== productId && p._id !== productId)));
        toast({ title: "Product deleted" });
      } catch (error) {
        toast({ title: "Delete failed", variant: "destructive" });
      }
    }
  };

  const handleAddProduct = async (productData: any) => {
    try {
      const { data } = await productService.create(productData);
      setProducts([...products, data]);
      toast({ title: "Product added successfully!" });
      return true;
    } catch (error: any) {
       toast({ 
         title: "Failed to add product", 
         description: error.response?.data?.message || "Something went wrong",
         variant: "destructive" 
       });
       return false;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const lowStockCount = products.filter(p => p.countInStock < 10 && p.countInStock > 0).length;
  const outOfStockCount = products.filter(p => p.countInStock === 0).length;

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-gray-900">
      <Header />
      <main className="flex-grow pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">{store?.name} Dashboard</h1>
              <p className="text-muted-foreground">Manage your products and track store performance</p>
            </div>
            <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Add New Product
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={<Box className="h-5 w-5 text-blue-500" />} title="Total Products" value={products.length} />
            <StatCard icon={<AlertCircle className="h-5 w-5 text-amber-500" />} title="Low Stock" value={lowStockCount} />
            <StatCard icon={<Package className="h-5 w-5 text-red-500" />} title="Out of Stock" value={outOfStockCount} />
            <StatCard icon={<TrendingUp className="h-5 w-5 text-purple-500" />} title="Total Orders" value="0" />
          </div>

          {(lowStockCount > 0 || outOfStockCount > 0) && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center gap-3 text-amber-800 dark:text-amber-200"
            >
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm font-medium">
                You have {lowStockCount} items with low stock and {outOfStockCount} items out of stock!
              </p>
            </motion.div>
          )}

          {/* Products Table */}
          <InventoryTable 
            products={products} 
            onUpdateStock={handleUpdateStock} 
            onDeleteProduct={handleDeleteProduct} 
          />
        </div>
      </main>
      
      <AddItemModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddProduct}
      />
      
      <Footer />
    </div>
  );
};

const StatCard = ({ icon, title, value }: any) => (
  <Card className="p-6">
    <div className="flex items-center gap-4">
        <div className="p-3 bg-muted rounded-xl">{icon}</div>
        <div>
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
  </Card>
);

export default MerchantDashboard;
