import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/context/CartContext';
import RecommendationCard from './RecommendationCard';
import { allProducts } from '@/data/products';

interface CompleteYourRoutineProps {
  cartItems: Product[];
}

const CompleteYourRoutine: React.FC<CompleteYourRoutineProps> = ({ cartItems }) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Get recommendations based on cart items
  const getRecommendations = (): Product[] => {
    if (cartItems.length === 0) return [];

    // Get categories from cart items
    const cartCategories = cartItems.map(item => item.category);
    
    // Find products from same categories that aren't in cart
    const cartIds = cartItems.map(item => item.id);
    const recommendations = allProducts
      .filter(product => 
        cartCategories.includes(product.category) && 
        !cartIds.includes(product.id)
      )
      .slice(0, 6);

    // If not enough recommendations, add random products
    if (recommendations.length < 4) {
      const remaining = allProducts
        .filter(product => !cartIds.includes(product.id))
        .slice(0, 6 - recommendations.length);
      recommendations.push(...remaining);
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  if (recommendations.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 280;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="border-t border-border pt-4 pb-2 animate-slide-in-up">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="font-semibold text-base text-foreground">
          Complete Your Routine
        </h3>
        
        {/* Scroll Buttons - Hidden on mobile, visible on larger screens */}
        <div className="hidden sm:flex gap-1">
          <button
            onClick={() => scroll('left')}
            className="h-8 w-8 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="h-8 w-8 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Recommendations Carousel */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto custom-scrollbar pb-2 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'thin' }}
      >
        {recommendations.map((product, index) => (
          <div 
            key={product.id} 
            className="snap-start"
            style={{ 
              animationDelay: `${index * 0.1}s`,
              opacity: 0,
              animation: 'fade-in 0.5s ease-out forwards'
            }}
          >
            <RecommendationCard product={product} />
          </div>
        ))}
      </div>

      {/* Scroll Indicator for Mobile */}
      <div className="flex justify-center mt-2 sm:hidden">
        <div className="flex gap-1">
          {recommendations.map((_, index) => (
            <div 
              key={index}
              className="h-1 w-1 rounded-full bg-muted-foreground/30"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompleteYourRoutine;
