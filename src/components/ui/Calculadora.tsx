"use client";

import { useState } from "react";
import Link from "next/link";
import type { CoinMarket } from "@/lib/api/coingecko";

function fmtPrice(n: number) {
  if (n < 0.01) return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 6 }).format(n);
  if (n < 1) return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 4 }).format(n);
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);
}

export default function Calculadora({ coins }: { coins: CoinMarket[] }) {
  const [coinId, setCoinId] = useState(coins[0]?.id ?? "bitcoin");
  const [qty, setQty] = useState("");
  const [buyPrice, setBuyPrice] = useState(
    coins[0]?.current_price ? coins[0].current_price.toString() : ""
  );

  const coin = coins.find((c) => c.id === coinId);
  const currentPrice = coin?.current_price ?? 0;

  function handleCoinChange(newId: string) {
    setCoinId(newId);
    const newCoin = coins.find((c) => c.id === newId);
    if (newCoin) setBuyPrice(newCoin.current_price.toString());
  }
  const qtyNum = parseFloat(qty) || 0;
  const buyNum = parseFloat(buyPrice) || 0;

  const invested = qtyNum * buyNum;
  const currentValue = qtyNum * currentPrice;
  const profit = currentValue - invested;
  const profitPct = invested > 0 ? (profit / invested) * 100 : 0;
  const isUp = profit >= 0;
  const hasResult = qtyNum > 0 && buyNum > 0;

  const instructorQ = hasResult
    ? encodeURIComponent(`Comprei ${qty} ${coin?.symbol?.toUpperCase()} a ${fmtPrice(buyNum)} cada. Hoje vale ${fmtPrice(currentPrice)}. Meu ${isUp ? "lucro" : "prejuízo"} é de ${fmtPrice(Math.abs(profit))} (${profitPct.toFixed(1)}%). O que você acha? Devo manter, comprar mais ou vender?`)
    : encodeURIComponent("Explique como calcular lucro e prejuízo em investimentos em criptomoedas.");

  return (
    <div className="px-4 pt-5 pb-10 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5 text-xs text-cl-muted">
        <Link href="/" className="hover:text-cl-primary transition-colors">← Início</Link>
      </div>
      <p className="text-xs font-semibold tracking-widest uppercase text-cl-muted mb-0.5">Ferramenta</p>
      <h1 className="text-2xl font-bold tracking-tight text-cl-primary mb-5">Calculadora</h1>

      {/* Form */}
      <div className="bg-cl-surface border border-cl-border rounded-2xl p-4 mb-4 space-y-4">
        {/* Coin selector */}
        <div>
          <label className="text-xs font-bold text-cl-muted uppercase tracking-wider block mb-1.5">Moeda</label>
          <select
            value={coinId}
            onChange={(e) => handleCoinChange(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm font-semibold text-cl-primary border border-cl-border"
            style={{ background: "var(--surface-2)" }}
          >
            {coins.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.symbol.toUpperCase()}) — {fmtPrice(c.current_price)}
              </option>
            ))}
          </select>
        </div>

        {/* Qty */}
        <div>
          <label className="text-xs font-bold text-cl-muted uppercase tracking-wider block mb-1.5">
            Quantidade comprada
          </label>
          <input
            type="number"
            placeholder="Ex: 0.5"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm text-cl-primary border border-cl-border"
            style={{ background: "var(--surface-2)" }}
          />
        </div>

        {/* Buy price */}
        <div>
          <label className="text-xs font-bold text-cl-muted uppercase tracking-wider block mb-1.5">
            Preço de compra (USD)
          </label>
          <input
            type="number"
            placeholder="Ex: 50000"
            value={buyPrice}
            onChange={(e) => setBuyPrice(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm text-cl-primary border border-cl-border"
            style={{ background: "var(--surface-2)" }}
          />
        </div>
      </div>

      {/* Result */}
      {hasResult && (
        <div
          className="rounded-2xl p-4 mb-4 border"
          style={{
            background: isUp ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
            borderColor: isUp ? "var(--positive)" : "var(--negative)",
          }}
        >
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: isUp ? "var(--positive)" : "var(--negative)" }}>
            {isUp ? "📈 Resultado" : "📉 Resultado"}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-3" style={{ background: "var(--surface)" }}>
              <p className="text-[10px] text-cl-muted mb-0.5">Investido</p>
              <p className="text-sm font-bold text-cl-primary tabular-nums">{fmtPrice(invested)}</p>
            </div>
            <div className="rounded-xl p-3" style={{ background: "var(--surface)" }}>
              <p className="text-[10px] text-cl-muted mb-0.5">Valor atual</p>
              <p className="text-sm font-bold text-cl-primary tabular-nums">{fmtPrice(currentValue)}</p>
            </div>
            <div className="col-span-2 rounded-xl p-3" style={{ background: "var(--surface)" }}>
              <p className="text-[10px] text-cl-muted mb-1">{isUp ? "Lucro" : "Prejuízo"}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-bold tabular-nums" style={{ color: isUp ? "var(--positive)" : "var(--negative)" }}>
                  {isUp ? "+" : ""}{fmtPrice(profit)}
                </p>
                <p className="text-sm font-bold tabular-nums" style={{ color: isUp ? "var(--positive)" : "var(--negative)" }}>
                  ({isUp ? "+" : ""}{profitPct.toFixed(2)}%)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preço atual info */}
      {coin && (
        <div className="rounded-xl px-4 py-3 mb-4 flex items-center justify-between border border-cl-border" style={{ background: "var(--surface)" }}>
          <span className="text-xs text-cl-muted">Preço atual {coin.name}</span>
          <div className="text-right">
            <span className="text-sm font-bold text-cl-primary tabular-nums">{fmtPrice(currentPrice)}</span>
            <span className="text-xs ml-2 font-semibold" style={{ color: (coin.price_change_percentage_24h ?? 0) >= 0 ? "var(--positive)" : "var(--negative)" }}>
              {(coin.price_change_percentage_24h ?? 0) >= 0 ? "+" : ""}{(coin.price_change_percentage_24h ?? 0).toFixed(2)}% 24h
            </span>
          </div>
        </div>
      )}

      {/* Instructor */}
      <Link
        href={`/chat?q=${instructorQ}`}
        className="flex items-center gap-3 rounded-2xl p-4 border"
        style={{ background: "var(--instructor-bg)", borderColor: "var(--instructor-border)" }}
      >
        <span className="text-2xl">🎓</span>
        <div className="flex-1">
          <p className="text-sm font-bold" style={{ color: "var(--instructor)" }}>
            {hasResult ? "O que o Instrutor acha?" : "Entender lucro e perda"}
          </p>
          <p className="text-xs text-cl-secondary">
            {hasResult ? "Manter, comprar mais ou vender?" : "Aprenda a calcular com o Instrutor"}
          </p>
        </div>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 7h8M7 3l4 4-4 4" stroke="var(--instructor)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}
