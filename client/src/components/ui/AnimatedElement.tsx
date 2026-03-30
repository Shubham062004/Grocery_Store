
import React from 'react';
import { motion, Variants, HTMLMotionProps } from 'framer-motion';

type AnimationType = 
  | 'fadeIn' 
  | 'fadeInUp' 
  | 'fadeInDown' 
  | 'fadeInLeft' 
  | 'fadeInRight'
  | 'zoom' 
  | 'bounce' 
  | 'flip' 
  | 'rotate' 
  | 'slide'
  | 'none';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';
type HoverEffect = 'grow' | 'shrink' | 'pulse' | 'wiggle' | 'glow' | 'zoom' | 'none';
type TapEffect = 'shrink' | 'grow' | 'none';

// Refining the interface to properly extend HTMLMotionProps
interface AnimatedElementProps extends Omit<HTMLMotionProps<'div'>, 'whileHover' | 'whileTap' | 'as'> {
  children: React.ReactNode;
  type?: AnimationType;
  direction?: Direction;
  delay?: number;
  duration?: number;
  staggerChildren?: number;
  staggerDirection?: 'forward' | 'reverse';
  threshold?: number;
  margin?: string;
  viewportEnabled?: boolean;
  once?: boolean;
  className?: string;
  as?: 'div';
  whileHover?: HoverEffect;
  whileTap?: TapEffect;
}

const variants: Record<AnimationType, (direction: Direction) => Variants> = {
  fadeIn: () => ({
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }),
  fadeInUp: () => ({
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  }),
  fadeInDown: () => ({
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 }
  }),
  fadeInLeft: () => ({
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 }
  }),
  fadeInRight: () => ({
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 }
  }),
  zoom: () => ({
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  }),
  bounce: () => ({
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', bounce: 0.5 } }
  }),
  flip: (direction) => {
    const isVertical = direction === 'up' || direction === 'down';
    const axis = isVertical ? 'X' : 'Y';
    const sign = direction === 'up' || direction === 'left' ? -1 : 1;
    
    return {
      hidden: { opacity: 0, rotate: sign * 90, perspective: 500 },
      visible: { opacity: 1, rotate: 0, perspective: 500 }
    };
  },
  rotate: () => ({
    hidden: { opacity: 0, rotate: -45 },
    visible: { opacity: 1, rotate: 0 }
  }),
  slide: (direction) => {
    const offset = 100;
    const x = direction === 'left' ? -offset : direction === 'right' ? offset : 0;
    const y = direction === 'up' ? -offset : direction === 'down' ? offset : 0;
    
    return {
      hidden: { opacity: 0, x, y },
      visible: { opacity: 1, x: 0, y: 0 }
    };
  },
  none: () => ({
    hidden: {},
    visible: {}
  })
};

const hoverVariants = {
  grow: { scale: 1.05 },
  shrink: { scale: 0.95 },
  pulse: { scale: [1, 1.05, 1], transition: { duration: 0.5, repeat: Infinity } },
  wiggle: { rotate: [0, 3, -3, 0], transition: { duration: 0.5 } },
  glow: { boxShadow: '0 0 8px rgba(255, 255, 255, 0.6)' },
  zoom: { scale: 1.1 },
  none: {}
};

const tapVariants = {
  shrink: { scale: 0.95 },
  grow: { scale: 1.05 },
  none: {}
};

const AnimatedElement: React.FC<AnimatedElementProps> = ({
  children,
  type = 'fadeIn',
  direction = 'none',
  delay = 0,
  duration = 0.5,
  staggerChildren = 0,
  staggerDirection = 'forward',
  threshold = 0.1,
  margin = '0px',
  viewportEnabled = true,
  once = true,
  className = '',
  whileHover = 'none',
  whileTap = 'none',
  as = 'div',
  ...props
}) => {
  const variantDefinition = variants[type](direction);
  
  const viewportProps = viewportEnabled ? { 
    once, 
    amount: threshold,
    margin 
  } : undefined;

  // Create the animation properties separately
  const animationProps = {
    initial: "hidden",
    animate: viewportEnabled ? undefined : "visible",
    whileInView: viewportEnabled ? "visible" : undefined,
    viewport: viewportProps,
    variants: {
      ...variantDefinition,
      visible: {
        ...variantDefinition.visible,
        transition: {
          duration,
          delay,
          staggerChildren,
          staggerDirection: staggerDirection === 'forward' ? 1 : -1,
        }
      }
    },
    // Convert string hover/tap effects to their actual variant objects
    ...(whileHover !== 'none' ? { whileHover: hoverVariants[whileHover] } : {}),
    ...(whileTap !== 'none' ? { whileTap: tapVariants[whileTap] } : {})
  };
  
  // Use motion.div directly to avoid complex type issues
  const MotionComponent = motion.div;
  
  return (
    <MotionComponent
      className={className}
      {...animationProps}
      {...(props as any)}
    >
      {children}
    </MotionComponent>
  );
};

export default AnimatedElement;
