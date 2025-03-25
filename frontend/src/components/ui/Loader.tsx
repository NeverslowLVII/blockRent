'use client';

import { motion } from 'framer-motion';

type LoaderSize = 'sm' | 'md' | 'lg';

interface LoaderProps {
  size?: LoaderSize;
  color?: string;
  className?: string;
}

const sizeClasses: Record<LoaderSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export default function Loader({ size = 'md', color = 'text-blue-500', className = '' }: LoaderProps) {
  const sizeClass = sizeClasses[size];
  
  // Animation variants for dots
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };
  
  const dotVariants = {
    initial: { y: 0, opacity: 0.2 },
    animate: {
      y: [0, -10, 0],
      opacity: [0.2, 1, 0.2],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };
  
  return (
    <div className="flex justify-center items-center">
      <motion.div 
        className="flex space-x-2"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.div
          className={`rounded-full ${sizeClass} bg-gradient-to-r from-blue-400 to-blue-600 ${className}`}
          variants={dotVariants}
        />
        <motion.div
          className={`rounded-full ${sizeClass} bg-gradient-to-r from-purple-400 to-purple-600 ${className}`}
          variants={dotVariants}
        />
        <motion.div
          className={`rounded-full ${sizeClass} bg-gradient-to-r from-blue-600 to-purple-600 ${className}`}
          variants={dotVariants}
        />
      </motion.div>
    </div>
  );
} 