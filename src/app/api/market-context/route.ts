import { getTopCoins } from "@/lib/api/coingecko";
import { getFearGreedIndex, classifyFearGreed } from "@/lib/api/fear-greed";
import { getCryptoNews } from "@/lib/api/news";

export const revalidate = 120; // 2 minutes cache

export async function GET() {
  const [coinsResult, fgResult, newsResult] = await Promise.allSettled([
    getTopCoins(10),
    getFearGreedIndex(),
    getCryptoNews(6),
  ]);

  const coins =
    coinsResult.status === "fulfilled"
      ? coinsResult.value.map((c) => ({
          name: c.name,
          symbol: c.symbol.toUpperCase(),
          price: c.current_price,
          change24h: c.price_change_percentage_24h ?? 0,
        }))
      : [];

  const fg =
    fgResult.status === "fulfilled"
      ? fgResult.value
      : { value: 50, classification: "Neutral" };
  const { label: fearGreedLabel } = classifyFearGreed(fg.value);

  const newsHeadlines =
    newsResult.status === "fulfilled"
      ? newsResult.value.map((n) => `[${n.source}] ${n.title}`)
      : [];

  return Response.json({
    fearGreed: fg.value,
    fearGreedLabel,
    coins,
    newsHeadlines,
    fetchedAt: new Date().toISOString(),
  });
}
