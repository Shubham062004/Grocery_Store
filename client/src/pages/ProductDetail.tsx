
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart, Product } from '@/context/CartContext';
import { allProducts } from '@/data/products';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart, items, updateQuantity, removeFromCart } = useCart();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Find the current item in the cart (if it exists)
  const cartItem = items.find(item => item.product.id === id);
  const quantity = cartItem ? cartItem.quantity : 0;
  
  // Fetch product details
  useEffect(() => {
    // Simulate loading
    setLoading(true);
    
    // Find product in our products list
    const foundProduct = allProducts.find(p => p.id === id);
    
    if (foundProduct) {
      setProduct(foundProduct);
    }
    
    setLoading(false);
  }, [id]);
  
  const handleAddToCart = () => {
    if (!product) return;
    
    if (quantity === 0) {
      addToCart(product);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
        duration: 3000,
      });
    } else {
      updateQuantity(product.id, quantity + 1);
      toast({
        title: "Updated quantity",
        description: `${product.name} quantity updated to ${quantity + 1}.`,
        duration: 2000,
      });
    }
  };
  
  const handleDecreaseQuantity = () => {
    if (!product) return;
    
    if (quantity === 1) {
      removeFromCart(product.id);
      toast({
        title: "Removed from cart",
        description: `${product.name} has been removed from your cart.`,
        duration: 2000,
      });
    } else if (quantity > 0) {
      updateQuantity(product.id, quantity - 1);
      toast({
        title: "Updated quantity",
        description: `${product.name} quantity updated to ${quantity - 1}.`,
        duration: 2000,
      });
    }
  };
  
  if (loading) {
    return (
      <>
        <Header />
        <main className="container mx-auto pt-24 pb-12 px-4 min-h-[80vh] flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-300 rounded-full mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-32"></div>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  if (!product) {
    return (
      <>
        <Header />
        <main className="container mx-auto pt-24 pb-12 px-4 min-h-[80vh] flex flex-col items-center justify-center">
          <ShoppingBag size={48} className="text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/menu">
            <Button className="bg-blink hover:bg-blink-600">Browse Products</Button>
          </Link>
        </main>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Header />
      <main className="container mx-auto pt-24 pb-12 px-4 min-h-[80vh]">
        <div className="max-w-6xl mx-auto">
          <Link to="/menu" className="inline-flex items-center mb-6 text-sm font-medium transition-colors hover:text-blink">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Menu
          </Link>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Product Image */}
            <div className="bg-secondary/30 dark:bg-gray-700/30 rounded-lg overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover aspect-square"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b";
                }}
              />
            </div>
            
            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-auto">
                <div className="text-sm text-muted-foreground mb-2">{product.category}</div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <div className="text-sm text-muted-foreground mb-4">{product.unit}</div>
                <p className="text-2xl font-bold mb-6">₹{product.price.toFixed(2)}</p>
                
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-2">About this product</h3>
                  <p className="text-muted-foreground">
                    This premium {product.name.toLowerCase()} is carefully selected to ensure the highest quality. 
                    Perfect for everyday use, our {product.category.toLowerCase()} products are fresh and reliable.
                  </p>
                </div>
              </div>
              
              <div className="border-t pt-6 mt-6">
                {quantity === 0 ? (
                  <Button 
                    onClick={handleAddToCart}
                    className="w-full bg-blink hover:bg-blink-600 text-white py-6 text-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Add to Cart
                  </Button>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-medium">Quantity</div>
                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-full p-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-10 w-10 rounded-full"
                        onClick={handleDecreaseQuantity}
                      >
                        <Minus size={16} />
                      </Button>
                      
                      <span className="w-10 text-center text-lg font-medium">
                        {quantity}
                      </span>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-10 w-10 rounded-full"
                        onClick={handleAddToCart}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Related Products section could be added here */}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetail;
