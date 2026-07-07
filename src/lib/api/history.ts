const BASE_URL = "https://api.coingecko.com/api/v3";

function getHeaders(): HeadersInit {
  const key = process.env.COINGECKO_API_KEY;
  return key ? { "x-cg-demo-api-key": key } : {};
}

export async function getCoinPriceHistory(coinId: string, days = 30): Promise<number[]> {
  const params = new URLSearchParams({ vs_currency: "usd", days: String(days) });
  const res = await fetch(
    `${BASE_URL}/coins/${coinId}/market_chart?${params}`,
    { headers: getHeaders(), next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error(`CoinGecko history ${res.status} for ${coinId}`);
  const json = await res.json();
  return (json.prices as [number, number][]).map(([, price]) => price);
}
