'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Bell, Heart, MessageCircle, Share, Bookmark, MoreHorizontal } from 'lucide-react';
import { BottomNav } from '@/components/app/bottom-nav';
import { Button } from '@/components/ui/button';

interface FeedPost {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  image: string;
  caption: string;
  likes: number;
  comments: number;
  liked: boolean;
  saved: boolean;
  timestamp: string;
}

const mockFeed: FeedPost[] = [
  {
    id: '1',
    author: { id: '1', name: 'Marina Silva', avatar: '/avatars/marina.jpg' },
    image: '/images/post1.jpg',
    caption: 'Descobri esse café incrível na Vila Madalena que serve o melhor café da manhã da região. O ambiente é aconchegante e a comida é deliciosa!',
    likes: 234,
    comments: 12,
    liked: false,
    saved: false,
    timestamp: '2h',
  },
  {
    id: '2',
    author: { id: '2', name: 'João Santos', avatar: '/avatars/joao.jpg' },
    image: '/images/post2.jpg',
    caption: 'Vista incrível do mirante! Valeu muito a caminhada até aqui. Recomendo para quem gosta de trilhas.',
    likes: 189,
    comments: 8,
    liked: true,
    saved: false,
    timestamp: '5h',
  },
  {
    id: '3',
    author: { id: '3', name: 'Ana Costa', avatar: '/avatars/ana.jpg' },
    image: '/images/post3.jpg',
    caption: 'Melhor praia que já visitei! Água cristalina e areia branca. Perfeito para relaxar.',
    likes: 312,
    comments: 24,
    liked: false,
    saved: true,
    timestamp: '1d',
  },
];

export default function FeedPage() {
  const [posts, setPosts] = useState<FeedPost[]>(mockFeed);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, isLoading]);

  const loadMorePosts = async () => {
    setIsLoading(true);
    // Simular carregamento
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Em produção, carregaria mais posts da API
    setHasMore(false); // Simular fim dos posts
    setIsLoading(false);
  };

  const toggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      })
    );
  };

  const toggleSave = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return { ...post, saved: !post.saved };
        }
        return post;
      })
    );
  };

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-primary">Pin.Go</h1>
          <button
            className="relative p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Notificações"
          >
            <Bell className="h-6 w-6" strokeWidth={1.5} />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4 px-4 pt-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="rounded-2xl border border-border bg-card overflow-hidden"
          >
            {/* Header do post */}
            <div className="p-3 flex items-center justify-between">
              <Link href={`/perfil/${post.author.id}`} className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full gradient-peach flex items-center justify-center text-primary font-bold">
                  {post.author.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{post.author.name}</p>
                  <p className="text-xs text-muted-foreground">{post.timestamp} atrás</p>
                </div>
              </Link>
              <button
                className="p-1 hover:bg-muted rounded-lg transition-colors"
                aria-label="Mais opções"
              >
                <MoreHorizontal className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
              </button>
            </div>

            {/* Imagem */}
            <Link href={`/dica/${post.id}`}>
              <div className="aspect-square w-full gradient-peach flex items-center justify-center">
                <div className="text-center">
                  <Heart className="h-12 w-12 mx-auto mb-2 text-primary" strokeWidth={1.5} />
                  <p className="text-xs text-muted-foreground">Imagem do post</p>
                </div>
              </div>
            </Link>

            {/* Ações */}
            <div className="px-3 py-2 flex items-center gap-4">
              <button
                onClick={() => toggleLike(post.id)}
                className="hover:opacity-70 transition-opacity"
              >
                <Heart
                  className={`h-6 w-6 ${post.liked ? 'fill-accent text-accent' : 'text-foreground'}`}
                  strokeWidth={post.liked ? 2 : 1.5}
                />
              </button>
              <Link href={`/dica/${post.id}#comentarios`}>
                <MessageCircle className="h-6 w-6 text-foreground" strokeWidth={1.5} />
              </Link>
              <button className="hover:opacity-70 transition-opacity">
                <Share className="h-6 w-6 text-foreground" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => toggleSave(post.id)}
                className="ml-auto hover:opacity-70 transition-opacity"
              >
                <Bookmark
                  className={`h-6 w-6 ${post.saved ? 'fill-accent text-accent' : 'text-foreground'}`}
                  strokeWidth={post.saved ? 2 : 1.5}
                />
              </button>
            </div>

            {/* Curtidas */}
            <div className="px-3">
              <p className="text-sm font-semibold text-foreground">{post.likes} curtidas</p>
            </div>

            {/* Caption */}
            <div className="px-3 py-1">
              <p className="text-sm leading-relaxed text-foreground">
                <span className="font-semibold">{post.author.name}</span>{' '}
                {post.caption.length > 100 ? (
                  <>
                    {post.caption.slice(0, 100)}...{' '}
                    <button className="text-muted-foreground hover:text-foreground">ver mais</button>
                  </>
                ) : (
                  post.caption
                )}
              </p>
            </div>

            {/* Ver comentários */}
            {post.comments > 0 && (
              <Link href={`/dica/${post.id}#comentarios`}>
                <div className="px-3 pb-3">
                  <p className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Ver todos os {post.comments} comentários
                  </p>
                </div>
              </Link>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}

        {/* Observer target para infinite scroll */}
        <div ref={observerTarget} className="h-1" />

        {/* End of feed */}
        {!hasMore && (
          <div className="text-center py-8 text-sm text-muted-foreground">
            Você viu todos os posts
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
