
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Store, Image as ImageIcon, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { storeService } from '@/services/api';

const CreateStore = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await storeService.create({ name, description, image });
      
      toast({
        title: "Store Created!",
        description: "Welcome to the marketplace. You can now start adding products.",
      });
      
      navigate('/inventory');
    } catch (error: any) {
      toast({
        title: "Failed to create store",
        description: error.response?.data?.message || "Please check your store details.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-gray-900">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4 pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl"
        >
          <Card className="border-2 border-primary/20 shadow-2xl overflow-hidden">
            <div className="h-32 bg-primary/10 flex items-center justify-center">
                <Store className="h-16 w-16 text-primary/40" />
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">Set Up Your Store</CardTitle>
              <CardDescription>
                Customize your storefront to stand out and attract customers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <div className="relative">
                    <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="storeName"
                      placeholder="e.g. Green Valley Organics"
                      className="pl-10 h-11"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image">Store Banner/Logo URL</Label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="image"
                      placeholder="https://images.unsplash.com/..."
                      className="pl-10 h-11"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Store Description</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
                    <Textarea
                      id="description"
                      placeholder="Tell customers about your store, products, and values..."
                      className="pl-10 min-h-[120px]"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={isLoading}>
                  {isLoading ? "Setting up..." : "Launch Store"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

const Label = ({ children, htmlFor }: { children: React.ReactNode, htmlFor: string }) => (
  <label htmlFor={htmlFor} className="text-sm font-medium leading-none">
    {children}
  </label>
);

export default CreateStore;
