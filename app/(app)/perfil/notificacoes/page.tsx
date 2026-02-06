'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BottomNav } from '@/components/app/bottom-nav';

export default function NotificacoesPage() {
  return (
    <main className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4">
        <div className="flex items-center gap-4">
          <Link href="/perfil" className="p-2 -ml-2 rounded-full hover:bg-muted" aria-label="Voltar">
            <ArrowLeft className="h-6 w-6" strokeWidth={1.5} />
          </Link>
          <h1 className="text-lg font-semibold">Notificações</h1>
        </div>
      </header>
      <div className="px-4 py-6 text-sm text-muted-foreground">
        Preferências de notificação em breve.
      </div>
      <BottomNav />
    </main>
  );
}
