'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

export default function CadastroPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    aceitarTermos: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    nome?: string;
    email?: string;
    senha?: string;
    confirmarSenha?: string;
    termos?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome completo é obrigatório';
    } else if (formData.nome.trim().length < 3) {
      newErrors.nome = 'Nome deve ter pelo menos 3 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 8) {
      newErrors.senha = 'Senha deve ter pelo menos 8 caracteres';
    }

    if (!formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Confirmação de senha é obrigatória';
    } else if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'As senhas não coincidem';
    }

    if (!formData.aceitarTermos) {
      newErrors.termos = 'Você deve aceitar os termos de uso';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push('/cadastro/redes-sociais');
    } catch (error) {
      setErrors({ general: 'Erro ao criar conta. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header fixo */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4">
        <div className="flex items-center gap-4 max-w-md mx-auto">
          <button
            onClick={() => router.push('/login')}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-primary flex-1 text-center">
            Criar conta
          </h1>
          <div className="w-9" /> {/* Spacer para centralizar */}
        </div>
      </div>

      {/* Card */}
      <div className="flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2 text-center">
              Dados pessoais
            </h2>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Preencha seus dados para começar
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center">
                  {errors.general}
                </div>
              )}

              {/* Nome completo */}
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-primary mb-2">
                  Nome completo
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Seu nome completo"
                    value={formData.nome}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, nome: e.target.value }));
                      if (errors.nome) setErrors((prev) => ({ ...prev, nome: undefined }));
                    }}
                    className="pl-11"
                    disabled={isLoading}
                    autoComplete="name"
                    error={!!errors.nome}
                  />
                </div>
                {errors.nome && (
                  <p className="text-xs text-destructive mt-1">{errors.nome}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, email: e.target.value }));
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    className="pl-11"
                    disabled={isLoading}
                    autoComplete="email"
                    error={!!errors.email}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive mt-1">{errors.email}</p>
                )}
              </div>

              {/* Senha */}
              <div>
                <label htmlFor="senha" className="block text-sm font-medium text-primary mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                  <Input
                    id="senha"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 8 caracteres"
                    value={formData.senha}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, senha: e.target.value }));
                      if (errors.senha) setErrors((prev) => ({ ...prev, senha: undefined }));
                    }}
                    className="pl-11 pr-11"
                    disabled={isLoading}
                    autoComplete="new-password"
                    error={!!errors.senha}
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
                {errors.senha && (
                  <p className="text-xs text-destructive mt-1">{errors.senha}</p>
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

              {/* Checkbox termos */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    id="termos"
                    checked={formData.aceitarTermos}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, aceitarTermos: e.target.checked }));
                      if (errors.termos) setErrors((prev) => ({ ...prev, termos: undefined }));
                    }}
                    className="mt-0.5"
                    disabled={isLoading}
                  />
                  <span className="text-sm text-muted-foreground">
                    Aceito os{' '}
                    <Link href="/termos" className="text-accent hover:underline">
                      termos de uso
                    </Link>{' '}
                    e{' '}
                    <Link href="/privacidade" className="text-accent hover:underline">
                      política de privacidade
                    </Link>
                  </span>
                </label>
                {errors.termos && (
                  <p className="text-xs text-destructive mt-1 ml-7">{errors.termos}</p>
                )}
              </div>

              {/* Botão Continuar */}
              <Button
                type="submit"
                variant="gradient"
                className="w-full"
                disabled={isLoading || !formData.aceitarTermos}
                isLoading={isLoading}
              >
                {isLoading ? 'Criando conta...' : 'Continuar'}
              </Button>

              {/* Link para login */}
              <p className="text-center text-sm text-muted-foreground">
                Já tem uma conta?{' '}
                <Link href="/login" className="font-semibold text-foreground hover:text-accent transition-colors">
                  Entrar
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
