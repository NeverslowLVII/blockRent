'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type LoaderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface LoaderProps {
  size?: LoaderSize;
  text?: string;
  className?: string;
  variant?: 'circle' | 'dots' | 'spinner';
  color?: 'primary' | 'secondary' | 'white';
}

export default function Loader({
  size = 'md',
  text,
  className,
  variant = 'circle',
  color = 'primary'
}: LoaderProps) {
  const sizeClasses: Record<LoaderSize, string> = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses: Record<string, string> = {
    primary: 'text-blue-600',
    secondary: 'text-purple-600',
    white: 'text-white'
  };

  // Spinner variant
  if (variant === 'spinner') {
    return (
      <div className={cn('flex flex-col items-center justify-center', className)}>
        <motion.div
          className={cn('border-t-transparent rounded-full border-4', 
            sizeClasses[size], 
            color === 'primary' ? 'border-blue-600' : 
            color === 'secondary' ? 'border-purple-600' : 'border-white'
          )}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        {text && <p className={cn('mt-2 text-sm', colorClasses[color])}>{text}</p>}
      </div>
    );
  }

  // Dots variant
  if (variant === 'dots') {
    const dotSize = size === 'xs' ? 'w-1 h-1' : 
                    size === 'sm' ? 'w-1.5 h-1.5' : 
                    size === 'md' ? 'w-2 h-2' : 
                    size === 'lg' ? 'w-2.5 h-2.5' : 'w-3 h-3';
    
    return (
      <div className={cn('flex flex-col items-center justify-center', className)}>
        <div className="flex space-x-2">
          <motion.div
            className={cn('rounded-full', dotSize, colorClasses[color])}
            animate={{ scale: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className={cn('rounded-full', dotSize, colorClasses[color])}
            animate={{ scale: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          />
          <motion.div
            className={cn('rounded-full', dotSize, colorClasses[color])}
            animate={{ scale: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          />
        </div>
        {text && <p className={cn('mt-2 text-sm', colorClasses[color])}>{text}</p>}
      </div>
    );
  }

  // Default circle variant
  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <svg
        className={cn('animate-spin', sizeClasses[size], colorClasses[color])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      {text && <p className={cn('mt-2 text-sm', colorClasses[color])}>{text}</p>}
    </div>
  );
} 