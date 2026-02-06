'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Pencil, MapPin, Star } from 'lucide-react';
import { BottomNav } from '@/components/app/bottom-nav';
import { PerfilMenu } from '@/components/app/perfil-menu';
import { DicaCard } from '@/components/app/dica-card';
import { GuiaCard } from '@/components/app/guia-card';
import { cn } from '@/lib/utils';
import type { DicaCardDica } from '@/components/app/dica-card';
import type { GuiaCardGuia } from '@/components/app/guia-card';

const mockPerfil = {
  id: '1',
  nome: 'Karenne Tikt',
  username: '@karenne',
  avatar: '/avatars/marina.jpg',
  capa: '/images/guia1.jpg',
  bio: 'Exploradora de praias 🏖️',
  localizacao: 'São Paulo, SP',
  stats: {
    dicas: 45,
    guias: 12,
    seguidores: 1200,
    seguindo: 340,
  },
  dicasDestaque: [
    {
      id: 'd1',
      titulo: 'Café da Manhã Perfeito',
      imagem: '/images/cafe1.jpg',
      localizacao: 'Vila Madalena, SP',
      categoria: 'Restaurantes',
      curtidas: 234,
    },
    {
      id: 'd2',
      titulo: 'Praia Secreta',
      imagem: '/images/hero2.jpg',
      localizacao: 'Ubatuba, SP',
      categoria: 'Natureza',
      curtidas: 189,
    },
  ],
  guias: [
    {
      id: 'g1',
      titulo: 'Roteiro 3 dias em SP',
      capa: '/images/guia1.jpg',
      cidade: 'São Paulo, SP',
      categoria: 'Roteiro',
      numeroDicas: 12,
      saves: 450,
      autor: { nome: 'Karenne Tikt', avatar: '/avatars/marina.jpg' },
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
    {
      id: '2',
      titulo: 'Padaria Artesanal',
      imagem: '/images/padaria.jpg',
      localizacao: 'Pinheiros, SP',
      categoria: 'Restaurantes',
    },
  ],
};

type TabType = 'guias' | 'dicas' | 'salvos';
type SalvosSubTab = 'dicas' | 'guias';

export default function PerfilPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tab, setTab] = useState<TabType>('guias');
  const [salvosSubTab, setSalvosSubTab] = useState<SalvosSubTab>('dicas');

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Capa */}
      <div className="relative aspect-[3/1] w-full overflow-hidden">
        <Image
          src={mockPerfil.capa}
          alt="Capa do perfil"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      <div className="px-4 -mt-12 relative z-10">
        <div className="flex items-end justify-between gap-4">
          <div className="relative h-24 w-24 rounded-full border-4 border-background overflow-hidden bg-muted shrink-0 flex-shrink-0">
            <Image
              src={mockPerfil.avatar}
              alt={mockPerfil.nome}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/perfil/editar"
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium flex items-center gap-2 hover:bg-muted transition-colors"
            >
              <Pencil className="h-4 w-4" strokeWidth={1.5} />
              Editar Perfil
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="p-2 rounded-full border border-border bg-card hover:bg-muted transition-colors"
              aria-label="Menu"
            >
              <Menu className="h-6 w-6" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div className="pt-4 pb-2">
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            {mockPerfil.nome}
          </h1>
          <p className="text-sm text-muted-foreground">{mockPerfil.username}</p>
          {mockPerfil.bio && (
            <p className="text-sm text-foreground mt-2">{mockPerfil.bio}</p>
          )}
          {mockPerfil.localizacao && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" strokeWidth={1.5} />
              {mockPerfil.localizacao}
            </p>
          )}
          <div className="flex items-center gap-6 mt-3">
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-foreground">
                {mockPerfil.stats.dicas}
              </span>
              <span className="text-xs text-muted-foreground">dicas</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-foreground">
                {mockPerfil.stats.guias}
              </span>
              <span className="text-xs text-muted-foreground">guias</span>
            </div>
            <Link href="/perfil/sugestoes" className="flex items-center gap-1">
              <span className="text-lg font-bold text-foreground">
                {mockPerfil.stats.seguidores}
              </span>
              <span className="text-xs text-muted-foreground">seguidores</span>
            </Link>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-foreground">
                {mockPerfil.stats.seguindo}
              </span>
              <span className="text-xs text-muted-foreground">seguindo</span>
            </div>
          </div>
        </div>

        {/* Dicas em destaque */}
        {mockPerfil.dicasDestaque.length > 0 && (
          <div className="py-4">
            <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
              <Star className="h-4 w-4 text-accent" strokeWidth={1.5} />
              Dicas em Destaque
            </h2>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
              {mockPerfil.dicasDestaque.map((d) => (
                <div key={d.id} className="shrink-0 w-72">
                  <DicaCard
                    dica={d as DicaCardDica}
                    variant="grid"
                    showDestaque
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border">
          {(['guias', 'dicas', 'salvos'] as const).map((t) => (
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
              {t === 'guias' && 'Guias'}
              {t === 'dicas' && 'Dicas'}
              {t === 'salvos' && 'Salvos'}
            </button>
          ))}
        </div>

        {tab === 'guias' && (
          <div className="py-6 grid grid-cols-1 gap-4">
            {mockPerfil.guias.map((g) => (
              <GuiaCard key={g.id} guia={g as GuiaCardGuia} variant="grid" />
            ))}
          </div>
        )}

        {tab === 'dicas' && (
          <div className="py-6 grid grid-cols-2 gap-3">
            {mockPerfil.dicas.map((d) => (
              <DicaCard key={d.id} dica={d as DicaCardDica} variant="grid" showDestaque={d.id === '1'} />
            ))}
          </div>
        )}

        {tab === 'salvos' && (
          <div className="py-6">
            <div className="flex gap-2 mb-4">
              {(['dicas', 'guias'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSalvosSubTab(st)}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    salvosSubTab === st
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {st === 'dicas' ? 'Dicas' : 'Guias'}
                </button>
              ))}
            </div>
            {salvosSubTab === 'dicas' && (
              <div className="grid grid-cols-2 gap-3">
                {mockPerfil.dicas.map((d) => (
                  <DicaCard key={d.id} dica={d as DicaCardDica} variant="grid" />
                ))}
              </div>
            )}
            {salvosSubTab === 'guias' && (
              <div className="grid grid-cols-1 gap-4">
                {mockPerfil.guias.map((g) => (
                  <GuiaCard key={g.id} guia={g as GuiaCardGuia} variant="grid" />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <PerfilMenu
        open={menuOpen}
        onOpenChange={setMenuOpen}
        user={{
          nome: mockPerfil.nome,
          username: mockPerfil.username,
          avatar: mockPerfil.avatar,
        }}
      />
      <BottomNav />
    </main>
  );
}
