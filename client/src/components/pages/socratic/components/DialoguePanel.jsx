import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

export default function DialoguePanel({
  messages,
  input,
  setInput,
  thinking,
  sendMessage,
  bottomRef,
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 shadow-[0_0_35px_rgba(59,130,246,0.08)] backdrop-blur">
      <div className="border-b border-white/10 px-5 py-4">
        <div className="text-sm font-semibold text-white/90">
          Socratic Dialogue
        </div>
        <div className="text-xs text-white/60">
          Answer thoughtfully — the goal is understanding, not speed.
        </div>
      </div>

      <div className="h-[55vh] overflow-y-auto px-5 py-4 space-y-4">
        {messages.map((m, i) => (
          <MessageBubble key={m.id ?? i} {...m} />
        ))}

        {thinking && (
          <div className="mr-auto max-w-[90%] rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/60">
            Socrates is thinking…
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <MessageInput input={input} setInput={setInput} onSend={sendMessage} />
    </section>
  );
}
