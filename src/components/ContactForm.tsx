"use client";

import { useState } from "react";

// ============================================================
// ♿ A11Y — LIÇÃO 17: Formulários acessíveis — o tema mais crítico
// ============================================================
// Formulários são onde mais ocorrem falhas de acessibilidade.
// Os problemas mais comuns:
//
//   1. Input sem <label> associado
//   2. Placeholder usado COMO label (some quando o usuário digita)
//   3. Erros indicados apenas por cor (ex: borda vermelha)
//   4. Mensagens de erro não vinculadas ao campo
//   5. Campos obrigatórios não indicados programaticamente
//   6. Submit que não informa o resultado da ação
//
// PADRÃO WCAG: Critérios 1.3.1, 3.3.1, 3.3.2, 4.1.2

type FormField = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormField, string>>;

const SUBJECTS = [
  "Dúvida sobre produto",
  "Problema com pedido",
  "Sugestão de melhoria",
  "Elogio",
  "Outro",
];

export default function ContactForm() {
  const [fields, setFields] = useState<FormField>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!fields.name.trim()) errs.name = "Nome é obrigatório";
    if (!fields.email.trim()) {
      errs.email = "E-mail é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      errs.email = "Digite um e-mail válido (ex: nome@exemplo.com)";
    }
    if (!fields.subject) errs.subject = "Selecione um assunto";
    if (!fields.message.trim()) {
      errs.message = "Mensagem é obrigatória";
    } else if (fields.message.trim().length < 20) {
      errs.message = "A mensagem deve ter pelo menos 20 caracteres";
    }
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      // ♿ A11Y — Focar no primeiro campo com erro após submit inválido
      // Isso garante que o usuário de leitor de tela saiba que algo deu errado.
      const firstErrorKey = Object.keys(errs)[0] as keyof FormField;
      document.getElementById(firstErrorKey)?.focus();
      return;
    }
    setErrors({});
    setSubmitting(true);
    // Simula envio
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  }

  // ============================================================
  // ♿ A11Y — LIÇÃO 18: Feedback de sucesso/erro com role="alert"
  // ============================================================
  // Quando o formulário é enviado, precisamos ANUNCIAR o resultado.
  // role="alert" cria uma "live region" — o leitor de tela anuncia
  // automaticamente qualquer mudança de conteúdo dentro dela.
  //
  // Tipos de live regions:
  //   role="alert"     → anuncia imediatamente, interrompendo o leitor (urgente)
  //   role="status"    → anuncia quando o leitor tiver uma pausa (não urgente)
  //   aria-live="polite"   → equivalente a role="status"
  //   aria-live="assertive" → equivalente a role="alert"
  //
  // Padrão WCAG: Critério 4.1.3 (Nível AA) — Status Messages.
  if (submitted) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="bg-green-50 border border-green-300 rounded-xl p-8 text-center"
      >
        <div aria-hidden="true" className="text-4xl mb-3">✅</div>
        <h3 className="text-xl font-bold text-green-800 mb-2">
          Mensagem enviada com sucesso!
        </h3>
        <p className="text-green-700">
          Obrigado, {fields.name}! Respondemos em até 2 dias úteis no e-mail{" "}
          <strong>{fields.email}</strong>.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setFields({ name: "", email: "", subject: "", message: "" });
          }}
          className="mt-4 text-green-700 underline hover:text-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
        >
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Formulário de contato"
      className="flex flex-col gap-5"
    >
      {/* ============================================================
          ♿ A11Y — LIÇÃO 19: <label> SEMPRE vinculado ao <input>
          ============================================================
          Existem 2 formas de associar label ao input:

          FORMA 1 — htmlFor/id (explícita, recomendada):
            <label htmlFor="email">E-mail</label>
            <input id="email" />

          FORMA 2 — Envolver o input no label (implícita):
            <label>
              E-mail
              <input />
            </label>

          ❌ PROIBIDO: usar apenas placeholder como label
            <input placeholder="Digite seu e-mail" />
            O placeholder: (1) some quando o usuário digita, (2) tem contraste baixo,
            (3) não é anunciado como label pelos leitores de tela.

          ❌ PROIBIDO: label flutuante (floating label) sem ID/for
            Muitos designs modernos fazem isso errado.

          Padrão WCAG: Critério 1.3.1 e 3.3.2 (Nível A).
      */}

      {/* Campo: Nome */}
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-semibold text-gray-700">
          {/* ♿ A11Y — Indicador de obrigatório */}
          {/*
            aria-hidden="true" no asterisco visual — o aria-required no input
            já informa programaticamente que o campo é obrigatório.
            Duplicar "obrigatório" causaria redundância no leitor.
          */}
          Nome completo{" "}
          <span aria-hidden="true" className="text-red-500">*</span>
        </label>

        {/* ============================================================
            ♿ A11Y — LIÇÃO 20: aria-required, aria-invalid, aria-errormessage
            ============================================================
            aria-required="true"
              → Informa que o campo é obrigatório PROGRAMATICAMENTE.
              → O leitor anuncia: "Nome completo, edição de texto, obrigatório"
              → NÃO substitui required (mantenha ambos para validação nativa)

            aria-invalid="true"
              → Informa que o valor atual é inválido.
              → O leitor anuncia: "Nome completo, inválido, edição de texto"
              → Só aplique APÓS o usuário tentar submeter (não no load)

            aria-errormessage="nome-do-id-da-mensagem"
              → Vincula o campo à mensagem de erro (por ID).
              → O leitor lê a mensagem ao focar no campo com erro.
              → MAIS específico que aria-describedby para erros.
              → Padrão: aria-errormessage (ARIA 1.1+) OU aria-describedby

            Padrão WCAG: Critério 3.3.1 (Nível A) — Error Identification.
                         Critério 4.1.2 (Nível A) — Name, Role, Value.
        */}
        <input
          type="text"
          id="name"
          name="name"
          value={fields.name}
          onChange={(e) => setFields({ ...fields, name: e.target.value })}
          required
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-errormessage={errors.name ? "error-name" : undefined}
          autoComplete="name"
          placeholder="Ex: Maria Silva"
          className={`
            border rounded-lg px-4 py-2.5 text-gray-900 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500
            transition-colors
            ${errors.name
              ? "border-red-500 bg-red-50 focus:ring-red-500"
              : "border-gray-300 bg-white hover:border-gray-400"
            }
          `}
        />

        {/* ============================================================
            ♿ A11Y — Mensagem de erro acessível
            ============================================================
            A mensagem de erro NÃO pode ser apenas visual (cor vermelha na borda).
            Precisa de texto explicativo vinculado ao campo via aria-errormessage.

            role="alert" → faz o leitor anunciar imediatamente quando o erro aparece.
            id="error-name" → referenciado pelo aria-errormessage do input acima.
        */}
        {errors.name && (
          <span
            id="error-name"
            role="alert"
            className="flex items-center gap-1 text-sm text-red-600"
          >
            <span aria-hidden="true">⚠</span>
            {errors.name}
          </span>
        )}
      </div>

      {/* Campo: E-mail */}
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-semibold text-gray-700">
          E-mail{" "}
          <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        {/*
          ♿ A11Y — type="email" ajuda leitores de tela e teclados mobile.
          Em celulares, o teclado abre com @ visível automaticamente.
          autoComplete="email" ajuda gerenciadores de senha e navegadores.
        */}
        <input
          type="email"
          id="email"
          name="email"
          value={fields.email}
          onChange={(e) => setFields({ ...fields, email: e.target.value })}
          required
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-errormessage={errors.email ? "error-email" : undefined}
          autoComplete="email"
          placeholder="Ex: maria@exemplo.com"
          className={`
            border rounded-lg px-4 py-2.5 text-gray-900 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500
            transition-colors
            ${errors.email
              ? "border-red-500 bg-red-50 focus:ring-red-500"
              : "border-gray-300 bg-white hover:border-gray-400"
            }
          `}
        />
        {errors.email && (
          <span id="error-email" role="alert" className="flex items-center gap-1 text-sm text-red-600">
            <span aria-hidden="true">⚠</span>
            {errors.email}
          </span>
        )}
      </div>

      {/* Campo: Assunto (select) */}
      <div className="flex flex-col gap-1">
        <label htmlFor="subject" className="text-sm font-semibold text-gray-700">
          Assunto{" "}
          <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        {/*
          ♿ A11Y — <select> nativo vs componente customizado
          O <select> nativo já é acessível por padrão (teclado, leitor de tela).
          Componentes dropdown customizados (ex: React Select sem a11y) perdem
          todo esse suporte. Se criar custom dropdown, precisa implementar:
          role="listbox", role="option", aria-selected, aria-expanded,
          navegação por teclado (setas, Enter, Esc, Home, End).
          Quando possível: USE O NATIVO.
        */}
        <select
          id="subject"
          name="subject"
          value={fields.subject}
          onChange={(e) => setFields({ ...fields, subject: e.target.value })}
          required
          aria-required="true"
          aria-invalid={!!errors.subject}
          aria-errormessage={errors.subject ? "error-subject" : undefined}
          className={`
            border rounded-lg px-4 py-2.5 text-gray-900 text-sm bg-white
            focus:outline-none focus:ring-2 focus:ring-blue-500
            transition-colors
            ${errors.subject
              ? "border-red-500 bg-red-50 focus:ring-red-500"
              : "border-gray-300 hover:border-gray-400"
            }
          `}
        >
          <option value="">Selecione um assunto...</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {errors.subject && (
          <span id="error-subject" role="alert" className="flex items-center gap-1 text-sm text-red-600">
            <span aria-hidden="true">⚠</span>
            {errors.subject}
          </span>
        )}
      </div>

      {/* Campo: Mensagem */}
      <div className="flex flex-col gap-1">
        <label htmlFor="message" className="text-sm font-semibold text-gray-700">
          Mensagem{" "}
          <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        {/*
          ♿ A11Y — aria-describedby para instrução adicional
          Aqui usamos aria-describedby (não aria-errormessage) para a instrução
          de "mínimo 20 caracteres". Instrução ≠ erro.
          O leitor anuncia ao focar: "Mensagem, área de texto, obrigatório.
          Descreva sua dúvida ou sugestão com detalhes. Mínimo 20 caracteres."
        */}
        <textarea
          id="message"
          name="message"
          value={fields.message}
          onChange={(e) => setFields({ ...fields, message: e.target.value })}
          required
          aria-required="true"
          aria-invalid={!!errors.message}
          aria-errormessage={errors.message ? "error-message" : undefined}
          aria-describedby="message-hint"
          rows={5}
          placeholder="Descreva sua dúvida ou sugestão..."
          className={`
            border rounded-lg px-4 py-2.5 text-gray-900 text-sm resize-y
            focus:outline-none focus:ring-2 focus:ring-blue-500
            transition-colors
            ${errors.message
              ? "border-red-500 bg-red-50 focus:ring-red-500"
              : "border-gray-300 bg-white hover:border-gray-400"
            }
          `}
        />
        {/* Dica permanente (não é erro) */}
        <span id="message-hint" className="text-xs text-gray-500">
          Mínimo 20 caracteres. {fields.message.length > 0 && `(${fields.message.length} digitados)`}
        </span>
        {errors.message && (
          <span id="error-message" role="alert" className="flex items-center gap-1 text-sm text-red-600">
            <span aria-hidden="true">⚠</span>
            {errors.message}
          </span>
        )}
      </div>

      {/* Indicação de campos obrigatórios */}
      <p className="text-xs text-gray-500">
        <span aria-hidden="true" className="text-red-500">*</span>{" "}
        Campos obrigatórios
      </p>

      {/* ============================================================
          ♿ A11Y — Botão de submit com estado de carregamento
          ============================================================
          Durante o envio, o botão fica desabilitado.
          aria-disabled="true" + aria-busy="true" comunicam o estado ao leitor.

          aria-disabled vs disabled:
            disabled → remove completamente do fluxo do teclado (Tab pula)
            aria-disabled="true" → mantém focável mas indica que está inativo
            Para UX: prefira aria-disabled em formulários (usuário ainda pode tabular)

          aria-busy="true" → indica que a aplicação está processando algo.
      */}
      <button
        type="submit"
        aria-busy={submitting}
        disabled={submitting}
        className={`
          w-full font-bold py-3 px-6 rounded-lg transition-all
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${submitting
            ? "bg-blue-400 cursor-not-allowed text-white"
            : "bg-blue-700 hover:bg-blue-800 text-white active:scale-95"
          }
        `}
      >
        {submitting ? (
          <>
            {/* aria-hidden no ícone de loading — o texto "Enviando..." já descreve */}
            <span aria-hidden="true" className="inline-block animate-spin mr-2">⏳</span>
            Enviando...
          </>
        ) : (
          "Enviar mensagem"
        )}
      </button>
    </form>
  );
}
