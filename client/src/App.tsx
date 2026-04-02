
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { StoreProvider } from "@/context/StoreContext";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MerchantSignup from "./pages/MerchantSignup";
import CreateStore from "./pages/CreateStore";
import MerchantDashboard from "./pages/MerchantDashboard";
import OrderHistory from "./pages/OrderHistory";
import Wishlist from "./pages/Wishlist";
import ProductDetail from "./pages/ProductDetail";
import OrderConfirmation from "./pages/OrderConfirmation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <StoreProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/merchant-signup" element={<MerchantSignup />} />
                
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                
                {/* Customer Routes */}
                <Route path="/cart" element={
                  <ProtectedRoute roles={['customer']}>
                    <Cart />
                  </ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute roles={['customer']}>
                    <OrderHistory />
                  </ProtectedRoute>
                } />
                <Route path="/wishlist" element={
                  <ProtectedRoute roles={['customer']}>
                    <Wishlist />
                  </ProtectedRoute>
                } />
                <Route path="/order-confirmation" element={
                   <ProtectedRoute roles={['customer']}>
                    <OrderConfirmation />
                  </ProtectedRoute>
                } />

                {/* Merchant Routes */}
                <Route path="/create-store" element={
                  <ProtectedRoute roles={['merchant']}>
                    <CreateStore />
                  </ProtectedRoute>
                } />
                <Route path="/inventory" element={
                  <ProtectedRoute roles={['merchant']}>
                    <MerchantDashboard />
                  </ProtectedRoute>
                } />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </StoreProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
