export default function MessageInput({ input, setInput, onSend }) {
  return (
    <div className="border-t border-white/10 px-5 py-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim()) return;
          onSend(input);
        }}
        className="flex gap-3"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What do you think the author is trying to prove?"
          rows={2}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (!input.trim()) return;
              onSend(input);
            }
          }}
          className="flex-1 resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        />

        <button
          type="submit"
          className="rounded-2xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(59,130,246,0.35)] hover:bg-blue-400 transition"
        >
          Respond
        </button>
      </form>
    </div>
  );
}
