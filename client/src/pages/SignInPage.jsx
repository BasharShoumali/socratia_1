import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";

export default function SignInPage() {
  const navigate = useNavigate();

  // Backend-ready state (later: send to API)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI-only for now (later: set based on API response)
  const [error, setError] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    setError("");

    // No backend/auth logic yet.
    // Later: call your API here and on success navigate("/papers")
    // For now: just basic empty check (optional)
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    navigate("/workspace");
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(60%_40%_at_50%_0%,rgba(59,130,246,0.22),transparent_60%),linear-gradient(180deg,#05070f,#03040a)] text-white">
      <Navbar variant="signin" />


      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
          {/* Left: intro */}
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_40px_rgba(59,130,246,0.08)] backdrop-blur sm:p-8">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Sign in to Socratia
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Continue your Socratic workspace and access your saved papers.
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-sm font-semibold">What you’ll do next</div>
              <ul className="mt-2 space-y-2 text-sm text-white/70">
                <li>• View your uploaded papers</li>
                <li>• Choose one paper to learn</li>
                <li>• Or compare two papers</li>
              </ul>
            </div>

            <div className="mt-6 text-sm text-white/70">
              Don’t have an account?{" "}
              <NavLink to="/signup" className="font-semibold text-blue-300 hover:text-blue-200">
                Create one
              </NavLink>
            </div>
          </section>

          {/* Right: form */}
          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_40px_rgba(59,130,246,0.08)] backdrop-blur sm:p-8">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="relative">
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-white/80">
                    Email
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none ring-blue-500/40 focus:ring-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-white/80">
                    Password
                  </label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none ring-blue-500/40 focus:ring-2"
                  />
                </div>

                {error ? (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  className="mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_35px_rgba(59,130,246,0.40)] hover:bg-blue-400 transition"
                >
                  Sign In
                </button>

                <div className="text-center text-xs text-white/50">
                  By continuing, you agree to use the app responsibly.
                </div>
              </form>

              <div className="mt-6 flex items-center justify-between text-sm">
                <NavLink to="/" className="text-white/70 hover:text-white">
                  ← Back to Home
                </NavLink>

                <NavLink
                  to="/signup"
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 font-semibold text-white/90 hover:bg-white/10 transition"
                >
                  Sign Up
                </NavLink>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
