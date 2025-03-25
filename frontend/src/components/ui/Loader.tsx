'use client';

type LoaderSize = 'sm' | 'md' | 'lg';

interface LoaderProps {
  size?: LoaderSize;
  color?: string;
  className?: string;
}

const sizeClasses: Record<LoaderSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-3',
};

export default function Loader({ size = 'md', color = 'border-blue-500', className = '' }: LoaderProps) {
  const sizeClass = sizeClasses[size];
  
  return (
    <div className="flex justify-center items-center">
      <div 
        className={`animate-spin rounded-full ${sizeClass} border-t-transparent ${color} ${className}`} 
      />
    </div>
  );
} 