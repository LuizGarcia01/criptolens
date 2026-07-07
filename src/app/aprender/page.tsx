import Link from "next/link";
import { LESSONS } from "@/lib/lessons";
import LessonsGrid from "@/components/aprender/LessonsGrid";

export default function AprenderPage() {
  return (
    <div className="px-4 pt-5 pb-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-5">
        <p className="text-xs font-semibold tracking-widest uppercase text-cl-muted mb-0.5">
          Escola
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-cl-primary">Aprender</h1>
        <p className="text-sm text-cl-muted mt-0.5">
          {LESSONS.length + 1} lições · vídeo + visual + Instrutor IA em todas
        </p>
      </div>

      {/* Instructor link */}
      <Link
        href={`/chat?q=${encodeURIComponent("Sou iniciante em cripto. Por onde devo começar? Quais são os conceitos mais importantes para aprender primeiro?")}`}
        className="flex items-center gap-3 rounded-2xl p-4 mb-6 border transition-opacity active:opacity-75"
        style={{ background: "var(--instructor-bg)", borderColor: "var(--instructor-border)" }}
      >
        <div
          className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-lg"
          style={{ background: "var(--instructor)" }}
        >
          🎓
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold" style={{ color: "var(--instructor)" }}>
            Não sabe por onde começar?
          </p>
          <p className="text-xs text-cl-secondary leading-snug">
            Pergunte ao instrutor — ele monta um plano personalizado para você
          </p>
        </div>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0" style={{ color: "var(--instructor)" }}>
          <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>

      {/* Grid com progresso (client component) */}
      <LessonsGrid />
    </div>
  );
}
