'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Bell,
  RefreshCw,
  MapPin,
  Search,
  X,
} from 'lucide-react';
import { BottomNav } from '@/components/app/bottom-nav';
import { FeedCard, type FeedPost } from '@/components/app/feed-card';
import { useDicas, useGuias, useSeguindo } from '@/lib/hooks/use-supabase';
import { useCurrentUser } from '@/lib/current-user';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

function formatarTempo(timestamp: string) {
  const agora = new Date();
  const data = new Date(timestamp);
  const diff = Math.floor((agora.getTime() - data.getTime()) / 1000);
  if (diff < 60) return 'agora';
  if (diff < 3600) return `${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return `${Math.floor(diff / 604800)}sem`;
}

type UserSearch = { id: string; nome: string; username: string; avatar?: string; bio?: string };

function SearchResult({
  user,
  usuarioAtualId,
  onClose,
}: {
  user: UserSearch;
  usuarioAtualId: string | null;
  onClose: () => void;
}) {
  const { seguindo, toggleSeguindo } = useSeguindo(user.id, usuarioAtualId);

  return (
    <div className="flex items-center gap-3 rounded-xl p-3 hover:bg-muted transition-colors">
      <Link
        href={`/perfil/${user.id}`}
        onClick={onClose}
        className="flex items-center gap-3 flex-1 min-w-0"
      >
        <div className="relative h-12 w-12 shrink-0 rounded-full overflow-hidden bg-muted">
          <Image
            src={user.avatar || '/images/hero1.jpg'}
            alt={user.nome}
            width={48}
            height={48}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{user.nome}</p>
          <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
        </div>
      </Link>
      <button
        type="button"
        onClick={toggleSeguindo}
        className={cn(
          'rounded-full px-4 py-2 text-xs font-medium transition-colors shrink-0',
          seguindo
            ? 'border border-border bg-card text-foreground hover:bg-muted'
            : 'gradient-peach text-primary hover:opacity-90'
        )}
      >
        {seguindo ? 'Seguindo' : 'Seguir'}
      </button>
    </div>
  );
}

type FeedTab = 'para-voce' | 'seguindo' | 'populares' | 'proximos';

export default function FeedPage() {
  const [tab, setTab] = useState<FeedTab>('para-voce');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasNotifications] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearch[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [usuarios, setUsuarios] = useState<UserSearch[]>([]);
  const observerTarget = useRef<HTMLDivElement>(null);

  const { usuario: usuarioAtual } = useCurrentUser();
  const usuarioId = usuarioAtual?.id ?? null;
  const { dicas, loading, error, fetchDicas } = useDicas();
  const { guias, loading: guiasLoading, fetchGuias } = useGuias();

  useEffect(() => {
    fetchUsuarios();
  }, []);

  async function fetchUsuarios() {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, nome, username, avatar, bio')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setUsuarios((data as UserSearch[]) || []);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
    }
  }

  const dicaPosts: FeedPost[] = dicas.map((dica) => {
    const autor = (dica as { autor?: { id: string; nome: string; avatar?: string } }).autor;
    return {
      id: dica.id,
      tipo: 'dica' as const,
      dicaId: dica.id,
      autor: {
        id: autor?.id ?? dica.autor_id,
        nome: autor?.nome ?? 'Anônimo',
        avatar: autor?.avatar ?? '',
      },
      imagem: Array.isArray(dica.imagens) && dica.imagens[0] ? dica.imagens[0] : '/images/hero1.jpg',
      titulo: dica.titulo,
      descricao: dica.descricao,
      curtidas: dica.curtidas,
      comentarios: dica.comentarios,
      tempo: formatarTempo(dica.created_at),
      curtido: false,
      salvo: false,
    };
  });

  const guiaPosts: FeedPost[] = guias.map((guia) => {
    const autor = (guia as { autor?: { id: string; nome: string; avatar?: string } }).autor;
    return {
      id: guia.id,
      tipo: 'guia' as const,
      guiaId: guia.id,
      autor: {
        id: autor?.id ?? guia.autor_id,
        nome: autor?.nome ?? 'Anônimo',
        avatar: autor?.avatar ?? '',
      },
      imagem: guia.capa ?? '/images/guia1.jpg',
      titulo: guia.titulo,
      descricao: guia.descricao,
      curtidas: guia.curtidas,
      comentarios: 0,
      tempo: formatarTempo(guia.created_at),
      curtido: false,
      salvo: false,
      numeroDicas: undefined,
      cidade: guia.cidade,
    };
  });

  const orderedPosts: FeedPost[] = [...dicaPosts, ...guiaPosts].sort(
    (a, b) => {
      const aItem = dicas.find((d) => d.id === a.id) ?? guias.find((g) => g.id === a.id);
      const bItem = dicas.find((d) => d.id === b.id) ?? guias.find((g) => g.id === b.id);
      const aT = aItem?.created_at ?? '';
      const bT = bItem?.created_at ?? '';
      return new Date(bT).getTime() - new Date(aT).getTime();
    }
  );

  const isLoading = loading || guiasLoading;
  const displayError = error;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    const results = usuarios.filter(
      (user) =>
        user.nome.toLowerCase().includes(query.toLowerCase()) ||
        user.username.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
    setShowSearchResults(true);
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([fetchDicas(), fetchGuias()]);
    setIsRefreshing(false);
  }, [fetchDicas, fetchGuias]);

  const tabs: { key: FeedTab; label: string }[] = [
    { key: 'para-voce', label: 'Para Você' },
    { key: 'seguindo', label: 'Seguindo' },
    { key: 'populares', label: 'Populares' },
    { key: 'proximos', label: 'Próximos' },
  ];

  return (
    <main className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-primary shrink-0">Pin.Go</h1>
            <div className="flex-1 min-w-0" />
            <div className="relative flex-1 max-w-xs">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar pessoas..."
                className="w-full rounded-full border border-border bg-card px-4 py-2 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" strokeWidth={1.5} />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setShowSearchResults(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" strokeWidth={1.5} />
                </button>
              )}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-y-auto rounded-2xl border border-border bg-card shadow-xl z-50">
                  {searchResults.length === 0 ? (
                    <div className="p-6 text-center">
                      <p className="text-sm text-muted-foreground">
                        Nenhuma pessoa encontrada
                      </p>
                    </div>
                  ) : (
                    <div className="p-2">
                      {searchResults.map((user) => (
                        <SearchResult
                          key={user.id}
                          user={user}
                          usuarioAtualId={usuarioAtual?.id ?? null}
                          onClose={() => setShowSearchResults(false)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50 shrink-0"
              aria-label="Atualizar"
            >
              <RefreshCw
                className={cn('h-6 w-6 text-muted-foreground', isRefreshing && 'animate-spin')}
                strokeWidth={1.5}
              />
            </button>
            <Link
              href="/perfil/notificacoes"
              className="relative p-2 hover:bg-muted rounded-lg transition-colors shrink-0"
              aria-label="Notificações"
            >
              <Bell className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
              {hasNotifications && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
              )}
            </Link>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-3 px-4">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                tab === t.key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {displayError && (
        <div className="px-4 py-6 text-center">
          <p className="text-sm text-muted-foreground mb-3">Erro ao carregar feed</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!displayError && isLoading && (
        <div className="px-4 space-y-4 pt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="flex items-center gap-3 p-3">
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                </div>
              </div>
              <div className="aspect-square w-full bg-muted animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                <div className="h-4 w-full bg-muted rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!displayError && !isLoading && orderedPosts.length === 0 && (
        <div className="px-4 py-12 text-center">
          <p className="text-sm text-muted-foreground">Siga pessoas para ver posts</p>
        </div>
      )}

      {!displayError && !isLoading && orderedPosts.length > 0 && (
        <div className="px-4 space-y-4 pt-4">
          {isRefreshing && (
            <div className="flex justify-center py-2">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}
          {orderedPosts.map((post) => (
            <FeedCard key={post.id} post={post} usuarioId={usuarioId} />
          ))}
          <div ref={observerTarget} className="h-1" />
        </div>
      )}

      <BottomNav />
    </main>
  );
}
