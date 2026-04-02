
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Package, ShoppingBag, Clock, CheckCircle, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { orderService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const OrderHistory = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await orderService.getMyOrders();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error: any) {
        toast({
          title: "Failed to load orders",
          description: error.response?.data?.message || "Something went wrong.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [toast]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'text-green-600 bg-green-50 dark:bg-green-900/10';
      case 'processing': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/10';
      case 'shipped': return 'text-purple-600 bg-purple-50 dark:bg-purple-900/10';
      default: return 'text-amber-600 bg-amber-50 dark:bg-amber-900/10';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-gray-900">
      <Header />
      <main className="flex-grow pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-primary/10 p-2 rounded-lg">
                <Clock className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Order History</h1>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <Card className="text-center p-12 border-dashed">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h2 className="text-xl font-semibold mb-2">No orders found</h2>
              <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
              <Button asChild>
                <Link to="/">Start Shopping</Link>
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order, idx) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="overflow-hidden hover:border-primary/40 transition-colors shadow-sm">
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Order ID</p>
                          <p className="font-mono text-sm">#{order._id.slice(-8).toUpperCase()}</p>
                        </div>
                        <div className="space-y-1 sm:text-right">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Date Placed</p>
                          <p className="text-sm">{order.createdAt ? format(new Date(order.createdAt), 'MMM dd, yyyy') : 'Recently'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${getStatusColor(order.status || 'Pending')}`}>
                             {order.status === 'Delivered' ? <CheckCircle className="h-3 w-3" /> : <Package className="h-3 w-3" />}
                             {order.status || 'Pending'}
                           </span>
                        </div>
                      </div>

                      <div className="border-t border-b py-4 my-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Items ({order.orderItems?.length || 0})</span>
                            <span className="text-sm font-bold">Total: ₹{order.totalPrice?.toFixed(2)}</span>
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {order.orderItems?.map((item: any, i: number) => (
                                <div key={`${order._id}-item-${i}`} className="min-w-[50px] h-[50px] rounded bg-muted border overflow-hidden flex-shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button variant="ghost" size="sm" className="gap-1 hover:text-primary">
                          View Details <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderHistory;
