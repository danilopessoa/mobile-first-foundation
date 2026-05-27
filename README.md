# Mobile-First Foundation — A11Y na Prática

Projeto de aprendizado focado em **acessibilidade web (a11y)** e **mobile-first**.  
Construído com Next.js 16 · App Router · Tailwind CSS · SSG (`output: "export"`).

> **Objetivo:** entender na prática os atributos ARIA, HTML semântico e técnicas de acessibilidade — com código comentado linha a linha e exemplos funcionais que podem ser replicados em projetos reais.

---

## Início rápido

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # gera HTML estático em /out
```

---

## Páginas

| Rota | O que demonstra |
|---|---|
| `/` | Estrutura completa de página acessível — skip link, landmarks, cards, formulário |
| `/exemplos/leitura-atomica` | 3 técnicas para fazer o leitor de tela ler um item de lista como uma fala única |

---

## Estrutura do projeto

```
src/
├── app/
│   ├── layout.tsx                   # lang, skip link, <title> por página
│   ├── page.tsx                     # estrutura landmark completa
│   └── exemplos/
│       └── leitura-atomica/
│           └── page.tsx             # aria-label · sr-only · role="text"
└── components/
    ├── Header.tsx                   # nav, aria-label, aria-current, aria-expanded
    ├── HeroSection.tsx              # alt em imagens, aria-labelledby, contraste
    ├── ProductCard.tsx              # aria-hidden, sr-only, botões descritivos
    ├── ContactForm.tsx              # labels, aria-required/invalid/errormessage
    └── Footer.tsx                   # segunda nav, links externos, <time>

docs/
├── a11y-cookbook.md                 # referência completa: WCAG · VoiceOver · TalkBack
├── mapa-de-licoes.md                # componente → conceito → seção do cookbook
└── leitura-atomica.md               # técnicas de leitura atômica (referência isolada)
```

---

## Documentação

### 📖 [`docs/a11y-cookbook.md`](docs/a11y-cookbook.md)
Referência completa de acessibilidade web. Cobre WCAG 2.1 AA, formulários, erros, `aria-live`, gerenciamento de foco, imagens, contraste, tabelas, landmarks, gestos do **VoiceOver iOS** e **TalkBack Android**, e um cheat sheet com todos os atributos ARIA.  
→ *Use como consulta rápida antes de implementar qualquer componente.*

### 🗺️ [`docs/mapa-de-licoes.md`](docs/mapa-de-licoes.md)
Tabela que conecta cada arquivo do projeto ao conceito de a11y que ele demonstra e à seção correspondente no cookbook. Inclui mapeamento por critério WCAG.  
→ *Use para encontrar o código certo quando tiver uma dúvida específica.*

### ⚛️ [`docs/leitura-atomica.md`](docs/leitura-atomica.md)
Referência isolada das 3 técnicas para leitura atômica — item de lista lido como fala única. Com snippets prontos para copiar e tabela de compatibilidade por leitor de tela.  
→ *Use quando precisar aplicar a técnica em um projeto real.*

---

## O que está comentado no código

Cada arquivo contém comentários pedagógicos identificados com `♿ A11Y — LIÇÃO N:`.  
Ordem recomendada de leitura:

1. `layout.tsx` — Lições 1–4 (lang, title, skip link, SSG)
2. `Header.tsx` — Lições 5–8 (semântica, aria-label, aria-expanded, aria-current)
3. `HeroSection.tsx` — Lições 9–12 (alt, aria-labelledby, aria-describedby, contraste)
4. `ProductCard.tsx` — Lições 13–16 (article, avaliações, aria-hidden, botões únicos)
5. `ContactForm.tsx` — Lições 17–20 (label, aria-required, aria-invalid, aria-errormessage)
6. `Footer.tsx` — Lição 21 (footer, segunda nav, links externos)
7. `page.tsx` — Lição 22 (estrutura completa, role="list")
8. `exemplos/leitura-atomica/page.tsx` — Lição avançada (3 técnicas atômicas)

---

## Conceitos cobertos

| Atributo / Técnica | Onde ver no projeto |
|---|---|
| `lang="pt-BR"` | `layout.tsx` |
| Skip link | `layout.tsx` |
| `aria-label` | `Header.tsx`, `ProductCard.tsx`, `ContactForm.tsx` |
| `aria-labelledby` | `HeroSection.tsx`, `page.tsx` |
| `aria-describedby` | `HeroSection.tsx`, `ContactForm.tsx` |
| `aria-current="page"` | `Header.tsx` |
| `aria-expanded` + `aria-controls` | `Header.tsx` |
| `aria-hidden="true"` | `Header.tsx`, `ProductCard.tsx`, `Footer.tsx` |
| `sr-only` (Tailwind) | `ProductCard.tsx`, `exemplos/leitura-atomica` |
| `alt` em imagens | `HeroSection.tsx`, `ProductCard.tsx` |
| `aria-required` | `ContactForm.tsx` |
| `aria-invalid` | `ContactForm.tsx` |
| `aria-errormessage` | `ContactForm.tsx` |
| `role="alert"` | `ContactForm.tsx` |
| `aria-busy` | `ContactForm.tsx` |
| `role="list"` | `page.tsx`, `Header.tsx` |
| `<article>` com nome acessível | `ProductCard.tsx` |
| `<table>` com `caption` e `scope` | `exemplos/leitura-atomica` |
| `role="text"` (VoiceOver) | `exemplos/leitura-atomica` |
| `<time dateTime>` | `Footer.tsx` |

---

## Ferramentas recomendadas para testar

| Ferramenta | Como usar |
|---|---|
| **Tab** no teclado | Navegue pela página sem mouse — tudo deve ser alcançável e visível |
| **VoiceOver** (Mac) | `Cmd+F5` → `Ctrl+Option+→` para navegar elemento por elemento |
| **VoiceOver** (iOS) | Ajustes → Acessibilidade → VoiceOver — gestos no [cookbook §11](docs/a11y-cookbook.md#11-voiceover-ios-1872) |
| **TalkBack** (Android) | Configurações → Acessibilidade → TalkBack — gestos no [cookbook §12](docs/a11y-cookbook.md#12-talkback-android-151) |
| **Axe DevTools** | Extensão Chrome — auditoria automática de a11y |
| **Chrome DevTools** | F12 → Elements → Accessibility → ver árvore de acessibilidade |
| **WebAIM Contrast Checker** | [webaim.org/resources/contrastchecker](https://webaim.org/resources/contrastchecker/) |

---

## Stack

- [Next.js 16](https://nextjs.org/docs) — App Router, SSG (`output: "export"`)
- [Tailwind CSS 4](https://tailwindcss.com/docs) — incluindo `sr-only`, `focus:ring-*`, `focus:not-sr-only`
- [TypeScript](https://www.typescriptlang.org/)
- WCAG 2.1 AA — padrão de referência para acessibilidade
