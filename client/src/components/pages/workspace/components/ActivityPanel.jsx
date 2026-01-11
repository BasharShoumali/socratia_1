import { forwardRef } from "react";

const ActivityPanel = forwardRef(({ chats, onOpenChat }, ref) => {
  return (
    <aside ref={ref}>
      <div className="mb-3 flex justify-between">
        <h2 className="text-sm font-semibold">Recent activity</h2>
        <span className="text-xs text-blue-200/70">Chats</span>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        {chats.length === 0 ? (
          <div className="text-sm text-white/60">No chats yet.</div>
        ) : (
          <div className="space-y-3">
            {chats.map((chat) => (
              <button
                key={chat.chatId}
                onClick={() => onOpenChat(chat)}
                className="w-full text-left rounded-2xl border border-white/10 bg-black/20 p-4 hover:bg-blue-500/10 transition"
              >
                <div className="font-semibold text-sm text-white">
                  {chat.paperName}
                </div>
                <div className="font-semibold text-sm text-white">
                  {chat.title}
                </div>

                <div className="text-xs text-white/50">
                  {new Date(chat.createdAt).toLocaleString()}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
});

export default ActivityPanel;
