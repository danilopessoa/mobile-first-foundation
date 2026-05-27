# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

---

## Comandos

```bash
npm run dev          # servidor de desenvolvimento em http://localhost:3000
npm run build        # build SSG — gera HTML estático em /out
npm run lint         # ESLint
npx tsc --noEmit     # checagem de tipos sem emitir arquivos
```

Não há test runner configurado. Validação é feita via TypeScript + ESLint + build.

---

## Arquitetura

**Next.js 16 · App Router · SSG · TypeScript · Tailwind CSS 4**

```
src/
├── app/          # rotas (Server Components por padrão)
└── components/   # componentes reutilizáveis
docs/             # referências de a11y (não afeta o build)
```

**Path alias:** `@/*` → `src/*`

### Restrição crítica — SSG (`output: "export"`)

O projeto gera HTML estático puro. São **incompatíveis** com SSG e não devem ser usados:
- `cookies()`, `headers()`, `redirect()` do servidor
- Route Handlers (`route.ts`) com métodos dinâmicos
- ISR / `revalidate` com `fetch`
- `useSearchParams()` sem wrapper `<Suspense>`
- Middleware

Dados devem ser definidos estaticamente no arquivo da rota ou importados de módulos locais.

### Server vs Client Components

Componentes são **Server Components por padrão**. Adicione `"use client"` apenas quando o componente usar hooks React (`useState`, `useEffect`, `usePathname`, etc.). Os componentes atuais com `"use client"`: `Header.tsx` e `ContactForm.tsx`.

### Tailwind CSS 4

A configuração fica em `postcss.config.mjs` — não existe `tailwind.config.js`. Classes de acessibilidade relevantes no projeto: `sr-only`, `focus:not-sr-only`, `focus:ring-*`, `focus:ring-offset-*`.

---

## Convenções de acessibilidade

Este projeto é didático — **cada decisão de a11y deve ser comentada**.

**Formato de comentário pedagógico:**
```tsx
// ♿ A11Y — LIÇÃO N: Título da lição
// Explicação do porquê, quando usar e referência ao critério WCAG.
```

**Docs de referência:**
- `docs/a11y-cookbook.md` — referência completa (WCAG, VoiceOver, TalkBack, cheat sheet)
- `docs/mapa-de-licoes.md` — tabela componente → conceito → seção do cookbook
- `docs/leitura-atomica.md` — técnicas para leitura atômica em leitores de tela

Consulte o cookbook antes de escolher a técnica de a11y. Ao adicionar novos exemplos, atualize `docs/mapa-de-licoes.md`.

---

## Adicionando conteúdo

**Nova página de exemplo:** criar em `src/app/exemplos/<nome>/page.tsx`. Exportar `metadata` com `title` e `description`. Usar `<Header />` e `<Footer />`, com `<main id="main-content" tabIndex={-1}>` como raiz do conteúdo.

**Novo componente:** criar em `src/components/`. Se usar hooks, adicionar `"use client"` no topo. Seguir o padrão de comentários `♿ A11Y`.

**Imagens externas:** o único domínio permitido em `next/image` é `images.unsplash.com`. Para outros domínios, adicionar em `remotePatterns` no `next.config.ts`.
