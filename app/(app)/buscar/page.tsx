'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, X } from 'lucide-react';
import { BottomNav } from '@/components/app/bottom-nav';
import { DicaCard } from '@/components/app/dica-card';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import type { DicaCardDica } from '@/components/app/dica-card';

const CATEGORIAS = ['Todos', 'Restaurantes', 'Cafés', 'Bares', 'Cultura', 'Natureza', 'Hotéis', 'Museus', 'Praias', 'Compras'];

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

export default function BuscarPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [categoria, setCategoria] = useState<string | null>(null);
  const [resultados, setResultados] = useState<DicaCardDica[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function buscarDicas() {
    if (query.trim() === '' && !categoria) {
      setResultados([]);
      return;
    }

    setLoading(true);
    try {
      let q = supabase
        .from('dicas')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (query.trim() !== '') {
        q = q.or(
          `titulo.ilike.%${query.trim()}%,descricao.ilike.%${query.trim()}%,localizacao.ilike.%${query.trim()}%`
        );
      }

      if (categoria) {
        q = q.eq('categoria', categoria);
      }

      const { data, error } = await q;

      if (error) throw error;
      setResultados((data || []).map((d) => toDicaCard({ ...d, imagens: d.imagens || [] })));
    } catch (err) {
      console.error('Erro na busca:', err);
      setResultados([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      buscarDicas();
    }, 300);
    return () => clearTimeout(timer);
  }, [query, categoria]);

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <main className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-50 bg-background border-b border-border p-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Voltar"
          >
            <svg className="h-5 w-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar dicas, lugares..."
              className="w-full rounded-full border border-border bg-card pl-11 pr-11 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Limpar"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoria(cat === 'Todos' ? null : cat)}
              className={cn(
                'rounded-full px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors shrink-0',
                (cat === 'Todos' && !categoria) || categoria === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border bg-card text-foreground hover:bg-muted'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse">
                <div className="h-32 w-full bg-muted" />
                <div className="p-3 space-y-2">
                  <div className="h-4 w-3/4 bg-muted rounded" />
                  <div className="h-3 w-1/2 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : resultados.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground">
              {query || categoria ? 'Nenhum resultado encontrado' : 'Digite para buscar'}
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {resultados.length} resultado{resultados.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {resultados.map((dica) => (
                <DicaCard key={dica.id} dica={dica} variant="grid" />
              ))}
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
