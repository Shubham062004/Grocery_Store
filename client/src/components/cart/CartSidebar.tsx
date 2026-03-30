
import React from 'react';
import { X, Plus, Minus, ShoppingBag, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ui/ThemeToggle';
import CompleteYourRoutine from './CompleteYourRoutine';

const CartSidebar: React.FC = () => {
  const { 
    items, 
    isCartOpen, 
    closeCart, 
    removeFromCart, 
    updateQuantity,
    totalPrice,
    qualifiesForFreeDelivery,
    deliveryFee,
    amountAwayFromFreeDelivery 
  } = useCart();
  
  if (!isCartOpen) return null;
  
  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-fade-in"
        onClick={closeCart}
      />
      
      {/* Cart sidebar */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white dark:bg-gray-800 shadow-xl z-50 animate-slide-in flex flex-col dark:text-white transition-colors duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <Button variant="ghost" size="sm" onClick={closeCart} className="rounded-full h-8 w-8 p-0 transition-transform duration-200 hover:rotate-90">
            <X size={20} />
          </Button>
        </div>
        
        {/* Free delivery notice */}
        <div className={`px-4 py-3 text-sm flex items-center gap-2 ${qualifiesForFreeDelivery 
          ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
          : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'} transition-colors duration-300`}>
          <Truck size={18} className="animate-bounce" style={{ animationDuration: '3s' }} />
          {qualifiesForFreeDelivery ? (
            <span>Congratulations! You've qualified for free delivery.</span>
          ) : (
            <span>Add ₹{amountAwayFromFreeDelivery.toFixed(2)} more to your order for free delivery.</span>
          )}
        </div>
        
        {/* Cart items */}
        <div className="flex-grow overflow-auto p-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 animate-scale-in">
              <ShoppingBag size={48} className="text-muted-foreground dark:text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground dark:text-gray-400 mb-6">Looks like you haven't added anything to your cart yet.</p>
              <Button onClick={closeCart} className="bg-blink hover:bg-blink-600 transition-transform hover:scale-105 active:scale-95">
                Start Shopping
              </Button>
            </div>
          ) : (
            <>
              <ul className="space-y-4 mb-4">
                {items.map((item, index) => (
                  <li key={item.product.id} className="flex gap-4 pb-4 border-b dark:border-gray-700 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    {/* Product image */}
                    <div className="h-20 w-20 bg-secondary/30 dark:bg-gray-700/30 rounded-md overflow-hidden flex-shrink-0 transition-transform duration-300 hover:scale-105">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    
                    {/* Product details */}
                    <div className="flex-grow">
                      <h4 className="font-medium text-sm dark:text-white">{item.product.name}</h4>
                      <p className="text-xs text-muted-foreground dark:text-gray-400">{item.product.unit}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-semibold dark:text-white">₹{(item.product.price * item.quantity).toFixed(2)}</span>
                        
                        {/* Quantity controls */}
                        <div className="flex items-center border dark:border-gray-600 rounded-full">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 w-7 p-0 rounded-full text-muted-foreground dark:text-gray-300 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus size={14} />
                          </Button>
                          <span className="w-8 text-center text-sm dark:text-white">{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 w-7 p-0 rounded-full text-muted-foreground dark:text-gray-300 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Remove button */}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeFromCart(item.product.id)}
                      className="h-7 w-7 p-0 rounded-full text-muted-foreground dark:text-gray-300 self-start transition-transform duration-200 hover:rotate-90"
                    >
                      <X size={16} />
                    </Button>
                  </li>
                ))}
              </ul>

              {/* Recommendations Section */}
              <CompleteYourRoutine cartItems={items.map(item => item.product)} />
            </>
          )}
        </div>
        
        {/* Footer with total and checkout */}
        {items.length > 0 && (
          <div className="border-t dark:border-gray-700 p-4 animate-fade-in">
            <div className="flex justify-between mb-1">
              <span className="text-muted-foreground dark:text-gray-400">Subtotal</span>
              <span className="font-medium dark:text-white">₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-muted-foreground dark:text-gray-400">Delivery</span>
              <span className={qualifiesForFreeDelivery ? "text-green-600 dark:text-green-400 font-medium" : "font-medium dark:text-white"}>
                {qualifiesForFreeDelivery ? "Free" : `₹${deliveryFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between mb-4 text-lg">
              <span className="font-medium dark:text-white">Total</span>
              <span className="font-bold dark:text-white">₹{(totalPrice + deliveryFee).toFixed(2)}</span>
            </div>
            <Button className="w-full bg-blink hover:bg-blink-600 text-white transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]">
              Checkout
            </Button>
          </div>
        )}
        
        {/* Show the theme toggle on cart as well */}
        <ThemeToggle />
      </div>
    </>
  );
};

export default CartSidebar;
