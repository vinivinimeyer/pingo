import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'gradient' | 'outline' | 'ghost' | 'link' | 'destructive';
  size?: 'sm' | 'default' | 'lg' | 'icon';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', isLoading, children, disabled, ...props }, ref) => {
    const variantClasses = {
      default: 'rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors',
      secondary: 'rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors',
      gradient: 'rounded-full gradient-peach px-6 py-3 text-sm font-medium text-primary hover:opacity-90 transition-opacity',
      outline: 'rounded-full border border-border bg-transparent px-6 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors',
      ghost: 'rounded-full bg-transparent px-6 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors',
      link: 'text-sm font-semibold text-foreground underline hover:text-accent transition-colors px-0 py-0',
      destructive: 'rounded-full bg-destructive px-6 py-3 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors',
    };

    const sizeClasses = {
      sm: 'px-4 py-2',
      default: 'px-6 py-3',
      lg: 'px-8 py-4',
      icon: 'h-10 w-10 rounded-full p-0',
    };

    // Para link variant, não aplicar tamanhos
    const finalSizeClass = variant === 'link' ? '' : sizeClasses[size];

    return (
      <button
        className={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          variantClasses[variant],
          finalSizeClass,
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="h-4 w-4 animate-spin"
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
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button };
