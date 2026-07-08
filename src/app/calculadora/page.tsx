import { getTopCoins } from "@/lib/api/coingecko";
import Calculadora from "@/components/ui/Calculadora";

export default async function CalculadoraPage() {
  const coins = await getTopCoins(20).catch(() => []);
  return <Calculadora coins={coins} />;
}
