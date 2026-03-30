
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import CategorySection from '@/components/home/CategorySection';
import { allProducts } from '@/data/products';
import LocationSelector from '@/components/ui/LocationSelector';
import FreeDeliveryBanner from '@/components/home/FreeDeliveryBanner';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { CartProvider } from '@/context/CartContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Package, MessageCircle } from 'lucide-react';
import { useScrollReveal, applySequentialAnimations } from '@/utils/scrollAnimation';
import ChatbotButton from '@/components/ui/ChatbotButton';
import { motion } from 'framer-motion';
import { PageLoadingSkeleton } from '@/components/ui/SkeletonLoaders';
import { LoadingTransition } from '@/components/ui/PageTransition';
import { useLoadingState } from '@/hooks/useLoadingState';
import { HoverScale, FloatingElement } from '@/components/ui/MicroAnimations';

const Index = () => {
  const [isLocationSelectorOpen, setIsLocationSelectorOpen] = useState(false);
  const [location, setLocation] = useState('Select Location');
  const { isLoading, setLoading } = useLoadingState();

  // Use the scroll reveal animation
  useScrollReveal({ 
    selector: '.reveal', 
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });

  // Simulate initial page load
  useEffect(() => {
    const initializeApp = async () => {
      setLoading(true);
      
      // Simulate loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      applySequentialAnimations(
        '.grid', 
        '.food-card', 
        'animate-fade-in', 
        0.05
      );
      
      setLoading(false);
    };
    
    initializeApp();
  }, [setLoading]);

  // Group products by category
  const productsByCategory = allProducts.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, typeof allProducts>);

  // Sort categories to show most popular first
  const sortedCategories = Object.keys(productsByCategory).sort((a, b) => {
    const popularOrder = ['Dairy', 'Bakery', 'Beverages', 'Snacks', 'Fruits', 'Vegetables'];
    const aIndex = popularOrder.indexOf(a);
    const bIndex = popularOrder.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return (
    <CartProvider>
      <LoadingTransition isLoading={isLoading} fallback={<PageLoadingSkeleton />}>
        <div className="min-h-screen flex flex-col bg-background dark:bg-gray-900 text-foreground dark:text-gray-100">
          <Header />
          
          <main className="flex-grow pt-16">
            <Hero />
            <div className="container mx-auto px-4">
              <motion.div 
                className="reveal reveal-from-bottom py-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <FreeDeliveryBanner />
              </motion.div>
              <motion.div 
                className="py-4 flex flex-col sm:flex-row gap-4 sm:justify-between reveal reveal-from-right"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Link to="/support">
                  <HoverScale>
                    <Button variant="outline" className="w-full sm:w-auto flex items-center gap-2 dark:border-gray-700 dark:text-gray-300 hover:text-blink hover:border-blink hover:bg-blink/10 dark:hover:border-blink-400 dark:hover:text-blink-400 dark:hover:bg-blink-400/10 transition-all duration-200">
                      <MessageCircle className="h-4 w-4" />
                      <span>Customer Support</span>
                    </Button>
                  </HoverScale>
                </Link>
                <Link to="/menu">
                  <HoverScale>
                    <Button variant="outline" className="w-full sm:w-auto flex items-center gap-2 dark:border-gray-700 dark:text-gray-300 hover:text-blink hover:border-blink hover:bg-blink/10 dark:hover:border-blink-400 dark:hover:text-blink-400 dark:hover:bg-blink-400/10 transition-all duration-200">
                      <Package className="h-4 w-4" />
                      <span>Full Menu</span>
                    </Button>
                  </HoverScale>
                </Link>
              </motion.div>
            </div>
            
            {/* Display all categories */}
            {sortedCategories.map((category, index) => (
              <motion.div 
                key={category} 
                className="reveal reveal-from-bottom"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <CategorySection 
                  title={category} 
                  products={productsByCategory[category]} 
                />
              </motion.div>
            ))}
          </main>
          
          <Footer />
          
          {/* Theme toggle - moved to bottom right corner */}
          <FloatingElement className="fixed bottom-4 right-4 z-50" duration={4} range={5}>
            <HoverScale>
              <ThemeToggle />
            </HoverScale>
          </FloatingElement>
          
          {/* Chatbot button */}
          <FloatingElement className="fixed bottom-20 right-4 z-50" duration={3} range={8}>
            <ChatbotButton />
          </FloatingElement>
          
          {/* Modals */}
          <LocationSelector 
            isOpen={isLocationSelectorOpen}
            onClose={() => setIsLocationSelectorOpen(false)}
            onSelectLocation={(loc) => setLocation(loc)}
          />
        </div>
      </LoadingTransition>
    </CartProvider>
  );
};

export default Index;
