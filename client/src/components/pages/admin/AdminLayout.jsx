import { Navigate, Outlet, NavLink } from "react-router-dom";

export default function AdminLayout() {
  const token = localStorage.getItem("socratia_token");
  const user = JSON.parse(localStorage.getItem("socratia_user") || "null");

  if (!token) return <Navigate to="/signin" replace />;
  if (user?.role !== "admin") return <Navigate to="/workspace" replace />;

  return (
    <div className="min-h-screen bg-[radial-gradient(60%_40%_at_50%_0%,rgba(59,130,246,0.22),transparent_60%),linear-gradient(180deg,#05070f,#03040a)] text-white">
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Admin navigation */}
        <div className="mb-8 flex gap-3">
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `rounded-xl px-4 py-2 text-sm font-semibold transition
              ${
                isActive
                  ? "bg-blue-500 text-white"
                  : "border border-white/15 bg-white/5 text-white hover:bg-white/10"
              }`
            }
          >
            Users
          </NavLink>
        </div>

        {/* Child page */}
        <Outlet />
      </main>
    </div>
  );
}
