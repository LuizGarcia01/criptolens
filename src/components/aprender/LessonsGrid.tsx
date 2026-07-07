"use client";

import Link from "next/link";
import { LESSONS } from "@/lib/lessons";
import { useProgress } from "@/hooks/useProgress";

const LEVEL_COLORS: Record<string, { bg: string; text: string }> = {
  Iniciante: { bg: "var(--positive)", text: "#fff" },
  Intermediário: { bg: "var(--accent)", text: "#111" },
  Avançado: { bg: "var(--negative)", text: "#fff" },
};

// Bitcoin kept first — has its own dedicated page
const BITCOIN = {
  slug: "bitcoin",
  icon: "₿",
  title: "O que é Bitcoin?",
  category: "Fundamentos",
  level: "Iniciante" as const,
  duration: "5 min",
  subtitle: "Como surgiu, por que importa e como funciona o pioneiro das criptos",
};

function hrefFor(slug: string) {
  return slug === "bitcoin" ? "/aprender/bitcoin" : `/aprender/${slug}`;
}

const ALL_LESSONS = [
  BITCOIN,
  ...LESSONS.map((l) => ({
    slug: l.slug,
    icon: l.icon,
    title: l.title,
    category: l.category,
    level: l.level,
    duration: l.duration,
    subtitle: l.visualBlocks[0]?.title?.replace(/^[^\w]*/u, "") ?? "",
  })),
];

const TOTAL = ALL_LESSONS.length;

const CATEGORIES = Array.from(
  new Set(ALL_LESSONS.map((l) => l.category))
);

export default function LessonsGrid() {
  const { isComplete, loaded } = useProgress();

  const completedCount = loaded
    ? ALL_LESSONS.filter((l) => isComplete(l.slug)).length
    : 0;
  const pct = TOTAL > 0 ? (completedCount / TOTAL) * 100 : 0;

  return (
    <div>
      {/* Progress bar */}
      <div
        className="rounded-2xl p-4 mb-6 border"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold uppercase tracking-wider text-cl-muted">
            Seu progresso
          </p>
          <p className="text-xs font-semibold tabular-nums" style={{ color: "var(--accent)" }}>
            {loaded ? completedCount : "—"} de {TOTAL} lições
          </p>
        </div>
        <div
          className="h-2 w-full rounded-full overflow-hidden"
          style={{ background: "var(--surface-2)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${loaded ? pct : 0}%`, background: "var(--accent)" }}
          />
        </div>
        {loaded && completedCount === TOTAL && (
          <p
            className="text-xs font-semibold text-center mt-2"
            style={{ color: "var(--positive)" }}
          >
            🎉 Todas as lições concluídas!
          </p>
        )}
      </div>

      {/* Category sections */}
      {CATEGORIES.map((category) => {
        const items = ALL_LESSONS.filter((l) => l.category === category);
        return (
          <div key={category} className="mb-6">
            <p className="text-xs font-bold tracking-wider uppercase text-cl-muted mb-3">
              {category}
            </p>
            <div className="space-y-2.5">
              {items.map((lesson) => {
                const levelStyle = LEVEL_COLORS[lesson.level];
                const done = loaded && isComplete(lesson.slug);
                return (
                  <Link
                    key={lesson.slug}
                    href={hrefFor(lesson.slug)}
                    className="flex items-center gap-3 bg-cl-surface border border-cl-border rounded-xl p-3.5 transition-all active:scale-[0.98] active:opacity-80"
                    style={done ? { borderColor: "var(--positive)", opacity: 0.85 } : undefined}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-lg font-bold relative"
                      style={{ background: "var(--surface-2)" }}
                    >
                      {lesson.icon}
                      {done && (
                        <span className="absolute -top-1 -right-1 text-[10px]">✅</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-cl-primary leading-tight">
                        {lesson.title}
                      </p>
                      <p className="text-xs text-cl-muted leading-snug mt-0.5 line-clamp-1">
                        {lesson.subtitle}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                          style={{ background: levelStyle.bg, color: levelStyle.text }}
                        >
                          {lesson.level}
                        </span>
                        <span className="text-[10px] text-cl-muted">⏱ {lesson.duration}</span>
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                          style={{
                            background: "var(--instructor-bg)",
                            color: "var(--instructor)",
                            border: "1px solid var(--instructor-border)",
                          }}
                        >
                          🎬 Vídeo + Visual
                        </span>
                      </div>
                    </div>
                    <div
                      className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
                      style={{
                        background: done ? "rgba(16,185,129,0.15)" : "var(--instructor-bg)",
                        border: `1px solid ${done ? "var(--positive)" : "var(--instructor-border)"}`,
                      }}
                    >
                      {done ? (
                        <span className="text-xs" style={{ color: "var(--positive)" }}>✓</span>
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path
                            d="M4.5 2.5L8 6l-3.5 3.5"
                            stroke="var(--instructor)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
