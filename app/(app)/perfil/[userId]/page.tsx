'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MoreHorizontal, MapPin, MessageCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
import { BottomNav } from '@/components/app/bottom-nav';
import { DicaCard } from '@/components/app/dica-card';
import { GuiaCard } from '@/components/app/guia-card';
import { useSeguindo } from '@/lib/hooks/use-supabase';
import { useCurrentUser } from '@/lib/current-user';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import type { DicaCardDica } from '@/components/app/dica-card';
import type { GuiaCardGuia } from '@/components/app/guia-card';

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

function toGuiaCard(
  g: { id: string; titulo: string; capa?: string; cidade: string; categoria: string; saves?: number; autor?: { nome: string; avatar?: string } },
  numeroDicas: number
): GuiaCardGuia {
  return {
    id: g.id,
    titulo: g.titulo,
    capa: g.capa || '/images/guia1.jpg',
    cidade: g.cidade,
    categoria: g.categoria,
    numeroDicas,
    saves: g.saves ?? 0,
    autor: g.autor ? { nome: g.autor.nome, avatar: g.autor.avatar || '' } : undefined,
  };
}

export default function PerfilOutroPage() {
  const params = useParams();
  const userId = params?.userId as string;

  const [usuario, setUsuario] = useState<{
    id: string;
    nome: string;
    username: string;
    avatar?: string;
    capa?: string;
    bio?: string;
    localizacao?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [dicas, setDicas] = useState<DicaCardDica[]>([]);
  const [guias, setGuias] = useState<GuiaCardGuia[]>([]);
  const [seguidores, setSeguidores] = useState(0);
  const [seguindo, setSeguindo] = useState(0);
  const [tab, setTab] = useState<'guias' | 'dicas'>('guias');

  const { usuario: usuarioAtual } = useCurrentUser();
  const { seguindo: estaSeguindo, toggleSeguindo } = useSeguindo(usuario?.id ?? null, usuarioAtual?.id ?? null);

  useEffect(() => {
    if (userId) fetchUsuario();
  }, [userId]);

  async function fetchUsuario() {
    if (!userId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUsuario(data);
    } catch (err) {
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (usuario) {
      fetchConteudo();
      fetchStats();
    }
  }, [usuario?.id]);

  async function fetchConteudo() {
    if (!usuario) return;
    try {
      const { data: dicasData } = await supabase
        .from('dicas')
        .select('*')
        .eq('autor_id', usuario.id)
        .order('created_at', { ascending: false });

      const { data: guiasData } = await supabase
        .from('guias')
        .select('*')
        .eq('autor_id', usuario.id)
        .order('created_at', { ascending: false });

      setDicas((dicasData || []).map((d) => toDicaCard({ ...d, imagens: d.imagens || [] })));

      const guiaIds = (guiasData || []).map((g) => g.id);
      let counts: Record<string, number> = {};
      if (guiaIds.length > 0) {
        const { data: gd } = await supabase.from('guias_dicas').select('guia_id').in('guia_id', guiaIds);
        guiaIds.forEach((id) => { counts[id] = 0; });
        (gd || []).forEach((row: { guia_id: string }) => {
          counts[row.guia_id] = (counts[row.guia_id] ?? 0) + 1;
        });
      }
      setGuias(
        (guiasData || []).map((g) =>
          toGuiaCard(
            { ...g, autor: (g as { autor?: { nome: string; avatar?: string } }).autor },
            counts[g.id] ?? 0
          )
        )
      );
    } catch (err) {
      console.error('Erro:', err);
    }
  }

  async function fetchStats() {
    if (!usuario) return;
    try {
      const { count: seguidoresCount } = await supabase
        .from('seguindo')
        .select('*', { count: 'exact', head: true })
        .eq('seguido_id', usuario.id);

      const { count: seguindoCount } = await supabase
        .from('seguindo')
        .select('*', { count: 'exact', head: true })
        .eq('seguidor_id', usuario.id);

      setSeguidores(seguidoresCount ?? 0);
      setSeguindo(seguindoCount ?? 0);
    } catch (err) {
      console.error('Erro:', err);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background pb-20 flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (!usuario) {
    return (
      <main className="min-h-screen bg-background pb-20 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Perfil não encontrado</p>
      </main>
    );
  }

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
            onClick={toggleSeguindo}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-all',
              estaSeguindo
                ? 'border border-border bg-card text-foreground hover:border-destructive hover:text-destructive'
                : 'gradient-peach text-primary'
            )}
          >
            {estaSeguindo ? 'Seguindo' : 'Seguir'}
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

      <div className="relative aspect-[3/1] w-full overflow-hidden">
        <Image
          src={usuario.capa || '/images/guia1.jpg'}
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
            src={usuario.avatar || '/images/hero1.jpg'}
            alt={usuario.nome}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>

        <div className="pt-4 pb-2">
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            {usuario.nome}
          </h1>
          <p className="text-sm text-muted-foreground">@{usuario.username}</p>
          {usuario.bio && (
            <p className="text-sm text-foreground mt-2">{usuario.bio}</p>
          )}
          {usuario.localizacao && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" strokeWidth={1.5} />
              {usuario.localizacao}
            </p>
          )}
          <div className="flex items-center gap-6 mt-3">
            <Link
              href={`/perfil/${userId}/seguidores`}
              className="flex items-center gap-1"
            >
              <span className="text-lg font-bold text-foreground">{seguidores}</span>
              <span className="text-xs text-muted-foreground">seguidores</span>
            </Link>
            <Link
              href={`/perfil/${userId}/seguindo`}
              className="flex items-center gap-1"
            >
              <span className="text-lg font-bold text-foreground">{seguindo}</span>
              <span className="text-xs text-muted-foreground">seguindo</span>
            </Link>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-foreground">{dicas.length}</span>
              <span className="text-xs text-muted-foreground">dicas</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-foreground">{guias.length}</span>
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
          <div className="py-6 grid grid-cols-2 gap-3 px-4">
            {guias.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-sm text-muted-foreground">
                Nenhum guia ainda
              </div>
            ) : (
              guias.map((guia) => (
                <GuiaCard key={guia.id} guia={guia} variant="grid" />
              ))
            )}
          </div>
        )}

        {tab === 'dicas' && (
          <div className="py-6 grid grid-cols-2 gap-3 px-4">
            {dicas.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-sm text-muted-foreground">
                Nenhuma dica ainda
              </div>
            ) : (
              dicas.map((d) => (
                <DicaCard key={d.id} dica={d} variant="grid" />
              ))
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
