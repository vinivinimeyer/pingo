'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BottomNav } from '@/components/app/bottom-nav';

export default function SobrePage() {
  return (
    <main className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4">
        <div className="flex items-center gap-4">
          <Link href="/perfil" className="p-2 -ml-2 rounded-full hover:bg-muted" aria-label="Voltar">
            <ArrowLeft className="h-6 w-6" strokeWidth={1.5} />
          </Link>
          <h1 className="text-lg font-semibold">Sobre</h1>
        </div>
      </header>
      <div className="px-4 py-6">
        <p className="text-2xl font-bold tracking-tight text-foreground">Pin.Go</p>
        <p className="text-sm text-muted-foreground mt-2">
          Explore o mundo com dicas e guias de quem já esteve lá.
        </p>
      </div>
      <BottomNav />
    </main>
  );
}
