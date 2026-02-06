import React, { useState } from 'react';
import { Button } from '../../design-system/components/Button';
import { Input } from '../../design-system/components/Input';
import { Card } from '../../design-system/components/Card';
import './Login.css';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulação de chamada à API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Aqui você faria a chamada real à API
      // const response = await authService.login(formData.email, formData.password);
      
      console.log('Login realizado com sucesso', formData);
      // Redirecionar ou atualizar estado da aplicação
    } catch (error) {
      setErrors({
        general: 'Erro ao fazer login. Verifique suas credenciais.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof LoginFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="login-page">
      <div className="login-page__container">
        <div className="login-page__header">
          <h1 className="login-page__title">Bem-vindo ao Pingo</h1>
          <p className="login-page__subtitle">
            Entre com suas credenciais para continuar
          </p>
        </div>

        <Card variant="elevated" padding="lg" className="login-page__card">
          <form onSubmit={handleSubmit} className="login-form" noValidate>
            {errors.general && (
              <div className="login-form__error-message" role="alert">
                {errors.general}
              </div>
            )}

            <div className="login-form__field">
              <Input
                type="email"
                label="Email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange('email')}
                error={errors.email}
                leftIcon={
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.5 6.66667L9.0755 11.0504C9.63533 11.4236 10.3647 11.4236 10.9245 11.0504L17.5 6.66667M4.16667 15.8333H15.8333C16.7538 15.8333 17.5 15.0871 17.5 14.1667V5.83333C17.5 4.91286 16.7538 4.16667 15.8333 4.16667H4.16667C3.24619 4.16667 2.5 4.91286 2.5 5.83333V14.1667C2.5 15.0871 3.24619 15.8333 4.16667 15.8333Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                autoComplete="email"
                disabled={isLoading}
              />
            </div>

            <div className="login-form__field">
              <Input
                type={showPassword ? 'text' : 'password'}
                label="Senha"
                placeholder="Digite sua senha"
                value={formData.password}
                onChange={handleChange('password')}
                error={errors.password}
                leftIcon={
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.5 9.16667C2.5 6.46429 4.63062 4.16667 7.29167 4.16667H12.7083C15.3694 4.16667 17.5 6.46429 17.5 9.16667V14.1667C17.5 16.869 15.3694 19.1667 12.7083 19.1667H7.29167C4.63062 19.1667 2.5 16.869 2.5 14.1667V9.16667Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M6.66667 9.16667C6.66667 10.0871 7.41286 10.8333 8.33333 10.8333C9.25381 10.8333 10 10.0871 10 9.16667C10 8.24619 9.25381 7.5 8.33333 7.5C7.41286 7.5 6.66667 8.24619 6.66667 9.16667Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                }
                rightIcon={
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="login-form__password-toggle"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.5 2.5L17.5 17.5M8.33333 8.33333C7.89131 8.77535 7.5 9.58781 7.5 10.4167C7.5 11.3371 8.24619 12.0833 9.16667 12.0833C9.99552 12.0833 10.808 11.692 11.25 11.25M14.5833 14.5833C13.3917 15.3917 11.875 15.8333 10 15.8333C5.82537 15.8333 2.5 12.0833 2.5 10.4167C2.5 9.25 3.33333 8.08333 4.58333 7.08333M6.66667 4.16667C7.29167 3.95833 7.91667 3.75 8.54167 3.75C12.7163 3.75 16.0417 7.5 16.0417 10.4167C16.0417 11.25 15.625 12.0833 15 12.9167"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.5 9.16667C2.5 6.46429 4.63062 4.16667 7.29167 4.16667C8.75 4.16667 10 4.58333 11.0417 5.20833M17.5 9.16667C17.5 11.869 15.3694 14.1667 12.7083 14.1667C11.6667 14.1667 10.625 13.75 9.79167 13.125M6.66667 9.16667C6.66667 10.0871 7.41286 10.8333 8.33333 10.8333C9.25381 10.8333 10 10.0871 10 9.16667M2.5 2.5L17.5 17.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                }
                autoComplete="current-password"
                disabled={isLoading}
              />
            </div>

            <div className="login-form__options">
              <label className="login-form__remember">
                <input
                  type="checkbox"
                  className="login-form__checkbox"
                />
                <span>Lembrar-me</span>
              </label>
              <a href="#" className="login-form__forgot-password">
                Esqueceu a senha?
              </a>
            </div>

            <div className="login-form__submit">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                disabled={isLoading}
              >
                Entrar
              </Button>
            </div>

            <div className="login-form__divider">
              <span>ou</span>
            </div>

            <div className="login-form__social">
              <Button
                type="button"
                variant="outline"
                size="md"
                fullWidth
                disabled={isLoading}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.3333 10.2273C18.3333 9.51818 18.2651 8.83636 18.1394 8.18182H10V12.05H14.6091C14.3939 12.95 13.8848 13.7227 13.1515 14.2364V16.5773H15.9848C17.4545 15.2182 18.3333 13.2727 18.3333 10.2273Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M10 18.3333C12.05 18.3333 13.7955 17.5455 15.9848 16.5773L13.1515 14.2364C12.2045 14.8364 11.0227 15.2273 10 15.2273C7.97727 15.2273 6.27273 13.8182 5.56818 11.9773H2.61364V14.3909C4.77273 17.75 8.18182 18.3333 10 18.3333Z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.56818 11.9773C5.34091 11.2955 5.21591 10.5682 5.21591 9.81818C5.21591 9.06818 5.34091 8.34091 5.56818 7.65909V5.24545H2.61364C1.88636 6.69091 1.45455 8.29545 1.45455 9.81818C1.45455 11.3409 1.88636 12.9455 2.61364 14.3909L5.56818 11.9773Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M10 4.40909C11.1364 4.40909 12.1591 4.79545 12.9773 5.54091L16.0455 2.47273C13.7955 0.409091 12.05 -0.113636 10 -0.113636C8.18182 -0.113636 4.77273 0.477273 2.61364 3.83636L5.56818 6.25C6.27273 4.40909 7.97727 3 10 3Z"
                    fill="#EA4335"
                  />
                </svg>
                Continuar com Google
              </Button>
            </div>

            <div className="login-form__footer">
              <p>
                Não tem uma conta?{' '}
                <a href="#" className="login-form__link">
                  Cadastre-se
                </a>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
