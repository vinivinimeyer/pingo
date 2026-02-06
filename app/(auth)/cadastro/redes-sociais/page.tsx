'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RedesSociaisPage() {
  const router = useRouter();
  const [connectedSocials, setConnectedSocials] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const socialNetworks = [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      color: 'bg-blue-600',
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      ),
      color: 'bg-sky-500',
    },
  ];

  const toggleSocial = (id: string) => {
    if (connectedSocials.includes(id)) {
      setConnectedSocials((prev) => prev.filter((social) => social !== id));
    } else {
      setConnectedSocials((prev) => [...prev, id]);
    }
  };

  const handleFinalizar = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push('/home');
    } catch (error) {
      console.error('Erro ao finalizar cadastro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePular = () => {
    router.push('/home');
  };

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
            Conectar redes sociais
          </h1>
          <div className="w-9" /> {/* Spacer */}
        </div>
      </div>

      {/* Card */}
      <div className="flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2 text-center">
              Redes sociais
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground mb-6 text-center">
              Opcional - facilita compartilhamento de suas dicas
            </p>

            {/* Lista de redes sociais */}
            <div className="space-y-3 mb-6">
              {socialNetworks.map((social) => {
                const isConnected = connectedSocials.includes(social.id);
                return (
                  <button
                    key={social.id}
                    type="button"
                    onClick={() => toggleSocial(social.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-full border-2 transition-all ${
                      isConnected
                        ? 'border-accent bg-accent/10'
                        : 'border-border bg-card hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${social.color} text-white flex items-center justify-center`}>
                        {social.icon}
                      </div>
                      <span className="font-medium text-foreground">{social.name}</span>
                    </div>
                    {isConnected && (
                      <div className="flex items-center gap-2 text-accent">
                        <Check className="h-5 w-5" strokeWidth={2} />
                        <span className="text-sm font-medium">Conectado</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Botões de ação */}
            <div className="space-y-3">
              <Button
                onClick={handleFinalizar}
                variant="gradient"
                className="w-full"
                disabled={isLoading}
                isLoading={isLoading}
              >
                {isLoading ? 'Finalizando...' : 'Finalizar'}
              </Button>
              <Button
                onClick={handlePular}
                variant="secondary"
                className="w-full"
                disabled={isLoading}
              >
                Pular
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
