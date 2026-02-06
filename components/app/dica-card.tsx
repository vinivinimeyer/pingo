'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DicaCardDica {
  id: string;
  titulo: string;
  imagem: string;
  localizacao: string;
  categoria: string;
  curtidas?: number;
}

interface DicaCardProps {
  dica: DicaCardDica;
  variant?: 'grid' | 'list' | 'compact';
  onSelect?: (id: string) => void;
  selected?: boolean;
  showDestaque?: boolean;
}

export function DicaCard({
  dica,
  variant = 'grid',
  onSelect,
  selected = false,
  showDestaque = false,
}: DicaCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (onSelect) {
      e.preventDefault();
      e.stopPropagation();
      onSelect(dica.id);
    }
  };

  const content = (
    <>
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={dica.imagem}
          alt={dica.titulo}
          fill
          className="object-cover"
          sizes={variant === 'grid' ? '(max-width: 768px) 50vw, 200px' : '100vw'}
        />
        {showDestaque && (
          <div className="absolute top-2 left-2 rounded-full bg-accent/90 px-2 py-0.5 text-[10px] font-medium text-primary backdrop-blur-sm flex items-center gap-1">
            <span>★</span> Destaque
          </div>
        )}
        {onSelect != null && (
          <div
            className={cn(
              'absolute top-2 right-2 h-6 w-6 rounded-full flex items-center justify-center transition-colors',
              selected ? 'bg-accent' : 'bg-card/80 backdrop-blur-sm border border-border'
            )}
          >
            {selected && <Check className="h-4 w-4 text-primary" strokeWidth={3} />}
          </div>
        )}
      </div>
      <div className={cn('p-3', variant === 'compact' && 'p-2')}>
        <p
          className={cn(
            'font-semibold line-clamp-2 text-foreground',
            variant === 'grid' && 'text-sm',
            variant === 'list' && 'text-sm',
            variant === 'compact' && 'text-xs line-clamp-1'
          )}
        >
          {dica.titulo}
        </p>
        <p
          className={cn(
            'text-muted-foreground flex items-center gap-1 mt-1',
            variant === 'compact' ? 'text-[10px]' : 'text-xs'
          )}
        >
          <MapPin className="h-3 w-3 shrink-0" strokeWidth={1.5} />
          <span className="line-clamp-1">{dica.localizacao}</span>
        </p>
        {variant === 'list' && dica.categoria && (
          <span className="inline-block mt-2 rounded-full bg-muted px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            {dica.categoria}
          </span>
        )}
      </div>
    </>
  );

  const cardClassName = cn(
    'rounded-2xl border bg-card overflow-hidden transition-all',
    variant === 'compact' && 'rounded-xl',
    onSelect
      ? selected
        ? 'border-2 border-accent'
        : 'border-2 border-border'
      : 'border border-border hover:shadow-lg'
  );

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={cn('w-full text-left block', variant === 'list' && 'flex gap-3')}
      >
        <div className={cn(cardClassName, variant === 'list' && 'flex flex-1 min-w-0')}>
          {variant === 'list' ? (
            <>
              <div className="relative h-24 w-24 shrink-0 overflow-hidden">
                <Image
                  src={dica.imagem}
                  alt={dica.titulo}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
                {selected && (
                  <div className="absolute top-1 right-1 h-5 w-5 rounded-full bg-accent flex items-center justify-center">
                    <Check className="h-3 w-3 text-primary" strokeWidth={3} />
                  </div>
                )}
              </div>
              <div className="p-3 flex-1 min-w-0">
                <p className="text-sm font-semibold line-clamp-2">{dica.titulo}</p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <MapPin className="h-3 w-3 shrink-0" />
                  {dica.localizacao}
                </p>
              </div>
            </>
          ) : (
            content
          )}
        </div>
      </button>
    );
  }

  return (
    <Link href={`/dica/${dica.id}`}>
      <div className={cn(cardClassName, variant === 'list' && 'flex')}>
        {variant === 'list' ? (
          <>
            <div className="relative h-24 w-24 shrink-0 overflow-hidden">
              <Image src={dica.imagem} alt={dica.titulo} fill className="object-cover" sizes="96px" />
            </div>
            <div className="p-3 flex-1 min-w-0">
              <p className="text-sm font-semibold line-clamp-2">{dica.titulo}</p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <MapPin className="h-3 w-3 shrink-0" />
                {dica.localizacao}
              </p>
              {dica.categoria && (
                <span className="inline-block mt-2 rounded-full bg-muted px-2 py-0.5 text-[10px] font-mono uppercase text-muted-foreground">
                  {dica.categoria}
                </span>
              )}
            </div>
          </>
        ) : (
          content
        )}
      </div>
    </Link>
  );
}
