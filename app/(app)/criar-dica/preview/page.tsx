'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, MapPin, Tag } from 'lucide-react';
import { BottomNav } from '@/components/app/bottom-nav';

interface DicaTemp {
  titulo: string;
  descricao: string;
  categoria: string;
  localizacao: string;
  imagensPreviews?: string[];
}

export default function PreviewDicaPage() {
  const router = useRouter();
  const [dicaTemp, setDicaTemp] = useState<DicaTemp | null>(null);

  useEffect(() => {
    const temp = typeof window !== 'undefined' ? localStorage.getItem('dica-temp') : null;
    if (!temp) {
      router.push('/criar-dica');
      return;
    }
    try {
      setDicaTemp(JSON.parse(temp));
    } catch {
      router.push('/criar-dica');
    }
  }, [router]);

  if (!dicaTemp) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-32">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-medium"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
            Voltar
          </button>
          <h1 className="text-lg font-bold">Preview</h1>
          <div className="w-16" />
        </div>
      </header>

      <div className="p-4">
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {dicaTemp.imagensPreviews && dicaTemp.imagensPreviews.length > 0 ? (
            <div className="relative aspect-square w-full">
              <Image
                src={dicaTemp.imagensPreviews[0]}
                fill
                className="object-cover"
                alt={dicaTemp.titulo}
              />
              {dicaTemp.imagensPreviews.length > 1 && (
                <div className="absolute top-3 right-3 rounded-full bg-foreground/80 backdrop-blur-sm px-3 py-1 text-xs font-medium text-background">
                  +{dicaTemp.imagensPreviews.length - 1}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-square w-full bg-muted" />
          )}

          <div className="p-4 space-y-3">
            <h2 className="text-xl font-bold">{dicaTemp.titulo}</h2>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-accent" strokeWidth={1.5} />
              <span className="text-sm text-accent">{dicaTemp.categoria}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" strokeWidth={1.5} />
              <span className="text-sm">{dicaTemp.localizacao}</span>
            </div>
            <p className="text-sm leading-relaxed">{dicaTemp.descricao}</p>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-muted p-4">
          <p className="text-xs text-muted-foreground text-center">
            Esta é uma prévia de como sua dica ficará após publicada
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 pb-safe z-50">
        <div className="flex gap-3 max-w-xl mx-auto">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium hover:bg-muted transition-colors"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => router.push('/criar-dica?action=publish')}
            className="flex-1 rounded-full gradient-peach px-6 py-3 text-sm font-medium text-primary"
          >
            Publicar Agora
          </button>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
