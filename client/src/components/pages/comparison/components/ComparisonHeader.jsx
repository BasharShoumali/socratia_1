export default function ComparisonHeader({ paperA, paperB, onBack }) {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-lg font-semibold text-white">
          {paperA} <span className="text-white/40">vs</span> {paperB}
        </h1>
        <p className="text-xs text-white/60">Socratic comparison session</p>
      </div>

      <button
        onClick={onBack}
        className="rounded-xl bg-white/10 px-4 py-2 text-sm"
      >
        Back
      </button>
    </header>
  );
}
