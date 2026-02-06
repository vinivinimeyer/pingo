'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MoreHorizontal, MapPin, MessageCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
import { BottomNav } from '@/components/app/bottom-nav';
import { DicaCard } from '@/components/app/dica-card';
import { GuiaCard } from '@/components/app/guia-card';
import { cn } from '@/lib/utils';
import type { DicaCardDica } from '@/components/app/dica-card';
import type { GuiaCardGuia } from '@/components/app/guia-card';

const mockPerfilOutro = {
  id: '2',
  nome: 'Marina Silva',
  username: '@marinasilva',
  avatar: '/avatars/marina.jpg',
  capa: '/images/guia2.jpg',
  bio: 'Viajante e foodie 🍜',
  localizacao: 'Rio de Janeiro, RJ',
  stats: {
    dicas: 78,
    guias: 15,
    seguidores: 3200,
    seguindo: 420,
  },
  seguindo: false,
  guias: [
    {
      id: '1',
      titulo: 'Roteiro 3 dias em São Paulo',
      capa: '/images/guia1.jpg',
      cidade: 'São Paulo, SP',
      categoria: 'Roteiro',
      numeroDicas: 12,
      saves: 450,
      autor: { nome: 'Marina Silva', avatar: '/avatars/marina.jpg' },
    },
  ],
  dicas: [
    {
      id: '1',
      titulo: 'Café da Manhã Perfeito',
      imagem: '/images/cafe1.jpg',
      localizacao: 'Vila Madalena, SP',
      categoria: 'Restaurantes',
      curtidas: 234,
    },
  ],
};

type TabType = 'guias' | 'dicas';

export default function PerfilOutroPage() {
  const params = useParams();
  const [tab, setTab] = useState<TabType>('guias');
  const [seguindo, setSeguindo] = useState(mockPerfilOutro.seguindo);
  const [hoverSeguindo, setHoverSeguindo] = useState(false);

  const perfil = mockPerfilOutro;

  return (
    <main className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-6 w-6" strokeWidth={1.5} />
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSeguindo(!seguindo)}
            onMouseEnter={() => setHoverSeguindo(true)}
            onMouseLeave={() => setHoverSeguindo(false)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-all',
              seguindo
                ? 'border border-border bg-card hover:border-destructive hover:text-destructive'
                : 'gradient-peach text-primary'
            )}
          >
            {seguindo && hoverSeguindo ? 'Deixar de seguir' : seguindo ? 'Seguindo' : 'Seguir'}
          </button>
          <button
            type="button"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium flex items-center gap-2 hover:bg-muted transition-colors"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
            Mensagem
          </button>
          <button
            type="button"
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Mais opções"
          >
            <MoreHorizontal className="h-6 w-6" strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Capa */}
      <div className="relative aspect-[3/1] w-full overflow-hidden">
        <Image
          src={perfil.capa}
          alt="Capa do perfil"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      <div className="px-4 -mt-12 relative z-10">
        <div className="relative h-24 w-24 rounded-full border-4 border-background overflow-hidden bg-muted shrink-0">
          <Image
            src={perfil.avatar}
            alt={perfil.nome}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>

        <div className="pt-4 pb-2">
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            {perfil.nome}
          </h1>
          <p className="text-sm text-muted-foreground">{perfil.username}</p>
          {perfil.bio && (
            <p className="text-sm text-foreground mt-2">{perfil.bio}</p>
          )}
          {perfil.localizacao && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" strokeWidth={1.5} />
              {perfil.localizacao}
            </p>
          )}
          <div className="flex items-center gap-6 mt-3">
            <Link
              href={`/perfil/${params?.userId ?? ''}/seguidores`}
              className="flex items-center gap-1"
            >
              <span className="text-lg font-bold text-foreground">
                {perfil.stats.seguidores}
              </span>
              <span className="text-xs text-muted-foreground">seguidores</span>
            </Link>
            <Link
              href={`/perfil/${params?.userId ?? ''}/seguindo`}
              className="flex items-center gap-1"
            >
              <span className="text-lg font-bold text-foreground">
                {perfil.stats.seguindo}
              </span>
              <span className="text-xs text-muted-foreground">seguindo</span>
            </Link>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-foreground">
                {perfil.stats.dicas}
              </span>
              <span className="text-xs text-muted-foreground">dicas</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-foreground">
                {perfil.stats.guias}
              </span>
              <span className="text-xs text-muted-foreground">guias</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 border-b border-border">
          {(['guias', 'dicas'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                'pb-3 px-2 text-sm font-medium border-b-2 -mb-px transition-colors',
                tab === t
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground'
              )}
            >
              {t === 'guias' ? 'Guias' : 'Dicas'}
            </button>
          ))}
        </div>

        {tab === 'guias' && (
          <div className="py-6 grid grid-cols-1 gap-4">
            {perfil.guias.map((g) => (
              <GuiaCard key={g.id} guia={g as GuiaCardGuia} variant="grid" />
            ))}
          </div>
        )}

        {tab === 'dicas' && (
          <div className="py-6 grid grid-cols-2 gap-3">
            {perfil.dicas.map((d) => (
              <DicaCard key={d.id} dica={d as DicaCardDica} variant="grid" />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
