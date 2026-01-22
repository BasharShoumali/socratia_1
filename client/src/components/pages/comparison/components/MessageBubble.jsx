
function formatMessage(text) {
  if (!text) return "";

  let cleaned = text;

  // 1. Remove separator lines (----- | ----)
  cleaned = cleaned.replace(/^\s*\|?[\s\-:|]+\|?\s*$/gm, "");

  // 2. Convert table rows into readable lines
  cleaned = cleaned.replace(/\|([^|\n]+)\|([^|\n]+)\|([^|\n]+)\|([^|\n]+)\|/g, 
    (_, col1, col2, col3, col4) => {
      return `
• ${col1.trim()}
  - File A: ${col2.trim()}
  - File B: ${col3.trim()}
  - Difference: ${col4.trim()}
`;
    }
  );

  // 3. Normalize section headers
  cleaned = cleaned
    .replace(/(Differences)/gi, "\n\n## Differences\n")
    .replace(/(Similarities)/gi, "\n\n## Similarities\n")
    .replace(/(Summary)/gi, "\n\n## Summary\n");

  // 4. Remove excessive empty lines
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

  return cleaned.trim();
}

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`max-w-[90%] rounded-3xl px-4 py-3 text-base leading-relaxed border whitespace-pre-wrap break-words`}
      style={{
        marginLeft: isUser ? "auto" : "0",
        backgroundColor: isUser ? "var(--user-msg-bg)" : "var(--bg-main)",
        borderColor: isUser ? "var(--user-msg-border)" : "var(--border-main)",
        color: "var(--text-main)",
      }}
    >
      <div className="mb-1 text-xs" style={{ color: "var(--text-muted)" }}>
  {isUser ? "You" : "Socrates"}
</div>
      <div className="overflow-x-auto">
       {formatMessage(message.text)}
    </div>
    </div>
  );
}
