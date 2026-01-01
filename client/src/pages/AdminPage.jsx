import { useEffect, useMemo, useState } from "react";
import { Navigate, NavLink } from "react-router-dom";
import Navbar from "../components/Navbar";
import { apiFetch } from "../lib/api";

export default function AdminPage() {
  const storedUser = localStorage.getItem("socratia_user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const token = localStorage.getItem("socratia_token");

  // Frontend guard
  const isAdmin = user?.role === "admin";
  if (!token) return <Navigate to="/signin" replace />;
  if (!isAdmin) return <Navigate to="/workspace" replace />;

  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadUsers() {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/api/admin/users");
      setUsers(data.users || []);
    } catch (err) {
      setError(err?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      return (
        (u.fullName || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.role || "").toLowerCase().includes(q)
      );
    });
  }, [query, users]);

  async function onDelete(id, email) {
    const ok = window.confirm(`Delete user: ${email} ?`);
    if (!ok) return;

    try {
      await apiFetch(`/api/admin/users/${id}`, { method: "DELETE" });
      await loadUsers();
    } catch (err) {
      alert(err?.message || "Delete failed.");
    }
  }

  async function onResetPassword(id, email) {
    const newPassword = window.prompt(
      `Set NEW password for ${email}\n(min 8 characters):`
    );
    if (!newPassword) return;

    try {
      await apiFetch(`/api/admin/users/${id}/password`, {
        method: "PATCH",
        body: { newPassword },
      });
      alert("Password reset successfully.");
    } catch (err) {
      alert(err?.message || "Password reset failed.");
    }
  }

  async function onChangeRole(id, email, currentRole) {
    const nextRole = currentRole === "admin" ? "user" : "admin";
    const ok = window.confirm(`Change role for ${email} to "${nextRole}" ?`);
    if (!ok) return;

    try {
      await apiFetch(`/api/admin/users/${id}/role`, {
        method: "PATCH",
        body: { role: nextRole },
      });
      await loadUsers();
    } catch (err) {
      alert(err?.message || "Role change failed.");
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(60%_40%_at_50%_0%,rgba(59,130,246,0.22),transparent_60%),linear-gradient(180deg,#05070f,#03040a)] text-white">
      <Navbar variant="app" />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Admin Panel
          </h1>

          <div className="flex items-center gap-2">
            <NavLink
              to="/workspace"
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              ← Back to Workspace
            </NavLink>

            <button
              onClick={loadUsers}
              className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_30px_rgba(59,130,246,0.35)] hover:bg-blue-400 transition"
            >
              Refresh
            </button>
          </div>
        </div>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_40px_rgba(59,130,246,0.08)] backdrop-blur">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-white/70">
              Manage users (delete, reset password, change role).
            </div>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name/email/role..."
              className="w-full sm:w-80 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none ring-blue-500/40 focus:ring-2"
            />
          </div>

          {error ? (
            <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="text-white/70">Loading users...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-white/70">
                  <tr className="border-b border-white/10">
                    <th className="py-3 pr-3">Name</th>
                    <th className="py-3 pr-3">Email</th>
                    <th className="py-3 pr-3">Role</th>
                    <th className="py-3 pr-3">Created</th>
                    <th className="py-3 pr-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.id} className="border-b border-white/5">
                      <td className="py-3 pr-3">
                        {u.fullName || <span className="text-white/50">—</span>}
                      </td>
                      <td className="py-3 pr-3">{u.email}</td>
                      <td className="py-3 pr-3">
                        <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-1">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 pr-3 text-white/70">
                        {u.createdAt ? new Date(u.createdAt).toLocaleString() : "—"}
                      </td>
                      <td className="py-3 pr-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => onResetPassword(u.id, u.email)}
                            className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10 transition"
                          >
                            Reset password
                          </button>

                          <button
                            onClick={() => onChangeRole(u.id, u.email, u.role)}
                            className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10 transition"
                          >
                            Toggle role
                          </button>

                          <button
                            onClick={() => onDelete(u.id, u.email)}
                            className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200 hover:bg-red-500/20 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-6 text-white/60">
                        No users found.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
