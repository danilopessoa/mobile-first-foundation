import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// ♿ A11Y — LIÇÃO 1: lang no <html>
// O atributo lang="pt-BR" é OBRIGATÓRIO.
// Leitores de tela usam esse atributo para saber em que idioma pronunciar o texto.
// Se estiver errado (ex: "en" em um site português), o leitor de tela vai pronunciar
// o conteúdo com sotaque e fonética errados — tornando o site inacessível.
// Padrão WCAG: Critério 3.1.1 (Nível A) — Language of Page.

export const metadata: Metadata = {
  // ♿ A11Y — LIÇÃO 2: <title> descritivo
  // O <title> é o PRIMEIRO item que um leitor de tela anuncia ao carregar a página.
  // Deve ser único por página e descritivo o suficiente para dar contexto fora da tela.
  // Padrão WCAG: Critério 2.4.2 (Nível A) — Page Titled.
  title: {
    default: "Loja Acessível — Produtos com propósito",
    template: "%s | Loja Acessível",
  },
  description:
    "Aprenda acessibilidade na prática com este projeto de loja virtual construída com Next.js, Tailwind e boas práticas de a11y.",
};

// ♿ A11Y — LIÇÃO 3: export const generateStaticParams (SSG)
// Usamos SSG (Static Site Generation) para que o HTML seja gerado em build time.
// Isso é melhor para acessibilidade porque o conteúdo está no HTML puro —
// não depende de JavaScript para renderizar, o que ajuda leitores de tela mais antigos.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} h-full antialiased`}
    >
      {/*
        ♿ A11Y — LIÇÃO 4: Skip Link (link para pular navegação)
        Usuários que navegam APENAS pelo teclado (Tab, Shift+Tab) ou leitores de tela
        precisam passar por TODO o menu a cada nova página, o que é exaustivo.
        O "Skip Link" é um link INVISÍVEL que aparece só quando recebe foco (via Tab),
        permitindo pular direto para o conteúdo principal.

        Como funciona:
        - É o PRIMEIRO elemento focável da página
        - Fica visualmente escondido com -translate-y-full (fora da tela)
        - Quando o usuário pressiona Tab, ele aparece (focus:translate-y-0)
        - O href="#main-content" aponta para o <main id="main-content">

        Padrão WCAG: Critério 2.4.1 (Nível A) — Bypass Blocks.
      */}
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <a
          href="#main-content"
          className="
            sr-only focus:not-sr-only
            focus:fixed focus:top-4 focus:left-4 focus:z-50
            focus:bg-blue-700 focus:text-white
            focus:px-4 focus:py-2 focus:rounded focus:font-semibold
            focus:shadow-lg focus:outline-2 focus:outline-white
          "
        >
          Pular para o conteúdo principal
        </a>
        {children}
      </body>
    </html>
  );
}