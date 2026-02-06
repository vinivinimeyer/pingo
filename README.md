# Pingo App

Aplicativo para descobrir e compartilhar dicas de viagem.

## Stack Tecnológica

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn/ui
- Lucide React (ícones)

## Design System

- **Cores**: Sage/Mint + Peach/Laranja
- **Tipografia**: DM Sans + Space Mono
- **Estilo**: Minimalista, mobile-first, warm & welcoming

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Estrutura do Projeto

```
pingo/
├── app/
│   ├── (auth)/          # Rotas de autenticação
│   │   ├── login/
│   │   ├── cadastro/
│   │   └── recuperar-senha/
│   ├── globals.css      # Estilos globais e design system
│   └── layout.tsx       # Layout raiz
├── components/
│   └── ui/              # Componentes Shadcn/ui
├── lib/
│   └── utils.ts        # Utilitários (cn helper)
└── public/             # Assets estáticos
```

## Telas de Autenticação (Sprint 1)

- ✅ Login (`/login`)
- ✅ Cadastro - Dados Pessoais (`/cadastro`)
- ✅ Cadastro - Redes Sociais (`/cadastro/redes-sociais`)

## Próximos Passos

Ver o roadmap completo em `pingo-prototype-roadmap_1.md`
