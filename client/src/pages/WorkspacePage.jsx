import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function WorkspacePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const activityRef = useRef(null);

  // Mock starter papers (later: replace with API data)
  const starterFiles = useMemo(
    () => [
      { id: "seed-1", name: "Deep_Learning_Paper.pdf", meta: "PDF • 12 pages" },
      { id: "seed-2", name: "Transformer_Architecture.pdf", meta: "PDF • 23 pages" },
      { id: "seed-3", name: "AI_in_Healthcare.pdf", meta: "PDF • 9 pages" },
      { id: "seed-4", name: "Survey_on_RAG.pdf", meta: "PDF • 31 pages" },
      { id: "seed-5", name: "Neural_Networks_Notes.pdf", meta: "PDF • 18 pages" },
    ],
    []
  );

  // Files state (backend-ready: later set from DB)
  const [files, setFiles] = useState(starterFiles);

  // Selection state
  const [selected, setSelected] = useState([]); // holds file ids (max 2)

  // Simple local history (backend-ready: later fetch/store in DB)
  const [history, setHistory] = useState([]);

  const selectedCount = selected.length;

  const toggleFile = (id) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return prev; // max 2 selected
      return [...prev, id];
    });
  };

  const selectedFiles = useMemo(() => {
    const map = new Map(files.map((f) => [f.id, f]));
    return selected.map((id) => map.get(id)).filter(Boolean);
  }, [selected, files]);

  // Upload button -> open native picker
  const onUploadClick = () => {
    fileInputRef.current?.click();
  };

  // After selecting files -> add to list (frontend-only for now)
  const onFilesPicked = (e) => {
    const picked = Array.from(e.target.files || []);
    if (picked.length === 0) return;

    const now = Date.now();
    const newItems = picked.map((file, idx) => ({
      id: `local-${now}-${idx}`,
      name: file.name,
      meta: `${(file.type || "File").toUpperCase()} • ${(file.size / 1024 / 1024).toFixed(2)} MB`,
      _localFile: file, // keep for later upload API
    }));

    setFiles((prev) => [...newItems, ...prev]);

    // Reset input so selecting same file again works
    e.target.value = "";
  };

  // Learn -> navigate to session
  const onLearn = () => {
    if (selectedCount !== 1) return;

    const f = selectedFiles[0];
    setHistory((prev) => [
      {
        id: `h-${Date.now()}`,
        type: "learn",
        title: f?.name || "Learning session",
        time: "Just now",
      },
      ...prev,
    ]);

    // Pass chosen paper info (useful later, still no backend)
    navigate("/session", { state: { paperId: f?.id, paperName: f?.name } });
  };

  // Compare -> navigate to compare page (we will build it later)
  const onCompare = () => {
    if (selectedCount !== 2) return;

    const a = selectedFiles[0];
    const b = selectedFiles[1];

    setHistory((prev) => [
      {
        id: `h-${Date.now()}`,
        type: "compare",
        title: `${a?.name || "Paper A"} vs ${b?.name || "Paper B"}`,
        time: "Just now",
      },
      ...prev,
    ]);

    navigate("/compare", {
      state: {
        paperA: { id: a?.id, name: a?.name },
        paperB: { id: b?.id, name: b?.name },
      },
    });
  };

  const onClear = () => setSelected([]);

  const onViewHistory = () => {
    activityRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(70%_45%_at_50%_0%,rgba(59,130,246,0.26),transparent_60%),radial-gradient(45%_35%_at_90%_20%,rgba(59,130,246,0.16),transparent_60%),radial-gradient(45%_30%_at_15%_55%,rgba(168,85,247,0.12),transparent_65%),linear-gradient(180deg,#05070f,#03040a)] text-white">
      <Navbar variant="app" />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Workspace
            </h1>
            <p className="mt-1 text-sm text-white/70">
              Select <span className="text-white">one</span> paper to learn or{" "}
              <span className="text-white">two</span> papers to compare.
            </p>
          </div>

          {/* Upload (works now) */}
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              multiple
              className="hidden"
              onChange={onFilesPicked}
            />
            <button
              type="button"
              onClick={onUploadClick}
              className="inline-flex items-center justify-center rounded-2xl border border-blue-400/25 bg-blue-500/10 px-5 py-2.5 text-sm font-semibold text-white/95 shadow-[0_0_28px_rgba(59,130,246,0.25)] hover:bg-blue-500/15 hover:shadow-[0_0_34px_rgba(59,130,246,0.32)] transition"
            >
              + Upload papers
            </button>
          </div>
        </div>

        {/* Actions bar */}
        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_0_35px_rgba(59,130,246,0.07)] backdrop-blur sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-white/70">
              Selected:{" "}
              <span className="font-semibold text-blue-200">
                {selectedCount}/2
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onLearn}
                disabled={selectedCount !== 1}
                className={`rounded-2xl px-5 py-2.5 text-sm font-semibold transition ${
                  selectedCount === 1
                    ? "bg-blue-500 text-white shadow-[0_0_30px_rgba(59,130,246,0.35)] hover:bg-blue-400"
                    : "bg-white/10 text-white/40 cursor-not-allowed"
                }`}
              >
                Learn
              </button>

              <button
                type="button"
                onClick={onCompare}
                disabled={selectedCount !== 2}
                className={`rounded-2xl px-5 py-2.5 text-sm font-semibold transition ${
                  selectedCount === 2
                    ? "bg-blue-500/25 text-blue-100 border border-blue-400/25 shadow-[0_0_30px_rgba(59,130,246,0.20)] hover:bg-blue-500/30"
                    : "bg-white/10 text-white/40 cursor-not-allowed"
                }`}
              >
                Compare
              </button>

              <button
                type="button"
                onClick={onClear}
                disabled={selectedCount === 0}
                className={`rounded-2xl px-5 py-2.5 text-sm font-semibold transition ${
                  selectedCount > 0
                    ? "border border-white/15 bg-white/5 text-white/90 hover:bg-white/10"
                    : "border border-white/10 bg-white/5 text-white/40 cursor-not-allowed"
                }`}
              >
                Clear
              </button>

              <button
                type="button"
                onClick={onViewHistory}
                className="rounded-2xl border border-blue-400/20 bg-blue-500/10 px-5 py-2.5 text-sm font-semibold text-blue-100 shadow-[0_0_22px_rgba(59,130,246,0.18)] hover:bg-blue-500/15 transition"
              >
                View all history
              </button>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto_360px] lg:items-start">
          {/* Papers */}
          <section className="lg:col-span-1">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white/90">Your papers</h2>
              <div className="text-xs text-blue-200/70">Select up to 2</div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {files.map((file) => {
                const isOn = selected.includes(file.id);

                return (
                  <button
                    key={file.id}
                    type="button"
                    onClick={() => toggleFile(file.id)}
                    className={`group text-left rounded-3xl border p-5 backdrop-blur transition shadow-[0_0_30px_rgba(59,130,246,0.07)]
                      ${
                        isOn
                          ? "border-blue-400/60 bg-blue-500/10 shadow-[0_0_38px_rgba(59,130,246,0.30)]"
                          : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-400/20"
                      }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {file.name}
                        </div>
                        <div className="mt-1 text-xs text-white/60">{file.meta}</div>
                      </div>

                      <div
                        className={`h-7 w-7 shrink-0 rounded-2xl border transition ${
                          isOn
                            ? "border-blue-400/60 bg-blue-500/20 shadow-[0_0_18px_rgba(59,130,246,0.25)]"
                            : "border-white/10 bg-white/5 group-hover:bg-white/10"
                        }`}
                        title={isOn ? "Selected" : "Select"}
                      />
                    </div>

                    <div className="mt-4 text-xs text-white/50">
                      {isOn ? "Selected" : "Click to select"}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Divider */}
          <div className="relative hidden lg:block h-full">
            <div className="mx-3 h-full w-px bg-gradient-to-b from-transparent via-blue-400/35 to-transparent shadow-[0_0_18px_rgba(59,130,246,0.25)]" />
          </div>

          {/* Activity */}
          <aside className="lg:col-span-1" ref={activityRef}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white/90">Recent activity</h2>
              <div className="text-xs text-blue-200/70">Sessions</div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_0_35px_rgba(59,130,246,0.08)] backdrop-blur">
              {history.length === 0 ? (
                <div className="text-sm text-white/60">
                  No activity yet.
                  <div className="mt-2 text-xs text-white/40">
                    Your last learning and comparison sessions will appear here.
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-left hover:bg-white/10 transition"
                    >
                      <div className="text-sm font-semibold">
                        {h.type === "compare" ? "Compare" : "Learn"}
                      </div>
                      <div className="mt-1 text-xs text-white/60">{h.title}</div>
                      <div className="mt-2 text-xs text-white/40">{h.time}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
