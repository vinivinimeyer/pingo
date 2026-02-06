'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Instagram,
  Facebook,
  Twitter,
  MessageCircle,
} from 'lucide-react';
import { BottomNav } from '@/components/app/bottom-nav';
import { cn } from '@/lib/utils';

type RedeKey = 'instagram' | 'facebook' | 'twitter' | 'tiktok' | 'whatsapp';

const redesConfig: { key: RedeKey; label: string; icon: React.ElementType }[] = [
  { key: 'instagram', label: 'Instagram', icon: Instagram },
  { key: 'facebook', label: 'Facebook', icon: Facebook },
  { key: 'twitter', label: 'Twitter / X', icon: Twitter },
  { key: 'tiktok', label: 'TikTok', icon: MessageCircle },
  { key: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
];

const permissoesInstagram = [
  'Compartilhar dicas nos stories',
  'Importar fotos para suas dicas',
  'Encontrar amigos que também usam Pin.Go',
];

export default function RedesSociaisPage() {
  const [redes, setRedes] = useState<Record<RedeKey, { conectado: boolean; username: string | null }>>({
    instagram: { conectado: true, username: 'karenne' },
    facebook: { conectado: false, username: null },
    twitter: { conectado: false, username: null },
    tiktok: { conectado: false, username: null },
    whatsapp: { conectado: false, username: null },
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleConectar = (key: RedeKey) => {
    setRedes((prev) => ({
      ...prev,
      [key]: {
        conectado: true,
        username: key === 'instagram' ? 'karenne' : `user_${key}`,
      },
    }));
    showToast(`${redesConfig.find((r) => r.key === key)?.label} conectado!`, 'success');
  };

  const handleDesconectar = (key: RedeKey) => {
    if (!window.confirm(`Desconectar ${redesConfig.find((r) => r.key === key)?.label}?`)) return;
    setRedes((prev) => ({
      ...prev,
      [key]: { conectado: false, username: null },
    }));
    showToast('Desconectado', 'success');
  };

  return (
    <main className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4">
        <div className="flex items-center gap-4">
          <Link href="/perfil" className="p-2 -ml-2 rounded-full hover:bg-muted" aria-label="Voltar">
            <ArrowLeft className="h-6 w-6" strokeWidth={1.5} />
          </Link>
          <h1 className="text-lg font-semibold text-foreground">Redes Sociais</h1>
        </div>
      </header>

      <div className="px-4 py-6">
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          Conecte suas redes sociais para compartilhar dicas facilmente e encontrar amigos que também usam o Pin.Go.
        </p>

        <div className="space-y-3">
          {redesConfig.map(({ key, label, icon: Icon }) => {
            const estado = redes[key];
            const conectado = estado.conectado;
            return (
              <div
                key={key}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10">
                  <Icon className="h-6 w-6 text-accent" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  {conectado && estado.username ? (
                    <p className="text-xs text-muted-foreground">@{estado.username}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">Não conectado</p>
                  )}
                </div>
                {conectado ? (
                  <button
                    type="button"
                    onClick={() => handleDesconectar(key)}
                    className="rounded-full border border-destructive px-4 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                  >
                    Desconectar
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleConectar(key)}
                    className="rounded-full gradient-peach px-4 py-2 text-xs font-medium text-primary hover:opacity-90 transition-opacity shrink-0"
                  >
                    Conectar
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-card p-4">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
            Permissões
          </p>
          <p className="text-sm font-medium text-foreground mb-2">
            Ao conectar o Instagram, você poderá:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {permissoesInstagram.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {toast && (
        <div
          className={cn(
            'fixed bottom-24 left-4 right-4 text-sm text-center py-3 rounded-xl z-50',
            toast.type === 'success'
              ? 'bg-primary text-primary-foreground'
              : 'bg-destructive text-destructive-foreground'
          )}
        >
          {toast.message}
        </div>
      )}

      <BottomNav />
    </main>
  );
}
