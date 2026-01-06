import { useRef } from "react";
import PaperCard from "./PaperCard";

export default function PapersGrid({
  files,
  selected,
  setSelected,
  onUploadFile,
  onSaveFile,
  onDeleteFile,
}) {
  const fileInputRef = useRef(null);

  const toggleFile = (id) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  };

  return (
    <section>
      {/* Header + Upload */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Your papers</h2>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={onUploadFile}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-2xl border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500/15"
          >
            + Upload
          </button>
        </div>
      </div>

      {files.length === 0 && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
          <div className="text-sm text-white/70">No papers uploaded yet</div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {files.map((file) => (
          <PaperCard
            key={file.id}
            file={file}
            isSelected={selected.includes(file.id)}
            onToggle={() => toggleFile(file.id)}
            onSave={() => onSaveFile(file)}
            onDelete={() => onDeleteFile(file)}
          />
        ))}
      </div>
    </section>
  );
}
