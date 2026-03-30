
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Plus, Save } from 'lucide-react';
import { allProducts, productCategories } from '@/data/products';
import { Product } from '@/context/CartContext';

const ProductManager: React.FC = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({
    id: '',
    name: '',
    price: 0,
    category: productCategories[0],
    image: '',
    unit: ''
  });
  
  useEffect(() => {
    // Load products from localStorage or use the default ones
    const savedProducts = localStorage.getItem('custom-products');
    if (savedProducts) {
      try {
        const parsedProducts = JSON.parse(savedProducts);
        setProducts(parsedProducts);
      } catch (error) {
        console.error('Error parsing saved products:', error);
        setProducts([]);
      }
    } else {
      // Use default products from data file
      setProducts([]);
    }
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };
  
  const handleCategoryChange = (value: string) => {
    setNewProduct(prev => ({
      ...prev,
      category: value
    }));
  };
  
  const saveProduct = () => {
    // Validate input
    if (!newProduct.name || !newProduct.category || newProduct.price <= 0 || !newProduct.unit) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields with valid information.",
        variant: "destructive"
      });
      return;
    }
    
    // Create new product with a unique ID
    const productToSave = {
      ...newProduct,
      id: `custom-${Date.now()}`
    };
    
    // Add to state
    const updatedProducts = [...products, productToSave];
    setProducts(updatedProducts);
    
    // Save to localStorage
    localStorage.setItem('custom-products', JSON.stringify(updatedProducts));
    
    // Also update all products in localStorage to be used across the app
    const combinedProducts = [...allProducts, ...updatedProducts];
    localStorage.setItem('all-products', JSON.stringify(combinedProducts));
    
    // Show success message
    toast({
      title: "Product Added",
      description: `${productToSave.name} has been added to inventory.`
    });
    
    // Reset form
    setNewProduct({
      id: '',
      name: '',
      price: 0,
      category: productCategories[0],
      image: '',
      unit: ''
    });
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); saveProduct(); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0.01"
                step="0.01"
                value={newProduct.price}
                onChange={handleInputChange}
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                value={newProduct.category}
                onChange={handleInputChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                {productCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                name="unit"
                value={newProduct.unit}
                onChange={handleInputChange}
                placeholder="e.g. 500g, 1L, each"
                required
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                value={newProduct.image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to use a default image
              </p>
            </div>
          </div>
          
          <Button type="submit" className="w-full mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductManager;
