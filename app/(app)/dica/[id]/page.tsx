'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Share,
  MapPin,
  Heart,
  MessageCircle,
  Bookmark,
  ChevronRight,
  Info,
} from 'lucide-react';
import { BottomNav } from '@/components/app/bottom-nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet } from '@/components/ui/sheet';
import { supabase } from '@/lib/supabase';
import { useCurrentUser } from '@/lib/current-user';
import { useCurtidas, useSalvos } from '@/lib/hooks/use-supabase';

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

export default function DicaDetalhadaPage() {
  const router = useRouter();
  const params = useParams();
  const dicaId = params?.id as string;

  const [dica, setDica] = useState<{
    id: string;
    titulo: string;
    descricao: string;
    imagens: string[];
    localizacao: string;
    categoria: string;
    autor_id: string;
    curtidas: number;
    comentarios: number;
    endereco?: string;
    horario?: string;
    preco_medio?: string;
    telefone?: string;
    website?: string;
    acessibilidade?: string[];
    tags?: string[];
    autor?: { id: string; nome: string; username: string; avatar?: string };
  } | null>(null);
  const [comentarios, setComentarios] = useState<{ id: string; texto: string; created_at: string; autor?: { id: string; nome: string; avatar?: string } }[]>([]);
  const [novoComentario, setNovoComentario] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [loading, setLoading] = useState(true);

  const { usuario } = useCurrentUser();
  const { curtido, curtidas, toggleCurtida } = useCurtidas(dicaId, usuario?.id ?? null);
  const { salvo, toggleSalvo } = useSalvos(dicaId, usuario?.id ?? null);

  const [currentImage, setCurrentImage] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (dicaId) {
      fetchDica();
      fetchComentarios();
    }
  }, [dicaId]);

  async function fetchDica() {
    if (!dicaId) return;
    try {
      const { data, error } = await supabase
        .from('dicas')
        .select('*, autor:usuarios(*)')
        .eq('id', dicaId)
        .single();
      if (error) throw error;
      const row = data as typeof dica & { autor?: unknown };
      const autor = Array.isArray(row?.autor) ? row.autor[0] : row?.autor;
      setDica({ ...row, autor: autor as typeof dica.autor });
    } catch (err) {
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchComentarios() {
    if (!dicaId) return;
    try {
      const { data, error } = await supabase
        .from('comentarios')
        .select('*, autor:usuarios(*)')
        .eq('dica_id', dicaId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      const list = (data || []) as { id: string; texto: string; created_at: string; autor?: unknown }[];
      setComentarios(
        list.map((c) => ({
          ...c,
          autor: (Array.isArray(c.autor) ? c.autor[0] : c.autor) as { id: string; nome: string; avatar?: string },
        }))
      );
    } catch (err) {
      console.error('Erro:', err);
    }
  }

  async function handleEnviarComentario() {
    if (!novoComentario.trim() || !usuario) return;
    setEnviando(true);
    try {
      const { data, error } = await supabase
        .from('comentarios')
        .insert({
          dica_id: dicaId,
          autor_id: usuario.id,
          texto: novoComentario.trim(),
          curtidas: 0,
        })
        .select('*, autor:usuarios(*)')
        .single();
      if (error) throw error;
      const c = data as (typeof comentarios)[0] & { autor?: unknown };
      const autor = Array.isArray(c.autor) ? c.autor[0] : c.autor;
      setComentarios((prev) => [{ ...c, autor: autor as { id: string; nome: string; avatar?: string } }, ...prev]);
      setNovoComentario('');
      if (dica) {
        await supabase.from('dicas').update({ comentarios: (dica.comentarios || 0) + 1 }).eq('id', dicaId);
        setDica((prev) => (prev ? { ...prev, comentarios: prev.comentarios + 1 } : null));
      }
    } catch {
      alert('Erro ao enviar comentário');
    } finally {
      setEnviando(false);
    }
  }

  if (loading && !dica) {
    return (
      <main className="min-h-screen bg-background pb-20 flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (!dica) {
    return (
      <main className="min-h-screen bg-background pb-20 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Dica não encontrada</p>
      </main>
    );
  }

  const images = Array.isArray(dica.imagens) && dica.imagens.length > 0 ? dica.imagens : ['/images/hero1.jpg'];
  const description = dica.descricao;
  const shouldTruncate = description.length > 300;
  const displayDescription = showFullDescription || !shouldTruncate ? description : description.slice(0, 300) + '...';

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Carousel de imagens */}
      <div className="relative aspect-[4/3] w-full">
        <div className="absolute inset-0 bg-muted">
          <Image
            src={images[currentImage]}
            alt={dica.titulo}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>

        {/* Header sobre imagem */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-foreground/60 to-transparent px-4 py-4 pt-safe">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full bg-background/80 backdrop-blur-md hover:bg-background transition-colors"
              aria-label="Voltar"
            >
              <ArrowLeft className="h-5 w-5 text-primary-foreground" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => setShowInfo(true)}
              className="p-2 rounded-full bg-background/80 backdrop-blur-md hover:bg-background transition-colors text-primary-foreground"
              aria-label="Informações"
            >
              <Info className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <button
              className="p-2 rounded-full bg-background/80 backdrop-blur-md hover:bg-background transition-colors"
              aria-label="Compartilhar"
            >
              <Share className="h-5 w-5 text-primary-foreground" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentImage
                    ? 'w-8 bg-primary-foreground'
                    : 'w-2 bg-primary-foreground/50'
                }`}
                aria-label={`Imagem ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-md hover:bg-background transition-colors z-10"
              aria-label="Imagem anterior"
            >
              <ChevronRight className="h-5 w-5 rotate-180 text-primary-foreground" strokeWidth={2} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-md hover:bg-background transition-colors z-10"
              aria-label="Próxima imagem"
            >
              <ChevronRight className="h-5 w-5 text-primary-foreground" strokeWidth={2} />
            </button>
          </>
        )}
      </div>

      {/* Conteúdo */}
      <div className="px-4 space-y-6 pt-6">
        {/* Autor */}
        <div className="flex items-center justify-between py-4">
          <Link href={`/perfil/${dica.autor?.id ?? dica.autor_id}`} className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted">
              <Image
                src={dica.autor?.avatar || '/images/hero1.jpg'}
                alt={dica.autor?.nome ?? ''}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{dica.autor?.nome ?? 'Anônimo'}</p>
              <p className="text-xs text-muted-foreground">@{dica.autor?.username ?? ''}</p>
            </div>
          </Link>
          <Link href={`/perfil/${dica.autor?.id ?? dica.autor_id}`}>
            <Button variant="outline" size="sm" className="rounded-full">
              Seguir
            </Button>
          </Link>
        </div>

        {/* Título e localização */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground mb-3">
            {dica.titulo}
          </h1>
          <Link
            href="/mapa"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mb-3"
          >
            <MapPin className="h-4 w-4" strokeWidth={1.5} />
            {dica.localizacao}
          </Link>
          <span className="inline-block rounded-full bg-accent/10 text-accent px-3 py-1 text-xs">
            {dica.categoria}
          </span>
        </div>

        {/* Descrição */}
        <div>
          <p className="text-sm leading-relaxed text-foreground">{displayDescription}</p>
          {shouldTruncate && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-sm text-accent hover:underline mt-2"
            >
              {showFullDescription ? 'Ver menos' : 'Ver mais'}
            </button>
          )}
        </div>

        {/* Ações */}
        <div className="flex items-center gap-6 py-2">
          <button onClick={toggleCurtida} className="flex items-center gap-2">
            <Heart
              className={`h-6 w-6 ${curtido ? 'fill-accent text-accent' : 'text-muted-foreground'}`}
              strokeWidth={curtido ? 2 : 1.5}
            />
            <span className="text-sm font-semibold text-foreground">{curtidas}</span>
          </button>
          <a href="#comentarios" className="flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
            <span className="text-sm font-semibold text-foreground">{dica.comentarios}</span>
          </a>
          <button onClick={toggleSalvo} className="ml-auto">
            <Bookmark
              className={`h-6 w-6 ${salvo ? 'fill-accent text-accent' : 'text-muted-foreground'}`}
              strokeWidth={salvo ? 2 : 1.5}
            />
          </button>
        </div>

        {/* Comentários */}
        <div id="comentarios" className="pt-6 border-t border-border">
          <h3 className="text-lg font-bold text-foreground mb-4">
            Comentários ({comentarios.length})
          </h3>
          <div className="flex gap-3 mb-6">
            <div className="relative h-10 w-10 rounded-full overflow-hidden bg-muted shrink-0">
              <Image
                src={usuario?.avatar || '/images/hero1.jpg'}
                alt=""
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={novoComentario}
                onChange={(e) => setNovoComentario(e.target.value)}
                placeholder="Adicione um comentário..."
                className="flex-1 rounded-full border border-border bg-card px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="button"
                onClick={handleEnviarComentario}
                disabled={!novoComentario.trim() || enviando}
                className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground disabled:opacity-50"
              >
                {enviando ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {comentarios.map((comentario) => (
              <div key={comentario.id} className="flex gap-3">
                <Link href={`/perfil/${comentario.autor?.id}`} className="shrink-0">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden bg-muted">
                    <Image
                      src={comentario.autor?.avatar || '/images/hero1.jpg'}
                      alt={comentario.autor?.nome ?? ''}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <Link href={`/perfil/${comentario.autor?.id}`}>
                      <p className="text-sm font-semibold text-foreground mb-1">
                        {comentario.autor?.nome ?? 'Anônimo'}
                      </p>
                    </Link>
                    <p className="text-sm text-foreground">{comentario.texto}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 px-4">
                    {formatarTempo(comentario.created_at)}
                  </p>
                </div>
              </div>
            ))}
            {comentarios.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">
                Seja o primeiro a comentar
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Sheet Informações gerais */}
      <Sheet open={showInfo} onOpenChange={setShowInfo} side="bottom">
        <div className="max-h-[80vh] overflow-y-auto p-6 pb-8">
          <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-muted" />
          <h3 className="text-lg font-bold text-foreground mb-4">Informações</h3>
          <div className="space-y-4">
            {dica.endereco && (
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                  Endereço
                </p>
                <p className="text-sm text-foreground">{dica.endereco}</p>
                <Link href="/mapa" className="text-xs text-accent mt-1 inline-block">
                  Ver no mapa
                </Link>
              </div>
            )}
            {dica.horario && (
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                  Horário
                </p>
                <p className="text-sm text-foreground">{dica.horario}</p>
              </div>
            )}
            {dica.preco_medio && (
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                  Preço médio
                </p>
                <p className="text-sm text-foreground">{dica.preco_medio}</p>
              </div>
            )}
            {(dica.telefone || dica.website) && (
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                  Contato
                </p>
                {dica.telefone && <p className="text-sm text-foreground">{dica.telefone}</p>}
                {dica.website && (
                  <a
                    href={dica.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-accent mt-1 block"
                  >
                    Visitar site
                  </a>
                )}
              </div>
            )}
            {dica.acessibilidade && dica.acessibilidade.length > 0 && (
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                  Acessibilidade
                </p>
                <div className="flex flex-wrap gap-2">
                  {dica.acessibilidade.map((item: string) => (
                    <span
                      key={item}
                      className="rounded-full bg-accent/10 px-3 py-1 text-xs text-accent"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {dica.tags && dica.tags.length > 0 && (
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                  Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {dica.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border px-3 py-1 text-xs text-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Sheet>

      {/* Input de comentário sticky */}
      <div className="sticky bottom-20 left-0 right-0 bg-card border-t border-border px-4 py-3 z-30">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Adicione um comentário..."
            value={novoComentario}
            onChange={(e) => setNovoComentario(e.target.value)}
            className="flex-1"
          />
          <Button
            variant="gradient"
            size="sm"
            disabled={!novoComentario.trim() || enviando}
            onClick={handleEnviarComentario}
          >
            {enviando ? 'Enviando...' : 'Enviar'}
          </Button>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
