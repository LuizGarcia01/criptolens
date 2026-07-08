import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";
import MissaoDoDia from "@/components/ui/MissaoDoDia";
import Onboarding from "@/components/ui/Onboarding";
import PWAInstall from "@/components/ui/PWAInstall";

function askInstrutor(question: string) {
  return `/chat?q=${encodeURIComponent(question)}`;
}
import { getTopCoins, type CoinMarket } from "@/lib/api/coingecko";
import { getFearGreedIndex, classifyFearGreed } from "@/lib/api/fear-greed";
import { getCryptoNews, type NormalizedNews } from "@/lib/api/news";

const FALLBACK_COINS: CoinMarket[] = [
  { id: "bitcoin", symbol: "btc", name: "Bitcoin", image: "", current_price: 108450.32, price_change_percentage_24h: 2.4, market_cap: 2140000000000, total_volume: 45000000000 },
  { id: "ethereum", symbol: "eth", name: "Ethereum", image: "", current_price: 3842.18, price_change_percentage_24h: -0.8, market_cap: 461800000000, total_volume: 18000000000 },
  { id: "solana", symbol: "sol", name: "Solana", image: "", current_price: 187.45, price_change_percentage_24h: 5.2, market_cap: 84200000000, total_volume: 4200000000 },
  { id: "binancecoin", symbol: "bnb", name: "BNB", image: "", current_price: 638.9, price_change_percentage_24h: 1.1, market_cap: 93500000000, total_volume: 2100000000 },
  { id: "ripple", symbol: "xrp", name: "XRP", image: "", current_price: 2.84, price_change_percentage_24h: -1.3, market_cap: 162800000000, total_volume: 5800000000 },
];

const FALLBACK_NEWS: NormalizedNews[] = [
  { title: "Bitcoin supera US$108.000 — analistas veem caminho para US$120.000", source: "CoinDesk", url: "#", time: "2h atrás", sentiment: "bullish" },
  { title: "Fed mantém juros estáveis — cripto reage positivamente à decisão", source: "Reuters", url: "#", time: "4h atrás", sentiment: "bullish" },
  { title: "Reguladores da UE publicam novas diretrizes para exchanges descentralizadas", source: "The Block", url: "#", time: "6h atrás", sentiment: "bearish" },
];

function formatPrice(price: number) {
  if (price < 0.01) return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 6, maximumFractionDigits: 6 }).format(price);
  if (price < 1) return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(price);
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);
}

function formatMarketCap(value: number) {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toFixed(0)}`;
}

const SYMBOL_COLORS: Record<string, string> = {
  btc: "#F7931A", eth: "#627EEA", sol: "#9945FF", bnb: "#F3BA2F",
  xrp: "#346AA9", ada: "#0033AD", doge: "#C2A633", dot: "#E6007A",
  avax: "#E84142", link: "#2A5ADA",
};

export default async function HomePage() {
  let coins = FALLBACK_COINS;
  let fearGreed = { value: 72, classification: "Greed" };
  let news = FALLBACK_NEWS;
  let marketLive = false;
  let newsLive = false;

  const results = await Promise.allSettled([
    getTopCoins(10),
    getFearGreedIndex(),
    getCryptoNews(5),
  ]);

  if (results[0].status === "fulfilled") { coins = results[0].value; marketLive = true; }
  if (results[1].status === "fulfilled") { fearGreed = results[1].value; }
  if (results[2].status === "fulfilled") { news = results[2].value; newsLive = true; }

  const { label: fgLabel, color: fgColor } = classifyFearGreed(fearGreed.value);
  const CIRCUMFERENCE = 2 * Math.PI * 28;
  const fgDash = (fearGreed.value / 100) * CIRCUMFERENCE;

  return (
    <div className="px-4 pt-5 max-w-lg mx-auto">
      <Onboarding />

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-cl-muted mb-0.5">
            Bem-vindo
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-cl-primary">
            Cripto<span className="text-cl-accent">Lens</span>
          </h1>
        </div>
        <div className="flex items-center gap-2.5">
          {marketLive && (
            <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--positive)" }}>
              <span className="block w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--positive)" }} />
              Ao vivo
            </span>
          )}
          <ThemeToggle />
        </div>
      </div>

      {/* Instrutor card */}
      <div
        className="rounded-2xl p-4 mb-5 border"
        style={{ background: "var(--instructor-bg)", borderColor: "var(--instructor-border)" }}
      >
        <div className="flex items-center gap-2.5 mb-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
            style={{ background: "var(--instructor)" }}
          >
            🎓
          </div>
          <div>
            <p className="text-xs font-bold tracking-wider uppercase" style={{ color: "var(--instructor)" }}>
              Instrutor
            </p>
            <p className="text-xs text-cl-muted">Powered by Claude AI</p>
          </div>
        </div>
        <p className="text-sm text-cl-secondary leading-relaxed">
          Qualquer número ou gráfico que você ver nesta tela — toque e pergunte. Estou aqui para explicar tudo em detalhes, do básico ao avançado.
        </p>
        <Link
          href="/chat"
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold"
          style={{ color: "var(--instructor)" }}
        >
          Iniciar conversa
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      {/* PWA Install */}
      <PWAInstall />

      {/* Missão do dia */}
      <MissaoDoDia fearGreedValue={fearGreed.value} fearGreedLabel={fgLabel} />

      {/* Fear & Greed */}
      <div className="bg-cl-surface border border-cl-border rounded-2xl p-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold tracking-wider uppercase text-cl-muted">
            Sentimento do Mercado
          </p>
          <span className="text-xs text-cl-muted">Fear & Greed Index</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0 w-[72px] h-[72px]">
            <svg width="72" height="72" viewBox="0 0 72 72" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="36" cy="36" r="28" fill="none" stroke="var(--border)" strokeWidth="8" />
              <circle
                cx="36" cy="36" r="28" fill="none"
                stroke={fgColor}
                strokeWidth="8"
                strokeDasharray={`${fgDash} ${CIRCUMFERENCE}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold" style={{ color: fgColor }}>
                {fearGreed.value}
              </span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold mb-0.5" style={{ color: fgColor }}>
              {fgLabel}
            </p>
            <p className="text-xs text-cl-secondary leading-relaxed">
              {fearGreed.value <= 49
                ? "Investidores estão com medo. Historicamente, pode ser uma oportunidade de compra."
                : fearGreed.value <= 74
                  ? "Mercado aquecido. Alta confiança dos investidores, mas atenção a correções."
                  : "Ganância extrema. Risco elevado de correção no curto prazo."}
            </p>
            <Link
              href={`/chat?q=${encodeURIComponent(`O Fear & Greed Index está em ${fearGreed.value} (${fgLabel}). O que isso significa para mim como iniciante em cripto?`)}`}
              className="mt-1.5 inline-block text-xs font-medium"
              style={{ color: "var(--instructor)" }}
            >
              ? O que isso significa para mim?
            </Link>
          </div>
        </div>
      </div>

      {/* Mercado */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold tracking-wider uppercase text-cl-muted">
            Principais Moedas
          </p>
          <span className="text-xs text-cl-muted tabular-nums">em USD</span>
        </div>
        <div className="bg-cl-surface border border-cl-border rounded-2xl overflow-hidden">
          {coins.map((coin, i) => {
            const color = SYMBOL_COLORS[coin.symbol] ?? "#6B7280";
            const change = coin.price_change_percentage_24h ?? 0;
            return (
              <div
                key={coin.id}
                className={`flex items-center gap-3 px-4 py-3 ${i < coins.length - 1 ? "border-b border-cl-border" : ""}`}
              >
                {/* Coin image or badge */}
                <div
                  className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: coin.image ? "transparent" : color }}
                >
                  {coin.image ? (
                    <Image
                      src={coin.image}
                      alt={coin.name}
                      width={36}
                      height={36}
                      className="rounded-full"
                      unoptimized
                    />
                  ) : (
                    coin.symbol.slice(0, 1).toUpperCase()
                  )}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-cl-primary uppercase">
                    {coin.symbol}
                  </p>
                  <p className="text-xs text-cl-muted truncate">{coin.name}</p>
                </div>

                {/* Price + change */}
                <div className="text-right">
                  <p className="text-sm font-semibold text-cl-primary tabular-nums font-mono">
                    {formatPrice(coin.current_price)}
                  </p>
                  <p
                    className="text-xs font-semibold tabular-nums"
                    style={{ color: change >= 0 ? "var(--positive)" : "var(--negative)" }}
                  >
                    {change >= 0 ? "+" : ""}{change.toFixed(2)}%
                  </p>
                </div>

                {/* Contextual ask button */}
                <Link
                  href={askInstrutor(`O ${coin.name} está ${change >= 0 ? "subindo" : "caindo"} ${Math.abs(change).toFixed(1)}% hoje e vale ${formatPrice(coin.current_price)}. O que pode estar causando isso e o que esse movimento significa?`)}
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-opacity hover:opacity-100 opacity-50"
                  style={{ background: "var(--instructor-bg)", color: "var(--instructor)", border: "1px solid var(--instructor-border)" }}
                  title={`Perguntar sobre ${coin.name}`}
                >
                  ?
                </Link>
              </div>
            );
          })}
        </div>

        {/* Legenda market cap */}
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 px-1 items-center">
          {coins.slice(0, 3).map((c) => (
            <span key={c.id} className="text-xs text-cl-muted tabular-nums">
              {c.symbol.toUpperCase()} cap: {formatMarketCap(c.market_cap)}
            </span>
          ))}
          <Link
            href={askInstrutor("O que é market cap de uma criptomoeda e por que ele é importante? Qual a diferença entre market cap e preço?")}
            className="text-xs font-semibold"
            style={{ color: "var(--instructor)" }}
          >
            ? O que é market cap?
          </Link>
        </div>
      </div>

      {/* Notícias */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold tracking-wider uppercase text-cl-muted">Notícias</p>
          {newsLive ? (
            <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--positive)" }}>
              <span className="block w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--positive)" }} />
              Ao vivo
            </span>
          ) : (
            <span className="text-xs text-cl-muted">Demo</span>
          )}
        </div>
        <div className="space-y-2.5">
          {news.map((item, i) => (
            <a
              key={i}
              href={item.url !== "#" ? item.url : undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-cl-surface border border-cl-border rounded-xl p-3 active:opacity-70 transition-opacity"
            >
              <div className="flex items-start gap-2.5">
                <span
                  className="text-xs mt-0.5 flex-shrink-0 font-bold"
                  style={{
                    color: item.sentiment === "bullish"
                      ? "var(--positive)"
                      : item.sentiment === "bearish"
                        ? "var(--negative)"
                        : "var(--text-muted)",
                  }}
                >
                  {item.sentiment === "bullish" ? "▲" : item.sentiment === "bearish" ? "▼" : "●"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-cl-primary leading-snug mb-1 line-clamp-2">
                    {item.title}
                  </p>
                  <p className="text-xs text-cl-muted">
                    {item.source} · {item.time}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

    </div>
  );
}
