'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CodigoPage() {
  const router = useRouter();
  const [codes, setCodes] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Auto-focus no primeiro input
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Apenas números
    if (value && !/^\d$/.test(value)) return;

    const newCodes = [...codes];
    newCodes[index] = value;
    setCodes(newCodes);

    // Mover para próximo input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Backspace volta para input anterior
    if (e.key === 'Backspace' && !codes[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newCodes = [...codes];
    for (let i = 0; i < 6; i++) {
      if (pastedData[i] && /^\d$/.test(pastedData[i])) {
        newCodes[i] = pastedData[i];
      }
    }
    setCodes(newCodes);
    // Focus no último input preenchido ou no próximo vazio
    const nextEmptyIndex = newCodes.findIndex((code) => !code);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = codes.join('');
    if (code.length !== 6) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push('/recuperar-senha/nova-senha');
    } catch (error) {
      console.error('Erro ao verificar código:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isCodeComplete = codes.every((code) => code !== '');

  return (
    <main className="min-h-screen bg-background">
      {/* Header fixo */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4">
        <div className="flex items-center gap-4 max-w-md mx-auto">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-primary flex-1 text-center">
            Digite o código
          </h1>
          <div className="w-9" /> {/* Spacer */}
        </div>
      </div>

      {/* Card */}
      <div className="flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2 text-center">
              Código de verificação
            </h2>
            <p className="text-sm text-muted-foreground mb-2 text-center">
              Enviamos um código para seu email
            </p>
            <div className="text-center mb-6">
              <button
                type="button"
                className="text-sm text-accent hover:underline transition-colors"
              >
                Reenviar código
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 6 inputs de código */}
              <div className="flex justify-center gap-2">
                {codes.map((code, index) => (
                  <Input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={code}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-lg font-bold p-0"
                    error={false}
                  />
                ))}
              </div>

              {/* Botão Verificar */}
              <Button
                type="submit"
                variant="gradient"
                className="w-full"
                disabled={isLoading || !isCodeComplete}
                isLoading={isLoading}
              >
                {isLoading ? 'Verificando...' : 'Verificar'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
