import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function clearAuthStorage() {
  localStorage.removeItem("socratia_token");
  localStorage.removeItem("socratia_user");
}

export default function UserMenu({ user }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const displayName = user?.fullName || user?.email || "User";

  useEffect(() => {
    const handler = (e) => {
      if (!menuRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function logout() {
    clearAuthStorage();
    navigate("/signin", { replace: true });
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 font-semibold text-white hover:bg-white/10 transition"
      >
        <span className="text-base">👤</span>
        <span className="hidden sm:inline text-sm">{displayName}</span>
        <span className="text-xs text-white/60">▼</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0f1a] shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
          {user?.role === "admin" && (
            <button
              onClick={() => {
                setOpen(false);
                navigate("/admin/users");
              }}
              className="w-full px-4 py-3 text-left text-sm text-blue-300 hover:bg-blue-500/10 transition"
            >
              Admin Panel
            </button>
          )}

          <button
            onClick={() => {
              if (window.confirm("Sign out and go to Sign In?")) logout();
            }}
            className="w-full px-4 py-3 text-left text-sm text-white/90 hover:bg-white/10 transition"
          >
            Switch account
          </button>

          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to sign out?"))
                logout();
            }}
            className="w-full px-4 py-3 text-left text-sm text-red-300 hover:bg-red-500/10 transition"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
