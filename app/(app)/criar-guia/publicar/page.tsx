'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, ChevronUp, ChevronDown } from 'lucide-react';
import { BottomNav } from '@/components/app/bottom-nav';
import { useDicas } from '@/lib/hooks/use-supabase';
import { getCurrentUser } from '@/lib/current-user';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const GUIA_TEMP_KEY = 'guia-temp';
const DICAS_SELECIONADAS_KEY = 'dicas-selecionadas';

interface GuiaTemp {
  titulo: string;
  descricao: string;
  cidade: string;
  categoria: string;
  capa?: string;
}

type DicaPreview = { id: string; titulo: string; localizacao: string; image: string };

function loadGuiaTemp(): Partial<GuiaTemp> {
  if (typeof window === 'undefined') return {};
  try {
    const s = localStorage.getItem(GUIA_TEMP_KEY);
    return s ? JSON.parse(s) : {};
  } catch {
    return {};
  }
}

function loadDicasSelecionadas(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const s = localStorage.getItem(DICAS_SELECIONADAS_KEY);
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
}

function clearGuiaTemp() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(GUIA_TEMP_KEY);
  localStorage.removeItem(DICAS_SELECIONADAS_KEY);
}

export default function PublicarGuiaPage() {
  const router = useRouter();
  const { dicas } = useDicas();
  const [guia, setGuia] = useState<Partial<GuiaTemp>>({});
  const [dicaIds, setDicaIds] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [publicando, setPublicando] = useState(false);
  const [guiaCriadoId, setGuiaCriadoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const temp = typeof window !== 'undefined' ? localStorage.getItem(GUIA_TEMP_KEY) : null;
    const dicasRaw = typeof window !== 'undefined' ? localStorage.getItem(DICAS_SELECIONADAS_KEY) : null;

    if (!temp || !dicasRaw) {
      setTimeout(() => {
        router.replace('/criar-guia');
      }, 0);
      setLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(temp) as Partial<GuiaTemp>;
      const parsedDicas = JSON.parse(dicasRaw) as string[];
      if (!parsed?.titulo) {
        setTimeout(() => {
          router.replace('/criar-guia');
        }, 0);
      } else {
        setGuia(parsed);
        setDicaIds(parsedDicas);
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setTimeout(() => {
        router.replace('/criar-guia');
      }, 0);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const dicaMap = new Map(
    dicas.map((d) => [
      d.id,
      {
        id: d.id,
        titulo: d.titulo,
        localizacao: d.localizacao,
        image: Array.isArray(d.imagens) && d.imagens[0] ? d.imagens[0] : '/images/hero1.jpg',
      },
    ])
  );
  const dicasOrdenadas: DicaPreview[] = dicaIds
    .map((id) => dicaMap.get(id))
    .filter((d): d is DicaPreview => Boolean(d));

  const move = (index: number, dir: 'up' | 'down') => {
    const newIds = [...dicaIds];
    const i = dir === 'up' ? index - 1 : index + 1;
    if (i < 0 || i >= newIds.length) return;
    [newIds[index], newIds[i]] = [newIds[i], newIds[index]];
    setDicaIds(newIds);
    if (typeof window !== 'undefined') {
      localStorage.setItem(DICAS_SELECIONADAS_KEY, JSON.stringify(newIds));
    }
  };

  const handlePublicar = async () => {
    setPublicando(true);
    try {
      const guiaTemp = JSON.parse(
        typeof window !== 'undefined' ? localStorage.getItem(GUIA_TEMP_KEY) || '{}' : '{}'
      );
      const dicasSelecionadas: string[] = JSON.parse(
        typeof window !== 'undefined' ? localStorage.getItem(DICAS_SELECIONADAS_KEY) || '[]' : '[]'
      );

      const usuario = await getCurrentUser();
      if (!usuario) throw new Error('Usuário não encontrado');

      const { data: guiaData, error: guiaError } = await supabase
        .from('guias')
        .insert({
          titulo: guiaTemp.titulo,
          descricao: guiaTemp.descricao,
          capa: guiaTemp.capa ?? null,
          cidade: guiaTemp.cidade,
          categoria: guiaTemp.categoria,
          autor_id: usuario.id,
          status: 'publicado',
          curtidas: 0,
          saves: 0,
          shares: 0,
        })
        .select()
        .single();

      if (guiaError) throw guiaError;

      const guiasDicas = dicasSelecionadas.map((dicaId: string, index: number) => ({
        guia_id: guiaData.id,
        dica_id: dicaId,
        ordem: index + 1,
      }));

      const { error: associacaoError } = await supabase
        .from('guias_dicas')
        .insert(guiasDicas);

      if (associacaoError) throw associacaoError;

      setGuiaCriadoId(guiaData.id);
      clearGuiaTemp();
      setShowSuccess(true);
    } catch (err: unknown) {
      alert('Erro ao publicar guia: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setPublicando(false);
    }
  };

  const handleSalvarRascunho = () => {
    router.push('/perfil');
  };

  const handleVerGuia = () => {
    setShowSuccess(false);
    router.push(guiaCriadoId ? `/guia/${guiaCriadoId}` : '/feed');
  };

  const handleCriarOutro = () => {
    setShowSuccess(false);
    router.push('/criar-guia');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!guia.titulo) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push('/criar-guia/catalogo')}
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-6 w-6" strokeWidth={1.5} />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Publicar Guia</h1>
          <button
            type="button"
            onClick={handlePublicar}
            disabled={publicando}
            className="text-sm font-medium text-accent disabled:opacity-50"
          >
            {publicando ? '...' : 'Publicar'}
          </button>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Preview capa */}
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
          {guia.capa ? (
            <img
              src={guia.capa}
              alt="Capa"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted gradient-warm" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-2xl font-bold tracking-tight text-primary-foreground">
              {guia.titulo || 'Sem título'}
            </h2>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {guia.cidade} • {guia.categoria}
          </p>
          <p className="text-sm leading-relaxed text-foreground">
            {guia.descricao}
          </p>
          <p className="text-xs font-mono text-accent">
            {dicasOrdenadas.length} dicas neste guia
          </p>
        </div>

        <div>
          <h3 className="text-base font-bold text-foreground mb-3">
            Dicas incluídas
          </h3>
          <div className="space-y-2">
            {dicasOrdenadas.map((dica, index) => (
              <div
                key={dica.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-2"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {index + 1}
                </span>
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={dica.image}
                    alt={dica.titulo}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold line-clamp-1">{dica.titulo}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {dica.localizacao}
                  </p>
                </div>
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => move(index, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded hover:bg-muted disabled:opacity-30"
                  >
                    <ChevronUp className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 'down')}
                    disabled={index === dicasOrdenadas.length - 1}
                    className="p-1 rounded hover:bg-muted disabled:opacity-30"
                  >
                    <ChevronDown className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4">
          <button
            type="button"
            onClick={handleSalvarRascunho}
            className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Salvar Rascunho
          </button>
          <button
            type="button"
            onClick={handlePublicar}
            disabled={publicando}
            className="rounded-full gradient-peach px-6 py-3 text-sm font-medium text-primary hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {publicando ? 'Publicando...' : 'Publicar Guia'}
          </button>
        </div>
      </div>

      {showSuccess && guiaCriadoId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/60 backdrop-blur-sm">
          <div className="mx-4 max-w-sm w-full rounded-3xl bg-card p-8 shadow-2xl">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
              <svg
                className="h-12 w-12 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-center text-xl font-bold mb-2">Guia Publicado!</h3>
            <p className="text-center text-sm text-muted-foreground mb-6">
              Seu guia com {dicasOrdenadas.length} dicas já está disponível
            </p>
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleVerGuia}
                className="w-full rounded-full gradient-peach px-6 py-3 text-sm font-medium text-primary"
              >
                Ver Guia
              </button>
              <button
                type="button"
                onClick={handleCriarOutro}
                className="w-full rounded-full border border-border bg-card px-6 py-3 text-sm font-medium hover:bg-muted"
              >
                Criar Outro Guia
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </main>
  );
}
