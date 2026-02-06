'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface GuiaCardGuia {
  id: string;
  titulo: string;
  capa: string;
  cidade: string;
  categoria: string;
  numeroDicas: number;
  saves: number;
  autor?: {
    nome: string;
    avatar: string;
  };
}

interface GuiaCardProps {
  guia: GuiaCardGuia;
  variant?: 'featured' | 'grid' | 'compact';
}

function Avatar({ src, className }: { src: string; className?: string }) {
  return (
    <div
      className={cn('relative rounded-full bg-muted overflow-hidden', className)}
    >
      <Image src={src} alt="" fill className="object-cover" sizes="48px" />
    </div>
  );
}

export function GuiaCard({ guia, variant = 'grid' }: GuiaCardProps) {
  const cardContent = (
    <>
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={guia.capa}
          alt={guia.titulo}
          fill
          className="object-cover"
          sizes={
            variant === 'featured'
              ? '(max-width: 768px) 100vw, 400px'
              : '(max-width: 768px) 50vw, 200px'
          }
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        <div className="absolute top-2 left-2">
          <span className="rounded-full bg-accent/90 px-3 py-1 text-xs font-medium text-primary backdrop-blur-sm">
            {guia.categoria}
          </span>
        </div>
      </div>
      <div className={cn('p-3', variant === 'compact' && 'p-2')}>
        <h3
          className={cn(
            'font-semibold line-clamp-2 text-foreground',
            variant === 'featured' && 'text-lg',
            variant === 'grid' && 'text-base',
            variant === 'compact' && 'text-sm line-clamp-1'
          )}
        >
          {guia.titulo}
        </h3>
        <div
          className={cn(
            'flex items-center gap-2 text-muted-foreground mt-2',
            variant === 'compact' ? 'text-[10px]' : 'text-xs'
          )}
        >
          <MapPin className="h-3 w-3 shrink-0" strokeWidth={1.5} />
          <span>{guia.cidade}</span>
          <span>•</span>
          <span>{guia.numeroDicas} dicas</span>
        </div>
        {guia.autor && variant !== 'compact' && (
          <div className="flex items-center gap-2 mt-3">
            <Avatar className="h-6 w-6" src={guia.autor.avatar} />
            <span className="text-xs text-muted-foreground">{guia.autor.nome}</span>
          </div>
        )}
        {variant === 'featured' && (
          <p className="text-xs text-muted-foreground mt-1">
            {guia.saves} salvamentos
          </p>
        )}
      </div>
    </>
  );

  const wrapperClassName = cn(
    'rounded-2xl border border-border bg-card overflow-hidden transition-all',
    variant === 'compact' && 'rounded-xl',
    variant === 'featured' && 'shadow-lg',
    'hover:shadow-lg'
  );

  return (
    <Link href={`/guia/${guia.id}`}>
      <div className={cn(wrapperClassName, variant === 'compact' && 'flex gap-3')}>
        {variant === 'compact' ? (
          <>
            <div className="relative aspect-video w-28 shrink-0 overflow-hidden">
              <Image
                src={guia.capa}
                alt={guia.titulo}
                fill
                className="object-cover"
                sizes="112px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
              <span className="absolute bottom-1 left-1 rounded bg-accent/90 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                {guia.categoria}
              </span>
            </div>
            <div className="p-2 flex-1 min-w-0 flex flex-col justify-center">
              <h3 className="text-sm font-semibold line-clamp-2">{guia.titulo}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {guia.cidade} • {guia.numeroDicas} dicas
              </p>
            </div>
          </>
        ) : (
          cardContent
        )}
      </div>
    </Link>
  );
}
