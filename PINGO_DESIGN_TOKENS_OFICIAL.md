# 🎨 Pin.Go - Design Tokens Oficiais

**Este documento contém TODOS os tokens extraídos do design system oficial do Pingo.**  
Use como referência OBRIGATÓRIA para implementação no Cursor.

---

## 📐 Cores (Color Palette)

### Core Palette

```css
/* Background - Sage Mist */
--background: 100 14% 92%;  /* #E4E9E0 */
--foreground: 150 10% 15%;

/* Card - Sage Cloud */
--card: 100 12% 95%;  /* #EEF1EB */
--card-foreground: 150 10% 15%;

/* Primary - Deep Forest */
--primary: 150 10% 15%;  /* #262E2A */
--primary-foreground: 60 20% 98%;

/* Secondary - Warm Cream */
--secondary: 40 30% 94%;  /* #F3EDE3 */
--secondary-foreground: 150 10% 15%;

/* Accent - Peach Sun */
--accent: 28 85% 65%;  /* #E8944A */
--accent-foreground: 150 10% 15%;
```

### Extended Palette (para Gradientes)

```css
/* Peach Family */
--peach-light: 35 90% 88%;  /* #FBE6D0 */
--peach: 28 85% 72%;        /* #E8A66A */
--peach-deep: 20 80% 60%;   /* #CC7733 */

/* Sage Family */
--sage-light: 100 15% 94%;  /* #EEF1EB */
--sage: 100 12% 85%;        /* #CDD5C8 */
--sage-deep: 120 10% 72%;   /* #A6B5A0 */

/* Amber */
--amber-glow: 40 90% 70%;   /* #F0C05A */
```

### Semantic Colors

```css
/* Muted */
--muted: 100 10% 89%;  /* #DDDFD9 */
--muted-foreground: 150 6% 45%;

/* Border */
--border: 100 8% 84%;  /* #CFD3CB */
--input: 100 8% 84%;

/* Destructive */
--destructive: 10 70% 50%;  /* #CC4422 */
--destructive-foreground: 60 20% 98%;

/* Ring / Focus */
--ring: 28 85% 65%;  /* #E8944A */
```

### Hexadecimal Reference

```
Background:  #E4E9E0
Card:        #EEF1EB
Primary:     #262E2A
Secondary:   #F3EDE3
Accent:      #E8944A
Peach Light: #FBE6D0
Peach:       #E8A66A
Peach Deep:  #CC7733
Sage Light:  #EEF1EB
Sage:        #CDD5C8
Sage Deep:   #A6B5A0
Amber Glow:  #F0C05A
Muted:       #DDDFD9
Border:      #CFD3CB
Destructive: #CC4422
```

---

## 🔤 Tipografia

### Font Family

```typescript
// Next.js font imports
import { DM_Sans, Space_Mono } from 'next/font/google'

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '600', '700']
})

const spaceMono = Space_Mono({ 
  subsets: ['latin'],
  variable: '--font-space-mono',
  weight: ['400', '700']
})
```

```css
/* Tailwind Config */
fontFamily: {
  sans: ['var(--font-dm-sans)'],
  mono: ['var(--font-space-mono)'],
}
```

### Headings (DM Sans - font-sans)

| Nome | Classe Tailwind | CSS Equivalente |
|------|----------------|-----------------|
| **Display** | `text-5xl font-bold tracking-tight` | `font-size: 3rem; font-weight: 700; letter-spacing: -0.025em` |
| **H1** | `text-4xl font-bold tracking-tight` | `font-size: 2.25rem; font-weight: 700; letter-spacing: -0.025em` |
| **H2** | `text-2xl font-bold tracking-tight` | `font-size: 1.5rem; font-weight: 700; letter-spacing: -0.025em` |
| **H3** | `text-xl font-semibold` | `font-size: 1.25rem; font-weight: 600` |
| **H4** | `text-lg font-semibold` | `font-size: 1.125rem; font-weight: 600` |

### Body (DM Sans - font-sans)

| Nome | Classe Tailwind | CSS Equivalente |
|------|----------------|-----------------|
| **Body Large** | `text-base leading-relaxed` | `font-size: 1rem; line-height: 1.625` |
| **Body** | `text-sm leading-relaxed` | `font-size: 0.875rem; line-height: 1.625` |
| **Body Small** | `text-xs leading-relaxed` | `font-size: 0.75rem; line-height: 1.625` |

### Monospace (Space Mono - font-mono)

| Nome | Classe Tailwind | Uso |
|------|----------------|-----|
| **Label Large** | `text-xs font-mono uppercase tracking-widest` | Metadados, categorias |
| **Label** | `text-[10px] font-mono uppercase tracking-widest` | Labels pequenos |
| **Caption** | `text-[10px] font-mono` | Timestamps, contadores |

**Exemplos de uso:**
```tsx
// Display
<h1 className="text-5xl font-bold tracking-tight">Pin.Go</h1>

// H1
<h1 className="text-4xl font-bold tracking-tight">Explore o Mundo</h1>

// H2
<h2 className="text-2xl font-bold tracking-tight">Dicas e Guias</h2>

// Body
<p className="text-sm leading-relaxed">Explore as ruelas de Roma...</p>

// Label
<span className="text-xs font-mono uppercase tracking-widest">
  DESIGN SYSTEM
</span>
```

---

## 🎨 Gradientes

### Classes CSS Customizadas

```css
/* globals.css */

/* Warm Sunrise - Banners, hero sections, onboarding */
.gradient-warm {
  background: linear-gradient(
    160deg,
    hsl(var(--sage-light)) 0%,
    hsl(var(--peach-light)) 40%,
    hsl(var(--peach)) 70%,
    hsl(var(--amber-glow)) 100%
  );
}

/* Peach Glow - Card highlights, accent backgrounds, CTAs */
.gradient-peach {
  background: linear-gradient(
    135deg,
    hsl(var(--peach-light)) 0%,
    hsl(var(--peach)) 50%,
    hsl(var(--amber-glow)) 100%
  );
}

/* Sage Mist - Map overlays, subtle section backgrounds */
.gradient-sage {
  background: linear-gradient(
    135deg,
    hsl(var(--sage-light)) 0%,
    hsl(var(--sage)) 50%,
    hsl(var(--sage-deep)) 100%
  );
}

/* Hero Flow - Large hero sections, page transitions */
.gradient-hero {
  background: linear-gradient(
    180deg,
    hsl(var(--background)) 0%,
    hsl(var(--peach-light)) 50%,
    hsl(var(--peach)) 100%
  );
}

/* Subtle Blend - Page backgrounds, ambient depth */
.gradient-subtle {
  background: linear-gradient(
    135deg,
    hsl(var(--background)) 0%,
    hsl(var(--sage-light)) 50%,
    hsl(var(--peach-light) / 0.5) 100%
  );
}
```

### Glow Effects

```css
/* Warm diffuse glow for accent elements */
.glow-peach {
  box-shadow: 
    0 0 80px 40px hsl(var(--peach) / 0.3),
    0 0 160px 80px hsl(var(--amber-glow) / 0.15);
}

/* Cool diffuse glow for ambient depth */
.glow-sage {
  box-shadow: 
    0 0 60px 30px hsl(var(--sage) / 0.3),
    0 0 120px 60px hsl(var(--sage-deep) / 0.15);
}
```

**Quando usar cada gradiente:**

| Gradiente | Contexto |
|-----------|----------|
| `gradient-warm` | Banners principais, hero sections, telas de onboarding |
| `gradient-peach` | Destaques em cards, backgrounds de CTAs |
| `gradient-sage` | Overlays em mapas, backgrounds sutis de seções |
| `gradient-hero` | Hero sections grandes, transições de página |
| `gradient-subtle` | Backgrounds de página, profundidade ambiente |

---

## 📏 Spacing & Border Radius

### Spacing Scale (Tailwind padrão + customizações)

```css
/* Já disponível no Tailwind */
p-1  = 4px (0.25rem)
p-2  = 8px (0.5rem)
p-3  = 12px (0.75rem)
p-4  = 16px (1rem)
p-5  = 20px (1.25rem)
p-6  = 24px (1.5rem)
p-8  = 32px (2rem)
p-10 = 40px (2.5rem)
p-12 = 48px (3rem)
p-16 = 64px (4rem)
```

**Padrões de uso no Pingo:**
- **Mobile padding**: `px-4` (16px) - padrão lateral
- **Seções verticais**: `py-6` (24px) - espaço entre blocos
- **Cards internos**: `p-3` ou `p-4` (12-16px)
- **Gap entre elementos**: `gap-3` (12px)

### Border Radius

```css
/* tailwind.config.ts */
borderRadius: {
  lg: 'var(--radius)',
  md: 'calc(var(--radius) - 2px)',
  sm: 'calc(var(--radius) - 4px)',
}

/* globals.css */
--radius: 0.75rem; /* 12px */
```

**Classes disponíveis:**
```
rounded-sm   = calc(0.75rem - 4px) = 8px
rounded-md   = calc(0.75rem - 2px) = 10px
rounded-lg   = 0.75rem = 12px
rounded-xl   = 0.75rem = 12px
rounded-2xl  = 1rem = 16px
rounded-full = 9999px (completamente arredondado)
```

**Uso nos componentes:**
- **Inputs**: `rounded-xl` (12px)
- **Buttons**: `rounded-full` (pill shape)
- **Cards**: `rounded-2xl` (16px)
- **Chips/Badges**: `rounded-full`

---

## 🎯 Iconografia (Lucide Icons)

### Configuração

```tsx
import { Home, Search, PlusCircle } from 'lucide-react'

// Stroke padrão
<Home className="h-5 w-5" strokeWidth={1.5} />

// Ativo (mais grosso)
<Home className="h-5 w-5" strokeWidth={2.2} />
```

### Ícones por Categoria

#### Navegação
- `Home`, `Search`, `PlusCircle`, `Bookmark`, `User`
- `ArrowLeft`, `Menu`, `ChevronRight`

#### Ações
- `Heart`, `Share`, `Camera`, `Pencil`, `MoreHorizontal`, `Settings`

#### Conteúdo
- `MapPin`, `Users`, `Globe`, `Zap`, `TreePine`

#### Player (se aplicável)
- `Play`, `Pause`, `SkipBack`, `SkipForward`

### Tamanhos

```tsx
// 16px (small)
<Icon className="h-4 w-4" />

// 20px (default)
<Icon className="h-5 w-5" />

// 24px (medium)
<Icon className="h-6 w-6" />

// 32px (large)
<Icon className="h-8 w-8" />
```

**Padrão do Pingo:**
- **Bottom Nav**: `h-6 w-6` (24px)
- **Ícones em botões**: `h-5 w-5` (20px)
- **Ícones em inputs**: `h-5 w-5` (20px)
- **Ícones de ação (curtir, compartilhar)**: `h-5 w-5` ou `h-6 w-6`

---

## 🧩 Componentes - Especificações Detalhadas

### 1. Button

**Variantes:**

#### Primary (Preto)
```tsx
className="
  rounded-full 
  bg-primary 
  px-6 py-3 
  text-sm font-medium 
  text-primary-foreground 
  hover:bg-primary/90
  transition-colors
"
```

#### Secondary (Branco com borda)
```tsx
className="
  rounded-full 
  border border-border 
  bg-card 
  px-6 py-3 
  text-sm font-medium 
  text-foreground 
  hover:bg-muted
  transition-colors
"
```

#### Gradient (Peach)
```tsx
className="
  rounded-full 
  gradient-peach 
  px-6 py-3 
  text-sm font-medium 
  text-primary 
  hover:opacity-90
  transition-opacity
"
```

#### Link (Apenas texto)
```tsx
className="
  text-sm font-semibold 
  text-foreground 
  underline 
  hover:text-accent
  transition-colors
"
```

#### Icon Button (Circular)
```tsx
className="
  h-10 w-10 
  rounded-full 
  bg-primary 
  flex items-center justify-center
  text-primary-foreground
  hover:bg-primary/90
  transition-colors
"
```

**Estados:**
- **Default**: cores normais
- **Hover**: `opacity-90` ou `/90` na cor
- **Active**: sem mudança adicional
- **Disabled**: `opacity-50 cursor-not-allowed`

**Tamanhos de padding:**
- **Small**: `px-4 py-2`
- **Medium** (default): `px-6 py-3`
- **Large**: `px-8 py-4`

---

### 2. Input

**Estrutura:**
```tsx
<div className="relative">
  {/* Ícone (opcional) */}
  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
  
  {/* Input */}
  <input
    className="
      w-full 
      rounded-xl 
      border border-border 
      bg-card 
      px-4 py-3
      pl-11  {/* se tem ícone à esquerda */}
      text-sm text-foreground
      placeholder:text-muted-foreground
      focus:outline-none 
      focus:ring-2 
      focus:ring-ring
      transition-shadow
    "
    placeholder="Buscar"
  />
</div>
```

**Variações:**
- **Com ícone esquerdo**: `pl-11`
- **Com ícone direito**: `pr-11`
- **Multiline (textarea)**: `rounded-2xl`, `min-h-[100px]`

**Estados de validação:**
```tsx
// Erro
className="border-destructive focus:ring-destructive"

// Sucesso
className="border-accent focus:ring-accent"
```

---

### 3. Filter Chips

**Estrutura:**
```tsx
<div className="flex gap-2 overflow-x-auto scrollbar-hide">
  {/* Chip não selecionado */}
  <button className="
    shrink-0 
    rounded-full 
    border border-border 
    bg-card 
    px-4 py-2 
    text-sm font-medium 
    text-foreground
    hover:bg-muted
    transition-colors
  ">
    Restaurantes
  </button>

  {/* Chip selecionado */}
  <button className="
    shrink-0 
    rounded-full 
    bg-primary 
    px-4 py-2 
    text-sm font-medium 
    text-primary-foreground
  ">
    Todos
  </button>
</div>
```

**Scroll horizontal:**
```css
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

---

### 4. Card

**Estrutura básica:**
```tsx
<div className="
  rounded-2xl 
  border border-border 
  bg-card 
  overflow-hidden
  shadow-sm
">
  {/* Conteúdo */}
</div>
```

**Variações:**

#### Card com imagem (Guia/Dica)
```tsx
<div className="rounded-2xl border border-border bg-card overflow-hidden">
  {/* Imagem */}
  <div className="relative h-48 w-full">
    <Image 
      src="..." 
      alt="..." 
      fill 
      className="object-cover"
    />
    {/* Overlay gradiente (opcional) */}
    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
  </div>
  
  {/* Conteúdo */}
  <div className="p-4">
    <h3 className="text-xl font-semibold">Título</h3>
    <p className="text-sm text-muted-foreground leading-relaxed mt-2">
      Descrição...
    </p>
  </div>
</div>
```

#### Card elevado (destaque)
```tsx
<div className="
  rounded-2xl 
  bg-card 
  shadow-lg 
  overflow-hidden
">
  {/* ... */}
</div>
```

---

### 5. Bottom Navigation

**Estrutura:**
```tsx
<nav className="
  fixed bottom-0 left-0 right-0 
  border-t border-border 
  bg-background/80 backdrop-blur-md
  safe-area-inset-bottom
">
  <div className="flex items-center justify-around px-6 py-3">
    {/* Item ativo */}
    <button className="
      flex flex-col items-center gap-1
    ">
      <Home className="h-6 w-6" strokeWidth={2.2} />
      <span className="text-[10px] font-medium text-foreground">
        Home
      </span>
    </button>

    {/* Item inativo */}
    <button className="
      flex flex-col items-center gap-1
      text-muted-foreground
    ">
      <Search className="h-6 w-6" strokeWidth={1.5} />
      <span className="text-[10px] font-medium">
        Buscar
      </span>
    </button>

    {/* Item central (criar) */}
    <button className="
      -mt-6
      h-14 w-14 
      rounded-full 
      bg-primary 
      flex items-center justify-center
      shadow-lg
    ">
      <PlusCircle className="h-6 w-6 text-primary-foreground" strokeWidth={2} />
    </button>

    {/* Demais itens... */}
  </div>
</nav>
```

**Estados:**
- **Ativo**: `strokeWidth={2.2}`, `text-foreground`
- **Inativo**: `strokeWidth={1.5}`, `text-muted-foreground`
- **Item central**: elevado com `-mt-6`, background primary

---

### 6. Stat Pills (Estatísticas)

**Estrutura:**
```tsx
<div className="flex items-center gap-1">
  <span className="text-lg font-bold text-foreground">
    1.200
  </span>
  <span className="text-xs text-muted-foreground">
    /dicas
  </span>
</div>
```

**Layout horizontal (perfil):**
```tsx
<div className="flex items-center gap-6">
  <div className="flex items-center gap-1">
    <span className="text-lg font-bold">1.200</span>
    <span className="text-xs text-muted-foreground">/dicas</span>
  </div>
  <div className="flex items-center gap-1">
    <span className="text-lg font-bold">1.200</span>
    <span className="text-xs text-muted-foreground">/Seguidores</span>
  </div>
  <div className="flex items-center gap-1">
    <span className="text-lg font-bold">3.400</span>
    <span className="text-xs text-muted-foreground">/curtidas</span>
  </div>
</div>
```

---

### 7. Social Icons

**Estrutura:**
```tsx
<div className="flex items-center gap-2">
  {/* Instagram */}
  <button className="
    h-8 w-8 
    rounded-full 
    border border-border 
    bg-card
    flex items-center justify-center
    text-xs font-bold
    hover:bg-muted
    transition-colors
  ">
    IG
  </button>

  {/* Facebook */}
  <button className="
    h-8 w-8 
    rounded-full 
    border border-border 
    bg-card
    flex items-center justify-center
    text-xs font-bold
    hover:bg-muted
    transition-colors
  ">
    FB
  </button>

  {/* Outros... */}
</div>
```

---

### 8. Banner (Pin.Go Promo)

**Estrutura:**
```tsx
<div className="relative overflow-hidden rounded-2xl bg-card p-6">
  {/* Gradiente background */}
  <div className="absolute inset-0 gradient-warm opacity-30" />
  
  {/* Blobs de profundidade */}
  <div className="absolute -right-16 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl" />
  <div className="absolute -left-8 top-0 h-24 w-24 rounded-full bg-muted/30 blur-2xl" />
  
  {/* Conteúdo */}
  <div className="relative flex flex-col items-center gap-2">
    <h3 className="text-2xl font-bold tracking-tight text-foreground">
      Pin.Go
    </h3>
    <p className="text-xs font-mono uppercase tracking-widest text-foreground/50">
      Explore mais com o Pin.Go+
    </p>
  </div>
</div>
```

---

## 📱 Layout Patterns

### Page Container (Mobile)

```tsx
<main className="min-h-screen bg-background pb-20">
  {/* pb-20 para compensar bottom nav */}
  
  <div className="flex-1 overflow-y-auto">
    {/* Conteúdo scrollável */}
  </div>

  <BottomNav active="/home" />
</main>
```

### Section Spacing

```tsx
{/* Seção padrão */}
<div className="px-4 pt-6">
  <h2 className="text-base font-bold text-foreground">
    Título da Seção
  </h2>
  <div className="mt-3">
    {/* Conteúdo */}
  </div>
</div>
```

### Scroll Horizontal (Chips, Cards)

```tsx
<div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
  {items.map(item => (
    <div key={item.id} className="shrink-0">
      {/* Item */}
    </div>
  ))}
</div>
```

---

## 🎭 Estados e Animações

### Transitions

```css
/* Padrão para interações */
transition-colors    /* Para mudanças de cor */
transition-opacity   /* Para fade in/out */
transition-shadow    /* Para elevação/focus */
transition-transform /* Para movimentos */

/* Todos juntos */
transition-all

/* Duração (padrão é 150ms) */
duration-200
duration-300
```

### Hover States

```tsx
// Botões e links
hover:bg-primary/90
hover:opacity-90
hover:text-accent

// Cards interativos
hover:shadow-lg
hover:scale-105
```

### Active/Focus States

```tsx
// Focus em inputs
focus:outline-none 
focus:ring-2 
focus:ring-ring

// Active em botões
active:scale-95
```

---

## 🖼️ Imagens e Overlays

### Image com Next.js

```tsx
import Image from 'next/image'

<div className="relative h-48 w-full overflow-hidden rounded-2xl">
  <Image
    src="/images/hero.jpg"
    alt="Descrição"
    fill
    className="object-cover"
  />
  
  {/* Overlay gradiente */}
  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
  
  {/* Conteúdo sobre imagem */}
  <div className="absolute bottom-4 left-4 right-4">
    <h3 className="text-lg font-bold text-primary-foreground">
      Título
    </h3>
  </div>
</div>
```

### Overlays Comuns

```tsx
// Escurecer fundo
className="absolute inset-0 bg-foreground/60"

// Gradiente de baixo para cima
className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent"

// Gradiente peach sutil
className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[hsl(var(--peach-deep)/0.3)] to-transparent"
```

---

## 🚨 Regras Críticas de Implementação

### ✅ SEMPRE FAZER:

1. **Usar tokens CSS**: `hsl(var(--primary))` em vez de hex
2. **Border radius**: `rounded-full` para botões, `rounded-2xl` para cards
3. **Spacing mobile**: `px-4` lateral, `py-6` entre seções
4. **Font classes**: `font-sans` para texto, `font-mono` para labels
5. **Ícones Lucide**: `strokeWidth={1.5}` normal, `{2.2}` ativo
6. **Transitions**: sempre adicionar `transition-colors` ou `transition-all`
7. **Gradientes**: usar classes `.gradient-*` pré-definidas
8. **Bottom nav**: sempre `pb-20` no container para compensar

### ❌ NUNCA FAZER:

1. ❌ Usar cores hardcoded (#E8944A) - sempre usar tokens
2. ❌ Botões com `rounded-lg` - sempre `rounded-full`
3. ❌ Esquecer `scrollbar-hide` em scroll horizontal
4. ❌ Inputs sem `focus:ring-2 focus:ring-ring`
5. ❌ Ícones sem especificar `strokeWidth`
6. ❌ Cards sem `overflow-hidden` quando tem imagem
7. ❌ Esquecer `-mt-6` no botão central do bottom nav
8. ❌ Usar `font-bold` onde deveria ser `font-semibold`

---

## 📋 Checklist de Validação

Antes de considerar um componente/tela "pronto", verificar:

- [ ] Cores vêm de tokens CSS (`hsl(var(--*))`)
- [ ] Border radius correto (buttons=full, cards=2xl, inputs=xl)
- [ ] Espaçamento mobile (px-4, py-6)
- [ ] Tipografia correta (sans vs mono, weights)
- [ ] Ícones com strokeWidth especificado
- [ ] Transitions em elementos interativos
- [ ] States (hover, focus, active) implementados
- [ ] Responsive/mobile-first
- [ ] Acessibilidade (alt text, aria labels)
- [ ] Overflow/scroll funcionando

---

## 🎯 Exemplos de Implementação Completa

### Tela de Login (Exemplo Fiel)

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simular API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    router.push('/home')
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      {/* Logo */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          Pingo
        </h1>
      </div>

      {/* Card */}
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
          {/* Título */}
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-8">
            Bem-vindo
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="
                    w-full rounded-xl border border-border bg-card 
                    px-4 py-3 pl-11 text-sm text-foreground
                    placeholder:text-muted-foreground
                    focus:outline-none focus:ring-2 focus:ring-ring
                    transition-shadow
                  "
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            {/* Senha Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    w-full rounded-xl border border-border bg-card 
                    px-4 py-3 pl-11 pr-11 text-sm text-foreground
                    placeholder:text-muted-foreground
                    focus:outline-none focus:ring-2 focus:ring-ring
                    transition-shadow
                  "
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" strokeWidth={1.5} />
                  ) : (
                    <Eye className="h-5 w-5" strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            {/* Esqueceu senha */}
            <div className="flex justify-end">
              <Link 
                href="/recuperar-senha"
                className="text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                Esqueceu a senha?
              </Link>
            </div>

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full rounded-full gradient-peach 
                px-6 py-3 text-sm font-medium text-primary
                hover:opacity-90 transition-opacity
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Divisor */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground">ou</span>
            </div>
          </div>

          {/* Botões Sociais */}
          <div className="space-y-3">
            <button className="
              w-full rounded-full border border-border bg-card 
              px-6 py-3 text-sm font-medium text-foreground
              hover:bg-muted transition-colors
              flex items-center justify-center gap-2
            ">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                {/* Google Icon SVG */}
              </svg>
              Continuar com Google
            </button>

            <button className="
              w-full rounded-full border border-border bg-card 
              px-6 py-3 text-sm font-medium text-foreground
              hover:bg-muted transition-colors
              flex items-center justify-center gap-2
            ">
              {/* Apple Icon */}
              Continuar com Apple
            </button>

            <button className="
              w-full rounded-full border border-border bg-card 
              px-6 py-3 text-sm font-medium text-foreground
              hover:bg-muted transition-colors
              flex items-center justify-center gap-2
            ">
              {/* Facebook Icon */}
              Continuar com Facebook
            </button>
          </div>

          {/* Link para Cadastro */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Não tem uma conta?{' '}
            <Link 
              href="/cadastro" 
              className="font-semibold text-foreground hover:text-accent transition-colors"
            >
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
```

---

## 📦 Arquivo globals.css Completo

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Core Palette */
    --background: 100 14% 92%;
    --foreground: 150 10% 15%;
    --card: 100 12% 95%;
    --card-foreground: 150 10% 15%;
    --popover: 60 20% 98%;
    --popover-foreground: 150 10% 15%;
    --primary: 150 10% 15%;
    --primary-foreground: 60 20% 98%;
    --secondary: 40 30% 94%;
    --secondary-foreground: 150 10% 15%;
    --muted: 100 10% 89%;
    --muted-foreground: 150 6% 45%;
    --accent: 28 85% 65%;
    --accent-foreground: 150 10% 15%;
    --destructive: 10 70% 50%;
    --destructive-foreground: 60 20% 98%;
    --border: 100 8% 84%;
    --input: 100 8% 84%;
    --ring: 28 85% 65%;

    /* Extended Palette */
    --peach-light: 35 90% 88%;
    --peach: 28 85% 72%;
    --peach-deep: 20 80% 60%;
    --sage-light: 100 15% 94%;
    --sage: 100 12% 85%;
    --sage-deep: 120 10% 72%;
    --amber-glow: 40 90% 70%;

    /* Border Radius */
    --radius: 0.75rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

@layer utilities {
  /* Gradientes */
  .gradient-warm {
    background: linear-gradient(
      160deg,
      hsl(var(--sage-light)) 0%,
      hsl(var(--peach-light)) 40%,
      hsl(var(--peach)) 70%,
      hsl(var(--amber-glow)) 100%
    );
  }

  .gradient-peach {
    background: linear-gradient(
      135deg,
      hsl(var(--peach-light)) 0%,
      hsl(var(--peach)) 50%,
      hsl(var(--amber-glow)) 100%
    );
  }

  .gradient-sage {
    background: linear-gradient(
      135deg,
      hsl(var(--sage-light)) 0%,
      hsl(var(--sage)) 50%,
      hsl(var(--sage-deep)) 100%
    );
  }

  .gradient-hero {
    background: linear-gradient(
      180deg,
      hsl(var(--background)) 0%,
      hsl(var(--peach-light)) 50%,
      hsl(var(--peach)) 100%
    );
  }

  .gradient-subtle {
    background: linear-gradient(
      135deg,
      hsl(var(--background)) 0%,
      hsl(var(--sage-light)) 50%,
      hsl(var(--peach-light) / 0.5) 100%
    );
  }

  /* Glow Effects */
  .glow-peach {
    box-shadow: 0 0 80px 40px hsl(var(--peach) / 0.3),
                0 0 160px 80px hsl(var(--amber-glow) / 0.15);
  }

  .glow-sage {
    box-shadow: 0 0 60px 30px hsl(var(--sage) / 0.3),
                0 0 120px 60px hsl(var(--sage-deep) / 0.15);
  }

  /* Scrollbar Hide */
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  /* Safe Area (iOS) */
  .safe-area-inset-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
```

---

## 🎓 Guia de Uso para o Cursor

### Como usar este documento:

1. **Copie este arquivo** para o projeto Pingo
2. **Crie um `.cursorrules`** referenciando este documento:

```
Você está desenvolvendo o app Pingo seguindo fielmente o design system oficial.

REGRA MÁXIMA: Consulte SEMPRE o arquivo PINGO_DESIGN_TOKENS_OFICIAL.md antes de criar qualquer componente ou tela.

Tokens obrigatórios:
- Cores: usar hsl(var(--*)) do globals.css
- Tipografia: DM Sans (sans) e Space Mono (mono)
- Border radius: rounded-full (buttons), rounded-2xl (cards), rounded-xl (inputs)
- Spacing: px-4 mobile, py-6 entre seções
- Ícones: Lucide com strokeWidth={1.5} normal ou {2.2} ativo
- Gradientes: classes .gradient-* pré-definidas

Ao criar componentes:
1. Leia a especificação no PINGO_DESIGN_TOKENS_OFICIAL.md
2. Siga EXATAMENTE as classes Tailwind especificadas
3. Não invente estilos - use apenas os tokens documentados
4. Teste visualmente contra o design system em https://vm-m91pm8e1t62s8zcubstjzf.vusercontent.net/
```

3. **Ao criar componentes**, referencie seções específicas:

```
@PINGO_DESIGN_TOKENS_OFICIAL.md 

Crie o componente Button seguindo a seção "Componentes - Button"
```

---

**Última atualização**: 2026-02-06  
**Fonte**: https://vm-m91pm8e1t62s8zcubstjzf.vusercontent.net/  
**Versão**: 1.0 Oficial
