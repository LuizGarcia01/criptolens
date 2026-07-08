const BASE_URL = "https://api.coingecko.com/api/v3";

function getHeaders(): HeadersInit {
  const key = process.env.COINGECKO_API_KEY;
  return key ? { "x-cg-demo-api-key": key } : {};
}

export interface CoinMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
}

export async function getCoinById(coinId: string): Promise<CoinMarket | null> {
  const params = new URLSearchParams({
    vs_currency: "usd", ids: coinId, sparkline: "false",
    price_change_percentage: "24h",
  });
  const res = await fetch(`${BASE_URL}/coins/markets?${params}`, {
    headers: getHeaders(), next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data[0] ?? null;
}

export async function getTopCoins(limit = 10): Promise<CoinMarket[]> {
  const params = new URLSearchParams({
    vs_currency: "usd",
    order: "market_cap_desc",
    per_page: String(limit),
    page: "1",
    sparkline: "false",
    price_change_percentage: "24h",
  });

  const res = await fetch(`${BASE_URL}/coins/markets?${params}`, {
    headers: getHeaders(),
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error(`CoinGecko ${res.status}: ${res.statusText}`);
  return res.json();
}
