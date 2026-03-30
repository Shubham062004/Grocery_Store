
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { productCategories } from '@/data/products';
import { productService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import ProductCard from '@/components/home/ProductCard';
import { Product } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuGridSkeleton, SearchResultsSkeleton } from '@/components/ui/SkeletonLoaders';
import { LoadingTransition } from '@/components/ui/PageTransition';
import { useLoadingState } from '@/hooks/useLoadingState';
import { StaggerContainer, StaggerItem, HoverScale } from '@/components/ui/MicroAnimations';

const Menu = () => {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const { isLoading, setLoading } = useLoadingState();
  const { toast } = useToast();
  
  // Load all products from API
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const { data } = await productService.getAll();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error",
          description: "Failed to load products. Using offline data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [setLoading, toast]);
  
  // Filter products based on search term and active category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 100 }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-gray-900">
      <Header />
      
      <main className="flex-grow pt-24 pb-10 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">Our Menu</h1>
            <p className="text-muted-foreground dark:text-gray-400 max-w-2xl mx-auto">
              Browse our complete product catalog and add items to your cart.
            </p>
          </motion.div>
          
          {/* Search bar */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative mb-8 max-w-md mx-auto"
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground transition-colors" size={18} />
            <HoverScale scale={1.02}>
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                value={searchTerm}
                onChange={handleSearch}
              />
            </HoverScale>
          </motion.div>
          
          {/* Category tabs */}
          <Tabs 
            defaultValue="All" 
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="mb-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center"
            >
              <TabsList className="bg-muted overflow-x-auto flex w-full md:w-auto py-1 px-1 mb-6 max-w-3xl mx-auto">
                <TabsTrigger 
                  key="All" 
                  value="All"
                  className="text-sm md:text-base whitespace-nowrap"
                >
                  All
                </TabsTrigger>
                {productCategories.map(category => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="text-sm md:text-base whitespace-nowrap"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </motion.div>
            
            {/* Products grid */}
            <LoadingTransition 
              isLoading={isLoading} 
              fallback={<MenuGridSkeleton />}
            >
              <AnimatePresence mode="wait">
                <StaggerContainer 
                  key={`${activeCategory}-${searchTerm}`}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto"
                  staggerDelay={0.05}
                >
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => (
                      <StaggerItem key={product.id}>
                        <motion.div
                          whileHover={{ y: -2 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                          <ProductCard product={product} index={index} />
                        </motion.div>
                      </StaggerItem>
                    ))
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="col-span-full text-center py-20"
                    >
                      <motion.div
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <p className="text-lg text-muted-foreground mb-2">
                          No products found matching "{searchTerm}"
                        </p>
                        <p className="text-sm text-muted-foreground/60">
                          Try adjusting your search or browse different categories
                        </p>
                      </motion.div>
                    </motion.div>
                  )}
                </StaggerContainer>
              </AnimatePresence>
            </LoadingTransition>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Menu;
