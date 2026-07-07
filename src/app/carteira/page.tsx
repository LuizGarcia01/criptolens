export default function CarteiraPage() {
  return (
    <div className="px-4 pt-5 max-w-lg mx-auto">
      <div className="mb-5">
        <p className="text-xs font-semibold tracking-widest uppercase text-cl-muted mb-0.5">
          Investimentos
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-cl-primary">Carteira</h1>
      </div>

      {/* Portfolio preview */}
      <div className="bg-cl-surface border border-cl-border rounded-2xl p-5 mb-4">
        <p className="text-xs font-bold tracking-wider uppercase text-cl-muted mb-1">
          Saldo Total
        </p>
        <p className="text-3xl font-bold text-cl-primary mb-0.5">—</p>
        <p className="text-xs text-cl-muted">Adicione suas moedas para começar</p>
      </div>

      <div className="bg-cl-surface border border-cl-border rounded-2xl p-5 mb-4">
        <div className="text-center mb-4">
          <span className="text-4xl">💼</span>
        </div>
        <h2 className="text-lg font-bold text-cl-primary text-center mb-2">
          Acompanhe seus Investimentos
        </h2>
        <p className="text-sm text-cl-secondary text-center leading-relaxed mb-4">
          Registre suas compras e veja o desempenho da sua carteira. O instrutor analisa sua diversificação e te ensina o que cada variação significa.
        </p>
        <div className="space-y-2 text-sm text-cl-secondary">
          {[
            "Lucro/prejuízo em tempo real (P&L)",
            "Diversificação da carteira explicada",
            "Histórico de operações",
            "Análise do instrutor IA sobre seu portfólio",
          ].map((f) => (
            <div key={f} className="flex items-center gap-2">
              <span style={{ color: "var(--positive)" }}>✓</span>
              {f}
            </div>
          ))}
        </div>
      </div>

      <div
        className="rounded-xl p-4 text-center"
        style={{ background: "var(--accent-glow)", border: "1px solid var(--accent)" }}
      >
        <p className="text-sm font-semibold text-cl-accent">
          Fase 3 do roadmap · Chegando em breve
        </p>
      </div>
    </div>
  );
}
