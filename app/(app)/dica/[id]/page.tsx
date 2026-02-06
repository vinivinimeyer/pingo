'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
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

const mockTip = {
  id: '1',
  title: 'Café da Manhã Perfeito',
  description:
    'Descobri esse café incrível na Vila Madalena que serve o melhor café da manhã da região. O ambiente é aconchegante, a comida é deliciosa e o atendimento é impecável. Recomendo especialmente os waffles com frutas frescas e o cappuccino artesanal. Vale muito a pena visitar!',
  images: ['/images/cafe1.jpg', '/images/cafe2.jpg'],
  location: { name: 'Vila Madalena, São Paulo', lat: -23.5505, lng: -46.6333 },
  category: 'Restaurantes',
  author: {
    id: '1',
    name: 'Marina Silva',
    username: '@marinasilva',
    avatar: '/avatars/marina.jpg',
  },
  likes: 234,
  comments: 12,
  saved: false,
  liked: false,
  endereco: 'Rua Augusta, 123 - Vila Madalena, São Paulo',
  horario: 'Seg-Sex: 8h-20h | Sáb-Dom: 9h-18h',
  precoMedio: 'R$ 25-50',
  telefone: '(11) 98765-4321',
  website: 'https://cafepingo.com.br',
  acessibilidade: ['Rampa de acesso', 'Banheiro adaptado'],
  tags: ['café', 'brunch', 'vilamadalena', 'petfriendly'],
};

const mockRelatedTips = [
  { id: '2', title: 'Padaria Artesanal', image: '/images/padaria.jpg', distance: '0.3 km' },
  { id: '3', title: 'Café Especial', image: '/images/cafe2.jpg', distance: '0.5 km' },
  { id: '4', title: 'Brunch Delicioso', image: '/images/brunch.jpg', distance: '0.7 km' },
];

const mockComments = [
  {
    id: '1',
    author: { name: 'João Santos', avatar: '/avatars/joao.jpg' },
    text: 'Adorei esse lugar! Os waffles são realmente incríveis.',
    time: '2h atrás',
    likes: 5,
  },
  {
    id: '2',
    author: { name: 'Ana Costa', avatar: '/avatars/ana.jpg' },
    text: 'Preciso visitar! Obrigada pela dica.',
    time: '5h atrás',
    likes: 2,
  },
];

export default function DicaDetalhadaPage() {
  const router = useRouter();
  const params = useParams();
  const [currentImage, setCurrentImage] = useState(0);
  const [liked, setLiked] = useState(mockTip.liked);
  const [saved, setSaved] = useState(mockTip.saved);
  const [likes, setLikes] = useState(mockTip.likes);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [comment, setComment] = useState('');
  const [showInfo, setShowInfo] = useState(false);

  const description = mockTip.description;
  const shouldTruncate = description.length > 300;
  const displayDescription = showFullDescription || !shouldTruncate ? description : description.slice(0, 300) + '...';

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % mockTip.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + mockTip.images.length) % mockTip.images.length);
  };

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Carousel de imagens */}
      <div className="relative aspect-[4/3] w-full">
        <div className="absolute inset-0 gradient-peach flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-16 w-16 mx-auto mb-2 text-primary" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground">Imagem {currentImage + 1} de {mockTip.images.length}</p>
          </div>
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
        {mockTip.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {mockTip.images.map((_, index) => (
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
        {mockTip.images.length > 1 && (
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
          <Link href={`/perfil/${mockTip.author.id}`} className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full gradient-peach flex items-center justify-center text-primary font-bold">
              {mockTip.author.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{mockTip.author.name}</p>
              <p className="text-xs text-muted-foreground">{mockTip.author.username}</p>
            </div>
          </Link>
          <Button variant="outline" size="sm" className="rounded-full">
            Seguir
          </Button>
        </div>

        {/* Título e localização */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground mb-3">
            {mockTip.title}
          </h1>
          <Link
            href={`/mapa?lat=${mockTip.location.lat}&lng=${mockTip.location.lng}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mb-3"
          >
            <MapPin className="h-4 w-4" strokeWidth={1.5} />
            {mockTip.location.name}
          </Link>
          <span className="inline-block rounded-full bg-accent/10 text-accent px-3 py-1 text-xs">
            {mockTip.category}
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
          <button
            onClick={() => {
              setLiked(!liked);
              setLikes((prev) => (liked ? prev - 1 : prev + 1));
            }}
            className="flex items-center gap-2"
          >
            <Heart
              className={`h-6 w-6 ${liked ? 'fill-accent text-accent' : 'text-muted-foreground'}`}
              strokeWidth={liked ? 2 : 1.5}
            />
            <span className="text-sm font-semibold text-foreground">{likes}</span>
          </button>
          <button className="flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
            <span className="text-sm font-semibold text-foreground">{mockTip.comments}</span>
          </button>
          <button
            onClick={() => setSaved(!saved)}
            className="ml-auto"
          >
            <Bookmark
              className={`h-6 w-6 ${saved ? 'fill-accent text-accent' : 'text-muted-foreground'}`}
              strokeWidth={saved ? 2 : 1.5}
            />
          </button>
        </div>

        {/* Mais dicas próximas */}
        <div>
          <h2 className="text-base font-bold text-foreground mb-3">Mais dicas próximas</h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {mockRelatedTips.map((tip) => (
              <Link
                key={tip.id}
                href={`/dica/${tip.id}`}
                className="shrink-0 w-40 rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-square w-full gradient-peach flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-primary" strokeWidth={1.5} />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-1">
                    {tip.title}
                  </h3>
                  <p className="text-xs text-accent font-mono">{tip.distance}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Comentários */}
        <div>
          <h2 className="text-base font-bold text-foreground mb-4">
            Comentários ({mockTip.comments})
          </h2>
          <div className="space-y-4 mb-4">
            {mockComments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="h-8 w-8 rounded-full gradient-peach flex items-center justify-center text-primary text-xs font-bold shrink-0">
                  {comment.author.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-semibold text-foreground">{comment.author.name}</p>
                    <p className="text-xs text-muted-foreground">{comment.time}</p>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground mb-2">{comment.text}</p>
                  <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-accent transition-colors">
                    <Heart className="h-3 w-3" strokeWidth={1.5} />
                    {comment.likes}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sheet Informações gerais */}
      <Sheet open={showInfo} onOpenChange={setShowInfo} side="bottom">
        <div className="max-h-[80vh] overflow-y-auto p-6 pb-8">
          <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-muted" />
          <h3 className="text-lg font-bold text-foreground mb-4">Informações</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                Endereço
              </p>
              <p className="text-sm text-foreground">{mockTip.endereco}</p>
              <Link
                href={`/mapa?lat=${mockTip.location.lat}&lng=${mockTip.location.lng}`}
                className="text-xs text-accent mt-1 inline-block"
              >
                Ver no mapa
              </Link>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                Horário
              </p>
              <p className="text-sm text-foreground">{mockTip.horario}</p>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                Preço médio
              </p>
              <p className="text-sm text-foreground">{mockTip.precoMedio}</p>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                Contato
              </p>
              <p className="text-sm text-foreground">{mockTip.telefone}</p>
              {mockTip.website && (
                <a
                  href={mockTip.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-accent mt-1 block"
                >
                  Visitar site
                </a>
              )}
            </div>
            {mockTip.acessibilidade && mockTip.acessibilidade.length > 0 && (
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                  Acessibilidade
                </p>
                <div className="flex flex-wrap gap-2">
                  {mockTip.acessibilidade.map((item: string) => (
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
            {mockTip.tags && mockTip.tags.length > 0 && (
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                  Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {mockTip.tags.map((tag: string) => (
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
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-1"
          />
          <Button
            variant="gradient"
            size="sm"
            disabled={!comment.trim()}
            onClick={() => {
              // Adicionar comentário
              setComment('');
            }}
          >
            Enviar
          </Button>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
