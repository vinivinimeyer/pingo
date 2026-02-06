'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Bell,
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  MoreHorizontal,
  RefreshCw,
} from 'lucide-react';
import { BottomNav } from '@/components/app/bottom-nav';
import { cn } from '@/lib/utils';

interface FeedPost {
  id: string;
  dicaId: string;
  autor: {
    id: string;
    nome: string;
    avatar: string;
  };
  imagem: string;
  titulo: string;
  descricao: string;
  curtidas: number;
  comentarios: number;
  tempo: string;
  curtido: boolean;
  salvo: boolean;
}

const mockPosts: FeedPost[] = [
  {
    id: '1',
    dicaId: '1',
    autor: {
      id: '1',
      nome: 'Marina Silva',
      avatar: '/avatars/marina.jpg',
    },
    imagem: '/images/cafe1.jpg',
    titulo: 'Café da Manhã Perfeito',
    descricao: 'Descobri esse lugar incrível na Vila Madalena! ☕',
    curtidas: 234,
    comentarios: 12,
    tempo: '2h',
    curtido: false,
    salvo: false,
  },
  {
    id: '2',
    dicaId: '2',
    autor: {
      id: '2',
      nome: 'João Santos',
      avatar: '/avatars/joao.jpg',
    },
    imagem: '/images/hero1.jpg',
    titulo: 'Vista Panorâmica',
    descricao: 'Valeu muito a caminhada até aqui. Recomendo para quem gosta de trilhas.',
    curtidas: 189,
    comentarios: 8,
    tempo: '5h',
    curtido: true,
    salvo: false,
  },
  {
    id: '3',
    dicaId: '3',
    autor: {
      id: '3',
      nome: 'Ana Costa',
      avatar: '/avatars/ana.jpg',
    },
    imagem: '/images/hero2.jpg',
    titulo: 'Melhor praia',
    descricao: 'Melhor praia que já visitei! Água cristalina e areia branca.',
    curtidas: 312,
    comentarios: 24,
    tempo: '1d',
    curtido: false,
    salvo: true,
  },
];

type FeedTab = 'para-voce' | 'seguindo' | 'populares' | 'proximos';

export default function FeedPage() {
  const [tab, setTab] = useState<FeedTab>('para-voce');
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNotifications] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);
  const pullStartY = useRef(0);

  const fetchPosts = useCallback(async (append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setPosts([]);
      setLoadingMore(false);
      setError(null);
      setHasMore(true);
    }
    try {
      await new Promise((r) => setTimeout(r, append ? 800 : 600));
      setPosts((prev) => (append ? [...prev, ...mockPosts] : mockPosts));
      if (append) setHasMore(false);
    } catch {
      setError('Erro ao carregar');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchPosts();
  }, [tab, fetchPosts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && posts.length > 0) {
          fetchPosts(true);
        }
      },
      { threshold: 0.1 }
    );
    const target = observerTarget.current;
    if (target) observer.observe(target);
    return () => (target ? observer.unobserve(target) : undefined);
  }, [hasMore, loadingMore, posts.length, fetchPosts]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setHasMore(true);
    await fetchPosts();
  }, [fetchPosts]);

  const toggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          curtido: !p.curtido,
          curtidas: p.curtido ? p.curtidas - 1 : p.curtidas + 1,
        };
      })
    );
  };

  const toggleSave = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, salvo: !p.salvo } : p))
    );
  };

  const tabs: { key: FeedTab; label: string }[] = [
    { key: 'para-voce', label: 'Para Você' },
    { key: 'seguindo', label: 'Seguindo' },
    { key: 'populares', label: 'Populares' },
    { key: 'proximos', label: 'Próximos' },
  ];

  return (
    <main className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-primary">Pin.Go</h1>
          <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
            aria-label="Atualizar"
          >
            <RefreshCw
              className={cn('h-6 w-6 text-muted-foreground', isRefreshing && 'animate-spin')}
              strokeWidth={1.5}
            />
          </button>
          <Link
            href="/perfil/notificacoes"
            className="relative p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Notificações"
          >
            <Bell className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
            {hasNotifications && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
            )}
          </Link>
        </div>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-3 -mx-4 px-4">
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

      {error && (
        <div className="px-4 py-6 text-center">
          <p className="text-sm text-muted-foreground mb-3">{error}</p>
          <button
            type="button"
            onClick={() => { setError(null); setIsLoading(true); fetchPosts(); }}
            className="rounded-full gradient-peach px-4 py-2 text-sm font-medium text-primary"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!error && isLoading && (
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

      {!error && !isLoading && posts.length === 0 && (
        <div className="px-4 py-12 text-center">
          <p className="text-sm text-muted-foreground">Siga pessoas para ver posts</p>
        </div>
      )}

      {!error && !isLoading && posts.length > 0 && (
        <div className="px-4 space-y-4 pt-4">
          {isRefreshing && (
            <div className="flex justify-center py-2">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}
          {posts.map((post) => (
            <div
              key={post.id}
              className="rounded-2xl border border-border bg-card overflow-hidden"
            >
              <div className="flex items-center gap-3 p-3">
                <Link href={`/perfil/${post.autor.id}`} className="shrink-0">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden bg-muted">
                    <Image
                      src={post.autor.avatar}
                      alt={post.autor.nome}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/perfil/${post.autor.id}`}>
                    <p className="text-sm font-semibold text-foreground truncate">
                      {post.autor.nome}
                    </p>
                  </Link>
                  <p className="text-xs text-muted-foreground">{post.tempo}</p>
                </div>
                <button
                  type="button"
                  className="p-1 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                  aria-label="Mais opções"
                >
                  <MoreHorizontal className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>

              <Link href={`/dica/${post.dicaId}`}>
                <div className="relative aspect-square w-full">
                  <Image
                    src={post.imagem}
                    alt={post.titulo}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 500px"
                  />
                </div>
              </Link>

              <div className="flex items-center gap-4 px-3 py-2">
                <button
                  type="button"
                  onClick={() => toggleLike(post.id)}
                  className="transition-colors hover:opacity-80"
                >
                  <Heart
                    className={cn(
                      'h-6 w-6',
                      post.curtido ? 'fill-accent text-accent' : 'text-foreground'
                    )}
                    strokeWidth={post.curtido ? 0 : 1.5}
                  />
                </button>
                <Link href={`/dica/${post.dicaId}#comentarios`}>
                  <MessageCircle className="h-6 w-6 text-foreground" strokeWidth={1.5} />
                </Link>
                <button type="button" className="hover:opacity-80 transition-opacity">
                  <Share className="h-6 w-6 text-foreground" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={() => toggleSave(post.id)}
                  className="ml-auto hover:opacity-80 transition-opacity"
                >
                  <Bookmark
                    className={cn(
                      'h-6 w-6 text-foreground',
                      post.salvo && 'fill-foreground'
                    )}
                    strokeWidth={1.5}
                  />
                </button>
              </div>

              <div className="px-3">
                <p className="text-sm font-semibold text-foreground">
                  {post.curtidas} curtidas
                </p>
              </div>

              <div className="px-3 pb-2">
                <p className="text-sm text-foreground">
                  <Link href={`/perfil/${post.autor.id}`}>
                    <span className="font-semibold">{post.autor.nome}</span>
                  </Link>{' '}
                  <span className="line-clamp-2">{post.descricao}</span>
                </p>
              </div>

              {post.comentarios > 0 && (
                <Link href={`/dica/${post.dicaId}#comentarios`}>
                  <div className="px-3 pb-3">
                    <p className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Ver todos os {post.comentarios} comentários
                    </p>
                  </div>
                </Link>
              )}
            </div>
          ))}

          {loadingMore && (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}
          <div ref={observerTarget} className="h-1" />
          {!hasMore && posts.length > 0 && (
            <div className="text-center py-8 text-sm text-muted-foreground">
              Você viu todos os posts
            </div>
          )}
        </div>
      )}

      <BottomNav />
    </main>
  );
}
