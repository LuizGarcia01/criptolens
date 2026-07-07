export interface NormalizedNews {
  title: string;
  source: string;
  url: string;
  time: string;
  sentiment: "bullish" | "bearish" | "neutral";
}

const RSS_FEEDS = [
  { url: "https://cointelegraph.com/rss", source: "Cointelegraph" },
  { url: "https://decrypt.co/feed", source: "Decrypt" },
];

export async function getCryptoNews(limit = 5): Promise<NormalizedNews[]> {
  const results = await Promise.allSettled(
    RSS_FEEDS.map((feed) => fetchRSS(feed.url, feed.source, Math.ceil(limit / RSS_FEEDS.length) + 1))
  );

  const allItems = results
    .filter((r): r is PromiseFulfilledResult<NormalizedNews[]> => r.status === "fulfilled")
    .flatMap((r) => r.value)
    .sort((a, b) => parseTimeToSort(a.time) - parseTimeToSort(b.time))
    .slice(0, limit);

  if (allItems.length === 0) throw new Error("All RSS feeds failed");
  return allItems;
}

async function fetchRSS(url: string, source: string, limit: number): Promise<NormalizedNews[]> {
  const res = await fetch(url, {
    next: { revalidate: 300 },
    headers: { "User-Agent": "CriptoLens/1.0" },
  });

  if (!res.ok) throw new Error(`RSS ${res.status} for ${url}`);

  const xml = await res.text();
  const items = xml.match(/<item[\s>][\s\S]*?<\/item>/g) ?? [];

  return items.slice(0, limit).map((item) => {
    const title = clean(extract(item, "title"));
    const link = clean(extract(item, "link")) || clean(extract(item, "guid"));
    const pubDate = clean(extract(item, "pubDate"));

    return {
      title,
      source,
      url: link,
      time: formatTimeAgo(pubDate),
      sentiment: detectSentiment(title),
    };
  });
}

function extract(xml: string, tag: string): string {
  const m = xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return m?.[1] ?? "";
}

function clean(str: string): string {
  return str
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function formatTimeAgo(pubDate: string): string {
  if (!pubDate) return "";
  const ts = new Date(pubDate).getTime();
  if (isNaN(ts)) return "";
  const seconds = Math.floor((Date.now() - ts) / 1000);
  if (seconds < 60) return "agora";
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m}min atrás`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h atrás`;
  const d = Math.floor(h / 24);
  return d === 1 ? "1 dia atrás" : `${d} dias atrás`;
}

function parseTimeToSort(time: string): number {
  const now = Date.now();
  if (!time) return now;
  const m = time.match(/(\d+)(min|h|dia|dias)/);
  if (!m) return now;
  const n = parseInt(m[1]);
  if (m[2] === "min") return n * 60 * 1000;
  if (m[2] === "h") return n * 3600 * 1000;
  return n * 86400 * 1000;
}

function detectSentiment(title: string): "bullish" | "bearish" | "neutral" {
  const t = title.toLowerCase();
  const bearish = ["hack", "exploit", "crash", "ban", "lawsuit", "scam", "bear", "fall", "drop", "lose", "lost", "warning", "collapse", "fraud", "stolen", "phishing", "attack"];
  const bullish = ["bull", "rise", "gain", "ath", "record", "launch", "adoption", "approve", "etf", "surge", "rally", "high", "growth", "buy", "soar", "breakthrough", "milestone"];
  const b = bearish.some((w) => t.includes(w));
  const u = bullish.some((w) => t.includes(w));
  if (b && !u) return "bearish";
  if (u && !b) return "bullish";
  return "neutral";
}
