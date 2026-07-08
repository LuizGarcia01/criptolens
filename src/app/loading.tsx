export default function Loading() {
  return (
    <div className="px-4 pt-5 max-w-lg mx-auto animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="h-3 w-16 rounded mb-1.5" style={{ background: "var(--surface-2)" }} />
          <div className="h-7 w-32 rounded" style={{ background: "var(--surface-2)" }} />
        </div>
        <div className="h-8 w-8 rounded-full" style={{ background: "var(--surface-2)" }} />
      </div>

      {/* Instructor card */}
      <div className="rounded-2xl p-4 mb-5 h-24" style={{ background: "var(--surface-2)" }} />

      {/* Mission */}
      <div className="rounded-2xl p-4 mb-5 h-32" style={{ background: "var(--surface-2)" }} />

      {/* Fear & Greed */}
      <div className="rounded-2xl p-4 mb-5 h-28" style={{ background: "var(--surface-2)" }} />

      {/* Coins */}
      <div className="mb-5">
        <div className="h-3 w-24 rounded mb-3" style={{ background: "var(--surface-2)" }} />
        <div className="rounded-2xl overflow-hidden border border-cl-border">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-cl-border last:border-0">
              <div className="w-9 h-9 rounded-full flex-shrink-0" style={{ background: "var(--surface-2)" }} />
              <div className="flex-1">
                <div className="h-3.5 w-16 rounded mb-1.5" style={{ background: "var(--surface-2)" }} />
                <div className="h-3 w-24 rounded" style={{ background: "var(--surface-2)" }} />
              </div>
              <div className="text-right">
                <div className="h-3.5 w-20 rounded mb-1.5 ml-auto" style={{ background: "var(--surface-2)" }} />
                <div className="h-3 w-12 rounded ml-auto" style={{ background: "var(--surface-2)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* News */}
      <div className="space-y-2.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl p-3 h-16" style={{ background: "var(--surface-2)" }} />
        ))}
      </div>
    </div>
  );
}
