'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Plus, Check, MapPin } from 'lucide-react';
import { BottomNav } from '@/components/app/bottom-nav';
import { cn } from '@/lib/utils';

const DICAS_SELECIONADAS_KEY = 'dicas-selecionadas';
const DICA_NOVA_CRIADA_KEY = 'dica-nova-criada';
const MAX_DICAS = 20;

function loadDicaNovaCriada(): typeof mockDicas[0] | null {
  if (typeof window === 'undefined') return null;
  try {
    const s = localStorage.getItem(DICA_NOVA_CRIADA_KEY);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

const mockDicas = [
  {
    id: '1',
    titulo: 'Café da Manhã Perfeito',
    localizacao: 'Vila Madalena, SP',
    image: '/images/cafe1.jpg',
    categoria: 'Restaurantes',
  },
  {
    id: '2',
    titulo: 'Padaria Artesanal',
    localizacao: 'Pinheiros, SP',
    image: '/images/padaria.jpg',
    categoria: 'Restaurantes',
  },
  {
    id: '3',
    titulo: 'Vista Panorâmica',
    localizacao: 'Centro, SP',
    image: '/images/hero1.jpg',
    categoria: 'Cultura',
  },
  {
    id: '4',
    titulo: 'Bar com Música Ao Vivo',
    localizacao: 'Vila Madalena, SP',
    image: '/images/hero2.jpg',
    categoria: 'Vida Noturna',
  },
  {
    id: '5',
    titulo: 'Parque para Piquenique',
    localizacao: 'Ibirapuera, SP',
    image: '/images/hero3.jpg',
    categoria: 'Natureza',
  },
  {
    id: '6',
    titulo: 'Feira de Artesanato',
    localizacao: 'Benedito Calixto, SP',
    image: '/images/guia1.jpg',
    categoria: 'Compras',
  },
];

function loadDicasSelecionadas(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const s = localStorage.getItem(DICAS_SELECIONADAS_KEY);
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
}

function saveDicasSelecionadas(ids: string[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DICAS_SELECIONADAS_KEY, JSON.stringify(ids));
}

export default function CatalogoDicasPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'minhas' | 'salvas' | 'explorar'>('minhas');
  const [dicasSelecionadas, setDicasSelecionadas] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [dicaNova, setDicaNova] = useState<typeof mockDicas[0] | null>(null);

  useEffect(() => {
    setDicasSelecionadas(loadDicasSelecionadas());
    setDicaNova(loadDicaNovaCriada());
  }, []);

  useEffect(() => {
    saveDicasSelecionadas(dicasSelecionadas);
  }, [dicasSelecionadas]);

  const toggleDica = (id: string) => {
    setDicasSelecionadas((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_DICAS) {
        setToast(`Máximo de ${MAX_DICAS} dicas por guia`);
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleContinuar = () => {
    if (dicasSelecionadas.length === 0) return;
    if (typeof window !== 'undefined') localStorage.removeItem(DICA_NOVA_CRIADA_KEY);
    router.push('/criar-guia/publicar');
  };

  const dicasParaExibir =
    tab === 'minhas' && dicaNova
      ? [dicaNova, ...mockDicas.filter((d) => d.id !== dicaNova.id)]
      : mockDicas;

  return (
    <main className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push('/criar-guia')}
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-6 w-6" strokeWidth={1.5} />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Adicionar Dicas</h1>
          <Link
            href="/criar-dica?returnTo=catalogo"
            className="flex items-center gap-1 text-sm font-medium text-accent"
          >
            <Plus className="h-5 w-5" strokeWidth={1.5} />
            Criar nova
          </Link>
        </div>
      </header>

      {dicasSelecionadas.length > 0 && (
        <div className="px-4 py-3">
          <div className="bg-accent/10 rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-foreground">
              {dicasSelecionadas.length} dica{dicasSelecionadas.length !== 1 ? 's' : ''} selecionada{dicasSelecionadas.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}

      <div className="px-4 py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {(['minhas', 'salvas', 'explorar'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                tab === t
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              )}
            >
              {t === 'minhas' && 'Minhas Dicas'}
              {t === 'salvas' && 'Dicas Salvas'}
              {t === 'explorar' && 'Explorar'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 grid grid-cols-2 gap-3 pb-6">
        {dicasParaExibir.map((dica) => {
          const selected = dicasSelecionadas.includes(dica.id);
          return (
            <button
              key={dica.id}
              type="button"
              onClick={() => toggleDica(dica.id)}
              className="relative text-left rounded-2xl border-2 overflow-hidden transition-all focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <div
                className={cn(
                  'rounded-2xl border-2 overflow-hidden transition-all',
                  selected ? 'border-accent' : 'border-border'
                )}
              >
                <div className="relative aspect-square">
                  <Image
                    src={dica.image}
                    alt={dica.titulo}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 200px"
                  />
                  <div className="absolute top-2 right-2">
                    <div
                      className={cn(
                        'h-6 w-6 rounded-full flex items-center justify-center',
                        selected
                          ? 'bg-accent'
                          : 'bg-card/80 backdrop-blur-sm border border-border'
                      )}
                    >
                      {selected && (
                        <Check className="h-4 w-4 text-primary" strokeWidth={3} />
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-xs font-semibold line-clamp-1 text-foreground">
                    {dica.titulo}
                  </p>
                  <p className="text-[10px] text-muted-foreground line-clamp-1 flex items-center gap-0.5">
                    <MapPin className="h-3 w-3 shrink-0" />
                    {dica.localizacao}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div
        className="fixed left-4 right-4 rounded-full bg-primary text-primary-foreground px-6 py-4 shadow-lg text-center font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-opacity z-40"
        style={{ bottom: '5.5rem' }}
      >
        <button
          type="button"
          onClick={handleContinuar}
          disabled={dicasSelecionadas.length === 0}
          className="w-full h-full"
        >
          Continuar ({dicasSelecionadas.length} selecionada{dicasSelecionadas.length !== 1 ? 's' : ''})
        </button>
      </div>

      {toast && (
        <div
          className="fixed bottom-24 left-4 right-4 bg-foreground text-primary-foreground text-sm text-center py-3 rounded-xl z-50 animate-in fade-in"
          role="alert"
        >
          {toast}
          <button
            type="button"
            onClick={() => setToast(null)}
            className="sr-only"
          >
            Fechar
          </button>
        </div>
      )}

      <BottomNav />
    </main>
  );
}
