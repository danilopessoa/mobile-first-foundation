"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ============================================================
// ♿ A11Y — LIÇÃO 5: HTML Semântico — <header>, <nav>, <main>
// ============================================================
// HTML semântico significa usar a TAG CERTA para o elemento certo.
// O browser e leitores de tela reconhecem automaticamente o papel de cada tag:
//
//  <header>  → cabeçalho da página ou de uma seção
//  <nav>     → bloco de navegação (menu, breadcrumbs, paginação)
//  <main>    → conteúdo principal da página (deve haver apenas 1 por página!)
//  <section> → seção temática com um título próprio
//  <article> → conteúdo independente e reutilizável (post, card de produto)
//  <aside>   → conteúdo secundário (sidebar, anúncios)
//  <footer>  → rodapé
//
// ❌ Errado: <div class="header"> ... <div class="nav"> ...
// ✅ Correto: <header> ... <nav> ...

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/produtos", label: "Produtos" },
  { href: "/sobre", label: "Sobre nós" },
  { href: "/contato", label: "Contato" },
];

export default function Header() {
  // Estado para controlar o menu mobile (hamburger)
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    // ♿ A11Y — <header> é uma landmark region.
    // Leitores de tela listam todas as landmarks para o usuário navegar diretamente.
    // Landmarks são: <header>, <nav>, <main>, <aside>, <footer>, <section> com aria-label.
    <header className="bg-blue-800 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* ♿ A11Y — Logo como link para home
            O texto dentro do <a> é o nome acessível (accessible name).
            Leitores de tela anunciam: "Loja Acessível, link" */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight hover:text-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-800 rounded"
        >
          🛍️ Loja Acessível
        </Link>

        {/* ============================================================
            ♿ A11Y — LIÇÃO 6: aria-label em <nav>
            ============================================================
            Quando há MAIS DE UM <nav> na página (ex: menu principal + footer),
            o leitor de tela lista "Navegação" duas vezes — confuso!
            O aria-label diferencia: "Navegação principal" vs "Navegação do rodapé".
            Padrão WCAG: Critério 2.4.6 (Nível AA) — Headings and Labels.
        */}
        <nav aria-label="Navegação principal">

          {/* ============================================================
              ♿ A11Y — LIÇÃO 7: Botão de menu (hamburger) acessível
              ============================================================
              Um <button> já é nativamente focável e ativável via Enter/Espaço.
              Nunca use <div onClick> para criar botões — não são focáveis por teclado!

              aria-expanded → diz ao leitor de tela se o menu está aberto ou fechado.
                              O leitor anuncia: "Menu, botão, recolhido" ou "expandido".
              aria-controls → aponta para o ID do elemento que o botão controla.
                              Cria uma relação programática entre botão e menu.
              aria-label    → substitui o texto visual quando ele é insuficiente.
                              "Menu" é melhor que "☰" (o leitor leria "três linhas horizontais").
          */}
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
            onClick={() => setMenuOpen(!menuOpen)}
            className="
              md:hidden p-2 rounded
              hover:bg-blue-700
              focus:outline-none focus:ring-2 focus:ring-white
              transition-colors
            "
          >
            {/* ♿ A11Y — aria-hidden="true" em ícones decorativos
                O SVG/ícone abaixo é puramente visual. O aria-label do <button>
                já descreve a ação. Se o leitor de tela lesse o SVG também,
                ficaria redundante ou confuso.
                Regra: ícone dentro de botão com texto/aria-label → aria-hidden="true" */}
            <svg
              aria-hidden="true"
              focusable="false"
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Menu Desktop */}
          <ul
            className="hidden md:flex gap-1"
            role="list"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  {/* ============================================================
                      ♿ A11Y — LIÇÃO 8: aria-current="page"
                      ============================================================
                      Indica ao leitor de tela QUAL página está ativa no menu.
                      Sem isso, o usuário não sabe onde está na navegação.
                      O leitor anuncia: "Início, página atual, link" — perfeito!

                      Valores comuns de aria-current:
                        "page"  → item de menu que representa a página atual
                        "step"  → etapa atual em um stepper/wizard
                        "date"  → data atual em um calendário
                        "true"  → genérico (use "page" para navegação)

                      Padrão WCAG: Critério 1.3.1 (Nível A) — Info and Relationships.
                  */}
                  <Link
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`
                      px-3 py-2 rounded text-sm font-medium transition-colors
                      focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-blue-800
                      ${isActive
                        ? "bg-blue-600 text-white"
                        : "text-blue-100 hover:bg-blue-700 hover:text-white"
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* ============================================================
          ♿ A11Y — Menu Mobile acessível
          ============================================================
          id="mobile-menu" → vinculado ao aria-controls do botão acima.
          Quando menuOpen=false, usamos hidden para remover do fluxo do DOM.
          NÃO use apenas opacity-0 ou visibility:hidden para esconder menus!
          Leitores de tela ainda leriam elementos com opacity-0.
          O atributo hidden ou display:none remove do fluxo de acessibilidade.
      */}
      {menuOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-blue-700">
          <ul className="flex flex-col px-4 py-2 gap-1" role="list">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={`
                      block px-3 py-2 rounded text-sm font-medium transition-colors
                      focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-blue-800
                      ${isActive
                        ? "bg-blue-600 text-white"
                        : "text-blue-100 hover:bg-blue-700 hover:text-white"
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
