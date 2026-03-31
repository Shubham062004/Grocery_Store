
import React, { useState, useEffect } from 'react';
import { MapPin, Search, ShoppingBag, User, LogIn, Store, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { totalItems } = useCart();
  const { selectedStore, setSelectedStore } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  
  // Check login status
  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);
  
  // Change header style on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goToCart = () => {
    navigate('/cart');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleChangeStore = () => {
    setSelectedStore(null);
    navigate('/');
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-8 smooth-transition ${
        isScrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blink dark:text-blink-400 flex items-center gap-1 shrink-0">
            <span className="text-3xl">🛒</span>
            <span className="hidden sm:inline">Marketplace</span>
          </Link>
          
          {/* Store Selector */}
          <button 
            type="button"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-primary/20 text-sm font-medium hover:bg-primary/5 hover:border-primary/40 smooth-transition shadow-sm cursor-pointer z-[60]"
            onClick={(e) => {
              console.log('Store selector clicked');
              handleChangeStore();
            }}
          >
            <Store size={16} className="text-primary shrink-0" />
            <span className="max-w-[100px] md:max-w-[200px] truncate text-foreground font-semibold">
              {selectedStore ? selectedStore.name : 'Select Store'}
            </span>
            {selectedStore && (
              <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Switch</span>
            )}
            <ChevronDown size={14} className="text-muted-foreground shrink-0" />
          </button>
          
          {/* Search bar */}
          <div className="flex-1 max-w-sm relative hidden lg:block">
            <Input
              type="search"
              placeholder={selectedStore ? `Search in ${selectedStore.name}...` : "Search products..."}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-border bg-background/80 dark:bg-gray-800/50"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
          
          {/* Right side navigation buttons */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* User or Login buttons */}
            {isLoggedIn ? (
              <div className="relative group">
                <Button 
                  variant="ghost" 
                  className="p-2 rounded-full hover:bg-blink/10 hover:text-blink smooth-transition"
                  aria-label="User Account"
                >
                  <User className="h-5 w-5" />
                </Button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-border">
                  <div className="py-2">
                    <Link to="/inventory" className="block px-4 py-2 text-sm hover:bg-muted font-medium">Merchant Dashboard</Link>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-sm text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login">
                <Button 
                  variant="ghost" 
                  className="p-2 rounded-full hover:bg-blink/10 hover:text-blink smooth-transition"
                  aria-label="Login"
                >
                  <LogIn className="h-5 w-5" />
                </Button>
              </Link>
            )}
            
            {/* Menu link */}
            <Link to="/menu" className="hidden md:block">
              <Button variant="ghost" size="sm">Menu</Button>
            </Link>
            
            {/* Support link */}
            <Link to="/support" className="hidden sm:block">
              <Button variant="ghost" size="sm">Support</Button>
            </Link>
            
            {/* Cart button */}
            <Button 
              onClick={goToCart}
              variant="outline" 
              className="relative p-2 rounded-full hover:bg-blink/10 hover:text-blink hover:border-blink smooth-transition"
            >
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blink dark:bg-blink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-scale-in">
                  {totalItems}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
