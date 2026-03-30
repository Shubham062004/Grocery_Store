import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Product } from '@/context/CartContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface RecommendationCardProps {
  product: Product;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product);
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });

    setTimeout(() => setIsAdding(false), 600);
  };

  return (
    <div className="flex-shrink-0 w-64 bg-card border border-border rounded-lg p-3 transition-all duration-300 hover:shadow-md animate-fade-in">
      <div className="flex gap-3">
        {/* Product Image */}
        <div className="h-20 w-20 bg-secondary/30 rounded-lg overflow-hidden flex-shrink-0">
          <img 
            src={product.image} 
            alt={product.name} 
            className="h-full w-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b";
            }}
          />
        </div>
        
        {/* Product Info */}
        <div className="flex-grow flex flex-col justify-between min-w-0">
          <div>
            <h4 className="font-medium text-sm text-foreground truncate">
              {product.name}
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              {product.unit}
            </p>
          </div>
          
          <div className="flex items-center justify-between gap-2 mt-2">
            <span className="font-bold text-sm text-foreground">
              ₹{product.price.toFixed(2)}
            </span>
            
            <Button 
              size="sm"
              onClick={handleAddToCart}
              disabled={isAdding}
              className="h-7 px-4 bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold rounded-md transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isAdding ? (
                <span className="animate-pulse">Adding...</span>
              ) : (
                <>
                  <Plus size={14} className="mr-1" />
                  ADD
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
