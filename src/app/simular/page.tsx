import { getTopCoins } from "@/lib/api/coingecko";
import { getFearGreedIndex, classifyFearGreed } from "@/lib/api/fear-greed";
import Simulator from "@/components/simulator/Simulator";

export default async function SimularPage() {
  const [coinsResult, fgResult] = await Promise.allSettled([
    getTopCoins(12),
    getFearGreedIndex(),
  ]);

  const coins = coinsResult.status === "fulfilled" ? coinsResult.value : [];
  const fg = fgResult.status === "fulfilled" ? fgResult.value : { value: 50, classification: "Neutral" };
  const { label: fearGreedLabel } = classifyFearGreed(fg.value);

  if (coins.length === 0) {
    return (
      <div className="px-4 pt-5 max-w-lg mx-auto">
        <p className="text-sm text-cl-muted">
          Não foi possível carregar os preços. Verifique sua conexão e atualize a página.
        </p>
      </div>
    );
  }

  return (
    <Simulator
      coins={coins}
      fearGreedValue={fg.value}
      fearGreedLabel={fearGreedLabel}
    />
  );
}
