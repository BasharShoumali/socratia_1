export default function ActionsBar({
  selected,
  setSelected,
  selectedFiles,
  navigate,
  onViewHistory,
}) {
  const selectedCount = selected.length;

  const onLearn = () => {
    if (selectedCount !== 1) return;

    const f = selectedFiles[0];

    console.log("[LEARN] Open session for file:", f.id);
    const sessionKey = crypto.randomUUID(); 

    console.log("[LEARN] Open NEW session for file:", f.id, sessionKey);
    navigate("/socratic-session", {
      state: {
        fileId: f.id,
        paperName: f.name,
        mode: "new",
        sessionKey,
      },
    });
  };

  const onCompare = () => {
    if (selectedCount !== 2) return;

    const [a, b] = selectedFiles;
    const sessionKey = crypto.randomUUID();

    console.log(
      "[COMPARE] Open NEW comparison session",
      a.id,
      b.id,
      sessionKey
    );

    navigate("/comparison", {
      state: {
        fileIds: [a.id, b.id],
        paperNames: [a.name, b.name],
        mode: "new",
        sessionKey,
      },
    });
  };

  return (
    <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <div className="text-sm text-white/70">
          Selected:{" "}
          <span className="font-semibold text-blue-200">{selectedCount}/2</span>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={onLearn}
            disabled={selectedCount !== 1}
            className={`rounded-2xl px-5 py-2.5 text-sm font-semibold ${
              selectedCount === 1
                ? "bg-blue-500 text-white"
                : "bg-white/10 text-white/40 cursor-not-allowed"
            }`}
          >
            Learn
          </button>

          <button
            onClick={onCompare}
            disabled={selectedCount !== 2}
            className={`rounded-2xl px-5 py-2.5 text-sm font-semibold ${
              selectedCount === 2
                ? "bg-blue-500/25 text-blue-100"
                : "bg-white/10 text-white/40 cursor-not-allowed"
            }`}
          >
            Compare
          </button>

          <button
            onClick={() => setSelected([])}
            disabled={!selectedCount}
            className="rounded-2xl px-5 py-2.5 text-sm border border-white/15 bg-white/5"
          >
            Clear
          </button>

          <button
            onClick={onViewHistory}
            className="rounded-2xl px-5 py-2.5 text-sm bg-blue-500/10 border border-blue-400/20"
          >
            View all history
          </button>
        </div>
      </div>
    </div>
  );
}
