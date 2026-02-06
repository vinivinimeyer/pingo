# Tela de Login - Pingo

Tela de login completa seguindo o design system do Pingo.

## Características

- ✅ Validação de formulário em tempo real
- ✅ Feedback visual de erros
- ✅ Estado de loading durante o submit
- ✅ Toggle de visibilidade de senha
- ✅ Design responsivo
- ✅ Acessibilidade (ARIA labels, navegação por teclado)
- ✅ Integração com Google (botão preparado)
- ✅ Link para recuperação de senha
- ✅ Link para cadastro

## Uso

```tsx
import { Login } from './pages/Login';

function App() {
  return <Login />;
}
```

## Componentes Utilizados

A tela utiliza os seguintes componentes do design system:

- `Button` - Botões primários, secundários e outline
- `Input` - Campos de texto com suporte a ícones e validação
- `Card` - Container com elevação e padding configurável

## Customização

Para customizar o comportamento de login, edite o método `handleSubmit` em `Login.tsx`:

```tsx
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }

  setIsLoading(true);
  
  try {
    // Substitua por sua chamada de API real
    const response = await authService.login(formData.email, formData.password);
    // Redirecionar ou atualizar estado
  } catch (error) {
    setErrors({ general: 'Erro ao fazer login' });
  } finally {
    setIsLoading(false);
  }
};
```

## Design System

A tela segue os tokens do design system definidos em:
- `src/design-system/tokens/colors.ts`
- `src/design-system/tokens/typography.ts`
- `src/design-system/tokens/spacing.ts`
