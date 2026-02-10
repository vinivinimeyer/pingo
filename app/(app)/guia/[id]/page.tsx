'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft,
  Share2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  MapPin,
  BookOpen,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { BottomNav } from '@/components/app/bottom-nav';
import { useCurrentUser } from '@/lib/current-user';

type GuiaRow = {
  id: string;
  titulo: string;
  descricao: string;
  capa?: string | null;
  cidade: string;
  categoria: string;
  curtidas?: number;
  saves?: number;
  shares?: number;
  autor?: { id: string; nome: string; username: string; avatar?: string } | { id: string; nome: string; username: string; avatar?: string }[];
};

type DicaRow = {
  id: string;
  titulo: string;
  descricao?: string;
  localizacao?: string;
  imagens?: string[] | null;
};

export default function GuiaPage() {
  const params = useParams();
  const router = useRouter();
  const guiaId = (params?.id as string) ?? '';

  const { usuario } = useCurrentUser();
  const [salvo, setSalvo] = useState(false);

  const [guia, setGuia] = useState<GuiaRow | null>(null);
  const [dicas, setDicas] = useState<DicaRow[]>([]);
  const [todasImagens, setTodasImagens] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (guiaId) {
      fetchGuia();
    }
  }, [guiaId]);

  async function fetchGuia() {
    try {
      setLoading(true);
      setError(null);

      const { data: guiaData, error: guiaError } = await supabase
        .from('guias')
        .select('*, autor:usuarios(*)')
        .eq('id', guiaId)
        .single();

      if (guiaError) throw guiaError;

      const guiaNormalized = guiaData as GuiaRow;
      const autor = Array.isArray(guiaNormalized.autor)
        ? guiaNormalized.autor[0]
        : guiaNormalized.autor;
      setGuia({ ...guiaNormalized, autor: autor ?? undefined });

      const { data: guiasDicasData, error: guiasDicasError } = await supabase
        .from('guias_dicas')
        .select('dica_id, ordem, dica:dicas(*)')
        .eq('guia_id', guiaId)
        .order('ordem', { ascending: true });

      if (guiasDicasError) throw guiasDicasError;

      type Row = { dica?: DicaRow | DicaRow[] | null };
      const dicasOrdenadas: DicaRow[] = (guiasDicasData ?? [])
        .map((item: Row) => {
          const d = item.dica;
          return Array.isArray(d) ? d[0] : d;
        })
        .filter((d): d is DicaRow => Boolean(d));

      setDicas(dicasOrdenadas);

      const imagens: string[] = [];
      if (guiaNormalized.capa) imagens.push(guiaNormalized.capa);
      dicasOrdenadas.forEach((d) => {
        if (d.imagens && Array.isArray(d.imagens)) {
          d.imagens.forEach((url) => imagens.push(url));
        }
      });
      setTodasImagens(imagens);
    } catch (err: unknown) {
      console.error('Erro ao buscar guia:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  const toggleSalvo = () => setSalvo((prev) => !prev);

  const autor = guia?.autor;
  const autorObj = Array.isArray(autor) ? autor[0] : autor;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Carregando guia...</p>
        </div>
      </div>
    );
  }

  if (error || !guia) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-lg font-semibold mb-2">Guia não encontrado</p>
          <p className="text-sm text-muted-foreground mb-6">
            {error || 'Este guia pode ter sido removido'}
          </p>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-full gradient-peach px-6 py-3 text-sm font-medium text-primary"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      <div className="relative aspect-square w-full bg-muted">
        {todasImagens.length > 0 ? (
          <>
            <Image
              src={todasImagens[currentImageIndex]}
              fill
              className="object-cover"
              alt={guia.titulo}
              sizes="100vw"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-transparent to-foreground/60" />

            <header className="absolute top-0 left-0 right-0 z-10">
              <div className="flex items-center justify-between px-4 py-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="rounded-full bg-background/80 backdrop-blur-sm p-2"
                >
                  <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-full bg-background/80 backdrop-blur-sm p-2"
                    aria-label="Compartilhar"
                  >
                    <Share2 className="h-5 w-5" strokeWidth={1.5} />
                  </button>
                  <button
                    type="button"
                    onClick={toggleSalvo}
                    className="rounded-full bg-background/80 backdrop-blur-sm p-2"
                  >
                    <Bookmark
                      className="h-5 w-5"
                      strokeWidth={1.5}
                      fill={salvo ? 'currentColor' : 'none'}
                    />
                  </button>
                </div>
              </div>
            </header>

            {currentImageIndex > 0 && (
              <button
                type="button"
                onClick={() => setCurrentImageIndex((prev) => prev - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm p-2 z-10"
              >
                <ChevronLeft className="h-6 w-6" strokeWidth={1.5} />
              </button>
            )}

            {currentImageIndex < todasImagens.length - 1 && (
              <button
                type="button"
                onClick={() => setCurrentImageIndex((prev) => prev + 1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm p-2 z-10"
              >
                <ChevronRight className="h-6 w-6" strokeWidth={1.5} />
              </button>
            )}

            {todasImagens.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                {todasImagens.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentImageIndex
                        ? 'w-6 bg-primary-foreground'
                        : 'w-1.5 bg-primary-foreground/40'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <BookOpen className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">{guia.titulo}</h1>
          {autorObj && (
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 rounded-full bg-muted overflow-hidden shrink-0">
                <Image
                  src={autorObj.avatar || '/images/hero1.jpg'}
                  width={40}
                  height={40}
                  alt={autorObj.nome}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium">{autorObj.nome}</p>
                <p className="text-xs text-muted-foreground">@{autorObj.username}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" strokeWidth={1.5} />
            <span>{guia.cidade}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" strokeWidth={1.5} />
            <span>{dicas.length} dicas</span>
          </div>
        </div>

        <p className="text-sm leading-relaxed">{guia.descricao}</p>

        <div>
          <h2 className="text-lg font-bold mb-4">Dicas neste guia</h2>
          <div className="space-y-3">
            {dicas.map((dica, index) => (
              <button
                key={dica.id}
                type="button"
                onClick={() => router.push(`/dica/${dica.id}`)}
                className="w-full rounded-2xl border border-border bg-card p-4 text-left hover:bg-muted transition-colors"
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-accent">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold mb-1 truncate">{dica.titulo}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {dica.localizacao ?? ''}
                    </p>
                  </div>
                  {dica.imagens && dica.imagens[0] && (
                    <div className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                      <Image
                        src={dica.imagens[0]}
                        width={64}
                        height={64}
                        alt={dica.titulo}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <div>
            <span className="font-semibold">{guia.curtidas ?? 0}</span>
            <span className="text-muted-foreground ml-1">curtidas</span>
          </div>
          <div>
            <span className="font-semibold">{guia.saves ?? 0}</span>
            <span className="text-muted-foreground ml-1">salvos</span>
          </div>
          <div>
            <span className="font-semibold">{guia.shares ?? 0}</span>
            <span className="text-muted-foreground ml-1">compartilhamentos</span>
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
