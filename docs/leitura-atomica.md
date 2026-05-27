# Leitura Atômica — Referência Rápida

> Técnicas para fazer um leitor de tela ler um item de lista como **uma única fala**, sem fragmentar ícone, título e descrição em anúncios separados.
>
> **Exemplo ao vivo:** `http://localhost:3000/exemplos/leitura-atomica`
> **Código:** `src/app/exemplos/leitura-atomica/page.tsx`
> **Cookbook relacionado:** [§2 — Conteúdo Agrupado](./a11y-cookbook.md#2-conteúdo-agrupado-para-leitores-de-tela)

---

## O problema

Dado este JSON:

```json
{
  "failure": [
    {
      "id": "f1",
      "icon": "❌",
      "title": "Cartão recusado",
      "description": "O cartão final 4242 foi recusado. Tente outro meio de pagamento."
    }
  ]
}
```

Uma renderização ingênua produz leitura fragmentada:

```tsx
// ❌ O leitor de tela lê 3 coisas separadas ao navegar por Tab:
<li>
  <span>❌</span>                          {/* anúncio 1 */}
  <strong>Cartão recusado</strong>          {/* anúncio 2 */}
  <p>O cartão final 4242 foi recusado...</p> {/* anúncio 3 */}
</li>
```

Para itens de erro/falha, isso é péssimo — o usuário precisa de 3 pressionamentos de Tab para entender um único status crítico.

---

## Técnica 1 — `aria-label` no container

**Compatibilidade:** ✅ Universal (NVDA · JAWS · VoiceOver · TalkBack · Narrator)

```tsx
// O aria-label SUBSTITUI a leitura de todos os filhos.
// Filhos devem ter aria-hidden="true" para evitar duplicação.

<li aria-label={`Falha: ${item.title}. ${item.description}`}>
  <span aria-hidden="true">{item.icon}</span>
  <strong aria-hidden="true">{item.title}</strong>
  <p aria-hidden="true">{item.description}</p>
</li>

// Leitor anuncia: "Falha: Cartão recusado. O cartão final 4242 foi recusado.
//                  Tente outro meio de pagamento. Item de lista."
```

**Quando usar:** conteúdo estático com texto simples (sem HTML semântico interno que precise ser preservado).

**Limitação:** o `aria-label` é plain text — não suporta formatação interna. Se mudar o conteúdo dos filhos, precisa atualizar o aria-label manualmente.

---

## Técnica 2 — `sr-only` + `aria-hidden` no visual

**Compatibilidade:** ✅ Universal (NVDA · JAWS · VoiceOver · TalkBack · Narrator)

```tsx
// Duas camadas completamente separadas:
//   sr-only → só o leitor de tela vê
//   aria-hidden → só a tela vê

<li>
  {/* Camada acessível: invisível na tela, lida pelo leitor */}
  <span className="sr-only">
    Falha: {item.title}. {item.description}
  </span>

  {/* Camada visual: visível na tela, ignorada pelo leitor */}
  <div aria-hidden="true" className="flex items-start gap-3">
    <span>{item.icon}</span>
    <div>
      <strong>{item.title}</strong>
      <p>{item.description}</p>
    </div>
  </div>
</li>

// Leitor anuncia: "Falha: Cartão recusado. O cartão final 4242 foi recusado.
//                  Tente outro meio de pagamento. Item de lista."
```

**Quando usar:** quando o texto acessível precisa ser diferente do visual (ex: traduzir siglas, adicionar contexto, formatar valores monetários por extenso).

**Vantagem sobre Técnica 1:** o `sr-only` pode ter HTML semântico interno; o `aria-label` não.

---

## Técnica 3 — `role="text"` (VoiceOver-first)

**Compatibilidade:** ⚠️ Parcial — VoiceOver ✅ · TalkBack ✅ · NVDA ⚠️ · JAWS ⚠️ · Narrator ❌

```tsx
// role="text" instrui o VoiceOver/TalkBack a tratar o elemento e filhos
// como um único nó de texto — sem divisões internas.
// NÃO é parte da especificação ARIA oficial.

<li>
  <div role="text" className="flex items-start gap-3">
    {/* Sem aria-hidden nos filhos — fazem parte do "texto" */}
    {/* Adicione espaços explícitos para concatenação natural */}
    <span>{item.icon}{" "}</span>
    <div>
      <strong>{"Falha: "}{item.title}{". "}</strong>
      <p>{item.description}</p>
    </div>
  </div>
</li>

// VoiceOver anuncia: "Falha: Cartão recusado. O cartão final 4242 foi recusado.
//                     Tente outro meio de pagamento. Item de lista."
// NVDA: lê os filhos separadamente (degradação graciosa — não quebra)
```

**Quando usar:** como camada complementar para VoiceOver/TalkBack, junto com Técnica 1 ou 2 como base universal.

**Nunca use isoladamente** — NVDA e Narrator não suportam.

---

## Recomendação: combinar Técnica 2 + Técnica 3

Para máxima compatibilidade em itens críticos:

```tsx
<li>
  {/* Técnica 2: garante NVDA · JAWS · Narrator */}
  <span className="sr-only">
    Falha: {item.title}. {item.description}
  </span>

  {/* Técnica 3: garante VoiceOver · TalkBack lendo o visual */}
  <div role="text" aria-hidden="true" className="flex items-start gap-3">
    <span>{item.icon}{" "}</span>
    <div>
      <strong>{"Falha: "}{item.title}{". "}</strong>
      <p>{item.description}</p>
    </div>
  </div>
</li>
```

**O que acontece em cada leitor:**
- NVDA/JAWS/Narrator → lê o `sr-only` (ignora `aria-hidden`)
- VoiceOver/TalkBack → lê o `role="text"` visual (trata como texto único)
- Todos recebem leitura atômica pelo caminho mais compatível

---

## Quando você NÃO precisa de leitura atômica

Para itens de **sucesso** e **pendência** (status não-críticos), a leitura fragmentada padrão é aceitável. O usuário consegue absorver o estado aos poucos sem prejuízo.

Reserve as técnicas atômicas para:
- ❌ Erros e falhas que exigem ação imediata
- ⚠️ Alertas de segurança
- 💰 Valores monetários compostos (saldo, preço com desconto)
- 🔔 Notificações críticas

---

## Comparativo rápido

| Técnica | Filhos precisam de `aria-hidden`? | Suporta HTML semântico interno? | Compatibilidade |
|---|---|---|---|
| `aria-label` no container | ✅ Sim | ❌ Não (plain text) | Universal |
| `sr-only` + `aria-hidden` | ✅ Sim (no wrapper) | ✅ Sim | Universal |
| `role="text"` | ❌ Não | ✅ Sim | Parcial |
| Técnica 2 + 3 combinadas | Parcialmente | ✅ Sim | Universal + melhor UX |

---

*Veja também: [§2 do cookbook](./a11y-cookbook.md#2-conteúdo-agrupado-para-leitores-de-tela) · [§13 VoiceOver vs TalkBack](./a11y-cookbook.md#13-voiceover-vs-talkback--comparação)*
