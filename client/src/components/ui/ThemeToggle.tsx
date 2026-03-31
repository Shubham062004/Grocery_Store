
import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { AnimatePresence, motion } from 'framer-motion';

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Check local storage or default to light
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      // Default to 'light' unless 'dark' is explicitly saved
      return savedTheme === 'dark' ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    // Update localStorage and document class when theme changes
    localStorage.setItem('theme', theme);
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <Button 
      onClick={toggleTheme}
      variant="outline" 
      size="icon"
      className="fixed bottom-4 right-4 z-50 rounded-full h-12 w-12 bg-background dark:bg-gray-800 border border-border shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center"
        >
          {theme === 'light' ? 
            <Moon className="h-5 w-5 text-foreground" /> : 
            <Sun className="h-5 w-5 text-foreground" />}
        </motion.div>
      </AnimatePresence>
    </Button>
  );
};

export default ThemeToggle;
