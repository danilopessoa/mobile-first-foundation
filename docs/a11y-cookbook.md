# A11Y Cookbook — Acessibilidade Web
> WCAG 2.1 AA · LBI 13.146/2015 · VoiceOver 18.7.2 · TalkBack 15.1

---

## Índice

1. [Visão Geral de Acessibilidade Web](#1-visão-geral-de-acessibilidade-web)
2. [Conteúdo Agrupado para Leitores de Tela](#2-conteúdo-agrupado-para-leitores-de-tela)
3. [Formulários Acessíveis](#3-formulários-acessíveis)
4. [Erros, Validação e Feedback](#4-erros-validação-e-feedback)
5. [aria-live — Regiões Dinâmicas](#5-aria-live--regiões-dinâmicas)
6. [Gerenciamento de Foco](#6-gerenciamento-de-foco)
7. [Imagens, Ícones e Mídia](#7-imagens-ícones-e-mídia)
8. [Cor, Contraste e Informação Visual](#8-cor-contraste-e-informação-visual)
9. [Tabelas e Listas de Dados](#9-tabelas-e-listas-de-dados)
10. [Landmarks e Navegação](#10-landmarks-e-navegação)
11. [VoiceOver iOS 18.7.2](#11-voiceover-ios-1872)
12. [TalkBack Android 15.1](#12-talkback-android-151)
13. [VoiceOver vs TalkBack — Comparação](#13-voiceover-vs-talkback--comparação)
14. [Cheat Sheet Completo](#14-cheat-sheet-completo)

---

## 1. Visão Geral de Acessibilidade Web

Acessibilidade web significa que pessoas com deficiência visual, auditiva, motora ou cognitiva conseguem perceber, entender, navegar e interagir com interfaces digitais de forma equivalente a qualquer outro usuário.

### Tipos de deficiência e impacto

| Tipo | Exemplos | Tecnologia assistiva |
|------|----------|----------------------|
| 👁️ Visual | Cegueira, baixa visão, daltonismo | Leitor de tela, ampliador de tela |
| 👂 Auditiva | Surdez, perda parcial | Legendas, transcrições |
| 🤚 Motora | Paralisia, tremor, ausência de membros | Teclado, switch access |
| 🧠 Cognitiva | Dislexia, TDAH, autismo | Linguagem simples, estrutura clara |

### Critérios WCAG 2.1 mais cobrados em apps bancários

| Critério | Nível | Título | Descrição |
|----------|-------|--------|-----------|
| 1.1.1 | A | Conteúdo não-textual | Imagens precisam de texto alternativo |
| 1.3.1 | A | Info e Relacionamentos | Estrutura visual deve ser programática |
| 1.3.3 | A | Características sensoriais | Não depender só de forma/cor/posição |
| 1.4.1 | A | Uso de cor | Cor não pode ser único meio de informação |
| 1.4.3 | AA | Contraste (mínimo) | 4,5:1 texto normal · 3:1 texto grande |
| 1.4.4 | AA | Redimensionamento de texto | 200% sem perda de conteúdo |
| 2.1.1 | A | Teclado | Tudo navegável por teclado |
| 2.4.1 | A | Ignorar blocos | Skip link para conteúdo principal |
| 2.4.3 | A | Ordem do foco | Foco em sequência lógica |
| 2.4.7 | AA | Foco visível | Indicador de foco sempre visível |
| 3.3.1 | A | Identificação do erro | Erros identificados em texto |
| 3.3.2 | A | Rótulos e instruções | Campos com labels descritivos |
| 4.1.2 | A | Nome, função, valor | Componentes com semântica completa |
| 4.1.3 | AA | Mensagens de status | Atualizações anunciadas sem mover foco |

> ⚠️ **Lei Brasileira de Inclusão (LBI — 13.146/2015) + eMAG:** Apps financeiros são obrigados a oferecer acessibilidade digital. Bancos que descumprem respondem ao Banco Central e ao PROCON. O padrão de referência é WCAG 2.1 nível **AA**.

---

## 2. Conteúdo Agrupado para Leitores de Tela

Textos visualmente fragmentados precisam ser reunidos com contexto para quem não enxerga a tela.

### O problema clássico — saldo bancário

❌ **O que o leitor de tela ouve sem acessibilidade:**
> "R$" ... "1.234" ... "," ... "56" ... "disponível"

✅ **O que deveria ouvir:**
> "Saldo disponível: mil duzentos e trinta e quatro reais e cinquenta e seis centavos"

---

### Técnica 1 — Classe `.sr-only` (visually hidden)

Esconde visualmente, mas mantém acessível. Padrão da indústria — presente no Tailwind, Bootstrap e GOV.BR.

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* ⚠️ NUNCA use display:none ou visibility:hidden
   — esses também ocultam do leitor de tela */
```

#### Saldo — `aria-hidden` no visual + `sr-only` no texto

```html
<!-- Parte visual: oculta do leitor de tela -->
<div class="saldo" aria-hidden="true">
  <span class="moeda">R$</span>
  <span class="inteiro">1.234</span>
  <span class="sep">,</span>
  <span class="centavos">56</span>
</div>

<!-- Parte acessível: invisível visualmente, lida pelo leitor -->
<span class="sr-only">
  Saldo disponível: mil duzentos e trinta e quatro reais e cinquenta e seis centavos
</span>
```

#### Lista de transações com contexto completo

```html
<ul role="list" aria-label="Últimas transações">
  <li>
    <!-- Visual decorativo: oculto do leitor -->
    <div aria-hidden="true" class="tx-visual">
      <img src="pix.svg" alt="" />
      <span class="nome">Pix recebido</span>
      <span class="data">hoje, 14h32</span>
      <span class="valor verde">+R$ 150,00</span>
    </div>

    <!-- Frase completa para o leitor de tela -->
    <span class="sr-only">
      Pix recebido de João Silva. Hoje às 14h32.
      Valor creditado: cento e cinquenta reais.
    </span>
  </li>

  <li>
    <div aria-hidden="true" class="tx-visual">
      <img src="debito.svg" alt="" />
      <span class="nome">Supermercado Extra</span>
      <span class="data">ontem</span>
      <span class="valor vermelho">-R$ 87,40</span>
    </div>
    <span class="sr-only">
      Compra no débito. Supermercado Extra. Ontem.
      Valor debitado: oitenta e sete reais e quarenta centavos.
    </span>
  </li>
</ul>
```

---

### Técnica 2 — `aria-labelledby` composto

Concatena textos de múltiplos elementos existentes sem duplicar conteúdo no DOM.

```html
<!-- IDs referenciados são lidos em sequência -->
<div role="group" aria-labelledby="tx-tipo tx-dest tx-valor tx-data">
  <span id="tx-tipo">Transferência enviada</span>
  <span id="tx-dest">para Maria Souza</span>
  <span id="tx-valor">R$ 500,00</span>
  <span id="tx-data">12/05/2025</span>
</div>
<!-- Leitor: "Transferência enviada para Maria Souza R$ 500,00 12/05/2025" -->
```

---

### Técnica 3 — `aria-label` no container

```html
<!-- O aria-label substitui TODO o conteúdo interno para o leitor -->
<div
  role="region"
  aria-label="Cartão Nubank Mastercard Gold, final 4521,
    limite de três mil reais, dois mil disponíveis"
>
  <!-- conteúdo visual fragmentado — leitor vai ignorar tudo isso -->
  <span aria-hidden="true">●●●● ●●●● ●●●● 4521</span>
  <img src="mastercard.svg" alt="" aria-hidden="true" />
  <span aria-hidden="true">Limite R$ 3.000 / Disponível R$ 2.000</span>
</div>
```

> 🔊 **Regra de ouro:** se o conteúdo visual depende de posição, ícone, cor ou separação entre elementos para ter significado, você precisa de um texto alternativo que comunique esse significado em linguagem natural.

---

## 3. Formulários Acessíveis

Labels, fieldsets, hints e validação — cada campo precisa de semântica completa.

### As 4 formas de nomear um campo

```html
<!-- 1. label explícito — melhor prática -->
<label for="cpf">CPF</label>
<input type="text" id="cpf" name="cpf"
  inputmode="numeric" maxlength="14" />

<!-- 2. aria-label — quando não há label visível -->
<input type="search"
  aria-label="Buscar transação por nome ou valor"
  placeholder="Buscar..." />

<!-- 3. aria-labelledby — reutilizando texto do DOM -->
<h2 id="secao-pix">Transferência via Pix</h2>
<input type="text" aria-labelledby="secao-pix dica-chave" />
<span id="dica-chave">Chave CPF, e-mail ou telefone</span>

<!-- 4. label implícito (envolvendo o input) -->
<label>
  Valor a transferir
  <input type="number" name="valor" min="0.01" />
</label>
```

---

### Formulário de login bancário completo

```html
<main>
  <h1>Acesso à conta</h1>

  <fieldset>
    <legend>Dados de acesso</legend>

    <div class="campo">
      <label for="agencia">
        Agência
        <span aria-hidden="true"> *</span>
      </label>
      <input
        type="text" id="agencia" name="agencia"
        inputmode="numeric" maxlength="4"
        autocomplete="off"
        aria-required="true"
        aria-describedby="agencia-hint"
      />
      <span id="agencia-hint" class="hint">
        4 dígitos, sem o dígito verificador
      </span>
    </div>

    <div class="campo">
      <label for="senha">Senha eletrônica <span aria-hidden="true">*</span></label>
      <input
        type="password" id="senha" name="senha"
        autocomplete="current-password"
        aria-required="true"
        aria-describedby="senha-hint"
      />
      <span id="senha-hint" class="hint">Entre 6 e 8 dígitos numéricos</span>

      <!-- Botão mostrar/ocultar senha -->
      <button
        type="button"
        id="toggle-senha"
        aria-pressed="false"
        aria-controls="senha"
        aria-label="Mostrar senha"
      >
        <img src="olho.svg" alt="" aria-hidden="true" />
      </button>
    </div>
  </fieldset>

  <button type="submit">Entrar na conta</button>
</main>
```

---

### Token OTP / Senha de dígitos separados

```html
<fieldset>
  <legend>Token de confirmação</legend>
  <p id="otp-desc">
    Digite os 6 dígitos enviados para o seu celular (**) *****-7890
  </p>

  <!-- Opção A: input único (MAIS acessível) -->
  <input
    type="text" inputmode="numeric"
    pattern="[0-9]{6}" maxlength="6"
    autocomplete="one-time-code"
    aria-label="Token de 6 dígitos"
    aria-describedby="otp-desc"
  />

  <!-- Opção B: inputs separados (visual mais bonito) -->
  <div role="group" aria-describedby="otp-desc" aria-label="Token de 6 dígitos">
    <input type="text" inputmode="numeric" maxlength="1" aria-label="1º dígito" />
    <input type="text" inputmode="numeric" maxlength="1" aria-label="2º dígito" />
    <input type="text" inputmode="numeric" maxlength="1" aria-label="3º dígito" />
    <input type="text" inputmode="numeric" maxlength="1" aria-label="4º dígito" />
    <input type="text" inputmode="numeric" maxlength="1" aria-label="5º dígito" />
    <input type="text" inputmode="numeric" maxlength="1" aria-label="6º dígito" />
  </div>
</fieldset>
```

---

### Seleção de tipo (radio group)

```html
<!-- fieldset + legend é OBRIGATÓRIO para radio groups -->
<fieldset>
  <legend>Tipo de transferência</legend>

  <label>
    <input type="radio" name="tipo-tx" value="pix" />
    Pix — transferência imediata
  </label>
  <label>
    <input type="radio" name="tipo-tx" value="ted" />
    TED — mesmo dia até 17h
  </label>
  <label>
    <input type="radio" name="tipo-tx" value="doc" />
    DOC — próximo dia útil
  </label>
</fieldset>
```

> ⚠️ **Nunca use só `placeholder` como label!** Desaparece ao digitar, não é lido de forma confiável pelo TalkBack, e tem baixo contraste por padrão (falha no WCAG 1.4.3).

---

## 4. Erros, Validação e Feedback

O usuário precisa saber: **há um erro**, em **qual campo**, e **como corrigir** — tudo via leitor de tela.

### Estado de erro num campo

```html
<div class="campo">
  <label for="cpf">CPF</label>
  <input
    type="text" id="cpf"
    aria-required="true"
    aria-invalid="true"
    aria-describedby="cpf-erro"
    value="123.456.789-0"
  />
  <!-- role="alert" anuncia automaticamente ao aparecer no DOM -->
  <span id="cpf-erro" role="alert">
    CPF inválido. Verifique os dígitos e tente novamente.
  </span>
</div>

<!-- Após correção — remova aria-invalid e role="alert" -->
<input
  type="text" id="cpf"
  aria-required="true"
  aria-invalid="false"
  value="123.456.789-09"
/>
```

---

### Resumo de erros no topo (padrão GOV.BR)

```html
<!-- Exibido após tentativa de submit com erros -->
<div
  role="alert"
  id="resumo-erros"
  tabindex="-1"
  aria-label="Erros no formulário"
>
  <h2>Corrija os erros antes de continuar:</h2>
  <ul>
    <li><a href="#cpf">CPF: formato inválido</a></li>
    <li><a href="#valor">Valor: informe um valor maior que zero</a></li>
  </ul>
</div>

<script>
  formEl.addEventListener('submit', (e) => {
    const erros = validar();
    if (erros.length) {
      e.preventDefault();
      renderizarResumo(erros);
      // Mova o foco para o resumo — o leitor anuncia tudo
      document.getElementById('resumo-erros').focus();
    }
  });
</script>
```

---

### Feedback de saldo insuficiente em tempo real

```html
<div class="campo">
  <label for="valor-tx">Valor da transferência</label>
  <input
    type="text" id="valor-tx"
    inputmode="decimal"
    aria-required="true"
    aria-invalid="true"
    aria-describedby="aviso-saldo"
  />
  <span
    id="aviso-saldo"
    role="alert"
    aria-live="assertive"
  >
    Saldo insuficiente. Seu saldo disponível é R$ 1.200,00.
  </span>
</div>
```

---

### Confirmação de sucesso acessível

```html
<!-- Sucesso: use role="status" (menos intrusivo que alert) -->
<div role="status" aria-live="polite" aria-atomic="true">
  <img src="check.svg" alt="" aria-hidden="true" />
  <p>
    Pix enviado com sucesso!
    <span class="sr-only">
      Transferência de cem reais para João Silva confirmada.
      Comprovante disponível no extrato.
    </span>
  </p>
</div>
```

> 💡 **`aria-live="assertive"` vs `role="alert"`:** Ambos interrompem o leitor imediatamente. Prefira `role="alert"` para mensagens de erro. Use `aria-live="polite"` para confirmações que podem aguardar o leitor terminar de falar.

---

## 5. aria-live — Regiões Dinâmicas

Quando o conteúdo muda sem reload, o leitor precisa ser avisado. `aria-live` é o mecanismo para isso.

### Os três valores e quando usar

| Valor | Comportamento | Use para |
|-------|---------------|----------|
| `"off"` | Não anuncia nada. Padrão. | Conteúdo estático |
| `"polite"` | Aguarda o leitor terminar de falar | Confirmações, saldo atualizado, filtros |
| `"assertive"` | Interrompe o leitor imediatamente | Erros críticos, sessão expirando |

---

### Padrão correto — container vazio no DOM desde o início

```html
<!-- ✅ Container vazio presente desde o carregamento da página -->
<div
  id="live-status"
  aria-live="polite"
  aria-atomic="true"
  class="sr-only"
></div>

<script>
  // Injete texto no container — o leitor anuncia quando mudar
  function anunciar(msg) {
    const el = document.getElementById('live-status');
    el.textContent = '';                   // limpa primeiro
    requestAnimationFrame(() => {          // garante que a mudança seja detectada
      el.textContent = msg;
    });
  }

  anunciar('Pix de R$ 500,00 enviado para Maria Santos com sucesso.');
  anunciar('Erro: chave Pix não encontrada. Verifique e tente novamente.');
</script>

<!-- ❌ NÃO crie o container dinamicamente — o leitor não o registra -->
<script>
  const div = document.createElement('div');
  div.setAttribute('aria-live', 'polite'); // tarde demais
  document.body.appendChild(div);
</script>
```

---

### `aria-atomic` e `aria-relevant`

```html
<!-- aria-atomic="true": lê o bloco inteiro, mesmo que só parte mudou -->
<!-- Útil para: placar, saldo, cronômetro -->
<div aria-live="polite" aria-atomic="true">
  <span>Saldo: </span>
  <span id="valor-saldo">R$ 2.312,60</span>
</div>

<!-- aria-atomic="false" (padrão): lê apenas o que mudou -->
<!-- Útil para: chat, log de transações -->
<ul aria-live="polite" aria-atomic="false" aria-relevant="additions">
  <!-- Novos itens adicionados aqui são anunciados individualmente -->
</ul>

<!-- aria-relevant controla o que dispara o anúncio -->
<!-- Valores: "additions" | "removals" | "text" | "all" -->
<div aria-live="polite" aria-relevant="additions text">
  <!-- Anuncia quando algo é adicionado ou texto muda -->
</div>
```

---

### Timer de sessão bancária

```html
<div id="aviso-sessao"   aria-live="polite"    aria-atomic="true" class="sr-only"></div>
<div id="urgente-sessao" aria-live="assertive" aria-atomic="true" class="sr-only"></div>

<script>
  let segundosRestantes = 300; // 5 minutos

  const tick = setInterval(() => {
    segundosRestantes--;

    if (segundosRestantes === 120) {
      // 2 min: polite — espera o leitor terminar
      document.getElementById('aviso-sessao').textContent =
        'Atenção: sua sessão expira em 2 minutos. Deseja continuar conectado?';
    }

    if (segundosRestantes === 30) {
      // 30s: assertive — interrompe imediatamente
      document.getElementById('urgente-sessao').textContent =
        'Sessão expirando em 30 segundos! Salve seus dados agora.';
    }

    if (segundosRestantes <= 0) {
      clearInterval(tick);
      document.getElementById('urgente-sessao').textContent =
        'Sessão encerrada por inatividade. Faça login novamente.';
    }
  }, 1000);
</script>
```

---

## 6. Gerenciamento de Foco

Onde o foco vai após uma ação determina a experiência de quem usa teclado ou leitor de tela.

### Regras de ouro do foco

| Ação | Onde o foco deve ir |
|------|---------------------|
| Abrir modal | Primeiro elemento interativo do modal |
| Fechar modal | Botão que abriu o modal |
| Navegar para nova página (SPA) | `<h1>` da página |
| Exibir erros | Resumo de erros (`role="alert"`) |
| Submit com sucesso | Mensagem de confirmação |
| Modal/drawer aberto | Foco fica preso dentro (focus trap) |

---

### Modal com focus trap completo

```html
<div
  id="modal"
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-titulo"
  aria-describedby="modal-desc"
  tabindex="-1"
>
  <h2 id="modal-titulo">Confirmar transferência</h2>
  <p id="modal-desc">
    Você está enviando R$ 1.000,00 para João da Silva via Pix.
  </p>
  <button id="btn-cancelar">Cancelar</button>
  <button id="btn-confirmar">Confirmar</button>
  <button aria-label="Fechar modal">✕</button>
</div>
```

```js
function abrirModal(triggerEl) {
  const modal = document.getElementById('modal');
  const focaveis = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const primeiro = focaveis[0];
  const ultimo   = focaveis[focaveis.length - 1];

  // Oculta fundo do leitor de tela
  document.getElementById('app').setAttribute('aria-hidden', 'true');

  modal.removeAttribute('hidden');
  modal.focus();

  // Trap: Tab/Shift+Tab ficam dentro do modal
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault(); ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault(); primeiro.focus();
      }
    }
    if (e.key === 'Escape') fecharModal(triggerEl);
  });
}

function fecharModal(triggerEl) {
  const modal = document.getElementById('modal');
  modal.setAttribute('hidden', '');
  document.getElementById('app').removeAttribute('aria-hidden');
  triggerEl.focus(); // devolve foco a quem abriu
}
```

---

### Foco em SPA (React)

```jsx
import { useEffect, useRef } from 'react';

function PaginaExtrato() {
  const headingRef = useRef(null);

  // Ao montar a página, foco vai para o h1
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <main>
      {/* tabindex="-1" permite receber foco programático sem entrar no Tab order */}
      <h1 ref={headingRef} tabIndex={-1} style={{ outline: 'none' }}>
        Extrato da conta
      </h1>
    </main>
  );
}
```

> ℹ️ **`tabIndex="-1"` vs `tabIndex="0"`:** Use `-1` para elementos que recebem foco só programaticamente. Use `0` para adicionar um elemento não-interativo ao fluxo de Tab. **Evite valores positivos** (1, 2, 3...) — quebram a ordem natural de foco.

---

## 7. Imagens, Ícones e Mídia

Todo conteúdo não-textual precisa de equivalente em texto — WCAG 1.1.1 nível A.

### Categorias de imagens e o `alt` correto

```html
<!-- 1. Informativa: descreva o que a imagem comunica -->
<img src="grafico.png"
  alt="Gráfico de linha mostrando crescimento de 12% na carteira em maio de 2025" />

<!-- 2. Decorativa: alt vazio (leitor ignora completamente) -->
<img src="fundo-abstrato.svg" alt="" role="presentation" />

<!-- 3. Funcional (dentro de link/botão): descreva a ação -->
<a href="/extrato">
  <img src="extrato-icone.svg" alt="Ver extrato completo" />
</a>

<!-- 4. Ícone em botão: aria-label no botão, alt="" na imagem -->
<button aria-label="Compartilhar comprovante">
  <img src="share.svg" alt="" aria-hidden="true" />
</button>

<!-- 5. Texto como imagem: replique o texto no alt -->
<img src="banner-taxa.png"
  alt="Taxa zero de IOF em transferências internacionais até 30 de junho" />

<!-- 6. Complexa (gráfico/mapa): forneça descrição longa -->
<figure>
  <img src="grafico-pizza.png"
    alt="Distribuição da carteira"
    aria-describedby="desc-grafico" />
  <figcaption id="desc-grafico">
    Renda fixa 60%, ações 25%, fundos imobiliários 15%.
  </figcaption>
</figure>
```

---

### Ícones SVG inline

```html
<!-- SVG decorativo: aria-hidden -->
<svg aria-hidden="true" focusable="false" width="24" height="24">
  <use href="#icon-pix" />
</svg>

<!-- SVG com significado: título + role -->
<svg role="img" aria-labelledby="svg-titulo" width="100" height="100">
  <title id="svg-titulo">Logo Pix — Banco Central do Brasil</title>
  <path d="..." />
</svg>

<!-- SVG dentro de botão: descreva no botão, não no SVG -->
<button aria-label="Copiar chave Pix">
  <svg aria-hidden="true" focusable="false">
    <use href="#icon-copy" />
  </svg>
</button>
```

---

### Vídeo e áudio

```html
<!-- Vídeo acessível -->
<video controls aria-label="Tutorial: como fazer uma transferência Pix">
  <!-- Legendas obrigatórias para surdos (WCAG 1.2.2 AA) -->
  <track kind="subtitles" src="legenda-pt.vtt" srclang="pt" label="Português" default />
  <!-- Audiodescrição para cegos (WCAG 1.2.5 AA) -->
  <track kind="descriptions" src="audiodesc.vtt" srclang="pt" label="Audiodescrição" />
</video>

<!-- Áudio standalone -->
<audio controls aria-label="Alerta de transação suspeita">
  <source src="alerta.mp3" type="audio/mpeg" />
</audio>
<!-- Sempre forneça transcrição em texto para conteúdo de áudio -->
```

---

## 8. Cor, Contraste e Informação Visual

Cor não pode ser o único meio de transmitir informação — WCAG 1.4.1 e 1.4.3.

### Mínimos de contraste WCAG 2.1 AA

| Tipo de conteúdo | Razão mínima |
|------------------|:------------:|
| Texto normal (< 18pt / < 14pt bold) | **4,5 : 1** |
| Texto grande (≥ 18pt / ≥ 14pt bold) | **3 : 1** |
| Componentes de UI e bordas informativas | **3 : 1** |
| Texto decorativo / logotipos | — |
| WCAG AAA (enhanced) | **7 : 1** |

---

### Cor não pode ser o único meio — exemplos práticos

```html
<!-- ❌ Só cor para indicar erro -->
<input type="text" style="border-color: red" />
<input type="text" style="border-color: green" />

<!-- ✅ Cor + ícone + texto -->
<div class="campo erro">
  <label for="email">E-mail</label>
  <div class="input-wrapper">
    <input type="email" id="email" aria-invalid="true"
      aria-describedby="email-erro" />
    <span aria-hidden="true" class="icone-erro">⚠</span>
  </div>
  <span id="email-erro" role="alert" class="msg-erro">
    E-mail inválido. Use o formato: nome@exemplo.com
  </span>
</div>

<!-- Transações no extrato: não só vermelho/verde -->
<span class="valor credito">
  <span aria-hidden="true" class="seta">↑</span>
  <span class="sr-only">Crédito:</span>
  R$ 500,00
</span>
<span class="valor debito">
  <span aria-hidden="true" class="seta">↓</span>
  <span class="sr-only">Débito:</span>
  R$ 87,40
</span>
```

---

### Foco visível — WCAG 2.4.7 / 2.4.11 (AA)

```css
/* ❌ Nunca remova o outline sem substituição */
* { outline: none; }    /* PROIBIDO */
:focus { outline: 0; }  /* PROIBIDO */

/* ✅ Customize o foco — mas mantenha visível e contrastado */
:focus-visible {
  outline: 3px solid #38bdf8;
  outline-offset: 3px;
  border-radius: 4px;
}

/* Para garantir visibilidade em qualquer fundo */
:focus-visible {
  outline: 3px solid #fff;
  box-shadow: 0 0 0 5px #38bdf8; /* dupla borda */
}
```

---

## 9. Tabelas e Listas de Dados

Tabelas exigem marcação rigorosa para que o leitor contextualize cada célula com seu cabeçalho.

### Extrato bancário acessível completo

```html
<table>
  <!-- caption: primeiro elemento lido, define o contexto -->
  <caption>
    Extrato da Conta Corrente — Maio de 2025
    <span class="sr-only">
      5 colunas: data, descrição, tipo, valor e saldo.
    </span>
  </caption>

  <thead>
    <tr>
      <th scope="col">Data</th>
      <th scope="col">Descrição</th>
      <th scope="col">Tipo</th>
      <th scope="col">Valor</th>
      <th scope="col">Saldo</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>12/05/2025</td>
      <td>Supermercado Extra</td>
      <td>Débito</td>
      <td>
        <span aria-hidden="true" class="debito">- R$ 87,40</span>
        <span class="sr-only">oitenta e sete reais e quarenta centavos debitados</span>
      </td>
      <td>
        <span aria-hidden="true">R$ 2.312,60</span>
        <span class="sr-only">saldo: dois mil trezentos e doze reais</span>
      </td>
    </tr>
  </tbody>

  <tfoot>
    <tr>
      <th scope="row" colspan="3">Saldo atual</th>
      <td></td>
      <td>
        <strong aria-hidden="true">R$ 2.812,60</strong>
        <span class="sr-only">saldo atual: dois mil oitocentos e doze reais</span>
      </td>
    </tr>
  </tfoot>
</table>
```

---

### Tabela com cabeçalhos duplos

```html
<table>
  <caption>Limites por tipo e período</caption>
  <thead>
    <tr>
      <th scope="col" id="th-tipo">Tipo</th>
      <th scope="col" id="th-dia">Por dia</th>
      <th scope="col" id="th-mes">Por mês</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row" id="tr-pix">Pix</th>
      <td headers="tr-pix th-dia">R$ 5.000</td>
      <td headers="tr-pix th-mes">R$ 20.000</td>
    </tr>
    <tr>
      <th scope="row" id="tr-ted">TED</th>
      <td headers="tr-ted th-dia">R$ 10.000</td>
      <td headers="tr-ted th-mes">R$ 50.000</td>
    </tr>
  </tbody>
</table>
```

> ⚠️ **Nunca use tabelas para layout!** Leitores de tela anunciam "tabela de N linhas e M colunas" ao entrar. Use CSS Grid ou Flexbox para layouts.

---

## 10. Landmarks e Navegação

Landmarks permitem pular diretamente para seções — como um índice invisível da página.

### Estrutura semântica completa de app bancário

```html
<!-- 1. Skip link — PRIMEIRO elemento, antes de tudo -->
<a href="#main" class="skip-link">Ir para o conteúdo principal</a>

<!-- 2. Header com identidade e navegação global -->
<header role="banner">
  <img src="logo.svg" alt="Banco XYZ" />
  <nav aria-label="Navegação principal">
    <ul>
      <li><a href="/">Início</a></li>
      <li><a href="/extrato" aria-current="page">Extrato</a></li>
      <li><a href="/cartoes">Cartões</a></li>
    </ul>
  </nav>
  <div aria-label="Menu do usuário Carlos Silva">
    <button aria-expanded="false" aria-haspopup="menu">
      Carlos <span aria-hidden="true">▾</span>
    </button>
  </div>
</header>

<!-- 3. Breadcrumb -->
<nav aria-label="Caminho de navegação">
  <ol>
    <li><a href="/">Início</a></li>
    <li><a href="/pix">Pix</a></li>
    <li aria-current="page">Nova transferência</li>
  </ol>
</nav>

<!-- 4. Conteúdo principal — alvo do skip link -->
<main id="main">
  <h1>Nova transferência Pix</h1>
</main>

<!-- 5. Sidebar complementar -->
<aside aria-label="Seus limites Pix">
  <h2>Limites disponíveis</h2>
</aside>

<!-- 6. Rodapé -->
<footer role="contentinfo">
  <nav aria-label="Links institucionais">
    <a href="/privacidade">Privacidade</a>
    <a href="/acessibilidade">Acessibilidade</a>
  </nav>
</footer>
```

---

### Skip link que aparece só no foco

```css
.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  z-index: 9999;
  background: #000;
  color: #fff;
  padding: 12px 20px;
  font-size: 16px;
  text-decoration: none;
  border-radius: 0 0 8px 0;
  transition: top .15s;
}
.skip-link:focus {
  top: 0; /* aparece ao receber foco via Tab */
}
```

---

### Tab panel (abas) acessível

```html
<div>
  <div role="tablist" aria-label="Tipos de conta">
    <button role="tab" id="tab-cc"
      aria-selected="true"  aria-controls="panel-cc">
      Conta Corrente
    </button>
    <button role="tab" id="tab-pp"
      aria-selected="false" aria-controls="panel-pp" tabindex="-1">
      Poupança
    </button>
  </div>

  <div role="tabpanel" id="panel-cc" aria-labelledby="tab-cc">
    <!-- Conteúdo da conta corrente -->
  </div>
  <div role="tabpanel" id="panel-pp" aria-labelledby="tab-pp" hidden>
    <!-- Conteúdo da poupança -->
  </div>
</div>
```

---

## 11. VoiceOver iOS 18.7.2

**Ativar:** Ajustes → Acessibilidade → VoiceOver, ou triplo clique no botão lateral.

### Gestos essenciais

| Gesto | Ação | Observação |
|-------|------|------------|
| Deslizar direita → | Próximo elemento | Navega item a item na ordem do DOM |
| Deslizar esquerda ← | Elemento anterior | Ordem inversa |
| Toque duplo | Ativar elemento | Equivale ao clique / Enter |
| Toque duplo longo | Ação adicional | Ex: arrastar, pressionar longo |
| Deslizar cima/baixo (2 dedos) | Ajustar rotor | Seleciona o modo de navegação |
| Girar (2 dedos) horário | Próximo item do rotor | Ex: próximo cabeçalho |
| Girar (2 dedos) anti-horário | Item anterior do rotor | Ex: cabeçalho anterior |
| 3 dedos deslizar ↑ | Rolar página para cima | Scroll |
| 3 dedos deslizar ↓ | Rolar página para baixo | Scroll |
| Toque duplo (2 dedos) | Parar/Retomar leitura | Pause/Play |
| Magic tap (2 dedos) | Ação principal do app | Atender ligação, play/pause |
| Escape (2 dedos Z) | Fechar / Voltar | Fecha modal, volta para tela anterior |

---

### O Rotor — navegação avançada

O Rotor é um seletor giratório que muda o que os swipes cima/baixo fazem.
Configure em: **Ajustes → Acessibilidade → VoiceOver → Rotor.**

| Modo do Rotor | O que faz | Requisito no HTML |
|---------------|-----------|-------------------|
| Cabeçalhos | Salta entre h1–h6 | Marque com `<h1>`–`<h6>` |
| Links | Navega por todos os `<a>` | Links com texto descritivo |
| Formulários | Pula entre campos | `<label>` associado a cada `<input>` |
| Pontos de referência | Landmarks semânticos | `<main>`, `<nav>`, `<header>`, `<aside>` |
| Tabelas | Navega por células | `<th scope>` e `<caption>` |
| Containers | Grupos e regiões | `role="region"` com `aria-label` |

---

### Comportamentos específicos do VoiceOver 18.x

**`role="group"` vs `role="region"`**

No iOS 18, `"region"` com `aria-label` aparece no Rotor como ponto de referência. `"group"` não aparece. Use `"region"` para seções navegáveis.

```html
<div role="region" aria-label="Saldo da conta">
```

---

**`aria-live` no Safari/WebKit**

Regiões live precisam existir no DOM antes de receber conteúdo. O VoiceOver 18 ignora regiões criadas dinamicamente após o carregamento.

```html
<!-- Container vazio presente desde o HTML inicial -->
<div id="status" aria-live="polite"></div>
```

---

**Imagens com `role="img"` em SVG**

SVGs inline precisam de `role="img"` explícito + `aria-label` ou `<title>`. Sem isso, VoiceOver 18 pode ignorar ou ler os paths brutos.

```html
<svg role="img" aria-label="Gráfico de crescimento">
  <title>Crescimento 12% em maio</title>
</svg>
```

---

**Foco em elementos não-interativos**

O VoiceOver iOS navega por TODOS os elementos, não só focáveis. Elementos com `aria-hidden="true"` são completamente ignorados (inclusive filhos).

```html
<div aria-hidden="true">
  <!-- tudo aqui é invisível para o VoiceOver -->
</div>
```

---

**`aria-expanded` em botões**

O VoiceOver 18 anuncia "expandido" ou "recolhido" automaticamente. Não precisa duplicar no `aria-label`.

```html
<!-- ✅ Correto: leitor diz "Menu principal, recolhido, botão" -->
<button aria-expanded="false" aria-controls="menu">
  Menu principal
</button>
```

---

> 🍎 **Testar VoiceOver no Mac + Safari:** ⌘+F5 ativa. Use VO+U para abrir o Rotor de Web. VO = Ctrl+Option. Navegue com VO+→ e VO+←. Ative com VO+Espaço.

---

## 12. TalkBack Android 15.1

**Ativar:** Configurações → Acessibilidade → TalkBack, ou volume ↑+↓ por 3s (se habilitado).

### Gestos essenciais

| Gesto | Ação | Observação |
|-------|------|------------|
| Deslizar direita → | Próximo elemento | Navega em ordem linear do DOM |
| Deslizar esquerda ← | Elemento anterior | Ordem reversa |
| Toque duplo | Ativar / clicar | Confirma a ação no elemento focado |
| Deslizar cima+baixo | Mudar granularidade | Troca modo: padrão → cabeçalhos → palavras → chars |
| Deslizar baixo+cima | Modo anterior | Volta para a granularidade anterior |
| 3 dedos deslizar | Rolar página | Scroll vertical/horizontal |
| Deslizar ↑→ (L) | Menu global do TalkBack | Atalhos e configurações |
| Deslizar ↓→ | Menu local / contexto | Ações do elemento focado |
| Toque duplo longo | Ação secundária | Arraste, seleção longa |
| 2 dedos deslizar ↑ | Ler da página inteira | Lê do topo ao fundo |
| 2 dedos deslizar ↓ | Ler a partir do foco | Lê do item atual em diante |
| Toque duplo (2 dedos) | Pausar/Retomar | Toggle de leitura |

---

### Granularidade de leitura

O TalkBack 15.1 introduziu granularidade adaptativa — ao invés do Rotor do VoiceOver, o usuário cicla entre modos com deslizamento vertical duplo.

| Modo | O que faz |
|------|-----------|
| Padrão | Navega elemento a elemento |
| Cabeçalhos | Salta entre h1–h6 |
| Controles | Botões, inputs, links |
| Links | Só âncoras `<a>` |
| Palavras | Palavra por palavra no texto |
| Caracteres | Letra por letra |

---

### Comportamentos específicos do TalkBack 15.1

**`role="button"` em divs**

TalkBack 15.1 suporta `role="button"` em divs, mas exige `tabindex="0"` e handler de teclado. Sem `tabindex`, o elemento não é focável por swipe.

```html
<div
  role="button"
  tabindex="0"
  aria-label="Ver detalhes da transação"
  onkeydown="if(e.key==='Enter'||e.key===' ')ativar()"
>...</div>
```

---

**`aria-live` no Chrome Android**

TalkBack 15.1 com Chrome tem um bug conhecido: `aria-live="assertive"` pode não interromper a leitura em progresso em alguns modelos Samsung. Teste sempre em dispositivo real.

```html
<!-- Workaround: use role="alert" que tem suporte mais consistente -->
<div role="alert" id="erro-crítico">
  Sessão expirada. Faça login novamente.
</div>
```

---

**Foco em elementos `position:fixed`**

No TalkBack 15.1, headers e footers fixos podem receber foco em momentos inesperados. Use `aria-hidden="true"` em elementos fixos que são duplicados no DOM.

```html
<header class="sticky" aria-hidden="true">...</header>
<header class="static" role="banner">...</header>
```

---

**Inputs com `inputmode`**

TalkBack 15.1 anuncia o tipo de teclado ao focar. Use `inputmode` correto para melhorar a UX.

```html
<input inputmode="numeric"  />  <!-- anuncia: teclado numérico -->
<input inputmode="email"    />  <!-- anuncia: teclado de e-mail -->
<input inputmode="decimal"  />  <!-- anuncia: teclado decimal -->
<input inputmode="tel"      />  <!-- anuncia: teclado telefônico -->
```

---

**Swipe em carrosséis e listas horizontais**

Carrosséis sem marcação acessível são invisíveis ao TalkBack. Use `role="list"` + `role="listitem"` e garanta que o swipe horizontal não conflite com a navegação.

```html
<div
  role="list"
  aria-label="Seus cartões"
  aria-roledescription="carrossel"
>
  <div role="listitem" aria-label="Cartão 1 de 3: Nubank, final 4521">
    ...
  </div>
</div>
```

---

> 🤖 **Ativar TalkBack via ADB:** `adb shell settings put secure enabled_accessibility_services com.google.android.marvin.talkback/.TalkBackService`

---

## 13. VoiceOver vs TalkBack — Comparação

| Comportamento | 🍎 VoiceOver 18.7.2 | 🤖 TalkBack 15.1 |
|---------------|---------------------|-----------------|
| Engine do browser | Safari / WebKit | Chrome / Blink |
| Navegação por swipe → | Próximo elemento | Próximo elemento |
| Ativar elemento | Toque duplo | Toque duplo |
| Seletor de modos | Rotor (giro 2 dedos) | Granularidade (swipe ↑↓ duplo) |
| Leitura por cabeçalho | Rotor → "Cabeçalhos" | Granularidade → "Cabeçalhos" |
| `aria-live assertive` | Funciona consistentemente | Bug em alguns Samsung — use `role="alert"` |
| `role="button"` em div | Funciona (exige tabindex) | Funciona (exige tabindex + keydown) |
| Anúncio de `aria-expanded` | "expandido"/"recolhido" automático | "expandido"/"recolhido" automático |
| Leitura de tabelas | Anuncia col/row ao navegar | Anuncia col/row ao navegar |
| SVG inline sem `role="img"` | Pode ler paths — use aria-hidden | Geralmente ignora — use aria-hidden |
| Foco em `position:fixed` | Normalmente ok | Pode comportar-se erraticamente |
| `inputmode` | Anuncia tipo de teclado | Anuncia tipo de teclado (mais verboso) |
| `aria-roledescription` | Suportado | Suportado no TalkBack 15+ |
| `role="dialog"` | Anuncia "caixa de diálogo" | Anuncia "caixa de diálogo" |
| Fechar modal com gesto | 2 dedos Z (Escape) | Deslizar ↑← (Back gesture) |
| `aria-haspopup` | Anuncia "menu pop-up" | Pode não anunciar — prefira `aria-expanded` |

### Padrões que funcionam nos dois leitores ✅

- Elementos semânticos nativos (`<button>`, `<a>`, `<input>`)
- `aria-label` / `aria-labelledby` / `aria-describedby`
- `<label>` associado ao `<input>` via `for`/`id`
- `role="dialog"` + `aria-modal="true"`
- `aria-live="polite"` para updates não-críticos
- `role="alert"` para erros e mensagens urgentes
- `aria-invalid="true"` + `aria-describedby` para erros
- `fieldset` + `legend` para grupos de campos
- `tabindex="-1"` para foco programático
- `<table>` com `scope` + `caption`
- Skip link para conteúdo principal
- `aria-expanded` em botões de toggle

---

## 14. Cheat Sheet Completo

### Referência rápida de propriedades ARIA

| Propriedade / Técnica | Para que serve | Quando usar | Exemplo |
|-----------------------|----------------|-------------|---------|
| `aria-label` | Nome acessível direto | Botões de ícone, inputs sem label visual | `aria-label="Fechar"` |
| `aria-labelledby` | Nomeia via outro elemento | Reutilizar texto existente no DOM | `aria-labelledby="titulo"` |
| `aria-describedby` | Descrição complementar | Hints, dicas, mensagens de erro | `aria-describedby="dica"` |
| `aria-hidden` | Remove do leitor de tela | Ícones decorativos, conteúdo duplicado | `aria-hidden="true"` |
| `aria-live` | Anuncia mudanças dinâmicas | Confirmações, erros, atualizações | `aria-live="polite"` |
| `aria-required` | Campo obrigatório | Todo campo obrigatório | `aria-required="true"` |
| `aria-invalid` | Campo com erro | Após validação com falha | `aria-invalid="true"` |
| `aria-expanded` | Estado expandido/colapsado | Dropdowns, accordions, menus | `aria-expanded="false"` |
| `aria-controls` | Associa controle ao conteúdo | Botões que abrem/fecham elementos | `aria-controls="menu-id"` |
| `aria-current` | Item ativo na navegação | Breadcrumb, menu ativo, paginação | `aria-current="page"` |
| `aria-atomic` | Lê bloco inteiro ou só mudança | Com aria-live em contadores/saldos | `aria-atomic="true"` |
| `aria-modal` | Modal verdadeiro | `role=dialog` aberto | `aria-modal="true"` |
| `aria-pressed` | Estado toggle | Botões liga/desliga (ex: favorito) | `aria-pressed="false"` |
| `aria-roledescription` | Nome customizado do role | Carrosséis, componentes customizados | `aria-roledescription="carrossel"` |
| `role="alert"` | Anuncia imediatamente | Erros críticos, sessão expirada | `role="alert"` |
| `role="status"` | Anuncia quando disponível | Confirmações, loading completo | `role="status"` |
| `role="region"` | Seção nomeada (Rotor) | Áreas com aria-label — aparece no Rotor iOS | `role="region"` |
| `role="dialog"` | Modal/Diálogo | Overlays que bloqueiam interação | `role="dialog"` |
| `.sr-only` | Visível só ao leitor | Contexto extra para conteúdo visual | `<span class="sr-only">` |
| `tabindex="-1"` | Focável só por JS | Modais, resumos de erro, h1 de SPA | `tabindex="-1"` |

---

### Checklist de auditoria — antes de qualquer release

#### HTML Semântico
- [ ] Todo `<img>` tem `alt` (vazio se decorativo)
- [ ] Hierarquia de headings correta (h1→h2→h3)
- [ ] Tabelas com `<caption>` e `<th scope>`

#### Formulários
- [ ] Todo `<input>` tem `<label>` associado
- [ ] Radio/checkbox em `<fieldset>` + `<legend>`
- [ ] Erros com `aria-invalid` + `aria-describedby`

#### Navegação
- [ ] Skip link presente e funcional
- [ ] Foco visível em todos os elementos interativos
- [ ] Tab order segue ordem visual lógica
- [ ] Landmarks: `<main>`, `<nav>`, `<header>`, `<footer>`

#### Modais
- [ ] `role="dialog"` + `aria-modal` + focus trap
- [ ] Foco retorna ao trigger ao fechar

#### Conteúdo Dinâmico
- [ ] Updates com `aria-live="polite"` ou `role="alert"`
- [ ] Container `aria-live` existe desde o carregamento

#### Visual
- [ ] Contraste mínimo 4,5:1 em texto normal
- [ ] Cor não é único meio de informação
- [ ] Funciona com zoom 200% sem quebrar layout

#### Leitores de Tela
- [ ] Testado no VoiceOver iOS (Safari)
- [ ] Testado no TalkBack Android (Chrome)
- [ ] Testado com teclado (Tab, Enter, Esc, setas)

---

*Baseado em WCAG 2.1 AA · LBI 13.146/2015 · VoiceOver 18.7.2 · TalkBack 15.1*
