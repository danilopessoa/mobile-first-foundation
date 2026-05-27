// ============================================================
// ♿ A11Y — LIÇÃO FINAL: A estrutura completa de uma página acessível
// ============================================================
// Estrutura ideal de uma página:
//
//  <html lang="pt-BR">
//    <body>
//      [Skip Link] ← primeiro elemento focável
//      <header>
//        <nav aria-label="Navegação principal">
//      </header>
//      <main id="main-content"> ← target do skip link
//        <h1>Título único da página</h1>
//        <section aria-labelledby="...">
//          <h2>Subtítulo da seção</h2>
//          ...
//        </section>
//      </main>
//      <footer>
//        <nav aria-label="Navegação do rodapé">
//      </footer>
//    </body>
//  </html>

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProductCard, { type Product } from "@/components/ProductCard";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

// ============================================================
// ♿ SSG: dados estáticos gerados em build time
// Em um projeto real, viriam de uma API/CMS em generateStaticParams
// ============================================================
const products: Product[] = [
  {
    id: 1,
    name: "Fone Bluetooth Premium",
    price: 89.9,
    originalPrice: 149.9,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    imageAlt: "Fone de ouvido bluetooth branco com almofadas de couro sobre fundo azul",
    category: "Eletrônicos",
    rating: 4.8,
    reviewCount: 238,
  },
  {
    id: 2,
    name: "Mochila Ergonômica 30L",
    price: 159.9,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
    imageAlt: "Mochila preta com compartimentos organizados, apoiada em uma cadeira",
    category: "Acessórios",
    rating: 4.6,
    reviewCount: 91,
  },
  {
    id: 3,
    name: "Garrafa Térmica Inox 500ml",
    price: 49.9,
    originalPrice: 69.9,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop",
    imageAlt: "Garrafa térmica de inox prata sobre mesa de madeira com folhas ao fundo",
    category: "Cozinha",
    rating: 4.9,
    reviewCount: 412,
  },
  {
    id: 4,
    name: "Teclado Mecânico Compacto",
    price: 229.9,
    image: "https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=400&h=300&fit=crop",
    imageAlt: "Teclado mecânico compacto 65% com teclas coloridas iluminadas em RGB",
    category: "Eletrônicos",
    rating: 4.7,
    reviewCount: 156,
  },
  {
    id: 5,
    name: "Luminária LED de Mesa",
    price: 79.9,
    originalPrice: 99.9,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop",
    imageAlt: "Luminária LED branca minimalista sobre mesa de home office com laptop ao fundo",
    category: "Casa",
    rating: 4.5,
    reviewCount: 67,
  },
  {
    id: 6,
    name: "Kit Canetas Aquarela 24 cores",
    price: 34.9,
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop",
    imageAlt: "Kit de canetas aquarela dispostas em leque colorido sobre papel branco",
    category: "Arte",
    rating: 4.4,
    reviewCount: 203,
  },
];

export default function HomePage() {
  return (
    <>
      <Header />

      {/*
        ♿ A11Y — <main> com id="main-content"
        Este é o target do Skip Link definido no layout.tsx.
        Deve haver APENAS 1 <main> por página.
        tabIndex={-1} permite que o Skip Link mova o foco para cá programaticamente
        sem adicionar o <main> à ordem natural do Tab.
      */}
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">

        {/* Seção Hero */}
        <HeroSection />

        {/* Seção de Produtos em Destaque */}
        <section
          aria-labelledby="featured-heading"
          className="max-w-6xl mx-auto px-4 py-12 md:py-16"
        >
          <div className="mb-8 text-center md:text-left">
            <h2
              id="featured-heading"
              className="text-2xl md:text-3xl font-bold text-gray-900 mb-2"
            >
              Produtos em destaque
            </h2>
            <p className="text-gray-600">
              Seleção curada com foco em qualidade e custo-benefício
            </p>
          </div>

          {/*
            ♿ A11Y — LIÇÃO 22: Listas de produtos
            <ul> com role="list" explícito garante semântica de lista mesmo
            quando CSS reseta list-style (alguns navegadores removem a semântica
            de lista quando list-style é none).
            O leitor anuncia: "lista de 6 itens".
          */}
          <ul
            role="list"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>

          <div className="mt-8 text-center">
            <a
              href="/produtos"
              className="
                inline-block border-2 border-blue-700 text-blue-700
                font-semibold px-8 py-3 rounded-lg
                hover:bg-blue-700 hover:text-white transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2
              "
            >
              Ver todos os produtos
            </a>
          </div>
        </section>

        <hr className="border-gray-200 max-w-6xl mx-auto" />

        {/* Seção de Contato */}
        <section
          aria-labelledby="contact-heading"
          className="max-w-6xl mx-auto px-4 py-12 md:py-16"
        >
          <div className="max-w-2xl mx-auto">
            <div className="mb-8 text-center">
              <h2
                id="contact-heading"
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-2"
              >
                Fale conosco
              </h2>
              <p className="text-gray-600">
                Tem dúvidas ou sugestões? Adoraríamos ouvir você.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
