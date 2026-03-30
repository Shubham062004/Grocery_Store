import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CompleteYourRoutine from '@/components/cart/CompleteYourRoutine';
import { ShoppingBag, ArrowLeft, Check, Plus, Minus, Trash2 } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const { 
    items, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    totalPrice,
    deliveryFee,
    qualifiesForFreeDelivery,
    amountAwayFromFreeDelivery,
    shippingAddress,
    paymentMethod,
    checkout
  } = useCart();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleOrderComplete = async () => {
    setIsLoading(true);
    
    try {
      await checkout();
      toast({
        title: "Order Successful",
        description: "Your order has been placed successfully!",
      });
      navigate('/order-confirmation');
    } catch (error: any) {
      toast({
        title: "Order Failed",
        description: error.response?.data?.message || "There was an issue processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="container mx-auto pt-24 pb-12 px-4 min-h-[80vh] flex flex-col items-center justify-center">
          <div className="max-w-md mx-auto text-center">
            <ShoppingBag size={64} className="mx-auto text-muted-foreground mb-6" />
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/">
              <Button className="bg-blink hover:bg-blink-600">Continue Shopping</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container mx-auto pt-24 pb-12 px-4 min-h-[80vh]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Link to="/" className="mr-4">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft size={16} />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
          </div>

          <div className={`p-4 mb-6 rounded-lg text-sm flex items-center gap-2 ${
            qualifiesForFreeDelivery 
              ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
              : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
          }`}>
            {qualifiesForFreeDelivery ? (
              <Check size={18} className="flex-shrink-0" />
            ) : (
              <ShoppingBag size={18} className="flex-shrink-0" />
            )}
            {qualifiesForFreeDelivery ? (
              <span>You've qualified for free delivery!</span>
            ) : (
              <span>Add ₹{amountAwayFromFreeDelivery.toFixed(2)} more to your order for free delivery.</span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h2 className="font-semibold">Cart Items ({items.length})</h2>
                </div>
                <ul className="divide-y divide-border">
                  {items.map(item => (
                    <li key={item.product.id} className="p-4 flex gap-4">
                      <div className="h-20 w-20 bg-secondary/30 dark:bg-gray-700/30 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b";
                          }}
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{item.product.unit}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">₹{(item.product.price * item.quantity).toFixed(2)}</span>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex items-center border rounded-full shadow-sm">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 rounded-full text-muted-foreground"
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              >
                                <Minus size={16} />
                              </Button>
                              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 rounded-full text-muted-foreground"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              >
                                <Plus size={16} />
                              </Button>
                            </div>
                            
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeFromCart(item.product.id)}
                              className="h-8 w-8 p-0 rounded-full text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Recommendations Section */}
                <div className="mt-6 px-4">
                  <CompleteYourRoutine cartItems={items.map(item => item.product)} />
                </div>
              </div>
            </div>
            
            <div className="col-span-1">
              <div className="bg-card rounded-lg border border-border shadow-sm sticky top-24">
                <div className="p-4 border-b border-border">
                  <h2 className="font-semibold">Order Summary</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className={qualifiesForFreeDelivery ? "text-green-600 dark:text-green-400 font-medium" : "font-medium"}>
                      {qualifiesForFreeDelivery ? "Free" : `₹${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between mb-6">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold">₹{(totalPrice + deliveryFee).toFixed(2)}</span>
                    </div>
                    <Button 
                      className="w-full bg-blink hover:bg-blink-600 text-white" 
                      disabled={isLoading}
                      onClick={handleOrderComplete}
                    >
                      {isLoading ? "Processing..." : "Complete Order"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Cart;
