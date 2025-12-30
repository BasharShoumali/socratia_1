import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";

export default function SocraticSessionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const bottomRef = useRef(null);

  // Paper info passed from Workspace
  const paperName =
    location.state?.paperName || "Selected Paper";

  const [messages, setMessages] = useState([
    {
      id: "s1",
      role: "assistant",
      text:
        "Let’s begin thoughtfully. Based on the title alone, what do you think this paper is trying to explore?",
    },
  ]);

  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const sendMessage = (text) => {
    if (!text.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", text },
    ]);

    setInput("");
    setThinking(true);

    // Placeholder for AI logic later
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          text:
            "Good. Now think carefully — which part of the paper supports that idea most clearly?",
        },
      ]);
      setThinking(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(70%_45%_at_50%_0%,rgba(59,130,246,0.25),transparent_60%),radial-gradient(45%_30%_at_15%_60%,rgba(168,85,247,0.12),transparent_65%),linear-gradient(180deg,#05070f,#03040a)] text-white">
      <Navbar variant="app" />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs text-white/50">Socratic Session</div>
            <h1 className="mt-1 text-xl font-bold">{paperName}</h1>
          </div>

          <button
            onClick={() => navigate("/workspace")}
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition"
          >
            ← Back to Workspace
          </button>
        </div>

        {/* Main layout */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Conversation */}
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
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[90%] rounded-3xl px-4 py-3 text-sm leading-relaxed border
                    ${
                      m.role === "user"
                        ? "ml-auto border-blue-400/30 bg-blue-500/10 text-white"
                        : "mr-auto border-white/10 bg-black/20 text-white/85"
                    }`}
                >
                  <div className="mb-1 text-xs text-white/40">
                    {m.role === "user" ? "You" : "Socrates"}
                  </div>
                  {m.text}
                </div>
              ))}

              {thinking && (
                <div className="mr-auto max-w-[90%] rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/60">
                  Socrates is thinking…
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-white/10 px-5 py-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="flex gap-3"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="What do you think the author is trying to prove?"
                  className="flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
                <button
                  type="submit"
                  className="rounded-2xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(59,130,246,0.35)] hover:bg-blue-400 transition"
                >
                  Respond
                </button>
              </form>

              {/* Socratic suggestions */}
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  "What problem is the author trying to solve?",
                  "What assumption does this section rely on?",
                  "Which result seems most important?",
                  "What would happen if this assumption was false?",
                ].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => sendMessage(q)}
                    className="rounded-xl border border-blue-400/20 bg-blue-500/10 px-3 py-2 text-xs font-semibold text-blue-100 hover:bg-blue-500/15 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Side notes */}
          <aside className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_0_35px_rgba(59,130,246,0.08)] backdrop-blur">
            <div className="text-sm font-semibold text-white/90">
              Session Notes
            </div>
            <p className="mt-2 text-sm text-white/70">
              Write down insights or questions you want to revisit.
            </p>

            <textarea
              className="mt-4 h-40 w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:ring-2 focus:ring-blue-500/40"
              placeholder="Your notes…"
            />
          </aside>
        </div>
      </main>
    </div>
  );
}
