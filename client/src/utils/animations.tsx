
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// Common animation variants
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};

export const slideUp: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
  exit: { 
    y: -20, 
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};

export const slideInFromRight: Variants = {
  hidden: { x: 100, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] }
  },
  exit: { 
    x: 100, 
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};

export const scaleIn: Variants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] }
  },
  exit: { 
    scale: 0.95, 
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
};

export const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const rotateIn: Variants = {
  hidden: { rotate: -5, opacity: 0 },
  visible: { 
    rotate: 0, 
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

export const bounceIn: Variants = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
};

// CSS-based animation components
export const FadeIn = ({ children, duration = 0.5, delay = 0 }: { 
  children: React.ReactNode; 
  duration?: number; 
  delay?: number;
}) => {
  return (
    <div 
      className="opacity-0 animate-fade-in" 
      style={{ 
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        animationFillMode: 'forwards'
      }}
    >
      {children}
    </div>
  );
};

export const ScaleIn = ({ children, duration = 0.5, delay = 0 }: { 
  children: React.ReactNode; 
  duration?: number; 
  delay?: number;
}) => {
  return (
    <div 
      className="scale-95 opacity-0 animate-scale-in" 
      style={{ 
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        animationFillMode: 'forwards'
      }}
    >
      {children}
    </div>
  );
};

// Animation presence wrapper for easy entrance/exit animations
export const AnimatedSection = ({ 
  children, 
  variants = fadeIn,
  className = "",
  initiallyVisible = false
}: { 
  children: React.ReactNode; 
  variants?: Variants;
  className?: string;
  initiallyVisible?: boolean;
}) => {
  const [isVisible, setIsVisible] = useState(initiallyVisible);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className={className}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hook to trigger animations when element is in viewport
export const useInViewAnimation = (options = {}) => {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  useEffect(() => {
    if (!ref) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated) {
        setHasAnimated(true);
      }
    }, {
      threshold: 0.1,
      ...options
    });
    
    observer.observe(ref);
    
    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [ref, options, hasAnimated]);
  
  return {
    ref: (node: HTMLDivElement) => {
      if (ref !== node) {
        setHasAnimated(false);
        setRef(node);
      }
    },
    inView: hasAnimated
  };
};

// GSAP-like animations using Framer Motion
export const AnimatedBox = ({ 
  children, 
  animation = "fadeIn", 
  duration = 1,
  delay = 0,
  className = ""
}: {
  children: React.ReactNode;
  animation?: "fadeIn" | "slideUp" | "slideIn" | "scaleIn" | "rotateIn" | "bounceIn";
  duration?: number;
  delay?: number;
  className?: string;
}) => {
  let variants: Variants;
  
  switch (animation) {
    case "slideUp":
      variants = slideUp;
      break;
    case "slideIn":
      variants = slideInFromRight;
      break;
    case "scaleIn":
      variants = scaleIn;
      break;
    case "rotateIn":
      variants = rotateIn;
      break;
    case "bounceIn":
      variants = bounceIn;
      break;
    case "fadeIn":
    default:
      variants = fadeIn;
      break;
  }
  
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      transition={{ 
        duration: duration, 
        delay: delay
      }}
    >
      {children}
    </motion.div>
  );
};

// Animated staggered list items
export const AnimatedList = ({ 
  children, 
  staggerDelay = 0.1
}: {
  children: React.ReactNode;
  staggerDelay?: number;
}) => {
  return (
    <motion.ul
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
    >
      {children}
    </motion.ul>
  );
};

export const AnimatedListItem = ({ 
  children, 
  animation = "fadeIn"
}: {
  children: React.ReactNode;
  animation?: "fadeIn" | "slideUp" | "slideIn" | "scaleIn";
}) => {
  let variants: Variants;
  
  switch (animation) {
    case "slideUp":
      variants = slideUp;
      break;
    case "slideIn":
      variants = slideInFromRight;
      break;
    case "scaleIn":
      variants = scaleIn;
      break;
    default:
      variants = fadeIn;
      break;
  }
  
  return (
    <motion.li variants={variants}>
      {children}
    </motion.li>
  );
};
