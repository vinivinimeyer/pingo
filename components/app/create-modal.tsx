'use client';

import Link from 'next/link';
import { X, MapPin, BookOpen } from 'lucide-react';

interface CreateModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateModal({ open, onClose }: CreateModalProps) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="fixed inset-x-4 top-1/2 z-50 -translate-y-1/2 max-w-sm mx-auto">
        <div className="rounded-3xl border border-border bg-card shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h3 className="text-lg font-bold text-foreground">
              O que deseja criar?
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>

          <div className="p-4 space-y-3">
            <Link href="/criar-dica" onClick={onClose}>
              <button
                type="button"
                className="w-full rounded-2xl border-2 border-border bg-card p-6 text-left hover:border-accent hover:bg-accent/5 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
                    <MapPin className="h-6 w-6 text-accent" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-foreground mb-1">
                      Nova Dica
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Compartilhe um lugar específico
                    </p>
                  </div>
                </div>
              </button>
            </Link>

            <Link href="/criar-guia" onClick={onClose}>
              <button
                type="button"
                className="w-full rounded-2xl border-2 border-border bg-card p-6 text-left hover:border-accent hover:bg-accent/5 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
                    <BookOpen className="h-6 w-6 text-accent" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-foreground mb-1">
                      Novo Guia
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Crie uma coleção de dicas
                    </p>
                  </div>
                </div>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
