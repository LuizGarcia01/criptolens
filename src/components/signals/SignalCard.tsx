import Link from "next/link";
import type { TrendResult, RSIInfo } from "@/lib/indicators";

export interface CoinSignal {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  rsi: number;
  rsiInfo: RSIInfo;
  trend: TrendResult;
}

// ── RSI arc path (counterclockwise top semicircle) ───────────────────────────
function arcPath(cx: number, cy: number, r: number, v1: number, v2: number): string {
  const a1 = Math.PI - (v1 / 100) * Math.PI;
  const a2 = Math.PI - (v2 / 100) * Math.PI;
  const x1 = (cx + r * Math.cos(a1)).toFixed(2);
  const y1 = (cy - r * Math.sin(a1)).toFixed(2);
  const x2 = (cx + r * Math.cos(a2)).toFixed(2);
  const y2 = (cy - r * Math.sin(a2)).toFixed(2);
  const largeArc = v2 - v1 > 50 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 0 ${x2} ${y2}`;
}

function RSIGauge({ rsi }: { rsi: number }) {
  const cx = 55, cy = 52, r = 38, sw = 10;
  const clamped = Math.max(0, Math.min(100, rsi));
  const angle = Math.PI - (clamped / 100) * Math.PI;
  const nx = (cx + (r - 5) * Math.cos(angle)).toFixed(2);
  const ny = (cy - (r - 5) * Math.sin(angle)).toFixed(2);

  const needleColor = rsi < 30 ? "#10B981" : rsi > 70 ? "#EF4444" : "#EAB308";

  return (
    <svg viewBox="0 0 110 72" width={120} height={79} aria-label={`RSI ${rsi.toFixed(0)}`}>
      {/* Background track */}
      <path d={arcPath(cx, cy, r, 0, 100)} fill="none" stroke="var(--surface-2)" strokeWidth={sw} strokeLinecap="butt" />

      {/* Zone arcs */}
      <path d={arcPath(cx, cy, r, 0, 30)} fill="none" stroke="#10B981" strokeWidth={sw} strokeLinecap="butt" opacity="0.5" />
      <path d={arcPath(cx, cy, r, 30, 70)} fill="none" stroke="#EAB308" strokeWidth={sw} strokeLinecap="butt" opacity="0.5" />
      <path d={arcPath(cx, cy, r, 70, 100)} fill="none" stroke="#EF4444" strokeWidth={sw} strokeLinecap="butt" opacity="0.5" />

      {/* Active fill up to RSI value */}
      {clamped > 0 && (
        <path
          d={arcPath(cx, cy, r + 0, 0, clamped)}
          fill="none"
          stroke={needleColor}
          strokeWidth={sw - 3}
          strokeLinecap="butt"
          opacity="0.85"
        />
      )}

      {/* Needle */}
      <line
        x1={cx} y1={cy}
        x2={nx} y2={ny}
        stroke="var(--text-primary)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r="3.5" fill="var(--text-primary)" />

      {/* RSI value */}
      <text
        x={cx} y={cy + 14}
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fill={needleColor}
        fontFamily="ui-monospace,monospace"
      >
        {rsi.toFixed(0)}
      </text>

      {/* Scale labels */}
      <text x="12" y="68" textAnchor="middle" fontSize="7" fill="#10B981" fontFamily="system-ui" opacity="0.8">0</text>
      <text x="55" y="14" textAnchor="middle" fontSize="7" fill="#EAB308" fontFamily="system-ui" opacity="0.8">50</text>
      <text x="98" y="68" textAnchor="middle" fontSize="7" fill="#EF4444" fontFamily="system-ui" opacity="0.8">100</text>
    </svg>
  );
}

const TREND_ICONS: Record<string, string> = { bullish: "↗", bearish: "↘", neutral: "→" };
const TREND_LABELS: Record<string, string> = { bullish: "Alta", bearish: "Baixa", neutral: "Lateral" };
const TREND_COLORS: Record<string, string> = {
  bullish: "var(--positive)",
  bearish: "var(--negative)",
  neutral: "var(--text-muted)",
};

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: n >= 1 ? 0 : 6 }).format(n);

const compact = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : usd(n);

export default function SignalCard({ signal }: { signal: CoinSignal }) {
  const { rsi, rsiInfo, trend, change24h, price } = signal;
  const up24h = change24h >= 0;

  const instructorQ = encodeURIComponent(
    `O ${signal.name} tem RSI de ${rsi.toFixed(0)} (${rsiInfo.label}) e tendência ${TREND_LABELS[trend.trend].toLowerCase()}. MA7: ${compact(trend.sma7)}, MA30: ${compact(trend.sma30)}. O que isso significa e o que devo fazer?`
  );

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      {/* Color top accent based on RSI zone */}
      <div
        className="h-0.5 w-full"
        style={{
          background: `linear-gradient(to right, ${rsiInfo.color}00, ${rsiInfo.color}, ${rsiInfo.color}00)`,
        }}
      />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-base font-bold text-cl-primary uppercase tracking-wide">
              {signal.symbol}
            </p>
            <p className="text-xs text-cl-muted">{signal.name}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-cl-primary tabular-nums">{usd(price)}</p>
            <p
              className="text-xs font-semibold tabular-nums"
              style={{ color: up24h ? "var(--positive)" : "var(--negative)" }}
            >
              {up24h ? "+" : ""}
              {change24h.toFixed(2)}% 24h
            </p>
          </div>
        </div>

        {/* RSI Gauge centered */}
        <div className="flex flex-col items-center mb-4">
          <RSIGauge rsi={rsi} />
          <div
            className="mt-1 px-3 py-1 rounded-full text-[10px] font-bold"
            style={{ background: rsiInfo.bg, color: rsiInfo.color }}
          >
            RSI {rsi.toFixed(0)} · {rsiInfo.label}
          </div>
          <p className="text-[10px] text-cl-muted mt-1 text-center leading-snug max-w-[220px]">
            {rsiInfo.tip}
          </p>
        </div>

        {/* Trend */}
        <div
          className="rounded-xl p-3 mb-3"
          style={{ background: "var(--surface-2)" }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-cl-muted">
              Tendência (MA7 vs MA30)
            </p>
            <span
              className="text-sm font-bold"
              style={{ color: TREND_COLORS[trend.trend] }}
            >
              {TREND_ICONS[trend.trend]} {TREND_LABELS[trend.trend]}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-[10px] text-cl-muted">MA 7 dias</p>
              <p className="text-xs font-semibold text-cl-primary tabular-nums">
                {compact(trend.sma7)}
              </p>
            </div>
            <div
              className="text-xs font-bold"
              style={{ color: TREND_COLORS[trend.trend] }}
            >
              {trend.diffPct > 0 ? "+" : ""}
              {trend.diffPct.toFixed(1)}%
            </div>
            <div className="text-center">
              <p className="text-[10px] text-cl-muted">MA 30 dias</p>
              <p className="text-xs font-semibold text-cl-primary tabular-nums">
                {compact(trend.sma30)}
              </p>
            </div>
          </div>
        </div>

        {/* Instructor link */}
        <Link
          href={`/chat?q=${instructorQ}`}
          className="flex items-center gap-2 text-xs font-semibold transition-opacity active:opacity-70"
          style={{ color: "var(--instructor)" }}
        >
          <span>🎓</span>
          O que isso significa para mim?
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="ml-auto">
            <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
