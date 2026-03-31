
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';
import { storeService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Store } from 'lucide-react';

const StoreList: React.FC = () => {
  const [stores, setStores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setSelectedStore } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const { data } = await storeService.getAll();
        setStores(data);
      } catch (err: any) {
        console.error("Failed to fetch stores:", err);
        setError(err.response?.data?.message || "Failed to load stores. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStores();
  }, []);

  const handleSelectStore = (store: any) => {
    setSelectedStore(store);
    navigate('/menu');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Finding nearby stores...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-12">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stores.map((store) => (
        <Card key={store._id} className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="h-48 overflow-hidden">
            <img 
              src={store.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=500'} 
              alt={store.name}
              className="w-full h-full object-cover"
            />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              {store.name}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {store.description}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" onClick={() => handleSelectStore(store)}>
              Shop Now
            </Button>
          </CardFooter>
        </Card>
      ))}
      {stores.length === 0 && (
        <div className="col-span-full text-center p-12">
          <p className="text-muted-foreground font-medium">No stores available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default StoreList;
