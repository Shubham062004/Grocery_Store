import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import StoreList from '@/components/store/StoreList';
import LocationSelector from '@/components/ui/LocationSelector';
import FreeDeliveryBanner from '@/components/home/FreeDeliveryBanner';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Package, MessageCircle, Store } from 'lucide-react';
import { applySequentialAnimations } from '@/utils/scrollAnimation';
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
  useEffect(() => {
    import('@/utils/scrollAnimation').then(({ useScrollReveal }) => {
      const scrollReveal = useScrollReveal({ 
        selector: '.reveal', 
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      });
    });
  }, []);

  // Simulate initial page load
  useEffect(() => {
    const initializeApp = async () => {
      setLoading(true);
      // Simulate loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      setLoading(false);
      
      applySequentialAnimations(
        '.grid', 
        '.card', 
        'animate-fade-in', 
        0.05
      );
    };
    
    initializeApp();
  }, [setLoading]);

  return (
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

            <div className="py-8">
              <div className="flex items-center justify-between mb-8 reveal reveal-from-left">
                <div>
                  <h2 className="text-3xl font-bold flex items-center gap-2">
                    <Store className="h-8 w-8 text-primary" />
                    Select a Store
                  </h2>
                  <p className="text-muted-foreground mt-1">Choose from our partner stores to start shopping</p>
                </div>
                <div className="hidden sm:flex gap-4">
                  <Link to="/support">
                    <Button variant="outline" className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Support
                    </Button>
                  </Link>
                </div>
              </div>
              
              <motion.div 
                className="reveal reveal-from-bottom"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.8 }}
              >
                <StoreList />
              </motion.div>
            </div>
          </div>
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
  );
};

export default Index;
