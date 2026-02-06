'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, MapPin, ChevronRight, Camera } from 'lucide-react';
import { BottomNav } from '@/components/app/bottom-nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function HomePage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    { id: 1, image: '/images/hero1.jpg', title: 'Descubra lugares incríveis' },
    { id: 2, image: '/images/hero2.jpg', title: 'Compartilhe suas experiências' },
    { id: 3, image: '/images/hero3.jpg', title: 'Explore o mundo' },
  ];

  const perfis = [
    { id: '1', name: 'Marina Silva', avatar: '/avatars/marina.jpg', username: '@marinasilva' },
    { id: '2', name: 'João Santos', avatar: '/avatars/joao.jpg', username: '@joaosantos' },
    { id: '3', name: 'Ana Costa', avatar: '/avatars/ana.jpg', username: '@anacosta' },
  ];

  const guias = [
    { id: '1', title: 'Roteiro 3 dias em SP', image: '/images/guia1.jpg', dicas: 12 },
    { id: '2', title: 'Melhores praias do Brasil', image: '/images/guia2.jpg', dicas: 8 },
    { id: '3', title: 'Gastronomia carioca', image: '/images/guia3.jpg', dicas: 15 },
  ];

  const categorias = [
    'Restaurantes',
    'Hotéis',
    'Museus',
    'Praias',
    'Natureza',
    'Compras',
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Barra de busca */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3">
        <Link href="/buscar">
          <div className="relative cursor-pointer">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
            <div className="w-full rounded-xl border-2 border-[#F0C05A] bg-card px-4 py-3 pl-11 text-sm text-foreground placeholder:text-muted-foreground">
              Buscar lugares, guias ou pessoas
            </div>
          </div>
        </Link>
      </div>

      <div className="space-y-6">
        {/* Hero Carousel */}
        <section className="px-4 pt-6">
          <div className="relative h-48 w-full rounded-2xl overflow-hidden">
            <div className="flex h-full transition-transform duration-300" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {heroSlides.map((slide) => (
                <div
                  key={slide.id}
                  className="min-w-full h-full gradient-warm flex items-center justify-center relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                  <h2 className="text-2xl font-bold tracking-tight text-primary-foreground relative z-10 px-4 text-center">
                    {slide.title}
                  </h2>
                </div>
              ))}
            </div>
            
            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentSlide ? 'w-8 bg-primary-foreground' : 'w-2 bg-primary-foreground/50'
                  }`}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-md hover:bg-background transition-colors z-10"
              aria-label="Slide anterior"
            >
              <ChevronRight className="h-5 w-5 rotate-180" strokeWidth={2} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-md hover:bg-background transition-colors z-10"
              aria-label="Próximo slide"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
        </section>

        {/* Perfis para seguir */}
        <section className="px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-foreground">Perfis para seguir</h2>
            <Link href="/perfil/sugestoes" className="text-sm text-accent hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {perfis.map((perfil) => (
              <Link key={perfil.id} href={`/perfil/${perfil.id}`} className="shrink-0">
                <div className="w-24 flex flex-col items-center gap-2">
                  <div className="h-16 w-16 rounded-full bg-gradient-peach flex items-center justify-center text-primary font-bold text-lg">
                    {perfil.name.charAt(0)}
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-foreground line-clamp-1">{perfil.name}</p>
                    <p className="text-[10px] text-muted-foreground line-clamp-1">{perfil.username}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Perto de você */}
        <section className="px-4">
          <h2 className="text-base font-bold text-foreground mb-3">Perto de você</h2>
          <Link href="/mapa">
            <div className="relative h-32 w-full rounded-2xl overflow-hidden gradient-sage">
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="h-12 w-12 text-primary/50" strokeWidth={1.5} />
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-sm font-semibold text-foreground">Ver no mapa</p>
                <p className="text-xs text-muted-foreground">Descubra lugares próximos</p>
              </div>
            </div>
          </Link>
        </section>

        {/* Dicas e Guias */}
        <section className="px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-foreground">Dicas e Guias</h2>
            <Link href="/guias" className="text-sm text-accent hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {guias.map((guia) => (
              <Link key={guia.id} href={`/guia/${guia.id}`} className="shrink-0">
                <div className="w-40 rounded-2xl border border-border bg-card overflow-hidden">
                  <div className="h-32 w-full gradient-peach flex items-center justify-center">
                    <Camera className="h-8 w-8 text-primary" strokeWidth={1.5} />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-1">{guia.title}</h3>
                    <p className="text-xs text-muted-foreground">{guia.dicas} dicas</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Banner Pin.Go */}
        <section className="px-4">
          <div className="relative overflow-hidden rounded-2xl bg-card p-6">
            <div className="absolute inset-0 gradient-warm opacity-30" />
            <div className="absolute -right-16 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl" />
            <div className="absolute -left-8 top-0 h-24 w-24 rounded-full bg-muted/30 blur-2xl" />
            <div className="relative flex flex-col items-center gap-2">
              <h3 className="text-2xl font-bold tracking-tight text-foreground">Pin.Go</h3>
              <p className="text-xs font-mono uppercase tracking-widest text-foreground/50">
                Explore mais com o Pin.Go+
              </p>
            </div>
          </div>
        </section>

        {/* Categorias */}
        <section className="px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-foreground">Categorias</h2>
            <Link href="/buscar?categoria=todas" className="text-sm text-accent hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {categorias.map((categoria) => (
              <Link
                key={categoria}
                href={`/buscar?categoria=${categoria.toLowerCase()}`}
                className="shrink-0 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                {categoria}
              </Link>
            ))}
          </div>
        </section>

        {/* Compartilhe suas dicas */}
        <section className="px-4 pb-6">
          <Link href="/criar-dica">
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <Camera className="h-12 w-12 mx-auto mb-3 text-accent" strokeWidth={1.5} />
              <h3 className="text-lg font-semibold text-foreground mb-2">Compartilhe suas dicas</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Ajude outros viajantes descobrirem lugares incríveis
              </p>
              <Button variant="gradient" className="w-full">
                Criar dica
              </Button>
            </div>
          </Link>
        </section>
      </div>

      <BottomNav />
    </main>
  );
}
