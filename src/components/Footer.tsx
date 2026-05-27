// ============================================================
// ♿ A11Y — LIÇÃO 21: Footer acessível
// ============================================================

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    // ♿ A11Y — <footer> é uma landmark region automática.
    // Leitores de tela navegam diretamente para landmarks com atalhos de teclado.
    // Não precisa de aria-label quando é o único <footer> da página.
    // Se houver footer dentro de <article> ou <section>, adicione aria-label.
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">

          {/* Coluna 1: Sobre */}
          <div>
            <h2 className="text-white font-bold text-base mb-3">
              🛍️ Loja Acessível
            </h2>
            <p className="text-sm leading-relaxed">
              Projeto educacional sobre acessibilidade web (a11y) com Next.js e Tailwind.
              Cada componente contém comentários explicativos.
            </p>
          </div>

          {/* Coluna 2: Navegação */}
          <div>
            {/*
              ♿ A11Y — Segundo <nav> na página.
              Este nav PRECISA de aria-label para se diferenciar do nav do header.
              Leitores de tela listam as landmarks: se ambos forem "Navegação",
              o usuário não sabe qual é qual.
            */}
            <nav aria-label="Navegação do rodapé">
              <h2 className="text-white font-bold text-base mb-3">Navegação</h2>
              <ul className="flex flex-col gap-2" role="list">
                {[
                  { href: "/", label: "Início" },
                  { href: "/produtos", label: "Produtos" },
                  { href: "/sobre", label: "Sobre nós" },
                  { href: "/contato", label: "Contato" },
                ].map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="
                        text-sm hover:text-white transition-colors
                        focus:outline-none focus:text-white focus:underline rounded
                      "
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Coluna 3: Recursos A11Y */}
          <div>
            <h2 className="text-white font-bold text-base mb-3">
              Recursos de Acessibilidade
            </h2>
            <ul className="flex flex-col gap-2" role="list">
              {[
                {
                  href: "https://www.w3.org/WAI/WCAG21/quickref/",
                  label: "WCAG 2.1 (W3C)",
                  external: true,
                },
                {
                  href: "https://webaim.org",
                  label: "WebAIM",
                  external: true,
                },
                {
                  href: "https://a11yproject.com",
                  label: "The A11Y Project",
                  external: true,
                },
              ].map((link) => (
                <li key={link.href}>
                  {/*
                    ♿ A11Y — Links externos: avise o usuário!
                    Links que abrem nova aba devem informar isso programaticamente.
                    target="_blank" sem aviso é uma surpresa negativa para usuários
                    de leitores de tela que não vêem o ícone de "nova janela".

                    Técnica: adicionar texto sr-only "(abre em nova janela)"
                    OU usar aria-label que inclua a informação.
                  */}
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="
                      text-sm hover:text-white transition-colors
                      focus:outline-none focus:text-white focus:underline rounded
                    "
                  >
                    {link.label}
                    {link.external && (
                      <>
                        {" "}
                        {/* Ícone visual de "nova janela" — aria-hidden pois é decorativo */}
                        <span aria-hidden="true">↗</span>
                        {/* Texto para leitor de tela informando que abre nova janela */}
                        <span className="sr-only">(abre em nova janela)</span>
                      </>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Linha separadora */}
        {/*
          ♿ A11Y — <hr> é semanticamente uma separação temática.
          role="separator" é implícito no <hr>.
          Não precisa de atributos extras.
        */}
        <hr className="border-gray-700 mb-6" />

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <p>
            {/* ♿ A11Y — <time> é semântico para datas */}
            © <time dateTime={String(currentYear)}>{currentYear}</time> Loja Acessível.
            Projeto educacional — sem fins comerciais.
          </p>
          <p className="flex items-center gap-1">
            {/* ♿ aria-hidden no emoji decorativo */}
            <span aria-hidden="true">♿</span>
            Construído com foco em acessibilidade
          </p>
        </div>
      </div>
    </footer>
  );
}
