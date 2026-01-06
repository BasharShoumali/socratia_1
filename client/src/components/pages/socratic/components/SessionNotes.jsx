import { useEffect, useState } from "react";
import { apiFetch } from "../../../../lib/api.js";

export default function SessionNotes({
  chatId,
  notes: initialNotes = [],
  readOnly = false,
}) {
  const [noteInput, setNoteInput] = useState("");
  const [notes, setNotes] = useState([]);
  const [saving, setSaving] = useState(false);

  // ✅ عند History mode: حمّل notes الجاهزة
  useEffect(() => {
    if (readOnly) {
      setNotes(initialNotes);
    }
  }, [readOnly, initialNotes]);

  async function handleSaveNote() {
    if (readOnly) return;
    if (!noteInput.trim() || !chatId) return;

    setSaving(true);

    try {
      const res = await apiFetch("/ai/notes", {
        method: "POST",
        body: {
          chatId,
          text: noteInput,
        },
      });

      if (res?.note) {
        setNotes((prev) => [...prev, res.note]);
        setNoteInput("");
      }
    } catch (err) {
      console.error("[NOTES] Failed to save note", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <aside className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_0_35px_rgba(59,130,246,0.08)] backdrop-blur">
      <div className="text-sm font-semibold text-white/90">Session Notes</div>

      {!readOnly && (
        <p className="mt-2 text-sm text-white/70">
          Write down insights or questions you want to revisit.
        </p>
      )}

      {/* ✏️ Input (Learn mode فقط) */}
      {!readOnly && (
        <>
          <textarea
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            className="mt-4 h-32 w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:ring-2 focus:ring-blue-500/40"
            placeholder="Your note…"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); // ❌ لا تنزل سطر
                handleSaveNote(); // ✅ احفظ الملاحظة
              }
              // Shift + Enter → سطر جديد (طبيعي)
            }}
          />

          <button
            onClick={handleSaveNote}
            disabled={saving}
            className="mt-3 w-full rounded-xl bg-blue-500/20 py-2 text-sm font-medium text-blue-300 transition hover:bg-blue-500/30 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save note"}
          </button>
        </>
      )}

      {/* 📌 Notes list (Learn + History) */}
      <div className="mt-4 space-y-2">
        {notes.length === 0 ? (
          <div className="text-xs text-white/50">No notes yet.</div>
        ) : (
          notes.map((note, index) => (
            <div
              key={note._id ?? note.id ?? index}
              className="rounded-2xl bg-white/10 px-4 py-2 text-sm text-white/90"
            >
              {note.text}
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
