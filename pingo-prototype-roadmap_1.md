# 🎯 Pingo App - Roadmap de Desenvolvimento do Protótipo

## 📋 Visão Geral do Projeto

**Objetivo**: Criar um protótipo funcional e navegável do aplicativo Pingo com design melhorado para apresentação ao cliente.

**Stack Tecnológica**:
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn/ui (componentes)
- PWA (Progressive Web App)

**Design System**: Já completo
- Paleta: Sage/Mint + Peach/Laranja
- Tipografia: DM Sans + Space Mono
- Componentes UI: Customizados e prontos

---

## 🗺️ Mapa Completo de Telas

### ✅ Status: Completo | 🔨 Em Desenvolvimento | ⏳ Pendente

### 1. **Autenticação** (4 telas)

#### 1.1 Login ⏳
**Rota**: `/login`
**Elementos**:
- Logo Pingo (topo)
- Input: Email
- Input: Senha
- Botão: "Entrar"
- Link: "Esqueceu a senha?"
- Link: "Criar conta"
- Divisor: "ou"
- Botões sociais: Google, Apple, Facebook

**Componentes necessários**:
- Input (já existe)
- Button (já existe)
- Card (já existe)

**Navegação**:
- "Entrar" → `/home`
- "Esqueceu a senha?" → `/recuperar-senha`
- "Criar conta" → `/cadastro`

---

#### 1.2 Cadastro - Dados Pessoais ⏳
**Rota**: `/cadastro`
**Elementos**:
- Header: "Criar conta" + botão voltar
- Input: Nome completo
- Input: Email
- Input: Senha
- Input: Confirmar senha
- Checkbox: Aceitar termos
- Botão: "Continuar"
- Link: "Já tem conta? Entrar"

**Componentes necessários**:
- Input (já existe)
- Button (já existe)
- Checkbox (já existe)

**Navegação**:
- "Continuar" → `/cadastro/redes-sociais`
- "Voltar" → `/login`
- "Entrar" → `/login`

---

#### 1.3 Cadastro - Redes Sociais ⏳
**Rota**: `/cadastro/redes-sociais`
**Elementos**:
- Header: "Conectar redes sociais" + botão voltar
- Texto: "Opcional - facilita compartilhamento"
- Botões sociais: Instagram, Facebook, Twitter
- Botão: "Pular"
- Botão: "Finalizar"

**Componentes necessários**:
- Button (já existe)
- Card (já existe)

**Navegação**:
- "Finalizar" → `/home`
- "Pular" → `/home`
- "Voltar" → `/cadastro`

---

#### 1.4 Recuperar Senha - Fluxo Completo (3 sub-telas) ⏳

**1.4.1 Digitar Email**
**Rota**: `/recuperar-senha`
- Header: "Recuperar senha" + botão voltar
- Input: Email
- Botão: "Enviar código"

**Navegação**: "Enviar código" → `/recuperar-senha/codigo`

**1.4.2 Adicionar Código**
**Rota**: `/recuperar-senha/codigo`
- Header: "Digite o código"
- 6 inputs: Código OTP
- Texto: "Reenviamos o código para seu email"
- Link: "Reenviar código"
- Botão: "Verificar"

**Componentes necessários**: Input OTP (já existe)
**Navegação**: "Verificar" → `/recuperar-senha/nova-senha`

**1.4.3 Definir Nova Senha**
**Rota**: `/recuperar-senha/nova-senha`
- Header: "Nova senha"
- Input: Nova senha
- Input: Confirmar senha
- Botão: "Salvar senha"

**Navegação**: "Salvar senha" → `/login` (com toast de sucesso)

---

### 2. **App Principal** (5 telas principais)

#### 2.1 Home ✅
**Rota**: `/home` ou `/`
**Status**: Completo
**Elementos existentes**:
- Barra de busca
- Hero carousel
- Perfis para seguir
- Perto de você (mapa)
- Dicas e guias
- Banner Pin.Go
- Categorias
- Compartilhe suas dicas
- Bottom navigation

**Melhorias necessárias**:
- Tornar busca funcional
- Links de navegação ativos
- Carousel funcional (swipe)

---

#### 2.2 Buscar 🔨
**Rota**: `/buscar`
**Elementos**:
- Header com input de busca (focus automático)
- Botão: Voltar
- Chips de filtro: Restaurantes, Hotéis, Museus, Praias, etc.
- Lista de resultados (cards)
- Empty state: "Busque por lugares, guias ou pessoas"

**Componentes necessários**:
- FilterChips (já existe)
- Input (já existe)
- Card (já existe)

**Navegação**:
- Clicar em resultado → `/dica/{id}`
- Voltar → página anterior

---

#### 2.3 Mapa ⏳
**Rota**: `/mapa`
**Elementos**:
- Mapa interativo (Google Maps ou Mapbox)
- Pins coloridos (categorias)
- Botão: Buscar
- Botão: Filtro
- Botão: Lista de locais (bottom sheet)
- Card flutuante: Local selecionado
- Bottom navigation

**Componentes necessários**:
- Mapa (integração externa)
- Bottom Sheet/Drawer (já existe)
- FilterChips (já existe)

**Sub-fluxos**:
- Filtro → Modal de filtros
- Lista de locais → Bottom sheet com scroll
- Selecionar pin → Card com info + "Ver dica"
- "Ver dica" → `/dica/{id}`

---

#### 2.4 Nova Dica/Guia ⏳
**Rota**: `/criar-dica`
**Elementos**:
- Header: "Nova dica" + botão fechar
- Input: Título
- Textarea: Descrição
- Upload de imagens (múltiplas)
- Input: Localização (com autocomplete)
- Select: Categoria
- Botão: "Publicar"
- Botão: "Salvar rascunho"

**Componentes necessários**:
- Input (já existe)
- Textarea (já existe)
- Upload de imagens (criar novo)
- Autocomplete de localização (criar novo)
- Select (já existe)

**Navegação**:
- "Publicar" → `/perfil` (com toast de sucesso)
- "Salvar rascunho" → `/perfil` (seção rascunhos)
- Fechar → Modal "Descartar alterações?"

---

#### 2.5 Perfil ✅ (expandir)
**Rota**: `/perfil`
**Status**: Base completa, precisa expandir
**Elementos existentes**:
- Avatar
- Nome
- Bio
- Stats (dicas, seguidores, seguindo)
- Tabs: Guias / Dicas / Salvos
- Bottom navigation

**Melhorias necessárias**:
- Botão: Editar perfil → `/perfil/editar`
- Botão: Configurações → `/perfil/configuracoes`
- Tabs funcionais com conteúdo
- Cards de dicas clicáveis → `/dica/{id}`
- Botão: Seguir/Deixar de seguir

---

#### 2.6 Feed Social (novo) ⏳
**Rota**: `/feed`
**Elementos**:
- Header: "Feed" + Logo Pingo
- Cards de posts:
  - Avatar + nome do autor
  - Imagem da dica
  - Título + preview da descrição
  - Localização
  - Botões: Curtir, Comentar, Salvar
  - Número de curtidas
- Bottom navigation

**Componentes necessários**:
- Card (já existe)
- Avatar (já existe)
- Button (já existe)

**Navegação**:
- Clicar no card → `/dica/{id}`
- Clicar no autor → `/perfil/{userId}`

---

### 3. **Telas Secundárias** (6 telas)

#### 3.1 Dica Detalhada ⏳
**Rota**: `/dica/{id}`
**Elementos**:
- Header: Botão voltar + Botão compartilhar
- Carousel de imagens
- Avatar + nome do autor
- Título
- Localização (com link para mapa)
- Descrição completa
- Categoria badge
- Seção: "Mais dicas próximas" (scroll horizontal)
- Botões: Curtir, Comentar, Salvar
- Seção de comentários

**Componentes necessários**:
- Carousel (já existe)
- Avatar (já existe)
- Badge (já existe)
- Card (já existe)

**Navegação**:
- Voltar → página anterior
- Autor → `/perfil/{userId}`
- Localização → `/mapa?lat={}&lng={}`
- Dicas relacionadas → `/dica/{otherId}`

---

#### 3.2 Guia Selecionado ⏳
**Rota**: `/guia/{id}`
**Elementos**:
- Header: Título do guia + botão voltar
- Avatar + nome do criador
- Descrição
- Número de dicas
- Lista de dicas (cards verticais)
- Botão: "Salvar guia"
- Botão: "Compartilhar"

**Componentes necessários**:
- Card (já existe)
- Avatar (já existe)
- Button (já existe)

**Navegação**:
- Voltar → página anterior
- Criador → `/perfil/{userId}`
- Dica → `/dica/{id}`

---

#### 3.3 Editar Perfil ⏳
**Rota**: `/perfil/editar`
**Elementos**:
- Header: "Editar perfil" + botão voltar + botão salvar
- Upload: Foto de perfil
- Input: Nome
- Textarea: Bio
- Input: Localização
- Input: Website
- Botão: "Salvar alterações"

**Componentes necessários**:
- Input (já existe)
- Textarea (já existe)
- Avatar upload (criar novo)

**Navegação**:
- "Salvar" → `/perfil` (com toast de sucesso)
- Voltar → `/perfil` (com confirmação se houver mudanças)

---

#### 3.4 Configurações ⏳
**Rota**: `/perfil/configuracoes`
**Elementos**:
- Header: "Configurações" + botão voltar
- Seções:
  - **Conta**: Alterar email, Alterar senha, Excluir conta
  - **Privacidade**: Perfil privado, Quem pode comentar
  - **Notificações**: Push, Email, Curtidas, Comentários
  - **Sobre**: Termos, Privacidade, Versão
- Botão: "Sair"

**Componentes necessários**:
- Switch (já existe)
- Separator (já existe)
- Dialog (já existe - para confirmações)

**Navegação**:
- Voltar → `/perfil`
- "Sair" → `/login`
- Sub-opções → Modals ou sub-rotas

---

#### 3.5 Perfil de Outro Usuário ⏳
**Rota**: `/perfil/{userId}`
**Elementos**: (similar ao perfil próprio)
- Avatar
- Nome + verificado badge (se aplicável)
- Bio
- Stats
- Botão: Seguir/Deixar de seguir
- Botão: Mensagem (futuro)
- Tabs: Guias / Dicas
- Cards de conteúdo

**Navegação**:
- Voltar → página anterior
- Dica → `/dica/{id}`
- Guia → `/guia/{id}`

---

#### 3.6 Lista de Seguidores/Seguindo ⏳
**Rota**: `/perfil/{userId}/seguidores` ou `/perfil/{userId}/seguindo`
**Elementos**:
- Header: "Seguidores" ou "Seguindo" + botão voltar
- Lista de usuários:
  - Avatar
  - Nome
  - Bio (preview)
  - Botão: Seguir/Seguindo
- Barra de busca (topo)

**Componentes necessários**:
- Avatar (já existe)
- Button (já existe)
- Input search (já existe)

**Navegação**:
- Voltar → `/perfil/{userId}`
- Usuário → `/perfil/{otherUserId}`

---

### 4. **Componentes Modais/Overlays** (5 componentes)

#### 4.1 Modal: "Quem" ⏳
**Trigger**: Botão "Quem" na bottom nav (diamante roxo)
**Elementos**:
- Título: "Quem está por perto"
- Lista de usuários próximos
- Avatar + nome + distância
- Botão: Ver perfil

**Componentes necessários**:
- Dialog/Sheet (já existe)
- Avatar (já existe)

---

#### 4.2 Modal: Criar Guia ⏳
**Trigger**: Botão "+" na bottom nav
**Elementos**:
- Opções:
  - "Nova dica" → `/criar-dica`
  - "Novo guia" → `/criar-guia`
  - "Upload de foto" → Camera/Gallery

**Componentes necessários**:
- Sheet (já existe)
- Button (já existe)

---

#### 4.3 Modal: Filtros ⏳
**Trigger**: Botão filtro no mapa ou busca
**Elementos**:
- Categorias (checkboxes múltiplos)
- Range de distância (slider)
- Avaliação mínima (stars)
- Botão: "Aplicar filtros"
- Botão: "Limpar"

**Componentes necessários**:
- Checkbox (já existe)
- Slider (já existe)
- Sheet (já existe)

---

#### 4.4 Modal: Compartilhar ⏳
**Trigger**: Botão compartilhar em dicas/guias
**Elementos**:
- Botões de redes sociais
- Botão: "Copiar link"
- Botão: "Compartilhar via..."

**Componentes necessários**:
- Sheet (já existe)
- Button (já existe)
- Toast (já existe - para feedback)

---

#### 4.5 Bottom Sheet: Lista de Locais ⏳
**Trigger**: Botão no mapa
**Elementos**:
- Handle (arrasto)
- Lista vertical de locais (cards compactos)
- Avatar + nome + categoria + distância
- Scroll infinito

**Componentes necessários**:
- Sheet (já existe)
- Card (já existe)

---

## 🏗️ Estrutura de Pastas do Projeto

```
pingo-app/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── cadastro/
│   │   │   ├── page.tsx
│   │   │   └── redes-sociais/
│   │   │       └── page.tsx
│   │   └── recuperar-senha/
│   │       ├── page.tsx
│   │       ├── codigo/
│   │       │   └── page.tsx
│   │       └── nova-senha/
│   │           └── page.tsx
│   ├── (app)/
│   │   ├── layout.tsx (com BottomNav)
│   │   ├── home/
│   │   │   └── page.tsx ✅
│   │   ├── buscar/
│   │   │   └── page.tsx
│   │   ├── mapa/
│   │   │   └── page.tsx
│   │   ├── feed/
│   │   │   └── page.tsx
│   │   ├── perfil/
│   │   │   ├── page.tsx ✅
│   │   │   ├── editar/
│   │   │   │   └── page.tsx
│   │   │   ├── configuracoes/
│   │   │   │   └── page.tsx
│   │   │   └── [userId]/
│   │   │       ├── page.tsx
│   │   │       ├── seguidores/
│   │   │       │   └── page.tsx
│   │   │       └── seguindo/
│   │   │           └── page.tsx
│   │   ├── dica/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── guia/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── criar-dica/
│   │   │   └── page.tsx
│   │   └── criar-guia/
│   │       └── page.tsx
│   ├── globals.css ✅
│   └── layout.tsx ✅
├── components/
│   ├── app/
│   │   ├── home-screen.tsx ✅
│   │   ├── profile-screen.tsx ✅
│   │   ├── bottom-nav.tsx ✅
│   │   ├── filter-chips.tsx ✅
│   │   └── (novos componentes específicos do app)
│   ├── design-system/ ✅
│   ├── ui/ ✅
│   └── (componentes compartilhados novos)
├── lib/
│   ├── utils.ts ✅
│   └── (helpers, hooks customizados)
└── public/
    └── images/
```

---

## 📊 Ordem de Desenvolvimento (Priorização)

### **Sprint 1: Fundação e Autenticação** (3-4 dias)
- [ ] Setup inicial do projeto (se começar do zero)
- [ ] Configurar rotas e layouts
- [ ] Login
- [ ] Cadastro (dados pessoais)
- [ ] Cadastro (redes sociais)
- [ ] Recuperar senha (fluxo completo)
- [ ] Navegação entre telas de auth

**Entregável**: Fluxo de autenticação completo e navegável

---

### **Sprint 2: App Core** (4-5 dias)
- [ ] Melhorar Home (busca funcional, carousel)
- [ ] Buscar (tela + filtros)
- [ ] Mapa (integração básica)
- [ ] Nova Dica (form completo)
- [ ] Dica Detalhada
- [ ] Feed Social

**Entregável**: Fluxo principal do app (criar e ver dicas)

---

### **Sprint 3: Perfil e Social** (3-4 dias)
- [ ] Expandir Perfil (tabs, conteúdo)
- [ ] Editar Perfil
- [ ] Perfil de Outro Usuário
- [ ] Lista de Seguidores/Seguindo
- [ ] Guia Detalhado

**Entregável**: Funcionalidades sociais completas

---

### **Sprint 4: Configurações e Polimento** (2-3 dias)
- [ ] Configurações completas
- [ ] Modais (filtros, compartilhar, etc)
- [ ] Animações e transições
- [ ] Estados de loading
- [ ] Empty states
- [ ] Error handling

**Entregável**: App polido e profissional

---

### **Sprint 5: PWA e Deploy** (1-2 dias)
- [ ] Configurar PWA (manifest, service worker)
- [ ] Otimizações mobile
- [ ] Testes em dispositivos reais
- [ ] Deploy no Vercel
- [ ] Configurar domínio (se houver)

**Entregável**: App publicado e testável em qualquer device

---

## 🎨 Componentes Novos a Criar

### Prioridade Alta
1. **ImageUpload** - Upload múltiplo de imagens com preview
2. **LocationAutocomplete** - Input com autocomplete de localização
3. **MapView** - Wrapper do mapa (Google Maps/Mapbox)
4. **PostCard** - Card de post do feed
5. **TipCard** - Card de dica (usado em várias telas)
6. **UserCard** - Card de usuário (seguidores, busca)
7. **CommentSection** - Seção de comentários
8. **FilterModal** - Modal de filtros completo

### Prioridade Média
9. **AvatarUpload** - Upload de avatar com crop
10. **GuideCard** - Card de guia
11. **CategoryBadge** - Badge de categoria customizado
12. **StatsDisplay** - Display de stats (curtidas, comentários, etc)
13. **ShareSheet** - Bottom sheet de compartilhamento

### Prioridade Baixa
14. **EmptyState** - Estados vazios customizados
15. **LoadingScreen** - Tela de loading personalizada
16. **ErrorBoundary** - Tratamento de erros

---

## 🔧 Integrações Necessárias

### Essenciais (para protótipo funcional)
1. **Mapa**: 
   - Opção 1: Google Maps (API key necessária)
   - Opção 2: Mapbox (mais customizável)
   - Opção 3: Mock/Dummy (para protótipo rápido)

2. **Imagens**:
   - Usar placeholders (unsplash, placeholder.com)
   - Ou criar mock local

### Nice to Have (podem ser mockadas)
3. **Autenticação**: Pode ser fake/mock para protótipo
4. **Backend**: Pode usar dados estáticos/mock
5. **Geolocalização**: Pode usar coordenadas fixas

---

## 📱 Configuração PWA

### Manifest (next-manifest.json)
```json
{
  "name": "Pin.Go",
  "short_name": "Pingo",
  "description": "Descubra e compartilhe dicas de viagem",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#E4E9E0",
  "theme_color": "#262E2A",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Viewport Meta (já no layout.tsx)
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
```

---

## 🧪 Checklist de Teste Mobile

### Funcionalidade
- [ ] Todas as telas carregam corretamente
- [ ] Navegação funciona (forward/back)
- [ ] Bottom nav funciona em todas as páginas
- [ ] Formulários funcionam (validação)
- [ ] Upload de imagens funciona
- [ ] Mapa é interativo (zoom, pan)

### UX Mobile
- [ ] Touch targets têm no mínimo 44x44px
- [ ] Scroll é suave
- [ ] Não há zoom inesperado em inputs
- [ ] Teclado não quebra layout
- [ ] Gestos funcionam (swipe, pinch)

### Performance
- [ ] Imagens otimizadas (Next Image)
- [ ] Carregamento < 3s em 3G
- [ ] Sem layout shift (CLS)
- [ ] Animações a 60fps

### Compatibilidade
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Diferentes tamanhos de tela (iPhone SE até iPhone 15 Pro Max)

---

## 🚀 Deploy no Vercel

### Setup Rápido
```bash
# Instalar Vercel CLI
npm i -g vercel

# No diretório do projeto
vercel

# Para produção
vercel --prod
```

### Variáveis de Ambiente
```env
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_key
NEXT_PUBLIC_API_URL=your_api_url (se houver)
```

---

## 📝 Dados Mock Sugeridos

### Usuários Mock (5-10)
```typescript
{
  id: "1",
  name: "Marina Silva",
  username: "@marinasilva",
  avatar: "/avatars/marina.jpg",
  bio: "Exploradora de praias 🏖️",
  location: "São Paulo, SP",
  stats: { tips: 45, followers: 1200, following: 340 },
  verified: true
}
```

### Dicas Mock (20-30)
```typescript
{
  id: "1",
  title: "Melhor café da região",
  description: "...",
  images: ["..."],
  location: { lat: -23.5505, lng: -46.6333, name: "Padaria X" },
  category: "Restaurantes",
  author: User,
  likes: 234,
  comments: 12,
  saved: false
}
```

### Guias Mock (5-10)
```typescript
{
  id: "1",
  title: "Roteiro 3 dias em São Paulo",
  description: "...",
  cover: "...",
  author: User,
  tips: [Tip[]],
  saves: 450
}
```

---

## 🎯 Objetivos da Apresentação ao Cliente

### Demo Flow Sugerido:
1. **Onboarding** (30s)
   - Mostrar telas de login/cadastro
   - Design limpo e profissional

2. **Exploração** (1min)
   - Home → Buscar
   - Filtros funcionando
   - Mapa interativo

3. **Criação de Conteúdo** (1min)
   - Criar nova dica
   - Upload de fotos
   - Publicar

4. **Social** (30s)
   - Feed
   - Ver perfil de outro usuário
   - Interações (curtir, comentar)

5. **Perfil** (30s)
   - Seu perfil
   - Guias criados
   - Configurações

**Tempo total**: ~3-4 minutos

---

## 📊 Métricas de Sucesso do Protótipo

- ✅ Todas as telas principais navegáveis
- ✅ Design system aplicado consistentemente
- ✅ Funciona em mobile (iOS e Android)
- ✅ Performance aceitável (< 3s load)
- ✅ Cliente consegue testar no próprio celular
- ✅ Fluxos críticos completos (auth, criar dica, explorar)

---

## 🎨 Notas de Design

### Princípios
- **Minimalista**: Muito espaço em branco
- **Warm & Welcoming**: Gradientes peach sutis
- **Clean Typography**: DM Sans legível
- **Visual Hierarchy**: Tamanhos e pesos claros

### Padrões de Uso
- **Sage**: Backgrounds, estados neutros
- **Peach**: CTAs, destaques, acentos
- **Deep Forest**: Texto principal, botões primários
- **Gradientes**: Overlays em imagens, banners especiais

### Spacing
- Mobile: px-4 (16px) padrão
- Seções: py-6 (24px) entre blocos
- Cards: gap-3 (12px) entre elementos
- Listas horizontais: gap-3 ou gap-4

---

## 🔄 Próximas Iterações (Pós-Protótipo)

### Fase 2 - Backend Real
- Autenticação real (Firebase/Supabase)
- Database (PostgreSQL/MongoDB)
- API REST ou GraphQL
- Storage de imagens (S3/Cloudinary)

### Fase 3 - Features Avançadas
- Notificações push
- Chat/Mensagens
- Gamificação (badges, achievements)
- Analytics
- Recomendações (ML)

### Fase 4 - Escalabilidade
- Cache e optimization
- CDN
- Server-side rendering otimizado
- Monitoring (Sentry, Analytics)

---

## 📞 Contatos e Recursos

### Documentação Útil
- Next.js: https://nextjs.org/docs
- Shadcn/ui: https://ui.shadcn.com
- Tailwind: https://tailwindcss.com
- Google Maps React: https://visgl.github.io/react-google-maps/
- Mapbox GL: https://docs.mapbox.com/mapbox-gl-js/

### Assets
- Icons: Lucide React (já instalado)
- Imagens placeholder: Unsplash, Placeholder.com
- Fontes: Google Fonts (DM Sans, Space Mono)

---

## ✅ Checklist Final Antes da Apresentação

### Técnico
- [ ] Build de produção sem erros
- [ ] Deploy funcionando
- [ ] Todas as rotas acessíveis
- [ ] Sem console errors
- [ ] Imagens carregando
- [ ] PWA instalável

### UX
- [ ] Navegação intuitiva
- [ ] Feedback visual em todas as ações
- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] Animações suaves

### Apresentação
- [ ] Script de demo preparado
- [ ] Backup local (caso internet caia)
- [ ] Dados mock interessantes
- [ ] Screenshots de backup
- [ ] Link compartilhável pronto

---

**Última atualização**: 2026-02-06
**Versão**: 1.0
**Status**: 🟢 Pronto para desenvolvimento
