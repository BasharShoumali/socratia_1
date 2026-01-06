export default function SessionHeader({ paperName, onBack }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-xs text-white/50">Socratic Session</div>
        <h1 className="mt-1 text-xl font-bold">{paperName}</h1>
      </div>

      <button
        onClick={onBack}
        className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition"
      >
        ← Back to Workspace
      </button>
    </div>
  );
}
