import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getCoinById } from "@/lib/api/coingecko";
import { getCoinPriceHistory } from "@/lib/api/history";
import { calcRSI, calcTrend, getRSIInfo } from "@/lib/indicators";
import { COIN_COLORS } from "@/components/simulator/Charts";

function fmt(n: number) {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  return `$${n.toFixed(0)}`;
}

function fmtPrice(n: number) {
  if (n < 0.01) return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 6 }).format(n);
  if (n < 1) return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 4 }).format(n);
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);
}

function PriceChart({ prices, color }: { prices: number[]; color: string }) {
  if (prices.length < 2) return null;
  const W = 340;
  const H = 120;
  const PX = 8;
  const PY = 12;
  const lo = Math.min(...prices) * 0.998;
  const hi = Math.max(...prices) * 1.002;
  const range = hi - lo || 1;
  const toX = (i: number) => PX + (i / (prices.length - 1)) * (W - PX * 2);
  const toY = (v: number) => PY + (1 - (v - lo) / range) * (H - PY * 2);

  const pts = prices.map((v, i) => [toX(i), toY(v)] as [number, number]);

  // Smooth line via quadratic bezier
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const mx = (pts[i - 1][0] + pts[i][0]) / 2;
    d += ` Q ${mx} ${pts[i - 1][1]} ${mx} ${(pts[i - 1][1] + pts[i][1]) / 2}`;
  }
  d += ` L ${pts[pts.length - 1][0]} ${pts[pts.length - 1][1]}`;

  const fill = `${d} L ${pts[pts.length - 1][0]} ${H} L ${pts[0][0]} ${H} Z`;
  const isUp = prices[prices.length - 1] >= prices[0];
  const lineColor = isUp ? "#10B981" : "#EF4444";

  const minIdx = prices.indexOf(Math.min(...prices));
  const maxIdx = prices.indexOf(Math.max(...prices));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lineColor} stopOpacity="0.2" />
          <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill="url(#cg)" />
      <path d={d} fill="none" stroke={lineColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Min/Max dots */}
      <circle cx={pts[minIdx][0]} cy={pts[minIdx][1]} r="3" fill="#EF4444" />
      <circle cx={pts[maxIdx][0]} cy={pts[maxIdx][1]} r="3" fill="#10B981" />
      {/* End dot pulse */}
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="4" fill={lineColor} opacity="0.3">
        <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="3" fill={lineColor} />
    </svg>
  );
}

function RSIArc({ rsi }: { rsi: number }) {
  const cx = 60; const cy = 55; const r = 40; const sw = 10;
  function arc(v1: number, v2: number) {
    const a1 = Math.PI - (v1 / 100) * Math.PI;
    const a2 = Math.PI - (v2 / 100) * Math.PI;
    const x1 = cx + r * Math.cos(a1); const y1 = cy - r * Math.sin(a1);
    const x2 = cx + r * Math.cos(a2); const y2 = cy - r * Math.sin(a2);
    const large = Math.abs(v2 - v1) > 50 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 0 ${x2} ${y2}`;
  }
  const info = getRSIInfo(rsi);
  return (
    <svg viewBox="0 0 120 65" width="120" height="65">
      <path d={arc(0, 30)} fill="none" stroke="#10B981" strokeWidth={sw} strokeLinecap="round" />
      <path d={arc(30, 70)} fill="none" stroke="#EAB308" strokeWidth={sw} strokeLinecap="round" />
      <path d={arc(70, 100)} fill="none" stroke="#EF4444" strokeWidth={sw} strokeLinecap="round" />
      <path d={arc(0, rsi)} fill="none" stroke={info.color} strokeWidth={sw - 2} strokeLinecap="round" opacity="0.35" />
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="18" fontWeight="bold" fill={info.color}>{Math.round(rsi)}</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="7" fill="var(--text-muted)">RSI(14)</text>
    </svg>
  );
}

export default async function CoinPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [coin, prices] = await Promise.all([
    getCoinById(id),
    getCoinPriceHistory(id, 30).catch(() => [] as number[]),
  ]);

  if (!coin) notFound();

  const rsi = calcRSI(prices);
  const trend = calcTrend(prices);
  const rsiInfo = getRSIInfo(rsi);
  const color = COIN_COLORS[id] ?? "#6366F1";
  const change = coin.price_change_percentage_24h ?? 0;
  const isUp = change >= 0;
  const price30dAgo = prices[0];
  const change30d = price30dAgo ? ((coin.current_price - price30dAgo) / price30dAgo) * 100 : 0;

  const instructorQ = encodeURIComponent(
    `Estou analisando ${coin.name} (${coin.symbol.toUpperCase()}). Preço atual: ${fmtPrice(coin.current_price)}, variação 24h: ${change.toFixed(2)}%, RSI: ${Math.round(rsi)} (${rsiInfo.label}), tendência: ${trend.trend}. O que você acha desta moeda agora?`
  );

  return (
    <div className="px-4 pt-5 pb-10 max-w-lg mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-5 text-xs text-cl-muted">
        <Link href="/" className="hover:text-cl-primary transition-colors">← Início</Link>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        {coin.image ? (
          <Image src={coin.image} alt={coin.name} width={48} height={48} className="rounded-2xl" unoptimized />
        ) : (
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold text-white" style={{ background: color }}>
            {coin.symbol[0].toUpperCase()}
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="text-xl font-bold text-cl-primary">{coin.name}</h1>
            <span className="text-xs font-bold px-1.5 py-0.5 rounded-md uppercase text-cl-muted" style={{ background: "var(--surface-2)" }}>
              {coin.symbol}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-cl-primary tabular-nums">{fmtPrice(coin.current_price)}</span>
            <span className="text-sm font-bold" style={{ color: isUp ? "var(--positive)" : "var(--negative)" }}>
              {isUp ? "+" : ""}{change.toFixed(2)}% 24h
            </span>
          </div>
        </div>
      </div>

      {/* Price chart */}
      <div className="bg-cl-surface border border-cl-border rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold tracking-wider uppercase text-cl-muted">Preço — 30 dias</p>
          <span className="text-xs font-semibold tabular-nums" style={{ color: change30d >= 0 ? "var(--positive)" : "var(--negative)" }}>
            {change30d >= 0 ? "+" : ""}{change30d.toFixed(1)}% no período
          </span>
        </div>
        <PriceChart prices={prices} color={color} />
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-cl-muted">30 dias atrás</span>
          <span className="text-[10px] text-cl-muted">Hoje</span>
        </div>
      </div>

      {/* RSI + Trend */}
      <div className="bg-cl-surface border border-cl-border rounded-2xl p-4 mb-4">
        <p className="text-xs font-bold tracking-wider uppercase text-cl-muted mb-3">Análise Técnica</p>
        <div className="flex items-center gap-4">
          <RSIArc rsi={rsi} />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ background: rsiInfo.bg, color: rsiInfo.color }}>
                {rsiInfo.label}
              </span>
            </div>
            <p className="text-xs text-cl-secondary leading-relaxed">{rsiInfo.tip}</p>
            <div className="mt-2 flex gap-3 text-xs">
              <span className="text-cl-muted">MM7: <strong className="text-cl-primary">{fmtPrice(trend.sma7)}</strong></span>
              <span className="text-cl-muted">MM30: <strong className="text-cl-primary">{fmtPrice(trend.sma30)}</strong></span>
            </div>
            <div className="mt-1">
              <span className="text-xs font-semibold" style={{ color: trend.trend === "bullish" ? "var(--positive)" : trend.trend === "bearish" ? "var(--negative)" : "var(--text-muted)" }}>
                {trend.trend === "bullish" ? "▲ Tendência de alta" : trend.trend === "bearish" ? "▼ Tendência de baixa" : "→ Sem tendência clara"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-cl-surface border border-cl-border rounded-2xl p-4 mb-4">
        <p className="text-xs font-bold tracking-wider uppercase text-cl-muted mb-3">Dados de Mercado</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Market Cap", value: fmt(coin.market_cap) },
            { label: "Volume 24h", value: fmt(coin.total_volume) },
            { label: "Mínimo 30d", value: prices.length ? fmtPrice(Math.min(...prices)) : "—" },
            { label: "Máximo 30d", value: prices.length ? fmtPrice(Math.max(...prices)) : "—" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-3" style={{ background: "var(--surface-2)" }}>
              <p className="text-[10px] text-cl-muted mb-0.5">{s.label}</p>
              <p className="text-sm font-bold text-cl-primary tabular-nums">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Instructor */}
      <Link
        href={`/chat?q=${instructorQ}`}
        className="flex items-center gap-3 rounded-2xl p-4 border"
        style={{ background: "var(--instructor-bg)", borderColor: "var(--instructor-border)" }}
      >
        <span className="text-2xl">🎓</span>
        <div className="flex-1">
          <p className="text-sm font-bold" style={{ color: "var(--instructor)" }}>Analisar com o Instrutor</p>
          <p className="text-xs text-cl-secondary">Pergunte sobre RSI, tendência e o que fazer agora</p>
        </div>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 7h8M7 3l4 4-4 4" stroke="var(--instructor)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}
