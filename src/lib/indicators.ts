export function calcRSI(prices: number[], period = 14): number {
  if (prices.length < period + 1) return 50;

  const changes: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1]);
  }

  let avgGain = 0;
  let avgLoss = 0;
  for (let i = 0; i < period; i++) {
    if (changes[i] > 0) avgGain += changes[i];
    else avgLoss += Math.abs(changes[i]);
  }
  avgGain /= period;
  avgLoss /= period;

  for (let i = period; i < changes.length; i++) {
    const gain = changes[i] > 0 ? changes[i] : 0;
    const loss = changes[i] < 0 ? Math.abs(changes[i]) : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
  }

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return Math.max(0, Math.min(100, 100 - 100 / (1 + rs)));
}

export function calcSMA(prices: number[], period: number): number {
  const slice = prices.slice(-period);
  if (slice.length === 0) return 0;
  return slice.reduce((a, b) => a + b, 0) / slice.length;
}

export interface TrendResult {
  trend: "bullish" | "bearish" | "neutral";
  sma7: number;
  sma30: number;
  diffPct: number;
}

export function calcTrend(prices: number[]): TrendResult {
  const sma7 = calcSMA(prices, 7);
  const sma30 = calcSMA(prices, 30);
  const diffPct = sma30 > 0 ? ((sma7 - sma30) / sma30) * 100 : 0;
  const trend = diffPct > 1.5 ? "bullish" : diffPct < -1.5 ? "bearish" : "neutral";
  return { trend, sma7, sma30, diffPct };
}

export interface RSIInfo {
  zone: "oversold" | "neutral" | "overbought";
  label: string;
  color: string;
  bg: string;
  tip: string;
}

export function getRSIInfo(rsi: number): RSIInfo {
  if (rsi < 30)
    return {
      zone: "oversold",
      label: "Sobrevendido",
      color: "#10B981",
      bg: "rgba(16,185,129,0.12)",
      tip: "Ativo muito vendido. Pode ser oportunidade de compra.",
    };
  if (rsi > 70)
    return {
      zone: "overbought",
      label: "Sobrecomprado",
      color: "#EF4444",
      bg: "rgba(239,68,68,0.12)",
      tip: "Ativo muito comprado. Possível zona de realização.",
    };
  return {
    zone: "neutral",
    label: rsi >= 50 ? "Neutro — força" : "Neutro — fraqueza",
    color: "#EAB308",
    bg: "rgba(234,179,8,0.1)",
    tip: "Sem sinal extremo. Observe a tendência de médias.",
  };
}
