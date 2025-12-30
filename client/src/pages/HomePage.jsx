import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function HomePage() {
  const navigate = useNavigate();
  const goToSignIn = () => navigate("/signin");

  return (
    <div className="min-h-screen bg-[radial-gradient(60%_40%_at_50%_0%,rgba(59,130,246,0.25),transparent_60%),linear-gradient(180deg,#05070f,#03040a)] text-white">
      <Navbar variant="home" />


      <main className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_40px_rgba(59,130,246,0.08)] backdrop-blur sm:p-10">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative">
            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
              Let an AI tutor guide you through research papers
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
              A calm Socratic workspace that helps you understand academic papers
              by asking the right questions — step by step, without overwhelming you.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                onClick={goToSignIn}
                className="inline-flex items-center justify-center rounded-2xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_35px_rgba(59,130,246,0.40)] hover:bg-blue-400 transition"
              >
                Open Socratic Workspace
              </button>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Socratic learning",
              desc: "Guiding questions that push your thinking instead of dumping answers.",
            },
            {
              title: "Paper-focused",
              desc: "Work with one paper at a time and stay aligned with its content.",
            },
            {
              title: "Comparison ready",
              desc: "Later you’ll compare two papers side-by-side for methods & results.",
            },
            {
              title: "Calm UI",
              desc: "Dark, glassy layout designed for reading and concentration.",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_0_30px_rgba(59,130,246,0.06)] backdrop-blur"
            >
              <div className="text-base font-semibold">{c.title}</div>
              <div className="mt-2 text-sm leading-relaxed text-white/70">
                {c.desc}
              </div>
            </div>
          ))}
        </section>

        <section
          id="about"
          className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8"
        >
          <h2 className="text-lg font-semibold">About</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            Socratia is a Socratic learning app for reading and comparing academic
            papers. You’ll upload papers, choose a learning mode (single paper or
            comparison), and the assistant will guide you with questions.
          </p>

          <div className="mt-5 flex">
            <button
              onClick={goToSignIn}
              className="rounded-2xl bg-blue-500 px-5 py-2.5 text-sm font-semibold shadow-[0_0_30px_rgba(59,130,246,0.35)] hover:bg-blue-400 transition"
            >
              Sign in to start
            </button>
          </div>
        </section>

        <footer className="mt-10 text-center text-xs text-white/40">
            Socratia — AI-powered research assistant. All rights reserved © 2026.

        </footer>
      </main>
    </div>
  );
}
