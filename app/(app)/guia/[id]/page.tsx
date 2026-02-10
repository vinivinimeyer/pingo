'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Share, Bookmark, MapPin, ChevronRight, ChevronLeft } from 'lucide-react';
import { BottomNav } from '@/components/app/bottom-nav';
import { cn } from '@/lib/utils';

const mockGuia = {
  id: '1',
  titulo: 'Roteiro 3 dias em São Paulo',
  descricao:
    'Os melhores lugares para quem tem pouco tempo na cidade. Do centro histórico à Vila Madalena, passando por museus, bares e restaurantes que não podem ficar de fora do seu roteiro. Ideal para um fim de semana prolongado ou feriado.',
  capa: '/images/guia1.jpg',
  cidade: 'São Paulo, SP',
  categoria: 'Roteiro',
  autor: {
    id: '1',
    nome: 'Marina Silva',
    avatar: '/avatars/marina.jpg',
  },
  dicas: [
    {
      id: '1',
      titulo: 'Café da Manhã Perfeito',
      descricao: 'O melhor café da Vila Madalena.',
      imagem: '/images/cafe1.jpg',
      imagens: ['/images/cafe1.jpg', '/images/hero2.jpg'],
      localizacao: 'Vila Madalena, SP',
      categoria: 'Restaurantes',
    },
    {
      id: '2',
      titulo: 'Padaria Artesanal',
      descricao: 'Pães e doces incríveis.',
      imagem: '/images/padaria.jpg',
      imagens: ['/images/padaria.jpg'],
      localizacao: 'Pinheiros, SP',
      categoria: 'Restaurantes',
    },
    {
      id: '3',
      titulo: 'Vista Panorâmica',
      descricao: 'Mirante com vista 360°.',
      imagem: '/images/hero1.jpg',
      imagens: ['/images/hero1.jpg', '/images/guia1.jpg'],
      localizacao: 'Centro, SP',
      categoria: 'Cultura',
    },
  ],
  stats: { dicas: 3, saves: 450, shares: 120 },
  saved: false,
};

export default function GuiaSelecionadoPage() {
  const todasImagens = [
    mockGuia.capa,
    ...mockGuia.dicas.flatMap((d) =>
      'imagens' in d && Array.isArray(d.imagens) ? d.imagens : [d.imagem]
    ),
  ];
  const router = useRouter();
  const [saved, setSaved] = useState(mockGuia.saved);
  const [descExpanded, setDescExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const DESC_LIMIT = 200;
  const descLong = mockGuia.descricao.length > DESC_LIMIT;

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Carousel de imagens */}
      <div className="relative aspect-[16/9] w-full bg-muted">
        <Image
          src={todasImagens[currentImageIndex] ?? mockGuia.capa}
          alt={mockGuia.titulo}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-transparent to-foreground/40" />

        {/* Header sobre a imagem */}
        <div className="absolute top-0 left-0 right-0 z-10 px-4 py-4 pt-[env(safe-area-inset-top)]">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="p-2 -ml-2 rounded-full bg-background/80 backdrop-blur-md hover:bg-background transition-colors"
              aria-label="Voltar"
            >
              <ArrowLeft className="h-6 w-6 text-primary" strokeWidth={1.5} />
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-2 rounded-full bg-background/80 backdrop-blur-md hover:bg-background transition-colors"
                aria-label="Compartilhar"
              >
                <Share className="h-6 w-6 text-primary" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => setSaved(!saved)}
                className={cn(
                  'p-2 rounded-full bg-background/80 backdrop-blur-md hover:bg-background transition-colors',
                  saved && 'bg-accent/20'
                )}
                aria-label={saved ? 'Remover dos salvos' : 'Salvar'}
              >
                <Bookmark
                  className="h-6 w-6 text-primary"
                  strokeWidth={1.5}
                  fill={saved ? 'currentColor' : 'none'}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Navegação do carousel */}
        {todasImagens.length > 1 && (
          <>
            {currentImageIndex > 0 && (
              <button
                type="button"
                onClick={() => setCurrentImageIndex((prev) => prev - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-md hover:bg-background transition-colors z-10"
                aria-label="Imagem anterior"
              >
                <ChevronLeft className="h-6 w-6 text-primary" strokeWidth={1.5} />
              </button>
            )}
            {currentImageIndex < todasImagens.length - 1 && (
              <button
                type="button"
                onClick={() => setCurrentImageIndex((prev) => prev + 1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-md hover:bg-background transition-colors z-10"
                aria-label="Próxima imagem"
              >
                <ChevronRight className="h-6 w-6 text-primary" strokeWidth={1.5} />
              </button>
            )}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
              {todasImagens.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentImageIndex(index)}
                  className={cn(
                    'h-2 rounded-full transition-all',
                    index === currentImageIndex
                      ? 'w-6 bg-primary-foreground'
                      : 'w-2 bg-primary-foreground/50'
                  )}
                  aria-label={`Imagem ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="px-4 space-y-6 -mt-2 pt-4 rounded-t-2xl bg-background relative">
        {/* Info do guia */}
        <div className="py-4 space-y-2">
          <span className="inline-block rounded-full bg-accent/10 text-accent px-3 py-1 text-xs font-medium">
            {mockGuia.categoria}
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {mockGuia.titulo}
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin className="h-4 w-4 shrink-0" strokeWidth={1.5} />
            {mockGuia.cidade}
          </p>
          <p className="text-xs text-muted-foreground">
            {mockGuia.stats.dicas} dicas • {mockGuia.stats.saves} salvamentos •{' '}
            {mockGuia.stats.shares} compartilhamentos
          </p>
        </div>

        {/* Autor */}
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted shrink-0">
            <Image
              src={mockGuia.autor.avatar}
              alt={mockGuia.autor.nome}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">
              {mockGuia.autor.nome}
            </p>
            <p className="text-xs text-muted-foreground">criou este guia</p>
          </div>
          <button
            type="button"
            className="rounded-full gradient-peach px-4 py-2 text-xs font-medium text-primary shrink-0"
          >
            Seguir
          </button>
        </div>

        {/* Descrição */}
        <div>
          <p className="text-sm leading-relaxed text-foreground">
            {descLong && !descExpanded
              ? `${mockGuia.descricao.slice(0, DESC_LIMIT)}...`
              : mockGuia.descricao}
          </p>
          {descLong && (
            <button
              type="button"
              onClick={() => setDescExpanded(!descExpanded)}
              className="text-sm font-medium text-accent mt-1"
            >
              {descExpanded ? 'Ver menos' : 'Ver mais'}
            </button>
          )}
        </div>

        {/* Ações */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setSaved(!saved)}
            className={cn(
              'flex-1 rounded-full border border-border py-3 text-sm font-medium transition-colors',
              saved ? 'bg-accent/10 border-accent text-accent' : 'bg-card hover:bg-muted'
            )}
          >
            {saved ? 'Salvo' : 'Salvar Guia'}
          </button>
          <button
            type="button"
            className="flex-1 rounded-full border border-border bg-card py-3 text-sm font-medium hover:bg-muted transition-colors flex items-center justify-center gap-2"
          >
            <Share className="h-4 w-4" strokeWidth={1.5} />
            Compartilhar
          </button>
        </div>

        {/* Lista de dicas */}
        <div>
          <h2 className="text-base font-bold text-foreground mb-3">
            Dicas deste guia ({mockGuia.dicas.length})
          </h2>
          <div className="space-y-3">
            {mockGuia.dicas.map((dica, index) => (
              <Link
                key={dica.id}
                href={`/dica/${dica.id}`}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 hover:shadow-md transition-shadow"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {index + 1}
                </span>
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={dica.imagem}
                    alt={dica.titulo}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold line-clamp-1">{dica.titulo}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {dica.descricao}
                  </p>
                  <span className="inline-block mt-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-mono uppercase text-muted-foreground">
                    {dica.categoria}
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" strokeWidth={1.5} />
              </Link>
            ))}
          </div>
        </div>

        {/* Mais guias do autor */}
        <div>
          <h2 className="text-base font-bold text-foreground mb-3">
            Mais guias de {mockGuia.autor.nome}
          </h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {[
              {
                id: '2',
                titulo: 'Praias do Nordeste',
                capa: '/images/guia2.jpg',
                numeroDicas: 8,
              },
            ].map((g) => (
              <Link
                key={g.id}
                href={`/guia/${g.id}`}
                className="shrink-0 w-40 rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-video">
                  <Image
                    src={g.capa}
                    alt={g.titulo}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                  <p className="absolute bottom-2 left-2 right-2 text-sm font-semibold text-primary-foreground line-clamp-2">
                    {g.titulo}
                  </p>
                </div>
                <p className="p-2 text-xs text-muted-foreground">{g.numeroDicas} dicas</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
