
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ChevronLeft, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Product } from '@/context/CartContext';
import { motion } from 'framer-motion';

interface OrderItem {
  product: Product;
  quantity: number;
}

interface OrderDetails {
  id: string;
  items: OrderItem[];
  total: number;
  date: string;
  address: string;
  paymentMethod: string;
}

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  
  useEffect(() => {
    const storedOrder = localStorage.getItem('last-order');
    
    if (storedOrder) {
      try {
        const parsedOrder = JSON.parse(storedOrder);
        setOrder(parsedOrder);
      } catch (error) {
        console.error('Failed to parse order data', error);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleContinueShopping = () => {
    navigate('/');
  };
  
  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-pulse">
          <div className="h-12 w-12 bg-gray-300 rounded-full mb-4 mx-auto"></div>
          <div className="h-4 bg-gray-300 rounded w-48 mb-2.5"></div>
          <div className="h-4 bg-gray-300 rounded w-36"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-gray-900">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground">
              Thank you for your order. Your order has been received and is now being processed.
            </p>
          </motion.div>
          
          <Card className="mb-8 print:shadow-none">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Order Receipt</CardTitle>
                <Button variant="ghost" size="sm" className="print:hidden" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <p className="font-medium">{order.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{order.date}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Items</h3>
                  <ScrollArea className="h-[220px] rounded-md border">
                    <div className="p-4">
                      <table className="w-full">
                        <thead className="text-xs text-left text-muted-foreground">
                          <tr>
                            <th className="pb-2">Item</th>
                            <th className="pb-2 text-center">Qty</th>
                            <th className="pb-2 text-right">Price</th>
                            <th className="pb-2 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item) => (
                            <tr key={item.product.id} className="border-t">
                              <td className="py-2">
                                <div className="font-medium">{item.product.name}</div>
                                <div className="text-xs text-muted-foreground">{item.product.unit}</div>
                              </td>
                              <td className="py-2 text-center">{item.quantity}</td>
                              <td className="py-2 text-right">₹{item.product.price.toFixed(2)}</td>
                              <td className="py-2 text-right">₹{(item.product.price * item.quantity).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </ScrollArea>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{order.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>₹0.00</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">Tax</span>
                    <span>₹{(order.total * 0.18).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                    <span>Total</span>
                    <span>₹{(order.total + (order.total * 0.18)).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Shipping Address</h3>
                  <p className="text-muted-foreground">{order.address || "Default Address, City, State, PIN"}</p>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Payment Method</h3>
                  <p className="text-muted-foreground">{order.paymentMethod}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-center print:hidden">
            <Button 
              variant="outline" 
              className="mr-2"
              onClick={handleContinueShopping}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
