import Link from "next/link";
import LessonChat from "@/components/ui/LessonChat";
import MarkComplete from "@/components/lesson/MarkComplete";
import type { Lesson, VisualBlock } from "@/lib/lessons";

const LEVEL_COLORS: Record<string, string> = {
  Iniciante: "var(--positive)",
  Intermediário: "var(--accent)",
  Avançado: "var(--negative)",
};

function renderBlock(block: VisualBlock, i: number) {
  switch (block.type) {
    case "comparison":
      return (
        <div key={i} className="bg-cl-surface border border-cl-border rounded-2xl p-4">
          <p className="text-sm font-bold text-cl-primary mb-3">{block.title}</p>
          <div className="flex items-stretch gap-2">
            <div className="flex-1 rounded-xl p-3 text-center" style={{ background: block.left.bg }}>
              <p className="text-2xl mb-1">{block.left.icon}</p>
              <p className="text-xs font-semibold" style={{ color: block.left.textColor ?? "var(--text-primary)" }}>{block.left.title}</p>
              <p className="text-[10px] mt-1 leading-relaxed" style={{ color: block.left.textColor ?? "var(--text-muted)" }}>{block.left.desc}</p>
            </div>
            <div className="flex items-center text-cl-muted text-sm px-1">vs</div>
            <div className="flex-1 rounded-xl p-3 text-center" style={{ background: block.right.bg }}>
              <p className="text-2xl mb-1">{block.right.icon}</p>
              <p className="text-xs font-semibold" style={{ color: block.right.textColor ?? "var(--text-primary)" }}>{block.right.title}</p>
              <p className="text-[10px] mt-1 leading-relaxed" style={{ color: block.right.textColor ?? "var(--text-muted)" }}>{block.right.desc}</p>
            </div>
          </div>
          {block.summary && (
            <p className="text-xs text-cl-secondary mt-3 leading-relaxed">{block.summary}</p>
          )}
        </div>
      );

    case "steps":
      return (
        <div key={i} className="bg-cl-surface border border-cl-border rounded-2xl p-4">
          <p className="text-sm font-bold text-cl-primary mb-3">{block.title}</p>
          {block.vertical ? (
            <div className="space-y-2">
              {block.items.map((step, j) => (
                <div key={j} className="flex gap-3 rounded-xl p-2.5" style={{ background: "var(--surface-2)" }}>
                  <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-lg" style={{ background: "var(--surface)" }}>
                    {step.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-cl-primary">{step.label}</p>
                    <p className="text-[10px] text-cl-muted leading-relaxed">{step.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-1">
              {block.items.map((step, j) => (
                <div key={j} className="flex items-center flex-1 gap-1">
                  <div className="flex-1 text-center">
                    <div className="w-10 h-10 rounded-full mx-auto flex items-center justify-center text-xl mb-1" style={{ background: "var(--surface-2)" }}>
                      {step.icon}
                    </div>
                    <p className="text-[10px] font-bold text-cl-primary">{step.label}</p>
                    <p className="text-[9px] text-cl-muted">{step.sub}</p>
                  </div>
                  {j < block.items.length - 1 && <div className="text-cl-muted text-xs flex-shrink-0 pb-5">→</div>}
                </div>
              ))}
            </div>
          )}
          {block.note && (
            <p className="text-[10px] text-cl-muted mt-3 leading-relaxed text-center">{block.note}</p>
          )}
        </div>
      );

    case "facts":
      return (
        <div key={i} className="bg-cl-surface border border-cl-border rounded-2xl p-4">
          <p className="text-sm font-bold text-cl-primary mb-3">{block.title}</p>
          <div className="grid grid-cols-2 gap-2">
            {block.items.map((fact, j) => (
              <div key={j} className="rounded-xl p-3 text-center" style={{ background: "var(--surface-2)" }}>
                <p className="text-lg mb-0.5">{fact.icon}</p>
                <p className="text-sm font-bold text-cl-primary tabular-nums leading-tight">{fact.value}</p>
                <p className="text-[10px] text-cl-muted mt-0.5 leading-snug">{fact.label}</p>
              </div>
            ))}
          </div>
          {block.note && (
            <p className="text-[10px] text-cl-muted mt-3 leading-relaxed">{block.note}</p>
          )}
        </div>
      );

    case "pillars":
      return (
        <div key={i} className="bg-cl-surface border border-cl-border rounded-2xl p-4">
          <p className="text-sm font-bold text-cl-primary mb-3">{block.title}</p>
          <div className="space-y-2">
            {block.items.map((p, j) => (
              <div key={j} className="flex gap-3 rounded-xl p-3" style={{ background: "var(--surface-2)" }}>
                <span className="text-lg flex-shrink-0">{p.icon}</span>
                <div>
                  <p className="text-xs font-bold text-cl-primary">{p.title}</p>
                  <p className="text-[10px] text-cl-muted leading-relaxed mt-0.5">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "table":
      return (
        <div key={i} className="bg-cl-surface border border-cl-border rounded-2xl p-4">
          <p className="text-sm font-bold text-cl-primary mb-3">{block.title}</p>
          <div className="overflow-x-auto rounded-xl" style={{ background: "var(--surface-2)" }}>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-cl-border">
                  {block.headers.map((h, j) => (
                    <th key={j} className="px-3 py-2 text-left font-bold text-cl-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, j) => (
                  <tr key={j} className={`border-b border-cl-border last:border-0 ${row.highlight ? "font-semibold" : ""}`}>
                    {row.cells.map((cell, k) => (
                      <td key={k} className="px-3 py-2 text-cl-secondary">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.note && (
            <p className="text-[10px] text-cl-muted mt-3 leading-relaxed">{block.note}</p>
          )}
        </div>
      );

    case "scale":
      return (
        <div key={i} className="bg-cl-surface border border-cl-border rounded-2xl p-4">
          <p className="text-sm font-bold text-cl-primary mb-3">{block.title}</p>
          <div className="space-y-2">
            {block.items.map((item, j) => (
              <div key={j} className="flex gap-3 rounded-xl p-3" style={{ background: "var(--surface-2)" }}>
                <div className="flex-shrink-0 text-center w-16">
                  <div className="w-full h-1.5 rounded-full mb-1" style={{ background: item.color }} />
                  <p className="text-[9px] font-bold" style={{ color: item.color }}>{item.range}</p>
                  <p className="text-[9px] font-semibold text-cl-primary leading-tight">{item.label}</p>
                </div>
                <p className="text-[10px] text-cl-muted leading-relaxed flex-1">{item.desc}</p>
              </div>
            ))}
          </div>
          {block.note && (
            <p className="text-[10px] text-cl-muted mt-3 leading-relaxed italic">{block.note}</p>
          )}
        </div>
      );

    case "explanation":
      return (
        <div key={i} className="bg-cl-surface border border-cl-border rounded-2xl p-4">
          <p className="text-sm font-bold text-cl-primary mb-2">{block.title}</p>
          <p className="text-xs text-cl-secondary leading-relaxed mb-3">{block.text}</p>
          {block.items && (
            <div className="space-y-2">
              {block.items.map((item, j) => (
                <div key={j} className="flex gap-2 rounded-xl p-2.5" style={{ background: "var(--surface-2)" }}>
                  <span className="text-base flex-shrink-0">{item.icon}</span>
                  <p className="text-[10px] text-cl-muted leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
}

export default function LessonTemplate({ lesson }: { lesson: Lesson }) {
  const levelColor = LEVEL_COLORS[lesson.level] ?? "var(--text-muted)";

  return (
    <div className="px-4 pt-5 pb-10 max-w-lg mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-5 text-xs text-cl-muted">
        <Link href="/aprender" className="hover:text-cl-primary transition-colors">
          ← Aprender
        </Link>
        <span>/</span>
        <span className="text-cl-secondary font-medium">{lesson.category}</span>
      </div>

      {/* Título */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: "var(--surface-2)" }}
        >
          {lesson.icon}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded"
              style={{ background: levelColor, color: "#fff" }}
            >
              {lesson.level}
            </span>
            <span className="text-[10px] text-cl-muted">⏱ {lesson.duration}</span>
          </div>
          <h1 className="text-xl font-bold text-cl-primary leading-tight">{lesson.title}</h1>
        </div>
      </div>

      {/* Vídeo */}
      <div className="mb-6">
        <p className="text-xs font-bold tracking-wider uppercase text-cl-muted mb-3">
          🎬 Assista primeiro
        </p>
        <div className="rounded-2xl overflow-hidden border border-cl-border" style={{ background: "var(--surface)" }}>
          <div className="relative" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${lesson.videoId}?rel=0&modestbranding=1`}
              title={lesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="px-4 py-2.5 flex items-center gap-1.5 border-t border-cl-border">
            <svg width="12" height="12" viewBox="0 0 12 12">
              <circle cx="6" cy="6" r="6" fill="#FF0000" />
              <polygon points="4.5,3.5 9,6 4.5,8.5" fill="white" />
            </svg>
            <p className="text-xs text-cl-muted">YouTube · assista antes de continuar</p>
          </div>
        </div>
      </div>

      {/* Blocos visuais */}
      <div className="mb-6">
        <p className="text-xs font-bold tracking-wider uppercase text-cl-muted mb-3">
          📖 Resumo visual
        </p>
        <div className="space-y-4">
          {lesson.visualBlocks.map((block, i) => renderBlock(block, i))}
        </div>
      </div>

      {/* Takeaways */}
      <div
        className="rounded-2xl p-4 mb-6 border"
        style={{ background: "var(--accent-glow)", borderColor: "var(--accent)" }}
      >
        <p
          className="text-xs font-bold tracking-wider uppercase mb-3"
          style={{ color: "var(--accent)" }}
        >
          ✅ O que você aprendeu
        </p>
        <ul className="space-y-2">
          {lesson.takeaways.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-cl-secondary">
              <span className="flex-shrink-0 mt-0.5 font-bold" style={{ color: "var(--positive)" }}>✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Mini-chat */}
      <p className="text-xs font-bold tracking-wider uppercase text-cl-muted mb-3">
        🎓 Ficou com dúvida?
      </p>
      <LessonChat
        lessonTitle={lesson.title}
        lessonContext={lesson.lessonContext}
        starters={lesson.chatStarters}
        maxExchanges={3}
      />

      {/* Marcar como concluída */}
      <div className="mt-6">
        <MarkComplete slug={lesson.slug} />
      </div>
    </div>
  );
}
