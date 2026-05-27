import Image from "next/image";

// ============================================================
// ♿ A11Y — LIÇÃO 13: Cards acessíveis
// ============================================================
// Cards são um dos elementos mais PROBLEMÁTICOS em acessibilidade.
// Problemas comuns:
//   ❌ Link vazio: <a href="..."><img /></a> sem alt nem texto
//   ❌ Links duplicados: imagem E título são links separados para a mesma URL
//   ❌ Botão genérico: "Comprar" repetido 12x sem dizer O QUÊ o usuário vai comprar
//   ❌ Preço sem contexto: "R$ 49,90" sem rótulo, o leitor leria só o número

export type Product = {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  imageAlt: string;
  category: string;
  rating: number;
  reviewCount: number;
};

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  // ============================================================
  // ♿ A11Y — LIÇÃO 14: Formatação de valores monetários para leitores de tela
  // ============================================================
  // R$ 49,90 pode ser lido como "R cifrão 49 vírgula 90" em alguns leitores.
  // Usando o Intl.NumberFormat com aria, garantimos a leitura correta.
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(product.price);

  const formattedOriginalPrice = product.originalPrice
    ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(product.originalPrice)
    : null;

  // ID único para o aria-labelledby do card
  const headingId = `product-heading-${product.id}`;

  return (
    // ♿ A11Y — <article> é perfeito para cards de produto.
    // Representa conteúdo independente que faz sentido isolado.
    // O leitor de tela pode anunciar: "Artigo: [nome do produto]"
    // quando aria-labelledby aponta para o título interno.
    <article
      aria-labelledby={headingId}
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
    >
      {/* ============================================================
          ♿ A11Y — Wrapper do link: técnica "card inteiro clicável"
          ============================================================
          Uma técnica comum é envolver TODO o card em um <a>.
          Problema: o leitor lê TODO o texto dentro do link de uma vez.
          "Fone Bluetooth Premium, Eletrônicos, 4.8 estrelas, 238 avaliações, R$ 89,90, Comprar"

          Solução alternativa (usada aqui): link apenas no título + botão separado.
          Isso permite navegação granular pelo teclado.
      */}
      <div className="relative">
        {/* ============================================================
            ♿ A11Y — Imagem do produto
            O alt vem dos dados (imageAlt) — nunca gere alt genérico programaticamente.
            O alt deve ser definido por quem conhece o produto, não gerado automaticamente.
        */}
        <Image
          src={product.image}
          alt={product.imageAlt}
          width={400}
          height={300}
          className="w-full h-48 object-cover"
          loading="lazy"
        />

        {/* ============================================================
            ♿ A11Y — Badge de desconto
            ============================================================
            O texto visual "30% OFF" pode ser suficiente para usuários videntes.
            Mas para leitores de tela, o contexto é melhor com texto completo.
            Usamos aria-label para substituir o texto visual por algo mais descritivo.
        */}
        {discount && (
          <span
            aria-label={`${discount}% de desconto`}
            className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded"
          >
            {/* aria-hidden para o texto visual, pois o aria-label já descreve */}
            <span aria-hidden="true">{discount}% OFF</span>
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2">
        {/* Categoria */}
        {/*
          ♿ A11Y — aria-hidden="true" na categoria
          A categoria é visualmente informativa, mas redundante para leitores de tela
          quando o aria-labelledby do <article> já contextualiza o conteúdo.
          NÃO abuse de aria-hidden! Use apenas quando o conteúdo é realmente decorativo
          ou quando causaria repetição confusa.
        */}
        <span
          aria-hidden="true"
          className="text-xs text-blue-600 font-semibold uppercase tracking-wide"
        >
          {product.category}
        </span>

        {/* Título do produto — vinculado ao <article> via aria-labelledby */}
        <h3
          id={headingId}
          className="text-base font-semibold text-gray-900 leading-snug"
        >
          {product.name}
        </h3>

        {/* ============================================================
            ♿ A11Y — LIÇÃO 15: Avaliações (estrelas) acessíveis
            ============================================================
            Estrelas visuais (★★★★☆) não têm significado para leitores de tela.
            O leitor leria: "estrela estrela estrela estrela estrela vazia" — inútil!

            Solução:
            - Esconder as estrelas visuais com aria-hidden="true"
            - Adicionar um <span class="sr-only"> com o texto real

            sr-only (screen-reader only) é uma classe Tailwind que:
              - Esconde visualmente o elemento
              - MAS mantém no fluxo de acessibilidade (leitores de tela leem)
            É o OPOSTO de aria-hidden: sr-only esconde da TELA, aria-hidden esconde do LEITOR.
        */}
        <div className="flex items-center gap-1">
          <div aria-hidden="true" className="flex text-yellow-400">
            {Array.from({ length: 5 }, (_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-current" : "fill-gray-200"}`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          {/* Texto acessível real */}
          <span className="sr-only">
            Avaliação: {product.rating} de 5 estrelas
          </span>
          <span className="text-sm text-gray-500" aria-label={`${product.reviewCount} avaliações`}>
            ({product.reviewCount})
          </span>
        </div>

        {/* Preço */}
        <div className="mt-auto pt-2">
          {formattedOriginalPrice && (
            <div>
              {/*
                ♿ A11Y — Preço original riscado
                O <del> semanticamente indica "preço removido/antigo".
                Adicionamos aria-label para deixar claro o contexto.
              */}
              <del
                aria-label={`Preço original: ${formattedOriginalPrice}`}
                className="text-sm text-gray-400"
              >
                <span aria-hidden="true">{formattedOriginalPrice}</span>
              </del>
            </div>
          )}

          {/* ============================================================
              ♿ A11Y — Preço atual com contexto semântico
              Apenas o número não tem significado. Adicionamos aria-label completo.
              O leitor anuncia: "Preço atual: R$ 49,90"
          */}
          <p
            aria-label={`Preço atual: ${formattedPrice}`}
            className="text-lg font-bold text-blue-800"
          >
            <span aria-hidden="true">{formattedPrice}</span>
          </p>
        </div>

        {/* ============================================================
            ♿ A11Y — LIÇÃO 16: Botões com nomes únicos e descritivos
            ============================================================
            ❌ PROBLEMA CLÁSSICO:
            12 cards com 12 botões "Adicionar ao carrinho" — todos iguais!
            O leitor de tela lista os botões: "Adicionar ao carrinho, botão" x12.
            O usuário não sabe QUAL produto cada botão vai adicionar.

            ✅ SOLUÇÃO: aria-label com contexto completo
            "Adicionar Fone Bluetooth Premium ao carrinho"

            Padrão WCAG: Critério 2.4.6 (Nível AA) — Headings and Labels.
                         Critério 4.1.2 (Nível A) — Name, Role, Value.
        */}
        <button
          type="button"
          aria-label={`Adicionar ${product.name} ao carrinho`}
          className="
            mt-2 w-full bg-blue-700 hover:bg-blue-800 text-white
            font-semibold py-2 px-4 rounded-lg transition-colors
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            active:scale-95
          "
        >
          {/* Texto visual curto (OK porque o aria-label tem o contexto completo) */}
          Adicionar ao carrinho
        </button>
      </div>
    </article>
  );
}
