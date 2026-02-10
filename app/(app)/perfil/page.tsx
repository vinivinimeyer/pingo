'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Pencil, MapPin, Star } from 'lucide-react';
import { BottomNav } from '@/components/app/bottom-nav';
import { PerfilMenu } from '@/components/app/perfil-menu';
import { DicaCard } from '@/components/app/dica-card';
import { GuiaCard } from '@/components/app/guia-card';
import { useDicas, useGuias } from '@/lib/hooks/use-supabase';
import { useCurrentUser } from '@/lib/current-user';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import type { DicaCardDica } from '@/components/app/dica-card';
import type { GuiaCardGuia } from '@/components/app/guia-card';

type TabType = 'guias' | 'dicas' | 'salvos';
type SalvosSubTab = 'dicas' | 'guias';

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

export default function PerfilPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tab, setTab] = useState<TabType>('guias');
  const [salvosSubTab, setSalvosSubTab] = useState<SalvosSubTab>('dicas');
  const [dicasSalvas, setDicasSalvas] = useState<DicaCardDica[]>([]);
  const [seguidores, setSeguidores] = useState(0);
  const [seguindo, setSeguindo] = useState(0);
  const [guiaDicaCounts, setGuiaDicaCounts] = useState<Record<string, number>>({});

  const { usuario, loading, error, refetch } = useCurrentUser();
  const { dicas: todasDicas } = useDicas();
  const { guias: todosGuias } = useGuias();

  const minhasDicas = usuario ? todasDicas.filter((d) => d.autor_id === usuario.id) : [];
  const meusGuias = usuario ? todosGuias.filter((g) => g.autor_id === usuario.id) : [];

  useEffect(() => {
    if (usuario) {
      fetchDicasSalvas();
      fetchStats();
    }
  }, [usuario]);

  async function fetchDicasSalvas() {
    if (!usuario) return;
    try {
      const { data, error } = await supabase
        .from('salvos')
        .select('*, dica:dicas(*)')
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
      setDicasSalvas(dicas.map((d) => toDicaCard({ ...d, imagens: d.imagens || [] })));
    } catch (err) {
      console.error('Erro ao buscar salvos:', err);
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
      console.error('Erro ao buscar stats:', err);
    }
  }

  const guiaIds = meusGuias.map((g) => g.id).sort().join(',');
  useEffect(() => {
    if (meusGuias.length === 0) {
      setGuiaDicaCounts({});
      return;
    }
    (async () => {
      const ids = meusGuias.map((g) => g.id);
      const { data } = await supabase.from('guias_dicas').select('guia_id').in('guia_id', ids);
      const counts: Record<string, number> = {};
      ids.forEach((id) => { counts[id] = 0; });
      (data || []).forEach((row: { guia_id: string }) => {
        counts[row.guia_id] = (counts[row.guia_id] ?? 0) + 1;
      });
      setGuiaDicaCounts(counts);
    })();
  }, [guiaIds]);

  const dicasDestaque = minhasDicas.slice(0, 3);

  if (loading) {
    return (
      <main className="min-h-screen bg-background pb-20">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Carregando perfil...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!usuario) {
    return (
      <main className="min-h-screen bg-background pb-20 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            {error || 'Usuário não encontrado'}
          </p>
          <p className="text-xs text-muted-foreground">
            Configure CURRENT_USER_ID em lib/current-user.ts
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Capa */}
      <div className="relative aspect-[3/1] w-full overflow-hidden">
        <Image
          src={usuario.capa || '/images/guia1.jpg'}
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
              src={usuario.avatar || '/images/hero1.jpg'}
              alt={usuario.nome}
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
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-foreground">{minhasDicas.length}</span>
              <span className="text-xs text-muted-foreground">dicas</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-foreground">{meusGuias.length}</span>
              <span className="text-xs text-muted-foreground">guias</span>
            </div>
            <Link href="/perfil/sugestoes" className="flex items-center gap-1">
              <span className="text-lg font-bold text-foreground">{seguidores}</span>
              <span className="text-xs text-muted-foreground">seguidores</span>
            </Link>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-foreground">{seguindo}</span>
              <span className="text-xs text-muted-foreground">seguindo</span>
            </div>
          </div>
        </div>

        {dicasDestaque.length > 0 && (
          <div className="py-4">
            <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
              <Star className="h-4 w-4 text-accent" strokeWidth={1.5} />
              Dicas em Destaque
            </h2>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
              {dicasDestaque.map((d) => (
                <div key={d.id} className="shrink-0 w-72">
                  <DicaCard dica={toDicaCard(d)} variant="grid" showDestaque />
                </div>
              ))}
            </div>
          </div>
        )}

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
          <div className="grid grid-cols-2 gap-3 px-4 pb-6 pt-4">
            {meusGuias.length === 0 ? (
              <div className="col-span-2 text-center py-12">
                <p className="text-sm text-muted-foreground">Nenhum guia criado ainda</p>
              </div>
            ) : (
              meusGuias.map((guia) => (
                <GuiaCard
                  key={guia.id}
                  guia={toGuiaCard(
                    { ...guia, autor: (guia as { autor?: { nome: string; avatar?: string } }).autor },
                    guiaDicaCounts[guia.id] ?? 0
                  )}
                  variant="grid"
                />
              ))
            )}
          </div>
        )}

        {tab === 'dicas' && (
          <div className="grid grid-cols-2 gap-3 px-4 pb-6 pt-4">
            {minhasDicas.length === 0 ? (
              <div className="col-span-2 text-center py-12">
                <p className="text-sm text-muted-foreground">Nenhuma dica criada ainda</p>
              </div>
            ) : (
              minhasDicas.map((dica) => (
                <DicaCard key={dica.id} dica={toDicaCard(dica)} variant="grid" />
              ))
            )}
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
              <div className="grid grid-cols-2 gap-3 px-4">
                {dicasSalvas.length === 0 ? (
                  <div className="col-span-2 text-center py-12">
                    <p className="text-sm text-muted-foreground">Nenhuma dica salva ainda</p>
                  </div>
                ) : (
                  dicasSalvas.map((d) => (
                    <DicaCard key={d.id} dica={d} variant="grid" />
                  ))
                )}
              </div>
            )}
            {salvosSubTab === 'guias' && (
              <div className="grid grid-cols-1 gap-4 px-4">
                <div className="col-span-2 text-center py-12">
                  <p className="text-sm text-muted-foreground">Guias salvos em breve</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <PerfilMenu
        open={menuOpen}
        onOpenChange={setMenuOpen}
        user={{
          nome: usuario.nome,
          username: `@${usuario.username}`,
          avatar: usuario.avatar || '',
        }}
      />
      <BottomNav />
    </main>
  );
}
