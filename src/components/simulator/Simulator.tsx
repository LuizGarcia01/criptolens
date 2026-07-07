"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { CoinMarket } from "@/lib/api/coingecko";
import { Sparkline, DonutChart, getCoinColor, type DonutSegment } from "./Charts";

const STARTING_BALANCE = 1000;
const STORAGE_KEY = "criptolens_simulator_v2";
const PRESETS = [10, 25, 50, 100];

interface Holding {
  amount: number;
  avgPrice: number;
}

interface Trade {
  id: string;
  date: string;
  type: "buy" | "sell";
  coinId: string;
  symbol: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface HistoryPoint {
  date: string;
  value: number;
}

interface SimState {
  balance: number;
  holdings: Record<string, Holding>;
  trades: Trade[];
  history: HistoryPoint[];
}

const INITIAL: SimState = {
  balance: STARTING_BALANCE,
  holdings: {},
  trades: [],
  history: [{ date: new Date().toISOString(), value: STARTING_BALANCE }],
};

type Tab = "portfolio" | "trade" | "history";

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

const compactUsd = (n: number) =>
  n >= 10000
    ? `$${(n / 1000).toFixed(1)}k`
    : `$${n.toFixed(0)}`;

function fmtQty(amount: number, symbol: string) {
  const decimals = amount < 0.001 ? 8 : amount < 1 ? 4 : 2;
  return `${amount.toFixed(decimals)} ${symbol.toUpperCase()}`;
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return `hoje ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
  }
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export default function Simulator({
  coins,
  fearGreedValue,
  fearGreedLabel,
}: {
  coins: CoinMarket[];
  fearGreedValue: number;
  fearGreedLabel: string;
}) {
  const [tab, setTab] = useState<Tab>("portfolio");
  const [simState, setSimState] = useState<SimState>(INITIAL);
  const [loaded, setLoaded] = useState(false);
  const [selectedCoinId, setSelectedCoinId] = useState(coins[0]?.id ?? "bitcoin");
  const [mode, setMode] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("50");
  const [lastTrade, setLastTrade] = useState<Trade | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  // Load from localStorage + record visit-time value (prices may have shifted)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      let state: SimState = {
        ...INITIAL,
        history: [{ date: new Date().toISOString(), value: STARTING_BALANCE }],
      };

      if (saved) {
        const parsed = JSON.parse(saved) as Partial<SimState>;
        state = {
          balance: parsed.balance ?? STARTING_BALANCE,
          holdings: parsed.holdings ?? {},
          trades: parsed.trades ?? [],
          history: parsed.history ?? [{ date: new Date().toISOString(), value: STARTING_BALANCE }],
        };
      }

      // Record current portfolio value on each visit (prices may have changed)
      const holdingsVal = Object.entries(state.holdings).reduce((sum, [coinId, h]) => {
        const coin = coins.find((c) => c.id === coinId);
        return sum + (coin ? h.amount * coin.current_price : 0);
      }, 0);
      const currentTotal = state.balance + holdingsVal;
      const lastHistVal = state.history[state.history.length - 1]?.value ?? STARTING_BALANCE;
      const changeFrac = Math.abs((currentTotal - lastHistVal) / lastHistVal);

      if (state.trades.length > 0 && changeFrac > 0.0002) {
        state = {
          ...state,
          history: [...state.history, { date: new Date().toISOString(), value: currentTotal }],
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }

      setSimState(state);
    } catch {}
    setLoaded(true);
  }, [coins]);

  const persist = (s: SimState) => {
    setSimState(s);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
  };

  const selectedCoin = coins.find((c) => c.id === selectedCoinId) ?? coins[0];
  const amountNum = parseFloat(amount) || 0;

  const holdingsValue = Object.entries(simState.holdings).reduce((sum, [coinId, h]) => {
    const coin = coins.find((c) => c.id === coinId);
    return sum + (coin ? h.amount * coin.current_price : 0);
  }, 0);

  const totalValue = simState.balance + holdingsValue;
  const pnl = totalValue - STARTING_BALANCE;
  const pnlPct = (pnl / STARTING_BALANCE) * 100;
  const pnlPositive = pnl >= 0;

  const holdingForSelected = simState.holdings[selectedCoinId];
  const holdingValueForSelected =
    holdingForSelected && selectedCoin
      ? holdingForSelected.amount * selectedCoin.current_price
      : 0;

  const canBuy = amountNum > 0 && amountNum <= simState.balance;
  const canSell =
    amountNum > 0 &&
    holdingForSelected != null &&
    amountNum <= holdingValueForSelected + 0.01;

  // Donut segments: coins sorted by value, then cash
  const donutSegments: DonutSegment[] = [
    ...Object.entries(simState.holdings)
      .map(([coinId, h], idx) => {
        const coin = coins.find((c) => c.id === coinId);
        const value = coin ? h.amount * coin.current_price : 0;
        return {
          label: coin?.symbol.toUpperCase() ?? coinId,
          value,
          color: getCoinColor(coinId, idx),
          pct: totalValue > 0 ? (value / totalValue) * 100 : 0,
        };
      })
      .sort((a, b) => b.value - a.value),
    simState.balance > 0
      ? {
          label: "Cash",
          value: simState.balance,
          color: "#6B7280",
          pct: totalValue > 0 ? (simState.balance / totalValue) * 100 : 100,
        }
      : null,
  ].filter(Boolean) as DonutSegment[];

  const executeTrade = () => {
    if (!selectedCoin) return;
    const price = selectedCoin.current_price;

    if (mode === "buy") {
      if (!canBuy) return;
      const quantity = amountNum / price;
      const existing = simState.holdings[selectedCoinId];
      const newHolding: Holding = existing
        ? {
            amount: existing.amount + quantity,
            avgPrice:
              (existing.avgPrice * existing.amount + amountNum) /
              (existing.amount + quantity),
          }
        : { amount: quantity, avgPrice: price };

      const newHoldings = { ...simState.holdings, [selectedCoinId]: newHolding };
      const newBalance = simState.balance - amountNum;
      const newTotal =
        newBalance +
        Object.entries(newHoldings).reduce((sum, [cid, h]) => {
          const c = coins.find((x) => x.id === cid);
          return sum + (c ? h.amount * c.current_price : 0);
        }, 0);

      const trade: Trade = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        type: "buy",
        coinId: selectedCoinId,
        symbol: selectedCoin.symbol,
        name: selectedCoin.name,
        quantity,
        price,
        total: amountNum,
      };

      persist({
        balance: newBalance,
        holdings: newHoldings,
        trades: [trade, ...simState.trades],
        history: [...simState.history, { date: trade.date, value: newTotal }],
      });
      setLastTrade(trade);
    } else {
      if (!holdingForSelected || !canSell) return;
      const quantityToSell = Math.min(amountNum / price, holdingForSelected.amount);
      const totalUSD = quantityToSell * price;
      const remaining = holdingForSelected.amount - quantityToSell;
      const newHoldings = { ...simState.holdings };
      if (remaining < 1e-8) delete newHoldings[selectedCoinId];
      else newHoldings[selectedCoinId] = { ...holdingForSelected, amount: remaining };

      const newBalance = simState.balance + totalUSD;
      const newTotal =
        newBalance +
        Object.entries(newHoldings).reduce((sum, [cid, h]) => {
          const c = coins.find((x) => x.id === cid);
          return sum + (c ? h.amount * c.current_price : 0);
        }, 0);

      const trade: Trade = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        type: "sell",
        coinId: selectedCoinId,
        symbol: selectedCoin.symbol,
        name: selectedCoin.name,
        quantity: quantityToSell,
        price,
        total: totalUSD,
      };

      persist({
        balance: newBalance,
        holdings: newHoldings,
        trades: [trade, ...simState.trades],
        history: [...simState.history, { date: trade.date, value: newTotal }],
      });
      setLastTrade(trade);
    }
  };

  const instructorHref = `/chat?q=${encodeURIComponent(
    `Tenho um portfólio simulado com ${usd(totalValue)} no total (comecei com US$1.000). Resultado: ${pnlPositive ? "+" : ""}${usd(pnl)} (${pnlPct.toFixed(1)}%). Fear & Greed: ${fearGreedValue} (${fearGreedLabel}). O que você acha da minha estratégia? O que devo fazer agora?`
  )}`;

  if (!loaded) return null;

  return (
    <div className="px-4 pt-5 pb-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-cl-muted mb-0.5">
            Laboratório
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-cl-primary">Simulador</h1>
          <p className="text-xs text-cl-muted mt-0.5">Capital virtual · sem dinheiro real</p>
        </div>
        <div className="text-right pt-1">
          <p className="text-[10px] text-cl-muted uppercase tracking-wider">Portfólio</p>
          <p
            className="text-lg font-bold tabular-nums"
            style={{ color: pnlPositive ? "var(--positive)" : "var(--negative)" }}
          >
            {usd(totalValue)}
          </p>
        </div>
      </div>

      {/* P&L Banner */}
      <div
        className="rounded-2xl p-3.5 mb-5 flex items-center justify-between"
        style={{
          background: pnlPositive ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
          border: `1px solid ${pnlPositive ? "var(--positive)" : "var(--negative)"}`,
        }}
      >
        <div>
          <p className="text-[10px] text-cl-muted mb-0.5">Resultado desde o início</p>
          <p
            className="text-base font-bold tabular-nums"
            style={{ color: pnlPositive ? "var(--positive)" : "var(--negative)" }}
          >
            {pnlPositive ? "+" : ""}
            {usd(pnl)}{" "}
            <span className="text-sm font-semibold">
              ({pnlPositive ? "+" : ""}
              {pnlPct.toFixed(2)}%)
            </span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-cl-muted mb-0.5">Disponível</p>
          <p className="text-sm font-semibold text-cl-primary tabular-nums">
            {usd(simState.balance)}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 p-1 rounded-xl mb-5"
        style={{ background: "var(--surface-2)" }}
      >
        {(["portfolio", "trade", "history"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: tab === t ? "var(--surface)" : "transparent",
              color: tab === t ? "var(--text-primary)" : "var(--text-muted)",
              boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
            }}
          >
            {t === "portfolio" ? "Carteira" : t === "trade" ? "Negociar" : "Histórico"}
          </button>
        ))}
      </div>

      {/* ── CARTEIRA ── */}
      {tab === "portfolio" && (
        <div className="space-y-3">
          {/* Instructor link */}
          <Link
            href={instructorHref}
            className="flex items-center gap-2.5 rounded-xl p-3 border transition-opacity active:opacity-75"
            style={{ background: "var(--instructor-bg)", borderColor: "var(--instructor-border)" }}
          >
            <div
              className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-sm"
              style={{ background: "var(--instructor)" }}
            >
              🎓
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold" style={{ color: "var(--instructor)" }}>
                Pedir análise ao Instrutor
              </p>
              <p className="text-[10px] text-cl-muted">Como está minha estratégia?</p>
            </div>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M4.5 2.5L8 6l-3.5 3.5"
                stroke="var(--instructor)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          {/* Sparkline card */}
          {simState.history.length >= 2 && (
            <div
              className="rounded-2xl p-4 border"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-cl-muted">
                  📈 Evolução
                </p>
                <p className="text-[10px] tabular-nums text-cl-muted">
                  {usd(simState.history[0].value)} →{" "}
                  <span
                    style={{
                      color: pnlPositive ? "var(--positive)" : "var(--negative)",
                      fontWeight: 600,
                    }}
                  >
                    {usd(simState.history[simState.history.length - 1].value)}
                  </span>
                </p>
              </div>
              <Sparkline history={simState.history} startValue={STARTING_BALANCE} />
              <p className="text-[9px] text-cl-muted mt-1 text-center">
                cada ponto = um trade ou visita com preços atualizados
              </p>
            </div>
          )}

          {/* Donut chart — alocação */}
          {donutSegments.length > 0 && (
            <div
              className="rounded-2xl p-4 border"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-cl-muted mb-3">
                🍩 Alocação
              </p>
              <div className="flex items-center gap-4">
                <DonutChart
                  segments={donutSegments}
                  centerLabel={compactUsd(totalValue)}
                />
                <div className="flex-1 space-y-2">
                  {donutSegments.map((seg) => (
                    <div key={seg.label} className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: seg.color }}
                      />
                      <span className="text-xs text-cl-secondary flex-1">{seg.label}</span>
                      <span className="text-xs font-semibold tabular-nums text-cl-primary">
                        {seg.pct.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Holdings */}
          {Object.keys(simState.holdings).length === 0 ? (
            <div
              className="rounded-2xl p-6 text-center border"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <p className="text-3xl mb-2">📭</p>
              <p className="text-sm font-semibold text-cl-primary mb-1">Carteira vazia</p>
              <p className="text-xs text-cl-muted">
                Você tem {usd(simState.balance)} disponíveis.{" "}
                <button
                  className="font-semibold underline"
                  style={{ color: "var(--instructor)" }}
                  onClick={() => setTab("trade")}
                >
                  Comece a negociar →
                </button>
              </p>
            </div>
          ) : (
            Object.entries(simState.holdings).map(([coinId, holding], idx) => {
              const coin = coins.find((c) => c.id === coinId);
              if (!coin) return null;
              const currentValue = holding.amount * coin.current_price;
              const costBasis = holding.amount * holding.avgPrice;
              const holdPnl = currentValue - costBasis;
              const holdPnlPct = (holdPnl / costBasis) * 100;
              const holdPositive = holdPnl >= 0;
              const coinColor = getCoinColor(coinId, idx);

              return (
                <div
                  key={coinId}
                  className="rounded-2xl p-4 border"
                  style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                >
                  {/* Color accent strip */}
                  <div
                    className="w-full h-0.5 rounded-full mb-3 opacity-60"
                    style={{ background: coinColor }}
                  />
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: coinColor }}
                      />
                      <div>
                        <p className="text-sm font-bold text-cl-primary uppercase">
                          {coin.symbol}
                        </p>
                        <p className="text-xs text-cl-muted">{coin.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-cl-primary tabular-nums">
                        {usd(currentValue)}
                      </p>
                      <p
                        className="text-xs font-semibold tabular-nums"
                        style={{
                          color: holdPositive ? "var(--positive)" : "var(--negative)",
                        }}
                      >
                        {holdPositive ? "+" : ""}
                        {usd(holdPnl)} ({holdPositive ? "+" : ""}
                        {holdPnlPct.toFixed(1)}%)
                      </p>
                    </div>
                  </div>

                  {/* Allocation mini-bar */}
                  <div className="mb-3">
                    <div
                      className="h-1 rounded-full w-full overflow-hidden"
                      style={{ background: "var(--surface-2)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(100, (currentValue / totalValue) * 100)}%`,
                          background: coinColor,
                          opacity: 0.75,
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1.5 text-[10px] text-cl-muted">
                      <span>{fmtQty(holding.amount, coin.symbol)}</span>
                      <span>Médio: {usd(holding.avgPrice)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedCoinId(coinId);
                        setMode("buy");
                        setAmount("50");
                        setTab("trade");
                      }}
                      className="flex-1 py-1.5 rounded-xl text-xs font-bold text-white transition-opacity active:opacity-75"
                      style={{ background: "var(--positive)" }}
                    >
                      Comprar mais
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCoinId(coinId);
                        setMode("sell");
                        setAmount(String(Math.floor(currentValue * 100) / 100));
                        setTab("trade");
                      }}
                      className="flex-1 py-1.5 rounded-xl text-xs font-bold text-white transition-opacity active:opacity-75"
                      style={{ background: "var(--negative)" }}
                    >
                      Vender
                    </button>
                  </div>
                </div>
              );
            })
          )}

          {/* Cash pill if holding something */}
          {Object.keys(simState.holdings).length > 0 && simState.balance > 0 && (
            <div
              className="rounded-xl p-3 flex items-center justify-between border"
              style={{ background: "var(--surface-2)", borderColor: "var(--border)" }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: "#6B7280" }}
                />
                <p className="text-xs text-cl-muted">Caixa disponível</p>
              </div>
              <p className="text-sm font-semibold text-cl-primary tabular-nums">
                {usd(simState.balance)}
              </p>
            </div>
          )}

          {/* Reset */}
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="w-full py-2.5 rounded-xl text-xs text-cl-muted border transition-opacity active:opacity-70 mt-1"
              style={{ borderColor: "var(--border)" }}
            >
              Resetar simulador
            </button>
          ) : (
            <div
              className="rounded-xl p-3 border"
              style={{ borderColor: "var(--negative)", background: "rgba(239,68,68,0.06)" }}
            >
              <p className="text-xs text-cl-secondary mb-2.5 text-center">
                Apaga todo o histórico e volta para US$1.000. Confirmar?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmReset(false)}
                  className="flex-1 py-1.5 rounded-lg text-xs font-semibold text-cl-muted border"
                  style={{ borderColor: "var(--border)" }}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    persist({
                      ...INITIAL,
                      history: [{ date: new Date().toISOString(), value: STARTING_BALANCE }],
                    });
                    setLastTrade(null);
                    setConfirmReset(false);
                  }}
                  className="flex-1 py-1.5 rounded-lg text-xs font-bold text-white"
                  style={{ background: "var(--negative)" }}
                >
                  Resetar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── NEGOCIAR ── */}
      {tab === "trade" && (
        <div className="space-y-4">
          {/* Coin picker */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-cl-muted mb-2">
              Moeda
            </p>
            <div className="flex flex-wrap gap-1.5">
              {coins.map((c) => {
                const coinColor = getCoinColor(c.id, coins.indexOf(c));
                const isSelected = selectedCoinId === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCoinId(c.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold border transition-all"
                    style={{
                      background: isSelected ? coinColor + "22" : "var(--surface-2)",
                      borderColor: isSelected ? coinColor : "var(--border)",
                      color: isSelected ? coinColor : "var(--text-secondary)",
                    }}
                  >
                    {c.symbol.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected coin info */}
          {selectedCoin && (
            <div
              className="rounded-2xl p-3.5 border flex items-center justify-between"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: getCoinColor(selectedCoin.id, coins.indexOf(selectedCoin)) }}
                />
                <div>
                  <p className="text-sm font-bold text-cl-primary">{selectedCoin.name}</p>
                  <p className="text-[10px] text-cl-muted">{selectedCoin.symbol.toUpperCase()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-base font-bold tabular-nums text-cl-primary">
                  {usd(selectedCoin.current_price)}
                </p>
                <p
                  className="text-xs font-semibold tabular-nums"
                  style={{
                    color:
                      (selectedCoin.price_change_percentage_24h ?? 0) >= 0
                        ? "var(--positive)"
                        : "var(--negative)",
                  }}
                >
                  {(selectedCoin.price_change_percentage_24h ?? 0) >= 0 ? "+" : ""}
                  {(selectedCoin.price_change_percentage_24h ?? 0).toFixed(2)}% 24h
                </p>
              </div>
            </div>
          )}

          {/* Buy / Sell toggle */}
          <div
            className="flex gap-1 p-1 rounded-xl"
            style={{ background: "var(--surface-2)" }}
          >
            <button
              onClick={() => setMode("buy")}
              className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
              style={{
                background: mode === "buy" ? "var(--positive)" : "transparent",
                color: mode === "buy" ? "#fff" : "var(--text-muted)",
              }}
            >
              Comprar
            </button>
            <button
              onClick={() => setMode("sell")}
              className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
              style={{
                background: mode === "sell" ? "var(--negative)" : "transparent",
                color: mode === "sell" ? "#fff" : "var(--text-muted)",
              }}
            >
              Vender
            </button>
          </div>

          {/* Amount */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-cl-muted">
                Valor (USD)
              </p>
              <p className="text-[10px] text-cl-muted">
                {mode === "buy"
                  ? `Disponível: ${usd(simState.balance)}`
                  : `Em carteira: ${usd(holdingValueForSelected)}`}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => setAmount(String(p))}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold border transition-all"
                  style={{
                    background: amount === String(p) ? "var(--surface)" : "var(--surface-2)",
                    borderColor: amount === String(p) ? "var(--border)" : "var(--border)",
                    color: "var(--text-secondary)",
                  }}
                >
                  US${p}
                </button>
              ))}
              {mode === "buy" && simState.balance > 0 && (
                <button
                  onClick={() =>
                    setAmount(String(Math.floor(simState.balance * 100) / 100))
                  }
                  className="px-3 py-1.5 rounded-xl text-xs font-bold border transition-all"
                  style={{
                    borderColor: "var(--positive)",
                    color: "var(--positive)",
                    background: "transparent",
                  }}
                >
                  Tudo
                </button>
              )}
              {mode === "sell" && holdingValueForSelected > 0 && (
                <button
                  onClick={() =>
                    setAmount(String(Math.floor(holdingValueForSelected * 100) / 100))
                  }
                  className="px-3 py-1.5 rounded-xl text-xs font-bold border transition-all"
                  style={{
                    borderColor: "var(--negative)",
                    color: "var(--negative)",
                    background: "transparent",
                  }}
                >
                  Tudo
                </button>
              )}
            </div>

            <div
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 border"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <span className="text-sm text-cl-muted font-mono">US$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 bg-transparent text-sm font-semibold text-cl-primary focus:outline-none tabular-nums"
                placeholder="0.00"
                min="0"
              />
            </div>

            {selectedCoin && amountNum > 0 && (
              <p className="text-[10px] text-cl-muted mt-1.5 px-1">
                ≈ {fmtQty(amountNum / selectedCoin.current_price, selectedCoin.symbol)} de{" "}
                {selectedCoin.name}
              </p>
            )}
          </div>

          {/* Execute */}
          <button
            onClick={executeTrade}
            disabled={mode === "buy" ? !canBuy : !canSell}
            className="w-full py-3 rounded-2xl text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-40"
            style={{
              background: mode === "buy" ? "var(--positive)" : "var(--negative)",
            }}
          >
            {mode === "buy" ? "Comprar" : "Vender"} {selectedCoin?.symbol.toUpperCase()} ·{" "}
            {usd(amountNum)}
          </button>

          {/* Last trade feedback */}
          {lastTrade && (
            <div
              className="rounded-2xl p-4 border"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    background:
                      lastTrade.type === "buy" ? "var(--positive)" : "var(--negative)",
                  }}
                />
                <p className="text-xs font-bold text-cl-primary">
                  {lastTrade.type === "buy" ? "Compra" : "Venda"} executada
                </p>
              </div>
              <p className="text-xs text-cl-secondary mb-3">
                {fmtQty(lastTrade.quantity, lastTrade.symbol)} · {usd(lastTrade.total)} · Preço:{" "}
                {usd(lastTrade.price)}
              </p>
              <Link
                href={`/chat?q=${encodeURIComponent(
                  `Acabei de ${lastTrade.type === "buy" ? "comprar" : "vender"} ${fmtQty(lastTrade.quantity, lastTrade.symbol)} por ${usd(lastTrade.total)} a ${usd(lastTrade.price)}. Fear & Greed: ${fearGreedValue} (${fearGreedLabel}). Foi uma boa decisão? O que devo considerar ao ${lastTrade.type === "buy" ? "comprar" : "vender"} ${lastTrade.name}?`
                )}`}
                className="flex items-center gap-1.5 text-xs font-semibold"
                style={{ color: "var(--instructor)" }}
              >
                <span>🎓</span> Pedir análise ao Instrutor
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M3 2l4 3-4 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ── HISTÓRICO ── */}
      {tab === "history" && (
        <div className="space-y-2.5">
          {/* Mini sparkline at top of history if enough data */}
          {simState.history.length >= 3 && (
            <div
              className="rounded-2xl p-4 border mb-1"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-cl-muted">
                  Curva do portfólio
                </p>
                <p
                  className="text-xs font-semibold tabular-nums"
                  style={{ color: pnlPositive ? "var(--positive)" : "var(--negative)" }}
                >
                  {pnlPositive ? "+" : ""}
                  {pnlPct.toFixed(2)}% total
                </p>
              </div>
              <Sparkline history={simState.history} startValue={STARTING_BALANCE} />
            </div>
          )}

          {simState.trades.length === 0 ? (
            <div
              className="rounded-2xl p-6 text-center border"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <p className="text-3xl mb-2">📋</p>
              <p className="text-sm font-semibold text-cl-primary mb-1">Nenhuma operação ainda</p>
              <p className="text-xs text-cl-muted">Suas compras e vendas aparecerão aqui</p>
            </div>
          ) : (
            simState.trades.slice(0, 30).map((trade, idx) => {
              const coin = coins.find((c) => c.id === trade.coinId);
              const currentValue = coin ? trade.quantity * coin.current_price : null;
              const tradePnl =
                currentValue !== null && trade.type === "buy"
                  ? currentValue - trade.total
                  : null;
              const coinColor = getCoinColor(trade.coinId, idx);

              return (
                <div
                  key={trade.id}
                  className="rounded-xl border overflow-hidden"
                  style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                >
                  <div
                    className="h-0.5 w-full opacity-60"
                    style={{ background: coinColor }}
                  />
                  <div className="p-3.5">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                          style={{
                            background:
                              trade.type === "buy"
                                ? "rgba(16,185,129,0.15)"
                                : "rgba(239,68,68,0.15)",
                            color: trade.type === "buy" ? "var(--positive)" : "var(--negative)",
                          }}
                        >
                          {trade.type === "buy" ? "COMPRA" : "VENDA"}
                        </span>
                        <span
                          className="text-xs font-bold uppercase"
                          style={{ color: coinColor }}
                        >
                          {trade.symbol}
                        </span>
                      </div>
                      <span className="text-[10px] text-cl-muted">{fmtDate(trade.date)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-cl-muted">
                        {fmtQty(trade.quantity, trade.symbol)} · {usd(trade.price)}/un
                      </p>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-cl-primary tabular-nums">
                          {usd(trade.total)}
                        </p>
                        {tradePnl !== null && (
                          <p
                            className="text-[10px] font-semibold tabular-nums"
                            style={{
                              color: tradePnl >= 0 ? "var(--positive)" : "var(--negative)",
                            }}
                          >
                            {tradePnl >= 0 ? "+" : ""}
                            {usd(tradePnl)} agora
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
