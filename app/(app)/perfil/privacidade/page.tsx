'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BottomNav } from '@/components/app/bottom-nav';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface SettingToggleProps {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}

function SettingToggle({ label, description, enabled, onChange }: SettingToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
      <Switch checked={enabled} onCheckedChange={onChange} className="shrink-0" />
    </div>
  );
}

type QuemPode = 'todos' | 'seguidores' | 'ninguem';

const PRIVACIDADE_STORAGE_KEY = 'pingo-privacidade-settings';

export default function PrivacidadePage() {
  const [settings, setSettings] = useState({
    perfilPrivado: false,
    quemPodeVer: {
      dicasSalvas: 'seguidores' as QuemPode,
      guias: 'todos' as QuemPode,
      localizacao: 'ninguem' as QuemPode,
    },
    interacoes: {
      comentarios: 'todos' as QuemPode,
      mencoes: 'seguidores' as QuemPode,
      compartilhamento: true,
    },
  });
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      const s = localStorage.getItem(PRIVACIDADE_STORAGE_KEY);
      if (s) setSettings(JSON.parse(s));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(PRIVACIDADE_STORAGE_KEY, JSON.stringify(settings));
        setToast('Configurações salvas');
        const clear = setTimeout(() => setToast(null), 2000);
        return () => clearTimeout(clear);
      } catch {
        // ignore
      }
    }, 500);
    return () => clearTimeout(t);
  }, [settings]);

  const update = (path: string, value: unknown) => {
    setSettings((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const parts = path.split('.');
      let cur: Record<string, unknown> = next;
      for (let i = 0; i < parts.length - 1; i++) {
        cur = cur[parts[i]] as Record<string, unknown>;
      }
      cur[parts[parts.length - 1]] = value;
      return next;
    });
  };

  return (
    <main className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4">
        <div className="flex items-center gap-4">
          <Link href="/perfil" className="p-2 -ml-2 rounded-full hover:bg-muted" aria-label="Voltar">
            <ArrowLeft className="h-6 w-6" strokeWidth={1.5} />
          </Link>
          <h1 className="text-lg font-semibold text-foreground">Privacidade</h1>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        <section>
          <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-3">
            Visibilidade do Perfil
          </p>
          <SettingToggle
            label="Perfil Privado"
            description={
              settings.perfilPrivado
                ? 'Apenas seguidores aprovados podem ver suas dicas'
                : 'Qualquer pessoa pode ver seu perfil'
            }
            enabled={settings.perfilPrivado}
            onChange={(v) => update('perfilPrivado', v)}
          />
          <p className="text-xs text-muted-foreground mt-2">
            Com perfil privado, novas pessoas precisam solicitar para te seguir.
          </p>
        </section>

        <section>
          <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-3">
            Quem pode ver
          </p>
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm font-medium text-foreground mb-3">Dicas salvas</p>
              <div className="flex flex-col gap-2">
                {(['todos', 'seguidores', 'ninguem'] as const).map((opt) => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="dicasSalvas"
                      checked={settings.quemPodeVer.dicasSalvas === opt}
                      onChange={() => update('quemPodeVer.dicasSalvas', opt)}
                      className="sr-only"
                    />
                    <span
                      className={cn(
                        'h-4 w-4 rounded-full border-2 flex items-center justify-center',
                        settings.quemPodeVer.dicasSalvas === opt
                          ? 'border-primary bg-primary'
                          : 'border-border'
                      )}
                    >
                      {settings.quemPodeVer.dicasSalvas === opt && (
                        <span className="h-2 w-2 rounded-full bg-primary-foreground" />
                      )}
                    </span>
                    <span className="text-sm text-foreground">
                      {opt === 'todos' && 'Todo mundo'}
                      {opt === 'seguidores' && 'Apenas seguidores'}
                      {opt === 'ninguem' && 'Apenas eu'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm font-medium text-foreground mb-3">Guias</p>
              <div className="flex flex-col gap-2">
                {(['todos', 'seguidores', 'ninguem'] as const).map((opt) => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="guias"
                      checked={settings.quemPodeVer.guias === opt}
                      onChange={() => update('quemPodeVer.guias', opt)}
                      className="sr-only"
                    />
                    <span
                      className={cn(
                        'h-4 w-4 rounded-full border-2 flex items-center justify-center',
                        settings.quemPodeVer.guias === opt ? 'border-primary bg-primary' : 'border-border'
                      )}
                    >
                      {settings.quemPodeVer.guias === opt && (
                        <span className="h-2 w-2 rounded-full bg-primary-foreground" />
                      )}
                    </span>
                    <span className="text-sm text-foreground">
                      {opt === 'todos' && 'Todo mundo'}
                      {opt === 'seguidores' && 'Apenas seguidores'}
                      {opt === 'ninguem' && 'Apenas eu'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm font-medium text-foreground mb-3">Localização em tempo real</p>
              <div className="flex flex-col gap-2">
                {(['todos', 'seguidores', 'ninguem'] as const).map((opt) => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="localizacao"
                      checked={settings.quemPodeVer.localizacao === opt}
                      onChange={() => update('quemPodeVer.localizacao', opt)}
                      className="sr-only"
                    />
                    <span
                      className={cn(
                        'h-4 w-4 rounded-full border-2 flex items-center justify-center',
                        settings.quemPodeVer.localizacao === opt
                          ? 'border-primary bg-primary'
                          : 'border-border'
                      )}
                    >
                      {settings.quemPodeVer.localizacao === opt && (
                        <span className="h-2 w-2 rounded-full bg-primary-foreground" />
                      )}
                    </span>
                    <span className="text-sm text-foreground">
                      {opt === 'todos' && 'Todo mundo'}
                      {opt === 'seguidores' && 'Apenas seguidores'}
                      {opt === 'ninguem' && 'Ninguém'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section>
          <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-3">
            Interações
          </p>
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm font-medium text-foreground mb-3">Quem pode comentar</p>
              <div className="flex flex-col gap-2">
                {(['todos', 'seguidores', 'ninguem'] as const).map((opt) => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="comentarios"
                      checked={settings.interacoes.comentarios === opt}
                      onChange={() => update('interacoes.comentarios', opt)}
                      className="sr-only"
                    />
                    <span
                      className={cn(
                        'h-4 w-4 rounded-full border-2 flex items-center justify-center',
                        settings.interacoes.comentarios === opt
                          ? 'border-primary bg-primary'
                          : 'border-border'
                      )}
                    >
                      {settings.interacoes.comentarios === opt && (
                        <span className="h-2 w-2 rounded-full bg-primary-foreground" />
                      )}
                    </span>
                    <span className="text-sm text-foreground">
                      {opt === 'todos' && 'Todo mundo'}
                      {opt === 'seguidores' && 'Seguidores'}
                      {opt === 'ninguem' && 'Ninguém'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm font-medium text-foreground mb-3">Quem pode mencionar você</p>
              <div className="flex flex-col gap-2">
                {(['todos', 'seguidores', 'ninguem'] as const).map((opt) => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="mencoes"
                      checked={settings.interacoes.mencoes === opt}
                      onChange={() => update('interacoes.mencoes', opt)}
                      className="sr-only"
                    />
                    <span
                      className={cn(
                        'h-4 w-4 rounded-full border-2 flex items-center justify-center',
                        settings.interacoes.mencoes === opt ? 'border-primary bg-primary' : 'border-border'
                      )}
                    >
                      {settings.interacoes.mencoes === opt && (
                        <span className="h-2 w-2 rounded-full bg-primary-foreground" />
                      )}
                    </span>
                    <span className="text-sm text-foreground">
                      {opt === 'todos' && 'Todo mundo'}
                      {opt === 'seguidores' && 'Seguidores'}
                      {opt === 'ninguem' && 'Ninguém'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <SettingToggle
              label="Permitir compartilhamento de dicas"
              description="Outros usuários podem compartilhar suas dicas no feed"
              enabled={settings.interacoes.compartilhamento}
              onChange={(v) => update('interacoes.compartilhamento', v)}
            />
          </div>
        </section>

        <section>
          <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-3">
            Bloqueados
          </p>
          <Link
            href="/perfil/privacidade/bloqueados"
            className="flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Usuários bloqueados
          </Link>
        </section>
      </div>

      {toast && (
        <div className="fixed bottom-24 left-4 right-4 bg-primary text-primary-foreground text-sm text-center py-3 rounded-xl z-50">
          {toast}
        </div>
      )}

      <BottomNav />
    </main>
  );
}
