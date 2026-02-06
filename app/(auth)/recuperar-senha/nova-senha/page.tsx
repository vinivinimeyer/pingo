'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function NovaSenhaPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    novaSenha: '',
    confirmarSenha: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    novaSenha?: string;
    confirmarSenha?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const passwordRequirements = {
    minLength: formData.novaSenha.length >= 8,
    hasUpperCase: /[A-Z]/.test(formData.novaSenha),
    hasNumber: /\d/.test(formData.novaSenha),
  };

  const allRequirementsMet = Object.values(passwordRequirements).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!formData.novaSenha) {
      newErrors.novaSenha = 'Senha é obrigatória';
    } else if (!allRequirementsMet) {
      newErrors.novaSenha = 'Senha não atende aos requisitos';
    }

    if (!formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Confirmação de senha é obrigatória';
    } else if (formData.novaSenha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'As senhas não coincidem';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Redirecionar para login com toast de sucesso (simulado)
      router.push('/login?success=Senha alterada com sucesso!');
    } catch (error) {
      setErrors({ general: 'Erro ao salvar senha. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header fixo - SEM botão voltar */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4">
        <div className="flex items-center justify-center max-w-md mx-auto">
          <h1 className="text-2xl font-bold tracking-tight text-primary text-center">
            Nova senha
          </h1>
        </div>
      </div>

      {/* Card */}
      <div className="flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6 text-center">
              Defina sua nova senha
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center">
                  {errors.general}
                </div>
              )}

              {/* Nova senha */}
              <div>
                <label htmlFor="novaSenha" className="block text-sm font-medium text-primary mb-2">
                  Nova senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                  <Input
                    id="novaSenha"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua nova senha"
                    value={formData.novaSenha}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, novaSenha: e.target.value }));
                      if (errors.novaSenha) setErrors((prev) => ({ ...prev, novaSenha: undefined }));
                    }}
                    className="pl-11 pr-11"
                    disabled={isLoading}
                    autoComplete="new-password"
                    error={!!errors.novaSenha}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" strokeWidth={1.5} />
                    ) : (
                      <Eye className="h-5 w-5" strokeWidth={1.5} />
                    )}
                  </button>
                </div>
                {errors.novaSenha && (
                  <p className="text-xs text-destructive mt-1">{errors.novaSenha}</p>
                )}

                {/* Requisitos de senha */}
                {formData.novaSenha && (
                  <div className="mt-2 space-y-1">
                    <div className={`flex items-center gap-2 text-xs ${passwordRequirements.minLength ? 'text-accent' : 'text-muted-foreground'}`}>
                      <Check className={`h-3 w-3 ${passwordRequirements.minLength ? 'text-accent' : 'opacity-50'}`} strokeWidth={2} />
                      Mínimo 8 caracteres
                    </div>
                    <div className={`flex items-center gap-2 text-xs ${passwordRequirements.hasUpperCase ? 'text-accent' : 'text-muted-foreground'}`}>
                      <Check className={`h-3 w-3 ${passwordRequirements.hasUpperCase ? 'text-accent' : 'opacity-50'}`} strokeWidth={2} />
                      Uma letra maiúscula
                    </div>
                    <div className={`flex items-center gap-2 text-xs ${passwordRequirements.hasNumber ? 'text-accent' : 'text-muted-foreground'}`}>
                      <Check className={`h-3 w-3 ${passwordRequirements.hasNumber ? 'text-accent' : 'opacity-50'}`} strokeWidth={2} />
                      Um número
                    </div>
                  </div>
                )}
              </div>

              {/* Confirmar senha */}
              <div>
                <label htmlFor="confirmarSenha" className="block text-sm font-medium text-primary mb-2">
                  Confirmar senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                  <Input
                    id="confirmarSenha"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Digite a senha novamente"
                    value={formData.confirmarSenha}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, confirmarSenha: e.target.value }));
                      if (errors.confirmarSenha) setErrors((prev) => ({ ...prev, confirmarSenha: undefined }));
                    }}
                    className="pl-11 pr-11"
                    disabled={isLoading}
                    autoComplete="new-password"
                    error={!!errors.confirmarSenha}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" strokeWidth={1.5} />
                    ) : (
                      <Eye className="h-5 w-5" strokeWidth={1.5} />
                    )}
                  </button>
                </div>
                {errors.confirmarSenha && (
                  <p className="text-xs text-destructive mt-1">{errors.confirmarSenha}</p>
                )}
              </div>

              {/* Botão Salvar senha */}
              <Button
                type="submit"
                variant="gradient"
                className="w-full"
                disabled={isLoading || !allRequirementsMet || formData.novaSenha !== formData.confirmarSenha}
                isLoading={isLoading}
              >
                {isLoading ? 'Salvando...' : 'Salvar senha'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
