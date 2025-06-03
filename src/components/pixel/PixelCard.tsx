
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PixelCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'dark' | 'highlight';
}

const PixelCard = ({ children, className, variant = 'default' }: PixelCardProps) => {
  const variantClasses = {
    default: 'bg-retro-gray-concrete border-retro-white-lines',
    dark: 'bg-retro-gray-dark border-retro-gray-concrete',
    highlight: 'bg-retro-yellow-highlight border-retro-green-dark text-retro-green-dark'
  };

  return (
    <Card className={cn(
      'border-4 border-solid shadow-2xl transition-all duration-300',
      'hover:shadow-[8px_8px_0px_0px_rgba(255,193,7,0.3)]',
      'transform hover:-translate-y-1',
      variantClasses[variant],
      className
    )}>
      {children}
    </Card>
  );
};

export default PixelCard;
