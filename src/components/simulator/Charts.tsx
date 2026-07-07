"use client";

export const COIN_COLORS: Record<string, string> = {
  bitcoin: "#F7931A",
  ethereum: "#627EEA",
  solana: "#9945FF",
  binancecoin: "#F3BA2F",
  ripple: "#00AAE4",
  cardano: "#0033AD",
  "avalanche-2": "#E84142",
  polkadot: "#E6007A",
  chainlink: "#375BD2",
  dogecoin: "#C2A633",
  "matic-network": "#8247E5",
  "shiba-inu": "#E6511F",
  tron: "#FF0013",
  toncoin: "#0098EA",
  "wrapped-bitcoin": "#F7931A",
};

const FALLBACK = [
  "#6366F1", "#EC4899", "#14B8A6", "#F59E0B",
  "#10B981", "#3B82F6", "#8B5CF6", "#EF4444",
];

export function getCoinColor(coinId: string, idx: number): string {
  return COIN_COLORS[coinId] ?? FALLBACK[idx % FALLBACK.length];
}

// ── Sparkline ────────────────────────────────────────────────────────────────

export function Sparkline({
  history,
  startValue,
}: {
  history: { value: number; date: string }[];
  startValue: number;
}) {
  if (history.length < 2) return null;

  const W = 300;
  const H = 76;
  const PX = 2;
  const PY = 10;

  const vals = history.map((h) => h.value);
  const lo = Math.min(startValue, ...vals) * 0.992;
  const hi = Math.max(startValue, ...vals) * 1.008;
  const range = hi - lo || 1;

  const sx = (i: number) => PX + (i / (history.length - 1)) * (W - PX * 2);
  const sy = (v: number) => PY + ((hi - v) / range) * (H - PY * 2);

  const pts: [number, number][] = history.map((h, i) => [sx(i), sy(h.value)]);

  // Smooth quadratic bezier through points
  const pathD = (() => {
    let d = `M ${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const mx = (pts[i][0] + pts[i + 1][0]) / 2;
      const my = (pts[i][1] + pts[i + 1][1]) / 2;
      d += ` Q ${pts[i][0]},${pts[i][1]} ${mx},${my}`;
    }
    d += ` L ${pts[pts.length - 1][0]},${pts[pts.length - 1][1]}`;
    return d;
  })();

  const areaD = `${pathD} L ${pts[pts.length - 1][0]},${H} L ${pts[0][0]},${H} Z`;
  const lastVal = history[history.length - 1].value;
  const positive = lastVal >= startValue;
  const color = positive ? "#10B981" : "#EF4444";
  const baseY = sy(startValue);
  const [endX, endY] = pts[pts.length - 1];
  const gradId = positive ? "sg-g" : "sg-r";

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      style={{ height: 76 }}
      aria-label="Gráfico de evolução do portfólio"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Baseline (start value) */}
      <line
        x1={PX} y1={baseY} x2={W - PX} y2={baseY}
        stroke={color} strokeWidth="0.75"
        strokeDasharray="4,3" opacity="0.35"
      />

      {/* Area fill */}
      <path d={areaD} fill={`url(#${gradId})`} />

      {/* Line */}
      <path
        d={pathD} fill="none"
        stroke={color} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
      />

      {/* Pulsing halo on last point */}
      <circle cx={endX} cy={endY} r="3" fill={color} opacity="0.2">
        <animate attributeName="r" values="3;8;3" dur="2.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0.04;0.2" dur="2.4s" repeatCount="indefinite" />
      </circle>
      {/* Solid dot */}
      <circle cx={endX} cy={endY} r="3.5" fill={color} />
    </svg>
  );
}

// ── Donut Chart ──────────────────────────────────────────────────────────────

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
  pct: number;
}

export function DonutChart({
  segments,
  centerLabel,
}: {
  segments: DonutSegment[];
  centerLabel: string;
}) {
  const R = 42;
  const CX = 60;
  const CY = 60;
  const SW = 13;
  const CIRC = 2 * Math.PI * R;
  const GAP_FRAC = 1.6 / 360;

  const visSegs = segments.filter((s) => s.value > 0);
  if (visSegs.length === 0) return null;

  const total = visSegs.reduce((s, seg) => s + seg.value, 0);
  const gapFrac = visSegs.length > 1 ? GAP_FRAC : 0;

  let acc = 0;
  const arcs = visSegs.map((seg) => {
    const frac = seg.value / total;
    const drawFrac = Math.max(0, frac - gapFrac);
    const dashLen = drawFrac * CIRC;
    const rotate = -90 + acc * 360;
    acc += frac;
    return { ...seg, dashLen, rotate };
  });

  return (
    <svg viewBox="0 0 120 120" width={108} height={108} className="flex-shrink-0">
      {/* Track ring */}
      <circle
        cx={CX} cy={CY} r={R}
        fill="none" stroke="var(--surface-2)" strokeWidth={SW}
      />
      {/* Segments */}
      {arcs.map((arc, i) => (
        <circle
          key={i}
          cx={CX} cy={CY} r={R}
          fill="none"
          stroke={arc.color}
          strokeWidth={SW}
          strokeDasharray={`${arc.dashLen} ${CIRC}`}
          transform={`rotate(${arc.rotate} ${CX} ${CY})`}
          strokeLinecap="butt"
        />
      ))}
      {/* Center text */}
      <text
        x={CX} y={CY - 7}
        textAnchor="middle" fontSize="7"
        fill="var(--text-muted)"
        fontFamily="ui-sans-serif,system-ui,sans-serif"
      >
        portfólio
      </text>
      <text
        x={CX} y={CY + 7}
        textAnchor="middle" fontSize="9.5"
        fill="var(--text-primary)"
        fontFamily="ui-sans-serif,system-ui,sans-serif"
        fontWeight="700"
      >
        {centerLabel}
      </text>
    </svg>
  );
}
