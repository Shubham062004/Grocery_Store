import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Minus, Eye } from 'lucide-react';
import { useCart, Product } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ProductDetailModal from './ProductDetailModal';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  const { addToCart, items, updateQuantity, removeFromCart } = useCart();
  const { toast } = useToast();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Find the current item in the cart (if it exists)
  const cartItem = items.find(item => item.product.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleDecreaseQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      removeFromCart(product.id);
      toast({
        title: "Removed from cart",
        description: `${product.name} has been removed from your cart.`,
        duration: 2000,
      });
    }
  };
  
  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/' || location.pathname === '/menu') {
      setIsModalOpen(true);
    } else {
      window.location.href = `/product/${product.id}`;
    }
  };
  
  return (
    <>
      <div 
        className={cn(
          "food-card group relative flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md dark:border-gray-800",
          className
        )}
        onClick={handleCardClick}
      >
        <div className="relative aspect-square overflow-hidden bg-secondary/30 dark:bg-gray-800/50">
          <img 
            src={product.image} 
            alt={product.name} 
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b";
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
            <Button size="sm" variant="secondary" className="flex items-center gap-1" onClick={handleCardClick}>
              <Eye className="h-3.5 w-3.5" />
              <span>View</span>
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col p-3">
          <div className="mb-1 text-xs text-muted-foreground">{product.category}</div>
          <h3 className="font-medium line-clamp-1">{product.name}</h3>
          <div className="text-xs text-muted-foreground mb-2">{product.unit}</div>
          
          <div className="mt-auto flex items-center justify-between">
            <div className="font-semibold">₹{product.price.toFixed(2)}</div>
            {quantity === 0 ? (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full hover:bg-blink hover:text-white"
                onClick={handleAddToCart}
              >
                <Plus className="h-4 w-4" />
              </Button>
            ) : (
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-full">
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={handleDecreaseQuantity}>
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-6 text-center text-xs font-medium">{quantity}</span>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={handleAddToCart}>
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <ProductDetailModal product={product} open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
};

export default ProductCard;
