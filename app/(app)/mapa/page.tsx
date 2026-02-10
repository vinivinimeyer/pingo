'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { BottomNav } from '@/components/app/bottom-nav';
import { useDicas } from '@/lib/hooks/use-supabase';
import { DicaCard } from '@/components/app/dica-card';
import type { DicaCardDica } from '@/components/app/dica-card';

function toDicaCard(d: { id: string; titulo: string; imagens: string[]; localizacao: string; categoria: string; curtidas?: number }): DicaCardDica {
  return {
    id: d.id,
    titulo: d.titulo,
    imagem: Array.isArray(d.imagens) && d.imagens[0] ? d.imagens[0] : '/images/hero1.jpg',
    localizacao: d.localizacao,
    categoria: d.categoria,
    curtidas: d.curtidas,
  };
}

export default function MapaPage() {
  const { dicas, loading } = useDicas();

  return (
    <main className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold text-foreground">Mapa</h1>
        </div>
      </header>

      <div className="relative h-[50vh] bg-muted flex items-center justify-center">
        <div className="text-center px-4">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" strokeWidth={1.5} />
          <p className="text-sm text-muted-foreground">
            Visualização de mapa em breve
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {dicas.length} dicas disponíveis
          </p>
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-lg font-bold text-foreground mb-4">Dicas Próximas</h2>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {dicas.slice(0, 10).map((dica) => (
              <DicaCard key={dica.id} dica={toDicaCard({ ...dica, imagens: dica.imagens || [] })} variant="list" />
            ))}
            {dicas.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">Nenhuma dica ainda</p>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
