
import React, { useState, useEffect } from 'react';
import { MapPin, Search, ShoppingBag, User, LogIn } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { totalItems } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [location, setLocation] = useState('Select Location');
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
          <Link to="/" className="text-2xl font-bold text-blink dark:text-blink-400 flex items-center gap-1">
            <span className="text-3xl">🛒</span>
            Balaji Store
          </Link>
          
          {/* Location selector on smaller screens */}
          <button 
            className="hidden md:flex items-center gap-1 text-sm font-medium hover:text-blink smooth-transition"
            onClick={() => alert('Location selector would open here')}
          >
            <MapPin size={16} />
            <span className="max-w-[150px] text-shorten">{location}</span>
          </button>
          
          {/* Search bar */}
          <div className="flex-1 max-w-xl relative hidden md:block">
            <Input
              type="search"
              placeholder="Search for products..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-border bg-background/80 dark:bg-gray-800/50"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
          
          {/* Right side navigation buttons */}
          <div className="flex items-center gap-3">
            {/* User or Login buttons */}
            {isLoggedIn ? (
              <div className="relative group">
                <Button 
                  variant="ghost" 
                  className="p-2 rounded-full group-hover:bg-blink/10 group-hover:text-blink dark:group-hover:bg-blink-600/20 dark:group-hover:text-blink-400 smooth-transition"
                  aria-label="User Account"
                >
                  <User className="h-5 w-5" />
                </Button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="py-2">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
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
                  className="p-2 rounded-full hover:bg-blink/10 hover:text-blink dark:hover:bg-blink-600/20 dark:hover:text-blink-400 smooth-transition"
                  aria-label="Login"
                >
                  <LogIn className="h-5 w-5" />
                </Button>
              </Link>
            )}
            
            {/* Manager link */}
            <Link to="/manager">
              <Button 
                variant="ghost" 
                className="p-2 rounded-full hover:bg-blink/10 hover:text-blink dark:hover:bg-blink-600/20 dark:hover:text-blink-400 smooth-transition"
                aria-label="Manager Dashboard"
              >
                <User size={22} />
              </Button>
            </Link>
            
            {/* Menu link */}
            <Link to="/menu">
              <Button 
                variant="outline" 
                className="hidden md:flex hover:bg-blink/10 hover:text-blink hover:border-blink dark:hover:bg-blink-600/20 dark:hover:text-blink-400 dark:hover:border-blink-400"
              >
                Menu
              </Button>
            </Link>
            
            {/* Support link */}
            <Link to="/support">
              <Button 
                variant="outline" 
                className="hidden sm:flex hover:bg-blink/10 hover:text-blink hover:border-blink dark:hover:bg-blink-600/20 dark:hover:text-blink-400 dark:hover:border-blink-400"
              >
                Support
              </Button>
            </Link>
            
            {/* Cart button */}
            <Button 
              onClick={goToCart}
              variant="outline" 
              className="relative p-2 rounded-full hover:bg-blink/10 hover:text-blink hover:border-blink dark:hover:bg-blink-600/20 dark:hover:text-blink-400 dark:hover:border-blink-400 smooth-transition"
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
