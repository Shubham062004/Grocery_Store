
import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Minus, X, ShoppingBag, Info, Calendar, Package, Utensils, AlertCircle } from 'lucide-react';
import { useCart, Product } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';

interface ProductDetailModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductDetailModal = ({ product, open, onOpenChange }: ProductDetailModalProps) => {
  const { addToCart, items, updateQuantity, removeFromCart } = useCart();
  const { toast } = useToast();
  
  if (!product) return null;
  
  // Find the current item in the cart (if it exists)
  const cartItem = items.find(item => item.product.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  
  const handleAddToCart = () => {
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
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        <div className="relative h-64 bg-secondary/20 dark:bg-gray-800">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b";
            }}
          />
          <DialogClose className="absolute right-2 top-2 bg-black/40 text-white rounded-full p-1 hover:bg-black/60">
            <X className="h-5 w-5" />
          </DialogClose>
        </div>
        
        <div className="px-6 pt-4 pb-2">
          <div className="text-sm text-muted-foreground mb-1">{product.category}</div>
          <DialogTitle className="text-2xl font-bold mb-1">{product.name}</DialogTitle>
          <DialogDescription className="text-muted-foreground mb-2">{product.unit}</DialogDescription>
          <div className="text-xl font-bold mb-4">₹{product.price.toFixed(2)}</div>
        </div>
        
        <Tabs defaultValue="details" className="flex-grow flex flex-col overflow-hidden">
          <TabsList className="mx-6 mb-2 justify-start">
            <TabsTrigger value="details" className="flex items-center gap-1">
              <Info className="h-4 w-4" />
              <span>Details</span>
            </TabsTrigger>
            <TabsTrigger value="nutrition" className="flex items-center gap-1">
              <Utensils className="h-4 w-4" />
              <span>Nutrition</span>
            </TabsTrigger>
            <TabsTrigger value="packaging" className="flex items-center gap-1">
              <Package className="h-4 w-4" />
              <span>Packaging</span>
            </TabsTrigger>
          </TabsList>
          
          <ScrollArea className="border-t flex-grow px-6 py-4 h-[200px] custom-scrollbar">
            <TabsContent value="details" className="m-0 p-0">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-1 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Expiration Information
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Best before: {product.expiration || "7 days from purchase"}<br />
                    Store in a cool, dry place. Refrigerate after opening.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-1">About this product</h3>
                  <p className="text-sm text-muted-foreground">
                    {product.description || 
                    `This premium ${product.name.toLowerCase()} is carefully selected to ensure the highest quality. 
                    Perfect for everyday use, our ${product.category.toLowerCase()} products are fresh and reliable.`}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-1">Ingredients</h3>
                  <p className="text-sm text-muted-foreground">
                    {product.ingredients || `Ingredients information not available for this product.`}
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="nutrition" className="m-0 p-0">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Nutritional Information</h3>
                  {product.nutritionalInfo ? (
                    <div className="space-y-1">
                      {Object.entries(product.nutritionalInfo).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-muted-foreground capitalize">{key}</span>
                          <span>{value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-amber-500 dark:text-amber-400">
                      <AlertCircle className="h-4 w-4" />
                      <span>Nutritional information not available for this product.</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-1">Dietary Information</h3>
                  <p className="text-sm text-muted-foreground">
                    {product.dietaryInfo || "No specific dietary information available for this product."}
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="packaging" className="m-0 p-0">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Packaging Information</h3>
                  <p className="text-sm text-muted-foreground">
                    {product.packagingInfo || 
                    "This product is packaged in environmentally friendly materials. Please recycle where possible."}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-1">Storage Instructions</h3>
                  <p className="text-sm text-muted-foreground">
                    {product.storageInstructions || 
                    "Store in a cool, dry place. Refrigerate after opening and consume within 3 days."}
                  </p>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        <div className="p-6 border-t">
          {quantity === 0 ? (
            <Button 
              onClick={handleAddToCart}
              className="w-full bg-blink hover:bg-blink-600 text-white"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          ) : (
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Quantity</div>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-full p-1">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={handleDecreaseQuantity}
                >
                  <Minus size={16} />
                </Button>
                
                <span className="w-8 text-center text-sm font-medium">
                  {quantity}
                </span>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={handleAddToCart}
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
