import * as React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export function Sheet({ open, onOpenChange, children, side = 'bottom' }: SheetProps) {
  if (!open) return null;

  const sideClasses = {
    bottom: 'bottom-0 left-0 right-0 rounded-t-2xl',
    top: 'top-0 left-0 right-0 rounded-b-2xl',
    left: 'left-0 top-0 bottom-0 rounded-r-2xl',
    right: 'right-0 top-0 bottom-0 rounded-l-2xl',
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-foreground/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Sheet */}
      <div
        className={cn(
          'fixed z-50 bg-card border-t border-border shadow-xl',
          sideClasses[side]
        )}
      >
        {children}
      </div>
    </>
  );
}

interface SheetContentProps {
  children: React.ReactNode;
  onClose?: () => void;
}

export function SheetContent({ children, onClose }: SheetContentProps) {
  return (
    <div className="relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-muted rounded-lg transition-colors z-10"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>
      )}
      {children}
    </div>
  );
}

interface SheetHeaderProps {
  children: React.ReactNode;
}

export function SheetHeader({ children }: SheetHeaderProps) {
  return <div className="p-6 pb-0">{children}</div>;
}

interface SheetTitleProps {
  children: React.ReactNode;
}

export function SheetTitle({ children }: SheetTitleProps) {
  return <h2 className="text-2xl font-bold tracking-tight">{children}</h2>;
}

interface SheetDescriptionProps {
  children: React.ReactNode;
}

export function SheetDescription({ children }: SheetDescriptionProps) {
  return <p className="text-sm text-muted-foreground mt-2">{children}</p>;
}
