import React from 'react';
import { Skeleton } from './skeleton';
import { motion } from 'framer-motion';

// Product Card Skeleton
export const ProductCardSkeleton = () => (
  <motion.div 
    className="bg-card rounded-lg shadow-sm border p-4 space-y-3"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <Skeleton className="h-32 w-full rounded-lg" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-5 w-1/3" />
    </div>
    <Skeleton className="h-8 w-full rounded-md" />
  </motion.div>
);

// Category Section Skeleton
export const CategorySectionSkeleton = () => (
  <motion.div 
    className="py-8 md:py-10"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="container px-4 md:px-6 lg:px-8">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex-shrink-0 w-48">
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

// Hero Section Skeleton
export const HeroSkeleton = () => (
  <motion.div 
    className="container mx-auto px-4 py-20 md:py-32"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
  >
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-6 w-3/5" />
        <div className="flex gap-4">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 w-32" />
        </div>
      </div>
      <Skeleton className="h-96 w-full rounded-2xl" />
    </div>
  </motion.div>
);

// Menu Grid Skeleton
export const MenuGridSkeleton = () => (
  <motion.div 
    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    {Array.from({ length: 12 }).map((_, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <ProductCardSkeleton />
      </motion.div>
    ))}
  </motion.div>
);

// Cart Item Skeleton
export const CartItemSkeleton = () => (
  <motion.div 
    className="flex items-center space-x-4 p-4 border-b"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Skeleton className="h-16 w-16 rounded-lg" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-6 w-16" />
    </div>
  </motion.div>
);

// Search Results Skeleton
export const SearchResultsSkeleton = () => (
  <motion.div 
    className="space-y-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.4 }}
  >
    {Array.from({ length: 6 }).map((_, index) => (
      <motion.div
        key={index}
        className="flex items-center space-x-4 p-4 border rounded-lg"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <Skeleton className="h-20 w-20 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-6 w-1/4" />
        </div>
        <Skeleton className="h-10 w-24" />
      </motion.div>
    ))}
  </motion.div>
);

// Page Loading Skeleton
export const PageLoadingSkeleton = () => (
  <motion.div 
    className="min-h-screen bg-background"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    {/* Header Skeleton */}
    <div className="fixed top-0 left-0 right-0 z-40 bg-background border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-64" />
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
    
    {/* Content Skeleton */}
    <div className="pt-20 pb-10">
      <HeroSkeleton />
      <CategorySectionSkeleton />
      <CategorySectionSkeleton />
    </div>
  </motion.div>
);

// Shimmer effect component
export const ShimmerWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative overflow-hidden">
    {children}
    <motion.div
      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
      animate={{
        x: ['0%', '100%']
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    />
  </div>
);

// Loading Spinner
export const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} border-2 border-primary/20 border-t-primary rounded-full`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  );
};

// Skeleton Card for different content types
export const SkeletonCard = ({ 
  type = 'default' 
}: { 
  type?: 'product' | 'category' | 'order' | 'default' 
}) => {
  const skeletonConfig = {
    product: {
      image: 'h-32',
      title: 'h-4 w-3/4',
      subtitle: 'h-3 w-1/2',
      price: 'h-5 w-1/3',
      button: 'h-8 w-full'
    },
    category: {
      image: 'h-24',
      title: 'h-5 w-2/3',
      subtitle: 'h-3 w-1/3',
      price: '',
      button: ''
    },
    order: {
      image: 'h-16',
      title: 'h-4 w-1/2',
      subtitle: 'h-3 w-1/3',
      price: 'h-4 w-1/4',
      button: 'h-6 w-20'
    },
    default: {
      image: 'h-32',
      title: 'h-4 w-3/4',
      subtitle: 'h-3 w-1/2',
      price: 'h-4 w-1/3',
      button: 'h-8 w-full'
    }
  };

  const config = skeletonConfig[type];

  return (
    <ShimmerWrapper>
      <motion.div 
        className="bg-card rounded-lg shadow-sm border p-4 space-y-3"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <Skeleton className={`${config.image} w-full rounded-lg`} />
        <div className="space-y-2">
          <Skeleton className={config.title} />
          {config.subtitle && <Skeleton className={config.subtitle} />}
          {config.price && <Skeleton className={config.price} />}
        </div>
        {config.button && <Skeleton className={config.button + ' rounded-md'} />}
      </motion.div>
    </ShimmerWrapper>
  );
};