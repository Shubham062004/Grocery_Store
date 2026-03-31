
import React, { createContext, useContext, useState, useEffect } from 'react';

interface Store {
  id: string;
  _id?: string;
  name: string;
  description: string;
  image: string;
}

interface StoreContextType {
  selectedStore: Store | null;
  setSelectedStore: (store: Store | null) => void;
  isLoading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedStore, setSelectedStoreState] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedStore = localStorage.getItem('selectedStore');
    if (savedStore) {
      try {
        setSelectedStoreState(JSON.parse(savedStore));
      } catch (error) {
        console.error("Failed to parse saved store:", error);
      }
    }
    setIsLoading(false);
  }, []);

  const setSelectedStore = (store: Store | null) => {
    setSelectedStoreState(store);
    if (store) {
      localStorage.setItem('selectedStore', JSON.stringify(store));
    } else {
      localStorage.removeItem('selectedStore');
    }
  };

  return (
    <StoreContext.Provider value={{ selectedStore, setSelectedStore, isLoading }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
