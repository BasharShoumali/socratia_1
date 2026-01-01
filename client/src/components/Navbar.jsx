import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

/**
 * Navbar variants:
 * - "home":  Sign In button + "Don’t have an account? Sign up"
 * - "signin": Home button + "Don’t have an account? Sign up"
 * - "signup": Home button + "Already have an account? Sign in"
 * - "app":   Home button + centered welcome + user menu (switch/sign out)
 */
export default function Navbar({ variant = "home" }) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("socratia_token");
    localStorage.removeItem("socratia_user");
    window.location.href = "/signin";
  }

  // keep your original behavior
  const showHomeBtn =
    variant === "signin" || variant === "signup" || variant === "app";
  const showSignInBtn = variant === "home";

  const helperText =
    variant === "signup"
      ? {
          text: "Already have an account? ",
          linkText: "Sign in",
          to: "/signin",
        }
      : { text: "Don’t have an account? ", linkText: "Sign up", to: "/signup" };

  // Logged-in user (stored after signin/signup)
  const storedUser = localStorage.getItem("socratia_user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const displayName = user?.fullName || user?.email || "User";

  // dropdown
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (!menuRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const confirmAndGo = (message, path) => {
    const ok = window.confirm(message);
    if (!ok) return;
    setOpen(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur">
      {/* 3-column layout so the welcome text is truly centered */}
      <div className="mx-auto grid max-w-6xl grid-cols-3 items-center px-4 py-3 sm:px-6">
        {/* Left: Logo */}
        <div className="flex items-center">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-blue-500/20 ring-1 ring-blue-400/30 shadow-[0_0_25px_rgba(59,130,246,0.25)]" />
            <div className="text-sm font-semibold tracking-wide text-white">
              SOCRATIA
            </div>
          </NavLink>
        </div>

        {/* Middle: Welcome (ONLY on app pages) */}
        <div className="flex justify-center">
          {variant === "app" && (
            <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-blue-400/15 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-100 shadow-[0_0_24px_rgba(59,130,246,0.15)]">
              <span className="text-white/70">Welcome,</span>
              <span className="text-white">{displayName}</span>
            </div>
          )}
        </div>

        {/* Right: Your original buttons + (added) user menu on app */}
        <div className="flex items-center justify-end gap-4 text-sm">
          {showHomeBtn && (
            <NavLink
              to="/"
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 font-semibold text-white hover:bg-white/10 transition"
            >
              Home
            </NavLink>
          )}

          {showSignInBtn && (
            <NavLink
              to="/signin"
              className="rounded-xl bg-blue-500 px-4 py-2 font-semibold text-white shadow-[0_0_30px_rgba(59,130,246,0.35)] hover:bg-blue-400 transition"
            >
              Sign In
            </NavLink>
          )}

          {/* keep your helper text exactly (only not shown on app) */}
          {variant !== "app" && (
            <div className="hidden text-white/70 sm:block">
              {helperText.text}
              <NavLink
                to={helperText.to}
                className="font-semibold text-blue-300 hover:text-blue-200"
              >
                {helperText.linkText}
              </NavLink>
            </div>
          )}

          {/* ADDED: user menu only on app */}
          {variant === "app" && (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 font-semibold text-white hover:bg-white/10 transition"
                aria-haspopup="menu"
                aria-expanded={open}
              >
                <span className="text-base">👤</span>
                <span className="hidden sm:inline text-sm">{displayName}</span>
                <span className="text-xs text-white/60">▼</span>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0f1a] shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
                  {user?.role === "admin" && (
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        navigate("/admin");
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-blue-300 hover:bg-blue-500/10 transition"
                    >
                      Admin Panel
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      const ok = window.confirm("Sign out and go to Sign In?");
                      if (!ok) return;
                      setOpen(false);
                      logout();
                    }}
                    className="w-full px-4 py-3 text-left text-sm text-white/90 hover:bg-white/10 transition"
                  >
                    Switch account
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const ok = window.confirm(
                        "Are you sure you want to sign out?"
                      );
                      if (!ok) return;
                      setOpen(false);
                      logout();
                    }}
                    className="w-full px-4 py-3 text-left text-sm text-red-300 hover:bg-red-500/10 transition"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile helper line (keep your original behavior) */}
      {variant !== "app" && (
        <div className="border-t border-white/10 bg-black/20 px-4 py-2 text-xs text-white/70 sm:hidden">
          {helperText.text}
          <NavLink to={helperText.to} className="font-semibold text-blue-300">
            {helperText.linkText}
          </NavLink>
        </div>
      )}
    </header>
  );
}
