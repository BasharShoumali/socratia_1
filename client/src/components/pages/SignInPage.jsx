import { NavLink } from "react-router-dom";
import useSignIn from "../../hooks/useSignIn";

export default function SignInPage() {
  const { email, password, setEmail, setPassword, submit, error, loading } =
    useSignIn();

  return (
    <div className="min-h-screen bg-[radial-gradient(60%_40%_at_50%_0%,rgba(59,130,246,0.22),transparent_60%),linear-gradient(180deg,#05070f,#03040a)] text-white">
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
              <NavLink
                to="/signup"
                className="font-semibold text-blue-300 hover:text-blue-200"
              >
                Create one
              </NavLink>
            </div>
          </section>

          {/* Right: form */}
          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_40px_rgba(59,130,246,0.08)] backdrop-blur sm:p-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="space-y-4"
            >
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
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/40"
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
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              {error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_35px_rgba(59,130,246,0.40)] hover:bg-blue-400 disabled:opacity-60 transition"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
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
          </section>
        </div>
      </main>
    </div>
  );
}
