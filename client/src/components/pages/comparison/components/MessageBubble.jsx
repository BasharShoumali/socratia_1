export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`max-w-[90%] rounded-3xl px-4 py-3 text-sm leading-relaxed border
        ${
          isUser
            ? "ml-auto border-blue-400/30 bg-blue-500/10 text-white"
            : "mr-auto border-white/10 bg-black/20 text-white/85"
        }`}
    >
      <div className="mb-1 text-xs text-white/40">
        {isUser ? "You" : "Socrates"}
      </div>
      {message.text}
    </div>
  );
}
