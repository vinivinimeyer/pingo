'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff, Check } from 'lucide-react';
import { BottomNav } from '@/components/app/bottom-nav';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const requisitos = [
  { id: 'min', label: 'Mínimo 8 caracteres', test: (s: string) => s.length >= 8 },
  { id: 'upper', label: 'Uma letra maiúscula', test: (s: string) => /[A-Z]/.test(s) },
  { id: 'lower', label: 'Uma letra minúscula', test: (s: string) => /[a-z]/.test(s) },
  { id: 'number', label: 'Um número', test: (s: string) => /\d/.test(s) },
];

export default function AlterarSenhaPage() {
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showAtual, setShowAtual] = useState(false);
  const [showNova, setShowNova] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [success, setSuccess] = useState(false);

  const novaSenhaOk = requisitos.every((r) => r.test(novaSenha));
  const confirmarOk = novaSenha.length > 0 && novaSenha === confirmarSenha;
  const isValid = senhaAtual.length >= 6 && novaSenhaOk && confirmarOk;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/perfil"
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-6 w-6" strokeWidth={1.5} />
          </Link>
          <h1 className="text-lg font-semibold text-foreground">Alterar Senha</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Senha atual
          </label>
          <div className="relative">
            <Input
              type={showAtual ? 'text' : 'password'}
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              placeholder="••••••••"
              className="pr-11 rounded-xl border-2 border-[#F0C05A]"
            />
            <button
              type="button"
              onClick={() => setShowAtual(!showAtual)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showAtual ? (
                <EyeOff className="h-5 w-5" strokeWidth={1.5} />
              ) : (
                <Eye className="h-5 w-5" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Nova senha
          </label>
          <div className="relative">
            <Input
              type={showNova ? 'text' : 'password'}
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              placeholder="••••••••"
              className="pr-11 rounded-xl border-2 border-[#F0C05A]"
            />
            <button
              type="button"
              onClick={() => setShowNova(!showNova)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showNova ? (
                <EyeOff className="h-5 w-5" strokeWidth={1.5} />
              ) : (
                <Eye className="h-5 w-5" strokeWidth={1.5} />
              )}
            </button>
          </div>
          <ul className="mt-2 space-y-1">
            {requisitos.map((r) => (
              <li
                key={r.id}
                className={cn(
                  'flex items-center gap-2 text-xs',
                  r.test(novaSenha) ? 'text-green-600' : 'text-muted-foreground'
                )}
              >
                {r.test(novaSenha) ? (
                  <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-current shrink-0" />
                )}
                {r.label}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Confirmar nova senha
          </label>
          <div className="relative">
            <Input
              type={showConfirmar ? 'text' : 'password'}
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              placeholder="••••••••"
              className={cn(
                'pr-11 rounded-xl border-2',
                confirmarSenha.length > 0 && !confirmarOk
                  ? 'border-destructive'
                  : 'border-[#F0C05A]'
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirmar(!showConfirmar)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showConfirmar ? (
                <EyeOff className="h-5 w-5" strokeWidth={1.5} />
              ) : (
                <Eye className="h-5 w-5" strokeWidth={1.5} />
              )}
            </button>
          </div>
          {confirmarSenha.length > 0 && !confirmarOk && (
            <p className="text-xs text-destructive mt-1">As senhas não coincidem</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className="w-full rounded-full gradient-peach px-6 py-4 text-sm font-medium text-primary hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          Alterar Senha
        </button>
      </form>

      {success && (
        <div className="fixed bottom-24 left-4 right-4 bg-primary text-primary-foreground text-sm text-center py-3 rounded-xl z-50">
          Senha alterada com sucesso!
        </div>
      )}

      <BottomNav />
    </main>
  );
}
