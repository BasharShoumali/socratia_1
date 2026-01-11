import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../../lib/api.js";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadUsers() {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/admin/users");
      setUsers(data.users || []);
    } catch (err) {
      setError(err?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        (u.fullName || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.role || "").toLowerCase().includes(q)
    );
  }, [query, users]);

  async function onDelete(id, email) {
    if (!window.confirm(`Delete user: ${email}?`)) return;
    await apiFetch(`/admin/users/${id}`, { method: "DELETE" });
    loadUsers();
  }

  async function onResetPassword(id, email) {
    const newPassword = window.prompt(
      `Set NEW password for ${email}\n(min 8 characters):`
    );
    if (!newPassword) return;

    await apiFetch(`/admin/users/${id}/password`, {
      method: "PATCH",
      body: { newPassword },
    });

    alert("Password reset successfully.");
  }

  async function onChangeRole(id, email, currentRole) {
    const nextRole = currentRole === "admin" ? "user" : "admin";
    if (!window.confirm(`Change role for ${email} to ${nextRole}?`)) return;

    await apiFetch(`/admin/users/${id}/role`, {
      method: "PATCH",
      body: { role: nextRole },
    });

    loadUsers();
  }

  return (
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

      {error && (
        <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-white/70">Loading users...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-white/70">
              <tr className="border-b border-white/10">
                <th className="py-3 pr-3">Username</th>
                <th className="py-3 pr-3">Email</th>
                <th className="py-3 pr-3">Role</th>
                <th className="py-3 pr-3">Created</th>
                <th className="py-3 pr-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-white/5">
                  <td className="py-3 pr-3">{u.username || "—"}</td>
                  <td className="py-3 pr-3">{u.email}</td>
                  <td className="py-3 pr-3">{u.role}</td>
                  <td className="py-3 pr-3 text-white/70">
                    {new Date(u.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 pr-3">
                    <div className="flex gap-2 flex-wrap">
                      {/* Reset password */}
                      <button
                        onClick={() => onResetPassword(u.id, u.email)}
                        className="
                          rounded-xl
                         bg-amber-500/15
                          px-3 py-1.5
                          text-xs font-semibold text-amber-300
                          border border-amber-400/30
                        hover:bg-amber-500/25
                          transition
                        "
                      >
                        Reset
                      </button>

                      {/* Toggle role */}
                      <button
                        onClick={() => onChangeRole(u.id, u.email, u.role)}
                        className="
                          rounded-xl
                        bg-blue-500/15
                          px-3 py-1.5
                          text-xs font-semibold text-blue-300
                          border border-blue-400/30
                        hover:bg-blue-500/25
                          transition
                        "
                      >
                        {u.role === "admin" ? "Demote" : "Promote"}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => onDelete(u.id, u.email)}
                        className="
                          rounded-xl
                        bg-red-500/15
                          px-3 py-1.5
                          text-xs font-semibold text-red-300
                          border border-red-400/30
                        hover:bg-red-500/30
                          transition
                        "
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-6 text-white/60">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
