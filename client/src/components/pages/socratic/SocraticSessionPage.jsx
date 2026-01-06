import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiFetch } from "../../../lib/api.js";

import SessionHeader from "./components/SessionHeader";
import DialoguePanel from "./components/DialoguePanel";
import SessionNotes from "./components/SessionNotes";
import useSocraticSession from "../../../hooks/useSocraticSession";

export default function SocraticSessionPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const mode = location.state?.mode; // "view" | undefined
  const chatId = location.state?.chatId;
  const fileId = location.state?.fileId;
  const paperName = location.state?.paperName || "Selected Paper";
  const sessionKey = location.state?.sessionKey;

  const session = useSocraticSession({
    fileId,
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

  useEffect(() => {
    if (!fileId) navigate("/workspace");
  }, [fileId, navigate]);

  useEffect(() => {
    if (mode === "view" && chatId) {
      apiFetch(`/ai/chats/${chatId}`).then((res) => {
        console.log("[HISTORY CHAT RAW]", res);
        setMessages(res.chat?.messages || []);
        setNotes(res.chat?.notes || []);
      });
    }
  }, [mode, chatId]); 

  return (
    <div className="min-h-screen bg-[radial-gradient(70%_45%_at_50%_0%,rgba(59,130,246,0.25),transparent_60%),radial-gradient(45%_30%_at_15%_60%,rgba(168,85,247,0.12),transparent_65%),linear-gradient(180deg,#05070f,#03040a)] text-white">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <SessionHeader
          paperName={paperName}
          onBack={() => navigate("/workspace")}
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <DialoguePanel {...session} />
          <SessionNotes
            fileId={fileId}
            chatId={session.chatId}
            notes={notes}
            readOnly={mode === "view"}
          />
        </div>
      </main>
    </div>
  );
}
