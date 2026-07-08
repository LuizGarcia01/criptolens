export default function Loading() {
  return (
    <div className="px-4 pt-5 pb-10 max-w-lg mx-auto animate-pulse">
      <div className="h-3 w-20 rounded mb-5" style={{ background: "var(--surface-2)" }} />
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl" style={{ background: "var(--surface-2)" }} />
        <div className="flex-1">
          <div className="h-6 w-32 rounded mb-2" style={{ background: "var(--surface-2)" }} />
          <div className="h-4 w-24 rounded" style={{ background: "var(--surface-2)" }} />
        </div>
      </div>
      <div className="rounded-2xl h-48 mb-4" style={{ background: "var(--surface-2)" }} />
      <div className="rounded-2xl h-36 mb-4" style={{ background: "var(--surface-2)" }} />
      <div className="rounded-2xl h-24 mb-4" style={{ background: "var(--surface-2)" }} />
    </div>
  );
}
