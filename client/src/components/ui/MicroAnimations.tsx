import React from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

// Hover scale animation wrapper
export const HoverScale: React.FC<{
  children: React.ReactNode;
  scale?: number;
  className?: string;
}> = ({ children, scale = 1.05, className = '' }) => (
  <motion.div
    className={className}
    whileHover={{ scale }}
    whileTap={{ scale: scale * 0.95 }}
    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
  >
    {children}
  </motion.div>
);

// Magnetic hover effect
export const MagneticHover: React.FC<{
  children: React.ReactNode;
  className?: string;
  strength?: number;
}> = ({ children, className = '', strength = 0.3 }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
};

// Floating animation
export const FloatingElement: React.FC<{
  children: React.ReactNode;
  className?: string;
  duration?: number;
  range?: number;
}> = ({ children, className = '', duration = 3, range = 10 }) => (
  <motion.div
    className={className}
    animate={{
      y: [-range, range, -range],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  >
    {children}
  </motion.div>
);

// Stagger animation for list items
export const StaggerContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}> = ({ children, className = '', staggerDelay = 0.1 }) => (
  <motion.div
    className={className}
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
        },
      },
    }}
  >
    {children}
  </motion.div>
);

export const StaggerItem: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <motion.div
    className={className}
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 100 },
      },
    }}
  >
    {children}
  </motion.div>
);

// Pulse glow effect
export const PulseGlow: React.FC<{
  children: React.ReactNode;
  className?: string;
  color?: string;
}> = ({ children, className = '', color = 'rgba(14, 167, 90, 0.3)' }) => (
  <motion.div
    className={className}
    animate={{
      boxShadow: [
        `0 0 0 0 ${color}`,
        `0 0 0 10px rgba(14, 167, 90, 0)`,
        `0 0 0 0 ${color}`,
      ],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  >
    {children}
  </motion.div>
);

// Shake animation for errors
export const ShakeOnError: React.FC<{
  children: React.ReactNode;
  className?: string;
  trigger: boolean;
}> = ({ children, className = '', trigger }) => (
  <motion.div
    className={className}
    animate={trigger ? {
      x: [-5, 5, -5, 5, 0],
    } : {}}
    transition={{
      duration: 0.5,
      ease: 'easeInOut',
    }}
  >
    {children}
  </motion.div>
);

// Bounce on tap
export const BounceOnTap: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <motion.div
    className={className}
    whileTap={{
      scale: 0.95,
      transition: { type: 'spring', stiffness: 400, damping: 17 },
    }}
  >
    {children}
  </motion.div>
);

// Typewriter effect
export const TypewriterText: React.FC<{
  text: string;
  className?: string;
  speed?: number;
}> = ({ text, className = '', speed = 50 }) => {
  const [displayText, setDisplayText] = React.useState('');

  React.useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
      >
        |
      </motion.span>
    </motion.span>
  );
};

// Count up animation
export const CountUp: React.FC<{
  from: number;
  to: number;
  duration?: number;
  className?: string;
}> = ({ from, to, duration = 2, className = '' }) => {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (value) => Math.round(value));
  const [displayValue, setDisplayValue] = React.useState(from);

  React.useEffect(() => {
    const controls = count.set(to);
    return count.onChange((value) => setDisplayValue(Math.round(value)));
  }, [count, to]);

  React.useEffect(() => {
    count.set(to);
  }, [count, to]);

  return (
    <motion.span
      className={className}
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {displayValue}
    </motion.span>
  );
};

// Gradient text animation
export const AnimatedGradientText: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <motion.span
    className={`bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent bg-size-200 ${className}`}
    animate={{
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: 'linear',
    }}
    style={{
      backgroundSize: '200% 200%',
    }}
  >
    {children}
  </motion.span>
);

// Morphing button
export const MorphingButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}> = ({ children, className = '', isLoading = false }) => (
  <motion.button
    className={className}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    animate={isLoading ? {
      scale: [1, 1.05, 1],
    } : {}}
    transition={isLoading ? {
      duration: 1,
      repeat: Infinity,
      ease: 'easeInOut',
    } : {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    }}
  >
    <motion.div
      animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
      transition={isLoading ? {
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      } : {}}
    >
      {children}
    </motion.div>
  </motion.button>
);

// Parallax scroll effect
export const ParallaxElement: React.FC<{
  children: React.ReactNode;
  className?: string;
  speed?: number;
}> = ({ children, className = '', speed = 0.5 }) => {
  const [offsetY, setOffsetY] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => setOffsetY(window.pageYOffset);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      className={className}
      style={{
        transform: `translateY(${offsetY * speed}px)`,
      }}
    >
      {children}
    </motion.div>
  );
};