// ============================================================
// ♿ A11Y — LIÇÃO AVANÇADA: Leitura Atômica (Atomic Reading)
// ============================================================
//
// PROBLEMA:
// Quando um item de lista tem múltiplos elementos filhos (ícone, título, descrição),
// o leitor de tela os anuncia SEPARADAMENTE conforme o usuário navega:
//
//   [Tab] → "✅" (anuncia o ícone)
//   [Tab] → "Pagamento confirmado" (anuncia o título)
//   [Tab] → "Seu pagamento foi processado..." (anuncia a descrição)
//
// Para itens de STATUS CRÍTICO (erros, falhas), isso é uma péssima experiência:
// o usuário perde contexto, precisa de múltiplos pressionamentos de tecla para
// entender uma única mensagem de erro.
//
// SOLUÇÃO: Forçar o leitor de tela a ler o item como uma UNIDADE — uma fala só.
//
// Este arquivo demonstra 3 técnicas para isso, com diferentes trade-offs.
// ============================================================

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leitura Atômica — Técnicas de A11Y",
  description:
    "Demonstração de 3 técnicas para forçar leitores de tela a ler um item de lista como uma única fala contínua.",
};

// ============================================================
// TIPOS E DADOS MOCK (simula o JSON recebido)
// ============================================================

type StatusItem = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

type StatusData = {
  success: StatusItem[];
  pending: StatusItem[];
  failure: StatusItem[];
};

// Simula o JSON recebido de uma API / prop externa
const statusData: StatusData = {
  success: [
    {
      id: "s1",
      icon: "✅",
      title: "Pagamento confirmado",
      description: "Seu pagamento de R$ 149,90 foi processado com sucesso em 14/05/2025.",
    },
    {
      id: "s2",
      icon: "✅",
      title: "E-mail verificado",
      description: "Seu endereço de e-mail foi verificado com sucesso.",
    },
    {
      id: "s3",
      icon: "✅",
      title: "Perfil atualizado",
      description: "Suas informações pessoais foram salvas.",
    },
  ],
  pending: [
    {
      id: "p1",
      icon: "⏳",
      title: "Análise de crédito em andamento",
      description: "Seu pedido está em análise. Prazo estimado: 2 dias úteis.",
    },
    {
      id: "p2",
      icon: "⏳",
      title: "Documento pendente",
      description: "Aguardando envio do comprovante de residência.",
    },
    {
      id: "p3",
      icon: "⏳",
      title: "Aguardando confirmação",
      description: "O vendedor ainda não confirmou o envio do pedido.",
    },
  ],
  failure: [
    {
      id: "f1",
      icon: "❌",
      title: "Cartão recusado",
      description:
        "O cartão final 4242 foi recusado pela operadora. Tente outro meio de pagamento.",
    },
    {
      id: "f2",
      icon: "❌",
      title: "Endereço inválido",
      description:
        "O CEP 00000-000 não foi encontrado. Verifique o endereço informado.",
    },
    {
      id: "f3",
      icon: "❌",
      title: "Sessão expirada",
      description:
        "Sua sessão expirou após 30 minutos de inatividade. Faça login novamente.",
    },
  ],
};

// ============================================================
// COMPONENTE: Item padrão (leitura FRAGMENTADA)
// Usado em success e pending para demonstrar o PROBLEMA
// ============================================================

function StandardItem({ item }: { item: StatusItem }) {
  // ⚠️ Esta implementação é INTENCIONAL para mostrar o problema.
  // O leitor de tela vai ler cada filho separadamente:
  // Primeiro lê o <span> do ícone, depois o <strong> do título, depois o <p>.
  // Para itens de confirmação/pendência, isso é tolerável.
  // Para erros críticos, é péssimo — o usuário perde o contexto da falha.
  return (
    <li className="flex items-start gap-3 p-4 rounded-lg bg-white border border-gray-200">
      {/* O ícone será lido separadamente: "símbolo de marca de verificação" */}
      <span className="text-xl mt-0.5 flex-shrink-0" role="img" aria-label={item.icon === "✅" ? "sucesso" : "aguardando"}>
        {item.icon}
      </span>
      <div>
        {/* O título será lido separadamente */}
        <strong className="block text-sm font-semibold text-gray-900">{item.title}</strong>
        {/* A descrição será lida separadamente */}
        <p className="text-sm text-gray-600 mt-0.5">{item.description}</p>
      </div>
    </li>
  );
}

// ============================================================
// TÉCNICA 1: aria-label no elemento raiz
// ============================================================
// COMO FUNCIONA:
//   O aria-label em um elemento SUBSTITUI completamente o nome acessível
//   calculado a partir dos filhos. Em vez de ler cada filho, o leitor de
//   tela lê apenas o valor do aria-label — em uma fala única.
//
// OBRIGATÓRIO junto com esta técnica:
//   Todos os filhos devem ter aria-hidden="true". Sem isso, alguns leitores
//   de tela (NVDA em browse mode) podem ler O aria-label E os filhos,
//   duplicando o conteúdo.
//
// O QUE O LEITOR ANUNCIA (VoiceOver / NVDA):
//   "Falha: Cartão recusado. O cartão final 4242 foi recusado pela operadora.
//    Tente outro meio de pagamento. Item de lista."
//
// COMPATIBILIDADE: ✅ NVDA ✅ JAWS ✅ VoiceOver ✅ TalkBack ✅ Narrator
// QUANDO USAR: Qualquer item estático com estrutura interna complexa.
// LIMITAÇÃO: O texto do aria-label fica "hardcoded" no atributo — não
//            reage a mudanças nos filhos sem atualização manual.
// ============================================================

function AtomicItemAriaLabel({ item }: { item: StatusItem }) {
  // Montamos o texto completo que o leitor de tela vai ler.
  // A formatação com "." entre partes garante pausas naturais na fala.
  const accessibleLabel = `Falha: ${item.title}. ${item.description}`;

  return (
    <li
      // aria-label no <li> substitui a leitura de todos os filhos.
      aria-label={accessibleLabel}
      className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200"
    >
      {/*
        aria-hidden="true" em TODOS os filhos.
        Eles ainda são visíveis na tela, mas o leitor de tela os ignora
        porque o pai já tem aria-label com o conteúdo completo.
      */}
      <span aria-hidden="true" className="text-xl mt-0.5 flex-shrink-0">
        {item.icon}
      </span>
      <div>
        <strong aria-hidden="true" className="block text-sm font-semibold text-red-900">
          {item.title}
        </strong>
        <p aria-hidden="true" className="text-sm text-red-700 mt-0.5">
          {item.description}
        </p>
      </div>
    </li>
  );
}

// ============================================================
// TÉCNICA 2: sr-only com texto completo + aria-hidden no visual
// ============================================================
// COMO FUNCIONA:
//   Criamos um elemento INVISÍVEL (sr-only) com o texto completo concatenado.
//   O conteúdo visual é envolvido em um div com aria-hidden="true".
//   O leitor de tela encontra apenas o sr-only e o lê como texto contínuo.
//
// sr-only (Tailwind) = posição absoluta, 1x1px, overflow hidden.
//   → Invisível na tela mas PRESENTE no fluxo de acessibilidade.
//   → DIFERENTE de aria-hidden (que esconde do leitor) e de display:none
//     (que esconde dos dois).
//
// O QUE O LEITOR ANUNCIA:
//   "Falha: Endereço inválido. O CEP 00000-000 não foi encontrado.
//    Verifique o endereço informado. Item de lista."
//
// COMPATIBILIDADE: ✅ NVDA ✅ JAWS ✅ VoiceOver ✅ TalkBack ✅ Narrator
// QUANDO USAR: Quando você precisa de flexibilidade para formatar o texto
//              acessível de forma diferente do visual (ex: adicionar contexto,
//              remover formatação decorativa, traduzir siglas).
// VANTAGEM sobre Técnica 1: O texto sr-only pode conter HTML semântico se
//              necessário, o que aria-label não suporta (é sempre plain text).
// ============================================================

function AtomicItemSrOnly({ item }: { item: StatusItem }) {
  return (
    <li className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
      {/*
        SPAN sr-only: invisível na tela, lido pelo leitor.
        Texto formatado como uma frase completa com pontuação adequada
        para criar pausas naturais na síntese de voz.
      */}
      <span className="sr-only">
        Falha: {item.title}. {item.description}
      </span>

      {/*
        aria-hidden="true" no wrapper visual:
        Todo o conteúdo visual é ignorado pelo leitor de tela.
        O usuário vidente vê o layout normal; o usuário de leitor de tela
        ouve o texto limpo do sr-only.
      */}
      <div aria-hidden="true" className="flex items-start gap-3 w-full">
        <span className="text-xl mt-0.5 flex-shrink-0">{item.icon}</span>
        <div>
          <strong className="block text-sm font-semibold text-red-900">
            {item.title}
          </strong>
          <p className="text-sm text-red-700 mt-0.5">{item.description}</p>
        </div>
      </div>
    </li>
  );
}

// ============================================================
// TÉCNICA 3: role="text" (VoiceOver-first)
// ============================================================
// COMO FUNCIONA:
//   role="text" instrui o leitor de tela a tratar o elemento e TODOS os seus
//   filhos como um único nó de texto — sem divisões entre elementos filhos.
//   É como se o conteúdo fosse um parágrafo de texto sem estrutura interna.
//
// ⚠️ ATENÇÃO — IMPORTANTE:
//   role="text" NÃO faz parte da especificação ARIA oficial (ARIA 1.1 / 1.2).
//   Ele é um "role" proprietário que:
//     ✅ VoiceOver (macOS e iOS) → suporta perfeitamente
//     ✅ TalkBack (Android)      → suporta em versões recentes
//     ⚠️  NVDA                   → comportamento inconsistente (pode ignorar)
//     ⚠️  JAWS                   → comportamento inconsistente
//     ❌ Narrator (Windows)      → não suporta
//
// QUANDO USAR: Quando o público-alvo primário usa iOS/macOS (VoiceOver).
//              Use SEMPRE em conjunto com uma das outras técnicas como fallback.
//              Nunca como técnica única.
//
// VANTAGEM: Não exige aria-hidden nos filhos — os filhos ainda são navegáveis
//           em screen readers que não suportam role="text". Graceful degradation.
//
// O QUE O LEITOR ANUNCIA no VoiceOver:
//   "Falha: Sessão expirada. Sua sessão expirou após 30 minutos de
//    inatividade. Faça login novamente. Item de lista."
//
// O QUE ACONTECE no NVDA (fallback):
//   Lê cada filho separadamente (degradação graciosa — não quebra, só não atomiza).
// ============================================================

function AtomicItemRoleText({ item }: { item: StatusItem }) {
  return (
    <li className="p-4 rounded-lg bg-red-50 border border-red-200">
      {/*
        role="text" no wrapper interno.
        Não coloque no <li> diretamente — pode conflitar com role="listitem".
        O wrapper vira um "nó de texto" para o VoiceOver.
      */}
      <div
        role="text"
        className="flex items-start gap-3"
      >
        {/*
          Aqui os filhos NÃO têm aria-hidden.
          O VoiceOver ignora a estrutura interna e lê tudo como texto plano.
          Outros leitores (NVDA) lerão os filhos separadamente — degradação graciosa.

          Dica: adicione espaços explícitos entre os elementos para que a
          concatenação de texto fique natural: "❌ Sessão expirada. Sua sessão..."
          Sem espaço, o VoiceOver pode ler: "❌Sessão expiradaSua sessão..."
        */}
        <span className="text-xl mt-0.5 flex-shrink-0">{item.icon}{" "}</span>
        <div>
          <strong className="block text-sm font-semibold text-red-900">
            {"Falha: "}{item.title}{". "}
          </strong>
          <p className="text-sm text-red-700 mt-0.5">{item.description}</p>
        </div>
      </div>
    </li>
  );
}

// ============================================================
// PÁGINA PRINCIPAL
// ============================================================

export default function LeituraAtomicaPage() {
  const { success, pending, failure } = statusData;

  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <div className="max-w-5xl mx-auto px-4 py-10 md:py-16">

          {/* Cabeçalho da página */}
          <div className="mb-10">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-2">
              Lição avançada de A11Y
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Leitura Atômica
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Como forçar um leitor de tela a ler um item de lista como uma{" "}
              <strong>única fala contínua</strong>, sem fragmentar ícone, título
              e descrição em três anúncios separados.
            </p>
          </div>

          {/* ============================================================
              BLOCO: O JSON recebido
              ============================================================
              Mostramos o shape do dado para contextualizar o exercício.
          */}
          <section aria-labelledby="json-heading" className="mb-12">
            <h2 id="json-heading" className="text-xl font-bold text-gray-900 mb-3">
              📦 Estrutura do JSON recebido
            </h2>
            <pre className="bg-gray-950 text-green-400 text-sm rounded-xl p-5 overflow-x-auto leading-relaxed">
              <code>{`{
  "success": [ { "id", "icon", "title", "description" }, ... ],
  "pending": [ { "id", "icon", "title", "description" }, ... ],
  "failure": [ { "id", "icon", "title", "description" }, ... ]
}`}</code>
            </pre>
          </section>

          {/* ============================================================
              BLOCO: O PROBLEMA — listas success e pending
              ============================================================
              Renderização PADRÃO sem técnicas atômicas.
              O leitor de tela lê cada filho separadamente.
          */}
          <section aria-labelledby="problem-heading" className="mb-14">
            <h2 id="problem-heading" className="text-2xl font-bold text-gray-900 mb-2">
              ⚠️ Sem técnica atômica — leitura fragmentada
            </h2>
            <p className="text-gray-600 mb-6 text-sm max-w-2xl">
              As listas abaixo usam a implementação padrão. O leitor de tela navega
              elemento por elemento: ícone → título → descrição — três anúncios
              separados por item. Para status não-críticos isso é aceitável.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Lista: Success */}
              <div>
                <h3 className="text-base font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <span aria-hidden="true">✅</span> Sucesso
                  <span className="text-xs font-normal text-gray-400 ml-1">
                    — leitura fragmentada (padrão)
                  </span>
                </h3>
                <ul
                  role="list"
                  aria-label="Itens com sucesso"
                  className="flex flex-col gap-2"
                >
                  {success.map((item) => (
                    <StandardItem key={item.id} item={item} />
                  ))}
                </ul>
              </div>

              {/* Lista: Pending */}
              <div>
                <h3 className="text-base font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                  <span aria-hidden="true">⏳</span> Pendente
                  <span className="text-xs font-normal text-gray-400 ml-1">
                    — leitura fragmentada (padrão)
                  </span>
                </h3>
                <ul
                  role="list"
                  aria-label="Itens pendentes"
                  className="flex flex-col gap-2"
                >
                  {pending.map((item) => (
                    <StandardItem key={item.id} item={item} />
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <hr className="border-gray-200 mb-14" />

          {/* ============================================================
              BLOCO: A SOLUÇÃO — lista failure com 3 técnicas
              ============================================================
          */}
          <section aria-labelledby="solution-heading" className="mb-14">
            <h2 id="solution-heading" className="text-2xl font-bold text-gray-900 mb-2">
              🎯 Com técnicas atômicas — lista de falhas
            </h2>
            <p className="text-gray-600 mb-8 text-sm max-w-2xl">
              Cada item abaixo usa uma técnica diferente. Visualmente são
              idênticos. A diferença é como o leitor de tela os anuncia —
              em todos os casos abaixo, o item inteiro é lido como uma única fala.
            </p>

            <ul
              role="list"
              aria-label="Itens com falha"
              className="flex flex-col gap-4"
            >
              {/* Item 0 — Técnica 1 */}
              <li className="flex flex-col gap-2">
                <TechniqueBadge
                  number={1}
                  name="aria-label no elemento raiz"
                  compatibility="NVDA · JAWS · VoiceOver · TalkBack · Narrator"
                  compatibilityLevel="full"
                />
                {/*
                  Passamos o item diretamente.
                  O AtomicItemAriaLabel renderiza um <li> internamente —
                  por isso este wrapper é um <li> com role="presentation"
                  para não criar um <li> dentro de outro <li>.
                */}
                <ul role="list" className="contents">
                  <AtomicItemAriaLabel item={failure[0]} />
                </ul>
                <ReaderAnnouncement text={`"Falha: ${failure[0].title}. ${failure[0].description}. Item de lista."`} />
              </li>

              {/* Item 1 — Técnica 2 */}
              <li className="flex flex-col gap-2">
                <TechniqueBadge
                  number={2}
                  name="sr-only + aria-hidden no visual"
                  compatibility="NVDA · JAWS · VoiceOver · TalkBack · Narrator"
                  compatibilityLevel="full"
                />
                <ul role="list" className="contents">
                  <AtomicItemSrOnly item={failure[1]} />
                </ul>
                <ReaderAnnouncement text={`"Falha: ${failure[1].title}. ${failure[1].description}. Item de lista."`} />
              </li>

              {/* Item 2 — Técnica 3 */}
              <li className="flex flex-col gap-2">
                <TechniqueBadge
                  number={3}
                  name='role="text" (VoiceOver-first)'
                  compatibility="VoiceOver ✅ · TalkBack ✅ · NVDA ⚠️ · JAWS ⚠️ · Narrator ❌"
                  compatibilityLevel="partial"
                />
                <ul role="list" className="contents">
                  <AtomicItemRoleText item={failure[2]} />
                </ul>
                <ReaderAnnouncement
                  text={`"Falha: ${failure[2].title}. ${failure[2].description}. Item de lista."`}
                  note="No NVDA/JAWS, o item pode ser lido de forma fragmentada (degradação graciosa)."
                />
              </li>
            </ul>
          </section>

          <hr className="border-gray-200 mb-14" />

          {/* ============================================================
              TABELA COMPARATIVA
          */}
          <section aria-labelledby="comparison-heading" className="mb-14">
            <h2 id="comparison-heading" className="text-2xl font-bold text-gray-900 mb-6">
              📊 Comparativo das técnicas
            </h2>

            {/*
              ♿ A11Y — Tabelas acessíveis precisam de:
                <caption> → título da tabela (lido antes das células)
                <thead>   → cabeçalhos com <th scope="col">
                <tbody>   → dados com <td>
                scope="row" em <th> de linha

              Padrão WCAG: Critério 1.3.1 — Info and Relationships.
            */}
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm text-left">
                <caption className="sr-only">
                  Comparativo de técnicas de leitura atômica para leitores de tela
                </caption>
                <thead className="bg-gray-50 text-gray-700 font-semibold">
                  <tr>
                    <th scope="col" className="px-4 py-3 border-b border-gray-200">Técnica</th>
                    <th scope="col" className="px-4 py-3 border-b border-gray-200">Como funciona</th>
                    <th scope="col" className="px-4 py-3 border-b border-gray-200">Compatibilidade</th>
                    <th scope="col" className="px-4 py-3 border-b border-gray-200">Quando usar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="bg-white">
                    <th scope="row" className="px-4 py-3 font-semibold text-gray-900 align-top">
                      <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">aria-label</code>
                      <span className="block text-xs text-gray-500 font-normal mt-0.5">no container</span>
                    </th>
                    <td className="px-4 py-3 text-gray-600 align-top">
                      Substitui todos os filhos por um texto inline.
                      Requer <code className="text-xs bg-gray-100 px-1 rounded">aria-hidden</code> nos filhos.
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-semibold">
                        Universal
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 align-top">
                      Conteúdo estático. Texto simples sem HTML interno.
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <th scope="row" className="px-4 py-3 font-semibold text-gray-900 align-top">
                      <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">sr-only</code>
                      <span className="block text-xs text-gray-500 font-normal mt-0.5">+ aria-hidden no visual</span>
                    </th>
                    <td className="px-4 py-3 text-gray-600 align-top">
                      Texto invisível para o leitor + visual oculto do leitor.
                      Separa completamente as duas camadas.
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-semibold">
                        Universal
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 align-top">
                      Quando o texto acessível difere do visual. Suporta
                      formatação rica no sr-only.
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <th scope="row" className="px-4 py-3 font-semibold text-gray-900 align-top">
                      <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">role=&quot;text&quot;</code>
                      <span className="block text-xs text-gray-500 font-normal mt-0.5">não-padrão</span>
                    </th>
                    <td className="px-4 py-3 text-gray-600 align-top">
                      Trata o elemento e filhos como nó de texto único.
                      Não requer aria-hidden nos filhos.
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full font-semibold">
                        Parcial (iOS/Android)
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 align-top">
                      Complemento para VoiceOver/TalkBack. Nunca como técnica
                      única — use com aria-label ou sr-only como base.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ============================================================
              DICA FINAL: Recomendação de uso combinado
          */}
          <section
            aria-labelledby="recommendation-heading"
            className="bg-blue-50 border border-blue-200 rounded-2xl p-6 md:p-8"
          >
            <h2
              id="recommendation-heading"
              className="text-xl font-bold text-blue-900 mb-3"
            >
              💡 Recomendação: combine as técnicas 2 + 3
            </h2>
            <p className="text-blue-800 text-sm leading-relaxed mb-4">
              Para máxima compatibilidade em itens críticos (erros, alertas, falhas),
              combine <strong>sr-only + aria-hidden</strong> com{" "}
              <strong>role=&quot;text&quot;</strong>:
            </p>
            <pre className="bg-blue-900 text-blue-100 text-xs rounded-xl p-4 overflow-x-auto leading-relaxed">
              <code>{`<li>
  {/* Técnica 2: texto acessível para NVDA/JAWS/Narrator */}
  <span className="sr-only">
    Falha: {item.title}. {item.description}
  </span>

  {/* Técnica 3: role="text" para VoiceOver/TalkBack lendo o visual */}
  <div role="text" aria-hidden="true">
    <span>{item.icon} </span>
    <strong>Falha: {item.title}. </strong>
    <span>{item.description}</span>
  </div>
</li>`}</code>
            </pre>
            <p className="text-blue-700 text-xs mt-3">
              Com esta combinação: NVDA e JAWS leem o sr-only. VoiceOver e TalkBack
              leem o role=&quot;text&quot; visual. Todos recebem uma fala atômica.
            </p>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}

// ============================================================
// COMPONENTES AUXILIARES DE INTERFACE (didáticos)
// ============================================================

// Badge que identifica qual técnica cada item usa
function TechniqueBadge({
  number,
  name,
  compatibility,
  compatibilityLevel,
}: {
  number: number;
  name: string;
  compatibility: string;
  compatibilityLevel: "full" | "partial";
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-700 text-white text-xs font-bold flex-shrink-0">
        {number}
      </span>
      <code className="text-xs font-semibold text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
        {name}
      </code>
      <span
        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          compatibilityLevel === "full"
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800"
        }`}
      >
        {compatibility}
      </span>
    </div>
  );
}

// Caixa mostrando o que o leitor de tela vai anunciar
function ReaderAnnouncement({
  text,
  note,
}: {
  text: string;
  note?: string;
}) {
  return (
    // ♿ A11Y — Esta caixa é puramente didática / decorativa.
    // aria-hidden="true" porque o conteúdo já está no item acima.
    // Não queremos que o leitor de tela leia o "anúncio simulado" além do item real.
    <div
      aria-hidden="true"
      className="flex flex-col gap-1 pl-3 border-l-2 border-blue-300"
    >
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
        🔊 Leitor de tela anuncia:
      </p>
      <p className="text-xs text-blue-800 italic font-medium">{text}</p>
      {note && (
        <p className="text-xs text-yellow-700">⚠️ {note}</p>
      )}
    </div>
  );
}
