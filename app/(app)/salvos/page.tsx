'use client';

import { useState } from 'react';
import { BottomNav } from '@/components/app/bottom-nav';
import { DicaCard } from '@/components/app/dica-card';
import { GuiaCard } from '@/components/app/guia-card';
import type { DicaCardDica } from '@/components/app/dica-card';
import type { GuiaCardGuia } from '@/components/app/guia-card';

const mockSalvos = {
  dicas: [
    {
      id: '1',
      titulo: 'Café da Manhã Perfeito',
      imagem: '/images/cafe1.jpg',
      localizacao: 'Vila Madalena, SP',
      categoria: 'Restaurantes',
    },
  ],
  guias: [
    {
      id: '1',
      titulo: 'Roteiro 3 dias em SP',
      capa: '/images/guia1.jpg',
      cidade: 'São Paulo, SP',
      categoria: 'Roteiro',
      numeroDicas: 12,
      saves: 450,
      autor: { nome: 'Marina Silva', avatar: '/avatars/marina.jpg' },
    },
  ],
};

export default function SalvosPage() {
  const [tab, setTab] = useState<'dicas' | 'guias'>('dicas');

  return (
    <main className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4">
        <h1 className="text-lg font-semibold text-foreground">Salvos</h1>
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={() => setTab('dicas')}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              tab === 'dicas' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}
          >
            Dicas
          </button>
          <button
            type="button"
            onClick={() => setTab('guias')}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              tab === 'guias' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}
          >
            Guias
          </button>
        </div>
      </header>
      <div className="px-4 py-6">
        {tab === 'dicas' && (
          <div className="grid grid-cols-2 gap-3">
            {mockSalvos.dicas.map((d) => (
              <DicaCard key={d.id} dica={d as DicaCardDica} variant="grid" />
            ))}
          </div>
        )}
        {tab === 'guias' && (
          <div className="grid grid-cols-1 gap-4">
            {mockSalvos.guias.map((g) => (
              <GuiaCard key={g.id} guia={g as GuiaCardGuia} variant="grid" />
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
