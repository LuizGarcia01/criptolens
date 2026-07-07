export interface FearGreedData {
  value: number;
  classification: string;
}

export async function getFearGreedIndex(): Promise<FearGreedData> {
  const res = await fetch("https://api.alternative.me/fng/?limit=1", {
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`Fear & Greed API ${res.status}`);

  const json = await res.json();
  const item = json.data[0];

  return {
    value: parseInt(item.value, 10),
    classification: item.value_classification,
  };
}

export function classifyFearGreed(value: number): {
  label: string;
  color: string;
} {
  if (value <= 24) return { label: "Medo Extremo", color: "var(--negative)" };
  if (value <= 49) return { label: "Medo", color: "#F97316" };
  if (value === 50) return { label: "Neutro", color: "#EAB308" };
  if (value <= 74) return { label: "Ganância", color: "var(--positive)" };
  return { label: "Ganância Extrema", color: "var(--positive)" };
}
