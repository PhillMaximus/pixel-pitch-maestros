
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  pixelBorder?: boolean;
}

const PixelButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  pixelBorder = true,
  className,
  ...props 
}: PixelButtonProps) => {
  const baseClasses = 'font-pixel transition-all duration-200 active:scale-95 hover:scale-105';
  
  const variantClasses = {
    primary: 'bg-retro-yellow-highlight text-retro-green-dark hover:bg-yellow-300 border-retro-green-dark',
    secondary: 'bg-retro-blue-team text-retro-white-lines hover:bg-blue-600 border-retro-white-lines',
    success: 'bg-retro-green-field text-retro-white-lines hover:bg-green-600 border-retro-white-lines',
    danger: 'bg-retro-red-team text-retro-white-lines hover:bg-red-600 border-retro-white-lines'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  const pixelBorderClass = pixelBorder ? 'border-2 border-solid' : '';
  
  return (
    <Button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        pixelBorderClass,
        'shadow-lg hover:shadow-xl',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

export default PixelButton;
