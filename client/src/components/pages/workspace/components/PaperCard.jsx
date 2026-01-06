export default function PaperCard({
  file,
  isSelected,
  onToggle,
  onSave,
  onDelete,
}) {
  const isLocal = !!file._localFile;

  return (
    <div
      className={`relative rounded-3xl border p-5 backdrop-blur transition
        ${
          isSelected
            ? "border-blue-400/60 bg-blue-500/10"
            : "border-white/10 bg-white/5"
        }`}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-bold text-white">
          Selected
        </div>
      )}

      <button onClick={onToggle} className="w-full text-left">
        <div className="text-sm font-semibold text-white">{file.name}</div>
        <div className="mt-1 text-xs text-white/60">{file.meta}</div>
      </button>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        {isLocal && (
          <button
            type="button"
            onClick={onSave}
            className="pointer-events-auto rounded-xl bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30 transition"
          >
            Save
          </button>
        )}

        <button
          onClick={onDelete}
          className="flex-1 rounded-xl border border-red-400/40 bg-red-500/10 px-3 py-1.5 text-xs text-red-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
