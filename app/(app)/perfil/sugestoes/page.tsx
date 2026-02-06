'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { BottomNav } from '@/components/app/bottom-nav';
import { cn } from '@/lib/utils';

const mockSugestoes = [
  {
    id: '1',
    nome: 'Marina Silva',
    username: 'marinasilva',
    avatar: '/avatars/marina.jpg',
    seguidores: 1500,
    dicas: 45,
    categoria: 'Populares em São Paulo',
  },
  {
    id: '2',
    nome: 'João Santos',
    username: 'joaosantos',
    avatar: '/avatars/joao.jpg',
    seguidores: 890,
    dicas: 32,
    categoria: 'Populares em São Paulo',
  },
  {
    id: '3',
    nome: 'Ana Costa',
    username: 'anacosta',
    avatar: '/avatars/ana.jpg',
    seguidores: 2100,
    dicas: 67,
    categoria: 'Viajantes como você',
  },
  {
    id: '4',
    nome: 'Pedro Lima',
    username: 'pedrolima',
    avatar: '/avatars/marina.jpg',
    seguidores: 430,
    dicas: 18,
    categoria: 'Baseado em seus interesses',
  },
];

const categorias = Array.from(
  new Set(mockSugestoes.map((s) => s.categoria))
);

export default function SugestoesPage() {
  const [seguindo, setSeguindo] = useState<Record<string, boolean>>({});

  const toggleSeguir = (id: string) => {
    setSeguindo((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <main className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/perfil"
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-6 w-6" strokeWidth={1.5} />
          </Link>
          <h1 className="text-lg font-semibold text-foreground">
            Sugestões para você
          </h1>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {categorias.map((cat) => (
          <div key={cat}>
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
              {cat}
            </p>
            <div className="space-y-3">
              {mockSugestoes
                .filter((s) => s.categoria === cat)
                .map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
                  >
                    <div className="relative h-14 w-14 rounded-full overflow-hidden bg-muted shrink-0">
                      <Image
                        src={p.avatar}
                        alt={p.nome}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {p.nome}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        @{p.username}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {p.seguidores} seguidores • {p.dicas} dicas
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSeguir(p.id)}
                      className={cn(
                        'rounded-full px-4 py-2 text-xs font-medium shrink-0 transition-opacity',
                        seguindo[p.id]
                          ? 'border border-border bg-card text-muted-foreground'
                          : 'gradient-peach text-primary hover:opacity-90'
                      )}
                    >
                      {seguindo[p.id] ? 'Seguindo' : 'Seguir'}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </main>
  );
}
