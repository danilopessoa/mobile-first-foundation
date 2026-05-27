# Mapa de Lições — O que cada arquivo ensina

Este documento conecta cada **arquivo do projeto** ao **conceito de a11y** que ele demonstra
e à **seção do cookbook** onde aprofundar o tema.

---

## Como usar este mapa

1. Você tem dúvida sobre um conceito → ache na tabela → abra o arquivo + a seção do cookbook
2. Você quer revisar um padrão antes de aplicar em projeto real → leia o cookbook diretamente
3. Você quer ver o padrão funcionando → rode `npm run dev` e abra a página correspondente

---

## Arquivos do projeto

### `src/app/layout.tsx`

| Conceito | Atributo/Técnica | Cookbook |
|---|---|---|
| Idioma da página | `lang="pt-BR"` no `<html>` | [§1 WCAG 3.1.1][wcag311] |
| Título descritivo por página | `metadata.title` com `template` | [§1 WCAG 2.4.2][wcag242] |
| Skip Link (pular navegação) | `<a href="#main-content">` com `sr-only focus:not-sr-only` | [§10 Skip Link][s10] |
| SSG e impacto em a11y | `output: "export"` no `next.config.ts` | — |

**Lição central:** as 3 primeiras coisas de qualquer página acessível são `lang`, `<title>` e o skip link.

---

### `src/components/Header.tsx`

| Conceito | Atributo/Técnica | Cookbook |
|---|---|---|
| HTML Semântico | `<header>`, `<nav>` em vez de `<div>` | [§10 Landmarks][s10] |
| Diferenciar múltiplos `<nav>` | `aria-label="Navegação principal"` | [§10 Landmarks][s10] |
| Botão de menu (hamburger) | `aria-expanded`, `aria-controls`, `aria-label` | [§14 Cheat Sheet][s14] |
| Link ativo na navegação | `aria-current="page"` | [§14 Cheat Sheet][s14] |
| Ícone decorativo em botão | `aria-hidden="true"` no `<svg>` | [§7 Ícones SVG][s7] |
| Esconder menu sem `display:none` | Condicional React (remove do DOM) | [§2 Técnica sr-only][s2] |

**Lição central:** landmarks + `aria-label` em navs múltiplos + botões com estado (`aria-expanded`).

---

### `src/components/HeroSection.tsx`

| Conceito | Atributo/Técnica | Cookbook |
|---|---|---|
| Imagem informativa | `alt="descrição relevante"` | [§7 Categorias de imagens][s7] |
| Nomeando seções | `aria-labelledby="id-do-h2"` na `<section>` | [§10 Landmarks][s10] |
| Hierarquia de headings | Único `<h1>` por página, `h2` para subseções | [§1 WCAG 2.4.6][s1] |
| Descrição complementar | `aria-describedby="id-do-paragrafo"` | [§14 Cheat Sheet][s14] |
| Contraste de cores | blue-100 em blue-900 → ~9.8:1 ✅ | [§8 Contraste][s8] |

**Lição central:** `aria-labelledby` para nomear regiões reutilizando texto já visível na tela.

---

### `src/components/ProductCard.tsx`

| Conceito | Atributo/Técnica | Cookbook |
|---|---|---|
| `<article>` com nome acessível | `aria-labelledby="product-heading-{id}"` | [§10 Landmarks][s10] |
| Avaliações com estrelas | `sr-only` para o texto, `aria-hidden` nas estrelas visuais | [§2 Técnica sr-only][s2] |
| Badge de desconto | `aria-label="30% de desconto"` no container | [§7 Imagens][s7] |
| Botões únicos e descritivos | `aria-label="Adicionar Fone Bluetooth Premium ao carrinho"` | [§14 Cheat Sheet][s14] |
| Preço com contexto | `aria-label="Preço atual: R$ 89,90"` + `aria-hidden` no visual | [§2 Saldo bancário][s2] |
| Preço riscado | `<del aria-label="Preço original: R$ 149,90">` | [§9 Listas][s9] |

**Lição central:** botões com `aria-label` únicos (não 12x "Adicionar ao carrinho") + sr-only para avaliações.

---

### `src/components/ContactForm.tsx`

| Conceito | Atributo/Técnica | Cookbook |
|---|---|---|
| `<label>` vinculado ao `<input>` | `htmlFor="id"` + `id="id"` | [§3 As 4 formas de nomear][s3] |
| Campo obrigatório | `aria-required="true"` | [§3 Formulário completo][s3] |
| Estado de erro | `aria-invalid="true"` após validação | [§4 Estado de erro][s4] |
| Mensagem de erro vinculada | `aria-errormessage="id-do-span-de-erro"` | [§4 Estado de erro][s4] |
| Instrução permanente | `aria-describedby="id-da-dica"` | [§3 Formulários][s3] |
| Erros anunciados ao aparecer | `role="alert"` no span de erro | [§4 role="alert"][s4] |
| Mensagem de sucesso | `role="alert"` no container de sucesso | [§4 Confirmação de sucesso][s4] |
| Botão em estado de loading | `aria-busy={true}` | [§14 Cheat Sheet][s14] |
| Input nativo vs customizado | `<select>` nativo preferido ao custom | [§3 Formulários][s3] |
| Foco no primeiro erro | `document.getElementById(id).focus()` após submit | [§6 Gerenciamento de foco][s6] |

**Lição central:** o trio `aria-required` + `aria-invalid` + `aria-errormessage` é o padrão para qualquer campo com validação.

---

### `src/components/Footer.tsx`

| Conceito | Atributo/Técnica | Cookbook |
|---|---|---|
| Segundo `<nav>` | `aria-label="Navegação do rodapé"` | [§10 Landmarks][s10] |
| Links externos | `target="_blank"` + `sr-only "(abre em nova janela)"` | [§7 Mídia][s7] |
| Data semântica | `<time dateTime="2025">` | — |
| Emoji decorativo | `aria-hidden="true"` | [§7 Ícones SVG][s7] |

---

### `src/app/page.tsx`

| Conceito | Atributo/Técnica | Cookbook |
|---|---|---|
| Estrutura landmark completa | `<main id="main-content" tabIndex={-1}>` | [§10 Estrutura completa][s10] |
| Lista de produtos | `<ul role="list">` — garante semântica mesmo com CSS reset | [§9 Listas][s9] |
| Seções nomeadas | `<section aria-labelledby="id-do-h2">` | [§10 Landmarks][s10] |

---

### `src/app/exemplos/leitura-atomica/page.tsx`

Documentado em detalhe em [`docs/leitura-atomica.md`](./leitura-atomica.md).

| Conceito | Atributo/Técnica | Cookbook |
|---|---|---|
| Leitura fragmentada (problema) | Sem técnica — cada filho lido separado | [§2 Problema clássico][s2] |
| Leitura atômica — Técnica 1 | `aria-label` no container + `aria-hidden` nos filhos | [§2 Técnica 3 — aria-label][s2] |
| Leitura atômica — Técnica 2 | `sr-only` + `aria-hidden` no wrapper visual | [§2 Técnica 1 — sr-only][s2] |
| Leitura atômica — Técnica 3 | `role="text"` (VoiceOver/TalkBack) | [§13 VoiceOver vs TalkBack][s13] |
| Tabela acessível | `<caption>`, `<th scope="col">`, `<th scope="row">` | [§9 Tabelas][s9] |

---

## Referências cruzadas — por critério WCAG

| Critério | Nível | Descrição | Arquivo no projeto |
|---|---|---|---|
| 1.1.1 | A | Texto alternativo em imagens | `HeroSection.tsx`, `ProductCard.tsx` |
| 1.3.1 | A | Info e relacionamentos | Todos os arquivos |
| 1.4.3 | AA | Contraste mínimo 4.5:1 | `HeroSection.tsx`, `globals.css` |
| 2.1.1 | A | Tudo navegável por teclado | `Header.tsx`, `ContactForm.tsx` |
| 2.4.1 | A | Skip link (bypass blocks) | `layout.tsx` |
| 2.4.2 | A | Página com título | `layout.tsx` |
| 2.4.6 | AA | Headings e labels descritivos | `HeroSection.tsx`, `ContactForm.tsx` |
| 2.4.7 | AA | Foco visível | Todos (classes `focus:ring-*`) |
| 3.1.1 | A | Idioma da página | `layout.tsx` |
| 3.3.1 | A | Identificação de erros | `ContactForm.tsx` |
| 3.3.2 | A | Rótulos e instruções | `ContactForm.tsx` |
| 4.1.2 | A | Nome, função, valor | `Header.tsx`, `ProductCard.tsx` |
| 4.1.3 | AA | Mensagens de status | `ContactForm.tsx` |

---

<!-- Links internos para as seções do cookbook -->
[s1]: ./a11y-cookbook.md#1-visão-geral-de-acessibilidade-web
[s2]: ./a11y-cookbook.md#2-conteúdo-agrupado-para-leitores-de-tela
[s3]: ./a11y-cookbook.md#3-formulários-acessíveis
[s4]: ./a11y-cookbook.md#4-erros-validação-e-feedback
[s5]: ./a11y-cookbook.md#5-aria-live--regiões-dinâmicas
[s6]: ./a11y-cookbook.md#6-gerenciamento-de-foco
[s7]: ./a11y-cookbook.md#7-imagens-ícones-e-mídia
[s8]: ./a11y-cookbook.md#8-cor-contraste-e-informação-visual
[s9]: ./a11y-cookbook.md#9-tabelas-e-listas-de-dados
[s10]: ./a11y-cookbook.md#10-landmarks-e-navegação
[s13]: ./a11y-cookbook.md#13-voiceover-vs-talkback--comparação
[s14]: ./a11y-cookbook.md#14-cheat-sheet-completo
[wcag311]: https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html
[wcag242]: https://www.w3.org/WAI/WCAG21/Understanding/page-titled.html
