"use client";

import { useProgress } from "@/hooks/useProgress";

export default function MarkComplete({ slug }: { slug: string }) {
  const { isComplete, markComplete, loaded } = useProgress();

  if (!loaded) return <div className="h-12" />;

  if (isComplete(slug)) {
    return (
      <div
        className="w-full rounded-2xl p-4 flex items-center justify-center gap-2.5 border"
        style={{ background: "rgba(16,185,129,0.08)", borderColor: "var(--positive)" }}
      >
        <span className="text-lg">✅</span>
        <p className="text-sm font-semibold" style={{ color: "var(--positive)" }}>
          Lição concluída!
        </p>
      </div>
    );
  }

  return (
    <button
      onClick={() => markComplete(slug)}
      className="w-full py-3 rounded-2xl text-sm font-bold text-white transition-all active:scale-[0.98] active:opacity-90"
      style={{ background: "var(--positive)" }}
    >
      ✓ Marcar como concluída
    </button>
  );
}
