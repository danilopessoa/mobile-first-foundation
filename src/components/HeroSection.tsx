// ============================================================
// ♿ A11Y — LIÇÃO 9: Imagens e texto alternativo (alt)
// ============================================================
// O atributo alt é OBRIGATÓRIO em toda <img>.
// Ele serve como substituto textual para quem não pode ver a imagem.
//
// REGRAS do alt:
//   1. Imagem INFORMATIVA → descreva o conteúdo relevante
//      alt="Mulher usando cadeira de rodas sorrindo enquanto faz compras online"
//
//   2. Imagem DECORATIVA → alt="" (string vazia)
//      O leitor de tela PULA a imagem. Não use alt="decoração" — o leitor leria isso.
//      alt="" = "esta imagem não tem significado, ignore".
//
//   3. Imagem como BOTÃO/LINK → descreva a AÇÃO
//      <a href="/cart"><img alt="Ver carrinho de compras" /></a>
//      NÃO: alt="ícone de carrinho"
//
//   4. Imagem com texto → o alt deve repetir o texto da imagem
//      alt="50% OFF — Promoção de verão"
//
// Padrão WCAG: Critério 1.1.1 (Nível A) — Non-text Content.

import Image from "next/image";

export default function HeroSection() {
  return (
    // ♿ A11Y — <section> precisa de um nome acessível quando há múltiplas seções.
    // Usamos aria-labelledby apontando para o ID do <h1> interno.
    // Isso cria uma relação: "esta seção se chama o mesmo que seu título".
    // O leitor anuncia a região como: "Seção: Produtos com propósito, acessíveis para todos"
    //
    // aria-labelledby vs aria-label:
    //   aria-labelledby → aponta para um ELEMENTO existente na página (por ID)
    //   aria-label      → texto INLINE no próprio atributo (quando não há texto visível)
    //
    // PREFIRA aria-labelledby quando o texto já existe na tela — evita duplicidade.
    // Padrão WCAG: Critério 1.3.1 (Nível A) — Info and Relationships.
    <section
      aria-labelledby="hero-heading"
      className="bg-gradient-to-br from-blue-900 to-blue-700 text-white"
    >
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row items-center gap-8 md:gap-12">

        {/* Texto do Hero */}
        <div className="flex-1 text-center md:text-left">

          {/* ============================================================
              ♿ A11Y — LIÇÃO 10: Hierarquia de títulos (h1, h2, h3...)
              ============================================================
              A hierarquia de headings é como o ÍNDICE do documento para leitores de tela.
              Usuários podem navegar diretamente entre headings pressionando H.

              REGRAS:
              ✅ Deve haver APENAS 1 <h1> por página (o título principal)
              ✅ Nunca pule níveis: h1 → h2 → h3 (não h1 → h3)
              ❌ Não use headings para deixar texto grande/em negrito — use CSS
              ❌ Não use <h2> só porque fica bonito visualmente

              Padrão WCAG: Critério 1.3.1 (Nível A) — Info and Relationships.
                           Critério 2.4.6 (Nível AA) — Headings and Labels.
          */}
          <h1
            id="hero-heading"
            className="text-3xl md:text-5xl font-extrabold leading-tight mb-4"
          >
            Produtos com propósito,{" "}
            <span className="text-blue-200">acessíveis para todos</span>
          </h1>

          {/* ============================================================
              ♿ A11Y — LIÇÃO 11: aria-describedby
              ============================================================
              Enquanto aria-labelledby dá o NOME de um elemento,
              o aria-describedby fornece uma DESCRIÇÃO adicional.

              Exemplo prático: um campo de formulário pode ter:
                - aria-labelledby → "E-mail" (o label visível)
                - aria-describedby → "Digite seu e-mail no formato nome@exemplo.com"

              Aqui usamos aria-describedby para vincular o botão CTA
              a uma descrição explicativa. O leitor anuncia:
              "Explorar produtos, link. Mais de 200 produtos disponíveis com entrega acessível."
          */}
          <p
            id="hero-description"
            className="text-blue-100 text-lg md:text-xl mb-8 max-w-xl mx-auto md:mx-0"
          >
            Mais de 200 produtos disponíveis com entrega acessível em todo o Brasil.
            Compre com facilidade, independente de como você navega.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <a
              href="/produtos"
              aria-describedby="hero-description"
              className="
                inline-block bg-white text-blue-800 font-bold px-6 py-3 rounded-lg
                hover:bg-blue-50 transition-colors
                focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-800
                text-center
              "
            >
              Explorar produtos
            </a>

            <a
              href="/sobre"
              className="
                inline-block border-2 border-white text-white font-bold px-6 py-3 rounded-lg
                hover:bg-white hover:text-blue-800 transition-colors
                focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-800
                text-center
              "
            >
              Sobre o projeto
            </a>
          </div>
        </div>

        {/* Imagem do Hero */}
        <div className="flex-shrink-0 w-full md:w-80 lg:w-96">
          {/*
            ♿ A11Y — Esta imagem é INFORMATIVA: mostra o produto/tema da loja.
            O alt descreve o que é relevante para o contexto, não apenas o que está visível.
            NÃO use: alt="imagem" ou alt="foto" — não acrescentam nada.
            NÃO use: alt="imagem_hero_banner_1200x800_azul" — isso é nome de arquivo.
          */}
          <Image
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=500&fit=crop"
            alt="Pessoa sorrindo enquanto recebe uma caixa de compras pela entrega em casa"
            width={480}
            height={400}
            priority
            className="rounded-2xl shadow-2xl w-full h-auto object-cover"
          />
        </div>
      </div>

      {/* ============================================================
          ♿ A11Y — LIÇÃO 12: Contraste de cores
          ============================================================
          O contraste entre texto e fundo é CRÍTICO para pessoas com baixa visão.

          WCAG define dois níveis:
            AA (mínimo obrigatório):
              - Texto normal (<18px ou não-negrito): 4.5:1
              - Texto grande (≥18px ou ≥14px negrito): 3:1
            AAA (ideal):
              - Texto normal: 7:1
              - Texto grande: 4.5:1

          Ferramentas para checar contraste:
            - WebAIM Contrast Checker: webaim.org/resources/contrastchecker/
            - Chrome DevTools: Inspect → Accessibility → Contrast ratio
            - Extensão Axe DevTools

          Exemplos RUINS (comuns em interfaces modernas):
            ❌ Texto cinza claro (#999) em fundo branco → contraste ~2.8:1 (falha AA)
            ❌ Texto azul claro (#87CEEB) em fundo azul → falha total
            ❌ Placeholder de input muito claro → falha AA

          No nosso site: blue-100 (#dbeafe) em blue-900 → contraste ~9.8:1 ✅
      */}
    </section>
  );
}
