"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getMissionForDay, getNextMission, type Mission } from "@/lib/missions";

const STORAGE_KEY = "criptolens_missao_v1";

interface StoredState {
  date: string;
  completed: boolean;
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

const CATEGORY_COLORS: Record<string, string> = {
  Mercado: "#00AAE4",
  Análise: "#9945FF",
  Aprender: "#F7931A",
  Simulador: "#10B981",
};

export default function MissaoDoDia({
  fearGreedValue,
  fearGreedLabel,
}: {
  fearGreedValue: number;
  fearGreedLabel: string;
}) {
  const [completed, setCompleted] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Compute once — deterministic from date + F&G
  const now = new Date();
  const mission: Mission = getMissionForDay(now, fearGreedValue, fearGreedLabel);
  const next: Mission = getNextMission(now, fearGreedValue, fearGreedLabel);
  const catColor = CATEGORY_COLORS[mission.category] ?? "var(--accent)";

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved: StoredState = JSON.parse(raw);
        if (saved.date === todayStr()) setCompleted(saved.completed);
      }
    } catch {}
    setLoaded(true);
  }, []);

  const markDone = () => {
    setCompleted(true);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ date: todayStr(), completed: true })
      );
    } catch {}
  };

  // Don't flash before localStorage loads
  if (!loaded) return <div className="h-[1px] mb-5" />;

  /* ── COMPLETED STATE ── */
  if (completed) {
    return (
      <div
        className="rounded-2xl p-4 mb-5 border"
        style={{ background: "rgba(16,185,129,0.07)", borderColor: "var(--positive)" }}
      >
        <div className="flex items-center gap-2.5 mb-2">
          <span className="text-xl">✅</span>
          <p className="text-sm font-bold text-cl-primary">Missão de hoje concluída!</p>
        </div>
        <p className="text-xs text-cl-muted mb-3 leading-relaxed">
          Ótimo trabalho. Volte amanhã para continuar aprendendo.
        </p>
        <div
          className="flex items-center gap-2 rounded-xl p-2.5"
          style={{ background: "var(--surface-2)" }}
        >
          <span className="text-base">{next.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-cl-muted">Amanhã</p>
            <p className="text-xs font-semibold text-cl-secondary truncate">{next.title}</p>
          </div>
          <span className="text-[10px] text-cl-muted">{next.duration}</span>
        </div>
      </div>
    );
  }

  /* ── ACTIVE MISSION ── */
  return (
    <div
      className="rounded-2xl border overflow-hidden mb-5"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      {/* Gradient accent top bar */}
      <div
        className="h-[3px] w-full"
        style={{
          background: `linear-gradient(to right, ${catColor}, var(--instructor))`,
        }}
      />

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: catColor + "22", color: catColor }}
            >
              ⚡ Missão do dia
            </span>
          </div>
          <span className="text-[10px] text-cl-muted">
            {mission.category} · {mission.duration}
          </span>
        </div>

        {/* Mission title + description */}
        <div className="flex items-start gap-3 mb-4">
          <span className="text-3xl flex-shrink-0 leading-none mt-0.5">{mission.emoji}</span>
          <div>
            <p className="text-base font-bold text-cl-primary leading-tight mb-1">
              {mission.title}
            </p>
            <p className="text-xs text-cl-secondary leading-relaxed">
              {mission.description}
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-2 mb-4">
          {mission.steps.map((step, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span
                className="text-[10px] font-bold flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5"
                style={{ border: `1.5px solid ${catColor}`, color: catColor }}
              >
                {i + 1}
              </span>
              <p className="text-xs text-cl-secondary leading-snug">{step}</p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex gap-2">
          <Link
            href={mission.cta.href}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-center transition-opacity active:opacity-75"
            style={{ background: catColor, color: "#fff" }}
          >
            {mission.cta.label} →
          </Link>
          <Link
            href={`/chat?q=${encodeURIComponent(mission.instructorQ)}`}
            className="px-3 py-2.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-opacity active:opacity-70"
            style={{
              borderColor: "var(--instructor-border)",
              color: "var(--instructor)",
              background: "var(--instructor-bg)",
            }}
          >
            🎓
          </Link>
          <button
            onClick={markDone}
            className="px-3 py-2.5 rounded-xl text-xs font-semibold border transition-opacity active:opacity-70"
            style={{
              borderColor: "var(--positive)",
              color: "var(--positive)",
              background: "transparent",
            }}
            title="Marcar como concluída"
          >
            ✓
          </button>
        </div>
      </div>
    </div>
  );
}
