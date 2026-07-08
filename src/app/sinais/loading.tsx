export default function Loading() {
  return (
    <div className="px-4 pt-5 pb-6 max-w-lg mx-auto animate-pulse">
      <div className="h-3 w-16 rounded mb-1.5" style={{ background: "var(--surface-2)" }} />
      <div className="h-7 w-24 rounded mb-5" style={{ background: "var(--surface-2)" }} />
      <div className="rounded-2xl h-16 mb-5" style={{ background: "var(--surface-2)" }} />
      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl h-48" style={{ background: "var(--surface-2)" }} />
        ))}
      </div>
    </div>
  );
}
