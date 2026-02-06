'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, X } from 'lucide-react';
import { BottomNav } from '@/components/app/bottom-nav';
import { Input } from '@/components/ui/input';

interface SearchResult {
  id: string;
  title: string;
  location: string;
  category: string;
  image: string;
}

const mockResults: SearchResult[] = [
  {
    id: '1',
    title: 'Café da Manhã Perfeito',
    location: 'Vila Madalena, São Paulo',
    category: 'Restaurantes',
    image: '/images/cafe.jpg',
  },
  {
    id: '2',
    title: 'Hotel Boutique Charmoso',
    location: 'Copacabana, Rio de Janeiro',
    category: 'Hotéis',
    image: '/images/hotel.jpg',
  },
  {
    id: '3',
    title: 'Museu de Arte Moderna',
    location: 'Centro, São Paulo',
    category: 'Museus',
    image: '/images/museu.jpg',
  },
  {
    id: '4',
    title: 'Praia Secreta',
    location: 'Ubatuba, São Paulo',
    category: 'Praias',
    image: '/images/praia.jpg',
  },
  {
    id: '5',
    title: 'Trilha da Pedra',
    location: 'Parque Nacional, SP',
    category: 'Natureza',
    image: '/images/trilha.jpg',
  },
];

const categories = ['Todos', 'Restaurantes', 'Hotéis', 'Museus', 'Praias', 'Natureza', 'Compras'];

export default function BuscarPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus no input
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    // Debounce de busca
    const timer = setTimeout(() => {
      if (query.trim()) {
        setIsSearching(true);
        // Simular busca
        setTimeout(() => {
          const filtered = mockResults.filter(
            (item) =>
              (item.title.toLowerCase().includes(query.toLowerCase()) ||
                item.location.toLowerCase().includes(query.toLowerCase())) &&
              (selectedCategory === 'Todos' || item.category === selectedCategory)
          );
          setResults(filtered);
          setIsSearching(false);
        }, 300);
      } else {
        setResults([]);
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, selectedCategory]);

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Header fixo */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Voltar"
          >
            <svg className="h-5 w-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Buscar lugares, guias ou pessoas"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-11 pr-11"
            />
            {query && (
              <button
                onClick={handleClear}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Limpar busca"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="px-4 py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border bg-card text-foreground hover:bg-muted'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Resultados */}
      <div className="px-4 pt-3">
        {!query.trim() ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-16">
            <Search className="h-16 w-16 text-muted-foreground mb-4" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground">Busque por lugares, guias ou pessoas</p>
          </div>
        ) : isSearching ? (
          // Loading skeleton
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse">
                <div className="h-32 w-full bg-muted" />
                <div className="p-3 space-y-2">
                  <div className="h-4 w-3/4 bg-muted rounded" />
                  <div className="h-3 w-1/2 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          // Resultados
          <div className="space-y-3">
            {results.map((result) => (
              <button
                key={result.id}
                onClick={() => router.push(`/dica/${result.id}`)}
                className="w-full rounded-2xl border border-border bg-card overflow-hidden text-left hover:shadow-md transition-shadow"
              >
                <div className="h-32 w-full gradient-peach flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-primary" strokeWidth={1.5} />
                </div>
                <div className="p-3">
                  <h3 className="text-base font-semibold text-foreground mb-1">{result.title}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-3 w-3 text-muted-foreground" strokeWidth={1.5} />
                    <p className="text-xs text-muted-foreground">{result.location}</p>
                  </div>
                  <span className="inline-block rounded-full px-2 py-1 bg-accent/10 text-accent text-xs">
                    {result.category}
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          // Sem resultados
          <div className="flex flex-col items-center justify-center py-16">
            <Search className="h-16 w-16 text-muted-foreground mb-4" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground">Nenhum resultado encontrado</p>
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
