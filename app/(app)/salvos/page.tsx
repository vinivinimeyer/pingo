'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Bookmark } from 'lucide-react';
import { BottomNav } from '@/components/app/bottom-nav';
import { DicaCard } from '@/components/app/dica-card';
import { useCurrentUser } from '@/lib/current-user';
import { supabase } from '@/lib/supabase';
import type { DicaCardDica } from '@/components/app/dica-card';

export default function SalvosPage() {
  const router = useRouter();
  const { usuario, loading } = useCurrentUser();
  const [dicasSalvas, setDicasSalvas] = useState<DicaCardDica[]>([]);
  const [loadingSalvos, setLoadingSalvos] = useState(true);

  useEffect(() => {
    if (usuario) fetchDicasSalvas();
    else setLoadingSalvos(false);
  }, [usuario]);

  async function fetchDicasSalvas() {
    if (!usuario) return;
    setLoadingSalvos(true);
    try {
      const { data, error } = await supabase
        .from('salvos')
        .select('id, created_at, dica:dicas(*)')
        .eq('usuario_id', usuario.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const list = (data || []) as { dica?: unknown; dicas?: unknown }[];
      const dicas = list
        .map((item) => {
          const raw = item.dica ?? item.dicas;
          return raw != null && typeof raw === 'object' && 'id' in raw ? raw : null;
        })
        .filter(Boolean) as { id: string; titulo: string; imagens?: string[]; localizacao: string; categoria: string; curtidas?: number }[];

      setDicasSalvas(
        dicas.map((d) => ({
          id: d.id,
          titulo: d.titulo,
          imagem: Array.isArray(d.imagens) && d.imagens[0] ? d.imagens[0] : '/images/hero1.jpg',
          localizacao: d.localizacao,
          categoria: d.categoria,
          curtidas: d.curtidas,
        }))
      );
    } catch (err) {
      console.error('Erro:', err);
    } finally {
      setLoadingSalvos(false);
    }
  }

  if (loading && !usuario) {
    return (
      <main className="min-h-screen bg-background pb-20 flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-4 px-4 py-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-6 w-6" strokeWidth={1.5} />
          </button>
          <h1 className="text-xl font-bold text-foreground">Salvos</h1>
        </div>
      </header>

      {loadingSalvos ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : dicasSalvas.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <Bookmark className="h-16 w-16 text-muted-foreground mb-4" strokeWidth={1.5} />
          <p className="text-lg font-semibold text-foreground mb-2">Nenhuma dica salva</p>
          <p className="text-sm text-muted-foreground text-center">
            Salve dicas que você gostou para acessá-las facilmente depois
          </p>
          <Link
            href="/feed"
            className="mt-6 rounded-full gradient-peach px-6 py-3 text-sm font-medium text-primary"
          >
            Explorar feed
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 p-4">
          {dicasSalvas.map((dica) => (
            <DicaCard key={dica.id} dica={dica} variant="grid" />
          ))}
        </div>
      )}

      <BottomNav />
    </main>
  );
}
