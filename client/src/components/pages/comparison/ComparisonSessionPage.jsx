import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiFetch } from "../../../lib/api";

import ComparisonHeader from "./components/ComparisonHeader";
import ComparisonDialogue from "./components/ComparisonDialogue";
import SessionNotes from "../socratic/components/SessionNotes";
import useComparisonSession from "../../../hooks/useComparisonSession";

export default function ComparisonSessionPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const mode = location.state?.mode; // "view" | undefined
  const chatId = location.state?.chatId;
  const fileIds = location.state?.fileIds;
  const paperNames = location.state?.paperNames || ["Paper A", "Paper B"];
  const sessionKey = location.state?.sessionKey;

  const session = useComparisonSession({
    fileIds,
    sessionKey,
    enabled: mode !== "view",
  });

  const { setMessages } = session;
  const [notes, setNotes] = useState([]);

  // 🔐 Auth guard
  useEffect(() => {
    const token = localStorage.getItem("socratia_token");
    if (!token) window.location.href = "/signin";
  }, []);

  // 🛑 Protection
  useEffect(() => {
    if (mode !== "view") {
      if (!Array.isArray(fileIds) || fileIds.length !== 2) {
        navigate("/workspace");
      }
    }
  }, [fileIds, mode, navigate]);

  // 📥 Load old comparison chat
  useEffect(() => {
    if (mode === "view" && chatId) {
      apiFetch(`/ai/chats/${chatId}`).then((res) => {
        setMessages(res.chat?.messages || []);
        setNotes(res.chat?.notes || []);
      });
    }
  }, [mode, chatId]);

  return (
    <div className="min-h-screen bg-[radial-gradient(70%_45%_at_50%_0%,rgba(59,130,246,0.22),transparent_60%),radial-gradient(45%_30%_at_15%_60%,rgba(168,85,247,0.12),transparent_65%),linear-gradient(180deg,#05070f,#03040a)] text-white">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <ComparisonHeader
          paperA={paperNames[0]}
          paperB={paperNames[1]}
          onBack={() => navigate("/workspace")}
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <ComparisonDialogue
            messages={session.messages}
            thinking={session.thinking}
            input={session.input}
            setInput={session.setInput}
            onSend={session.sendMessage} // ✅ THIS IS THE FIX
            bottomRef={session.bottomRef}
          />

          <SessionNotes
            chatId={session.chatId}
            notes={notes}
            readOnly={mode === "view"}
          />
        </div>
      </main>
    </div>
  );
}
