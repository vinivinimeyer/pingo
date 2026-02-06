'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, Locate, Layers, MapPin, X } from 'lucide-react';
import { BottomNav } from '@/components/app/bottom-nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface Location {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  distance: string;
  image: string;
}

const mockLocations: Location[] = [
  {
    id: '1',
    name: 'Café Pingo',
    category: 'Restaurantes',
    lat: -23.5505,
    lng: -46.6333,
    distance: '0.5 km',
    image: '/images/cafe.jpg',
  },
  {
    id: '2',
    name: 'Hotel Vista',
    category: 'Hotéis',
    lat: -23.5515,
    lng: -46.6343,
    distance: '1.2 km',
    image: '/images/hotel.jpg',
  },
  {
    id: '3',
    name: 'Museu Arte',
    category: 'Museus',
    lat: -23.5495,
    lng: -46.6323,
    distance: '0.8 km',
    image: '/images/museu.jpg',
  },
];

export default function MapaPage() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showList, setShowList] = useState(false);

  return (
    <main className="min-h-screen bg-background relative">
      {/* Mapa Mock */}
      <div className="relative h-screen w-full gradient-sage opacity-60">
        {/* Grid SVG */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>

        {/* Pins mockados */}
        {mockLocations.map((location, index) => (
          <button
            key={location.id}
            onClick={() => setSelectedLocation(location)}
            className="absolute"
            style={{
              left: `${30 + index * 20}%`,
              top: `${40 + index * 10}%`,
            }}
            aria-label={location.name}
          >
            <div className="relative">
              <MapPin className="h-8 w-8 text-accent drop-shadow-lg" strokeWidth={2} fill="currentColor" />
              {selectedLocation?.id === location.id && (
                <div className="absolute -top-2 -left-2 h-4 w-4 rounded-full bg-accent border-2 border-background animate-pulse" />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Header flutuante */}
      <div className="absolute top-4 left-4 right-4 z-10 bg-card/80 backdrop-blur-md rounded-2xl border border-border p-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            <Input
              type="text"
              placeholder="Buscar no mapa"
              className="pl-9 h-9 text-sm"
            />
          </div>
          <button
            onClick={() => setShowList(true)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Filtros"
          >
            <SlidersHorizontal className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Botões de ação flutuantes */}
      <div className="absolute top-20 right-4 z-10 space-y-2">
        <button
          className="h-12 w-12 rounded-full bg-card border border-border shadow-lg flex items-center justify-center hover:bg-muted transition-colors"
          aria-label="Localização"
        >
          <Locate className="h-5 w-5" strokeWidth={1.5} />
        </button>
        <button
          className="h-12 w-12 rounded-full bg-card border border-border shadow-lg flex items-center justify-center hover:bg-muted transition-colors"
          aria-label="Camadas"
        >
          <Layers className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </div>

      {/* Card de local selecionado */}
      {selectedLocation && (
        <div className="absolute bottom-20 left-4 right-4 z-10 rounded-2xl bg-card border border-border shadow-xl p-4 animate-in slide-in-from-bottom-4">
          <button
            onClick={() => setSelectedLocation(null)}
            className="absolute top-4 right-4 p-1 hover:bg-muted rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <div className="flex gap-4">
            <div className="h-24 w-24 rounded-xl gradient-peach flex items-center justify-center shrink-0">
              <MapPin className="h-8 w-8 text-primary" strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-foreground mb-1">{selectedLocation.name}</h3>
              <p className="text-xs text-muted-foreground mb-2">{selectedLocation.category}</p>
              <p className="text-xs font-mono text-accent mb-3">{selectedLocation.distance}</p>
              <Button
                variant="gradient"
                size="sm"
                onClick={() => router.push(`/dica/${selectedLocation.id}`)}
                className="w-full"
              >
                Ver dica
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sheet: Lista de locais */}
      <Sheet open={showList} onOpenChange={setShowList} side="bottom">
        <SheetContent onClose={() => setShowList(false)}>
          <SheetHeader>
            <SheetTitle>Locais próximos</SheetTitle>
          </SheetHeader>
          <div className="px-6 py-4">
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {mockLocations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => {
                    setSelectedLocation(location);
                    setShowList(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-muted transition-colors text-left"
                >
                  <div className="h-16 w-16 rounded-xl gradient-peach flex items-center justify-center shrink-0">
                    <MapPin className="h-6 w-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground mb-1">{location.name}</h4>
                    <p className="text-xs text-muted-foreground mb-1">{location.category}</p>
                    <p className="text-xs font-mono text-accent">{location.distance}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <BottomNav />
    </main>
  );
}
