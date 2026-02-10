'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  MoreHorizontal,
  BookOpen,
  MapPin,
} from 'lucide-react';
import { useCurtidas, useSalvos } from '@/lib/hooks/use-supabase';
import { cn } from '@/lib/utils';

export type PostTipo = 'dica' | 'guia';

export interface FeedPost {
  id: string;
  tipo: PostTipo;
  dicaId?: string;
  guiaId?: string;
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
  numeroDicas?: number;
  cidade?: string;
}

interface FeedCardProps {
  post: FeedPost;
  usuarioId: string | null;
}

export function FeedCard({ post, usuarioId }: FeedCardProps) {
  const dicaId = post.tipo === 'dica' && post.dicaId != null ? post.dicaId : null;
  const { curtido, curtidas, toggleCurtida } = useCurtidas(dicaId, usuarioId);
  const { salvo, toggleSalvo } = useSalvos(dicaId, usuarioId);

  const isDica = dicaId != null;

  const displayCurtidas = isDica ? curtidas : post.curtidas;
  const displayCurtido = isDica ? curtido : post.curtido;
  const displaySalvo = isDica ? salvo : post.salvo;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-3 p-3">
        <Link href={`/perfil/${post.autor.id}`} className="shrink-0">
          <div className="relative h-10 w-10 rounded-full overflow-hidden bg-muted">
            <Image
              src={post.autor.avatar || '/images/hero1.jpg'}
              alt={post.autor.nome}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link href={`/perfil/${post.autor.id}`}>
              <p className="text-sm font-semibold text-foreground truncate">
                {post.autor.nome}
              </p>
            </Link>
            {post.tipo === 'guia' && (
              <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent flex items-center gap-1 shrink-0">
                <BookOpen className="h-3 w-3" strokeWidth={2} />
                GUIA
              </span>
            )}
          </div>
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

      <Link
        href={
          post.tipo === 'guia'
            ? `/guia/${post.guiaId}`
            : `/dica/${post.dicaId}`
        }
      >
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
          onClick={() => isDica && toggleCurtida()}
          className="transition-colors hover:opacity-80"
        >
          <Heart
            className={cn(
              'h-6 w-6',
              displayCurtido ? 'fill-accent text-accent' : 'text-foreground'
            )}
            strokeWidth={displayCurtido ? 0 : 1.5}
          />
        </button>
        <Link
          href={
            (post.tipo === 'guia'
              ? `/guia/${post.guiaId}`
              : `/dica/${post.dicaId}`) + '#comentarios'
          }
        >
          <MessageCircle
            className="h-6 w-6 text-foreground"
            strokeWidth={1.5}
          />
        </Link>
        <button
          type="button"
          className="hover:opacity-80 transition-opacity"
        >
          <Share className="h-6 w-6 text-foreground" strokeWidth={1.5} />
        </button>
        <button
          type="button"
          onClick={() => isDica && toggleSalvo()}
          className="ml-auto hover:opacity-80 transition-opacity"
        >
          <Bookmark
            className={cn(
              'h-6 w-6 text-foreground',
              displaySalvo && 'fill-foreground'
            )}
            strokeWidth={1.5}
          />
        </button>
      </div>

      <div className="px-3">
        <p className="text-sm font-semibold text-foreground">
          {displayCurtidas} curtidas
        </p>
      </div>

      <div className="px-3 pb-2">
        <p className="text-sm text-foreground">
          <Link href={`/perfil/${post.autor.id}`}>
            <span className="font-semibold">{post.autor.nome}</span>
          </Link>{' '}
          <span className="line-clamp-2">{post.descricao}</span>
        </p>
        {post.tipo === 'guia' &&
          post.numeroDicas != null &&
          post.cidade && (
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <MapPin
                className="h-3 w-3 shrink-0"
                strokeWidth={1.5}
              />
              <span>
                {post.numeroDicas} dicas • {post.cidade}
              </span>
            </div>
          )}
      </div>

      {post.comentarios > 0 && (
        <Link
          href={
            (post.tipo === 'guia'
              ? `/guia/${post.guiaId}`
              : `/dica/${post.dicaId}`) + '#comentarios'
          }
        >
          <div className="px-3 pb-3">
            <p className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Ver todos os {post.comentarios} comentários
            </p>
          </div>
        </Link>
      )}
    </div>
  );
}
