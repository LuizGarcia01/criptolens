import Link from "next/link";
import { getTopCoins } from "@/lib/api/coingecko";
import { getCoinPriceHistory } from "@/lib/api/history";
import { calcRSI, calcTrend, getRSIInfo } from "@/lib/indicators";
import SignalCard, { type CoinSignal } from "@/components/signals/SignalCard";

// Known stablecoins to exclude
const STABLECOINS = new Set([
  "tether", "usd-coin", "dai", "binance-usd", "frax", "true-usd",
  "usdc", "busd", "tusd", "paxos-standard", "gemini-dollar",
]);

export default async function SinaisPage() {
  // Fetch top 18 and filter stablecoins, take first 9
  const allCoins = await getTopCoins(18).catch(() => []);
  const coins = allCoins.filter((c) => !STABLECOINS.has(c.id)).slice(0, 9);

  if (coins.length === 0) {
    return (
      <div className="px-4 pt-5 max-w-lg mx-auto">
        <p className="text-sm text-cl-muted">Erro ao carregar dados. Tente novamente.</p>
      </div>
    );
  }

  // Fetch price history for all coins in parallel
  const historyResults = await Promise.allSettled(
    coins.map((c) => getCoinPriceHistory(c.id, 30))
  );

  // Build signal data
  const signals: CoinSignal[] = coins
    .map((coin, i) => {
      const result = historyResults[i];
      if (result.status === "rejected" || result.value.length < 15) return null;

      const prices = result.value;
      const rsi = calcRSI(prices);
      const trend = calcTrend(prices);
      const rsiInfo = getRSIInfo(rsi);

      return {
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        price: coin.current_price,
        change24h: coin.price_change_percentage_24h ?? 0,
        rsi,
        rsiInfo,
        trend,
      } satisfies CoinSignal;
    })
    .filter(Boolean) as CoinSignal[];

  const oversold = signals.filter((s) => s.rsi < 30).length;
  const overbought = signals.filter((s) => s.rsi > 70).length;
  const neutral = signals.length - oversold - overbought;

  const instructorSummaryQ = encodeURIComponent(
    `Hoje no mercado: ${oversold} ativo(s) sobrevendido(s), ${overbought} sobrecomprado(s), ${neutral} neutro(s). ${signals.map((s) => `${s.symbol.toUpperCase()} RSI ${s.rsi.toFixed(0)}`).join(", ")}. Qual é o panorama geral do mercado e o que devo prestar atenção?`
  );

  return (
    <div className="px-4 pt-5 pb-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-5">
        <p className="text-xs font-semibold tracking-widest uppercase text-cl-muted mb-0.5">
          Análise Técnica
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-cl-primary">Sinais</h1>
        <p className="text-xs text-cl-muted mt-0.5">
          RSI(14) + Tendência · atualizado a cada hora
        </p>
      </div>

      {/* Panorama geral */}
      <div
        className="rounded-2xl p-4 mb-4 border"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <p className="text-[10px] font-bold uppercase tracking-wider text-cl-muted mb-3">
          Panorama do mercado
        </p>
        <div className="flex items-center gap-2">
          <div
            className="flex-1 rounded-xl p-2.5 text-center"
            style={{ background: "rgba(16,185,129,0.1)" }}
          >
            <p className="text-lg font-bold" style={{ color: "#10B981" }}>{oversold}</p>
            <p className="text-[10px] font-semibold" style={{ color: "#10B981" }}>Sobrevendido</p>
            <p className="text-[9px] text-cl-muted mt-0.5">RSI &lt; 30</p>
          </div>
          <div
            className="flex-1 rounded-xl p-2.5 text-center"
            style={{ background: "rgba(234,179,8,0.1)" }}
          >
            <p className="text-lg font-bold" style={{ color: "#EAB308" }}>{neutral}</p>
            <p className="text-[10px] font-semibold" style={{ color: "#EAB308" }}>Neutro</p>
            <p className="text-[9px] text-cl-muted mt-0.5">RSI 30–70</p>
          </div>
          <div
            className="flex-1 rounded-xl p-2.5 text-center"
            style={{ background: "rgba(239,68,68,0.1)" }}
          >
            <p className="text-lg font-bold" style={{ color: "#EF4444" }}>{overbought}</p>
            <p className="text-[10px] font-semibold" style={{ color: "#EF4444" }}>Sobrecomprado</p>
            <p className="text-[9px] text-cl-muted mt-0.5">RSI &gt; 70</p>
          </div>
        </div>

        <Link
          href={`/chat?q=${instructorSummaryQ}`}
          className="flex items-center gap-2 mt-3 text-xs font-semibold transition-opacity active:opacity-70"
          style={{ color: "var(--instructor)" }}
        >
          <span>🎓</span> Pedir análise geral ao Instrutor
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="ml-auto">
            <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      {/* Legenda rápida */}
      <div
        className="rounded-xl p-3 mb-5 border"
        style={{ background: "var(--surface-2)", borderColor: "var(--border)" }}
      >
        <p className="text-[10px] font-bold uppercase tracking-wider text-cl-muted mb-2">
          Como ler os sinais?
        </p>
        <div className="space-y-1.5">
          <div className="flex items-start gap-2">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}>RSI &lt; 30</span>
            <p className="text-[10px] text-cl-muted leading-snug flex-1">Sobrevendido — preço caiu rápido demais, possível recuperação</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: "rgba(234,179,8,0.15)", color: "#EAB308" }}>RSI 30–70</span>
            <p className="text-[10px] text-cl-muted leading-snug flex-1">Neutro — sem sinal extremo, observe a tendência</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444" }}>RSI &gt; 70</span>
            <p className="text-[10px] text-cl-muted leading-snug flex-1">Sobrecomprado — preço subiu rápido, cuidado com realização</p>
          </div>
        </div>
        <Link
          href="/aprender/rsi"
          className="flex items-center gap-1 mt-2.5 text-[10px] font-semibold"
          style={{ color: "var(--instructor)" }}
        >
          📖 Aprender mais sobre RSI →
        </Link>
      </div>

      {/* Signal cards */}
      <div className="space-y-3">
        {signals.map((signal) => (
          <SignalCard key={signal.id} signal={signal} />
        ))}
      </div>

      {signals.length === 0 && (
        <div
          className="rounded-2xl p-6 text-center border"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          <p className="text-sm text-cl-muted">
            Não foi possível calcular sinais no momento. Tente novamente em instantes.
          </p>
        </div>
      )}
    </div>
  );
}
