import Link from "next/link";
import LessonChat from "@/components/ui/LessonChat";
import MarkComplete from "@/components/lesson/MarkComplete";

const VIDEO_ID = "E2q57ERWqiM";

const LESSON_CONTEXT =
  "O usuário acabou de estudar a lição 'O que é Bitcoin?', cobrindo: origem em 2009 por Satoshi Nakamoto, como a blockchain funciona como livro-razão distribuído, por que Bitcoin tem valor (escassez de 21M, descentralização, segurança criptográfica), e como se compara ao sistema bancário tradicional. Foque as respostas nesse contexto.";

const CHAT_STARTERS = [
  "Por que o preço do Bitcoin sobe e desce tanto?",
  "Como comprar minha primeira fração de Bitcoin?",
  "O que acontece quando todos os 21 milhões de BTC forem minerados?",
];

const STEPS = [
  { icon: "👤", label: "Você", sub: "envia BTC" },
  { icon: "📡", label: "Rede global", sub: "valida em ~10 min" },
  { icon: "👤", label: "Destino", sub: "recebe BTC" },
];

const FACTS = [
  { value: "2009", label: "Ano de criação", icon: "📅" },
  { value: "21M", label: "Máximo de BTC", icon: "🔢" },
  { value: "8", label: "Casas decimais", icon: "✂️" },
  { value: "24/7", label: "Funciona sempre", icon: "⏰" },
];

const PILLARS = [
  {
    icon: "🪙",
    title: "Escasso",
    desc: "Só existirão 21 milhões — ninguém pode criar mais (diferente do Real, que o governo pode imprimir a qualquer hora)",
  },
  {
    icon: "🌐",
    title: "Descentralizado",
    desc: "Não tem dono nem sede. É como a internet — milhares de computadores mantêm a rede funcionando juntos",
  },
  {
    icon: "🔒",
    title: "Seguro",
    desc: "A criptografia do Bitcoin é tão forte que hackear seria computacionalmente impossível com a tecnologia atual",
  },
];

const TAKEAWAYS = [
  "Bitcoin é uma moeda digital que não precisa de banco nem governo",
  "Funciona numa rede de milhares de computadores ao redor do mundo",
  "Só existirão 21 milhões de BTC — isso cria escassez real",
  "Você pode comprar frações pequenas, sem precisar de 1 BTC inteiro",
];

export default function BitcoinLessonPage() {
  return (
    <div className="px-4 pt-5 pb-10 max-w-lg mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-5 text-xs text-cl-muted">
        <Link
          href="/aprender"
          className="hover:text-cl-primary transition-colors"
        >
          ← Aprender
        </Link>
        <span>/</span>
        <span className="text-cl-secondary font-medium">Fundamentos</span>
      </div>

      {/* Título */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0"
          style={{ background: "#FEF3C7" }}
        >
          ₿
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-cl-muted">
            Fundamentos · Iniciante · 5 min
          </p>
          <h1 className="text-xl font-bold text-cl-primary leading-tight">
            O que é Bitcoin?
          </h1>
        </div>
      </div>

      {/* ── 1. VÍDEO ── */}
      <div className="mb-6">
        <p className="text-xs font-bold tracking-wider uppercase text-cl-muted mb-3">
          🎬 Assista primeiro
        </p>
        <div
          className="rounded-2xl overflow-hidden border border-cl-border"
          style={{ background: "var(--surface)" }}
        >
          <div className="relative" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${VIDEO_ID}?rel=0&modestbranding=1`}
              title="A melhor explicação sobre Bitcoin para iniciantes"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="px-4 py-2.5 flex items-center gap-1.5 border-t border-cl-border">
            <svg width="12" height="12" viewBox="0 0 12 12">
              <circle cx="6" cy="6" r="6" fill="#FF0000" />
              <polygon points="4.5,3.5 9,6 4.5,8.5" fill="white" />
            </svg>
            <p className="text-xs text-cl-muted">
              YouTube · assista antes de continuar para fixar melhor
            </p>
          </div>
        </div>
      </div>

      {/* ── 2. EXPLICAÇÃO VISUAL ── */}
      <div className="mb-6">
        <p className="text-xs font-bold tracking-wider uppercase text-cl-muted mb-3">
          📖 Resumo visual
        </p>
        <div className="space-y-4">

          {/* O que é */}
          <div className="bg-cl-surface border border-cl-border rounded-2xl p-4">
            <p className="text-sm font-bold text-cl-primary mb-3">
              💡 Bitcoin vs. Banco tradicional
            </p>
            <div className="flex items-stretch gap-2">
              <div
                className="flex-1 rounded-xl p-3 text-center"
                style={{ background: "var(--surface-2)" }}
              >
                <p className="text-2xl mb-1">🏦</p>
                <p className="text-xs font-semibold text-cl-primary">Banco</p>
                <p className="text-[10px] text-cl-muted mt-1 leading-relaxed">
                  Empresa privada controla seu saldo. Pode congelar, cobrar tarifas, fechar fins de semana.
                </p>
              </div>
              <div className="flex items-center text-cl-muted text-sm px-1">
                vs
              </div>
              <div
                className="flex-1 rounded-xl p-3 text-center"
                style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}
              >
                <p className="text-2xl mb-1">₿</p>
                <p className="text-xs font-semibold" style={{ color: "#92400E" }}>
                  Bitcoin
                </p>
                <p
                  className="text-[10px] mt-1 leading-relaxed"
                  style={{ color: "#78350F" }}
                >
                  Rede global sem dono. Ninguém pode congelar ou bloquear. Funciona 24h.
                </p>
              </div>
            </div>
          </div>

          {/* Como funciona — diagrama de transação */}
          <div className="bg-cl-surface border border-cl-border rounded-2xl p-4">
            <p className="text-sm font-bold text-cl-primary mb-3">
              🔗 Como uma transação funciona?
            </p>
            <div className="flex items-center gap-1">
              {STEPS.map((step, i) => (
                <div key={step.label} className="flex items-center flex-1 gap-1">
                  <div className="flex-1 text-center">
                    <div
                      className="w-11 h-11 rounded-full mx-auto flex items-center justify-center text-xl mb-1"
                      style={{ background: "var(--surface-2)" }}
                    >
                      {step.icon}
                    </div>
                    <p className="text-[10px] font-bold text-cl-primary">
                      {step.label}
                    </p>
                    <p className="text-[9px] text-cl-muted">{step.sub}</p>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className="text-cl-muted text-xs flex-shrink-0 pb-5"
                    >
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-[10px] text-cl-muted text-center mt-3 leading-relaxed">
              A &ldquo;Rede global&rdquo; são milhares de computadores ao redor do mundo —
              ninguém controla, todos verificam juntos
            </p>
          </div>

          {/* Números importantes */}
          <div className="bg-cl-surface border border-cl-border rounded-2xl p-4">
            <p className="text-sm font-bold text-cl-primary mb-3">
              📊 Números que você precisa saber
            </p>
            <div className="grid grid-cols-2 gap-2">
              {FACTS.map((fact) => (
                <div
                  key={fact.label}
                  className="rounded-xl p-3 text-center"
                  style={{ background: "var(--surface-2)" }}
                >
                  <p className="text-lg mb-0.5">{fact.icon}</p>
                  <p className="text-base font-bold text-cl-primary tabular-nums">
                    {fact.value}
                  </p>
                  <p className="text-[10px] text-cl-muted">{fact.label}</p>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-cl-muted mt-3 leading-relaxed">
              💡 Não precisa comprar 1 BTC inteiro. Você pode comprar R$50, R$100, qualquer valor
              — receberá a fração equivalente.
            </p>
          </div>

          {/* Por que tem valor */}
          <div className="bg-cl-surface border border-cl-border rounded-2xl p-4">
            <p className="text-sm font-bold text-cl-primary mb-3">
              💎 Por que Bitcoin tem valor?
            </p>
            <div className="space-y-2">
              {PILLARS.map((p) => (
                <div
                  key={p.title}
                  className="flex gap-3 rounded-xl p-3"
                  style={{ background: "var(--surface-2)" }}
                >
                  <span className="text-lg flex-shrink-0">{p.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-cl-primary">{p.title}</p>
                    <p className="text-[10px] text-cl-muted leading-relaxed mt-0.5">
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. O QUE VOCÊ APRENDEU ── */}
      <div
        className="rounded-2xl p-4 mb-6 border"
        style={{
          background: "var(--accent-glow)",
          borderColor: "var(--accent)",
        }}
      >
        <p
          className="text-xs font-bold tracking-wider uppercase mb-3"
          style={{ color: "var(--accent)" }}
        >
          ✅ O que você aprendeu
        </p>
        <ul className="space-y-2">
          {TAKEAWAYS.map((item) => (
            <li key={item} className="flex items-start gap-2 text-xs text-cl-secondary">
              <span
                className="flex-shrink-0 mt-0.5 font-bold"
                style={{ color: "var(--positive)" }}
              >
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* ── 4. MINI-CHAT ── */}
      <p className="text-xs font-bold tracking-wider uppercase text-cl-muted mb-3">
        🎓 Ficou com dúvida?
      </p>
      <LessonChat
        lessonTitle="O que é Bitcoin?"
        lessonContext={LESSON_CONTEXT}
        starters={CHAT_STARTERS}
        maxExchanges={3}
      />

      {/* Marcar como concluída */}
      <div className="mt-6">
        <MarkComplete slug="bitcoin" />
      </div>
    </div>
  );
}
