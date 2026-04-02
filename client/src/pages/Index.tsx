
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StoreList from '@/components/store/StoreList';
import { motion } from 'framer-motion';

const Index = () => {
  // Use the scroll reveal animation logic if needed, 
  // but for this simplified version we'll just show the content.
  useEffect(() => {
    // Optional: Re-init scroll reveal for the classes provided in the snippet
    import('@/utils/scrollAnimation').then(({ useScrollReveal }) => {
      useScrollReveal({ 
        selector: '.reveal', 
        threshold: 0.1,
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 text-foreground p-6 md:p-12">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header Section from User Snippet */}
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

        {/* Store Grid Section */}
        <motion.div 
          className="reveal reveal-from-bottom"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StoreList />
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
