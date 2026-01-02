import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";

import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import WorkspacePage from "./pages/WorkspacePage";
import SocraticSessionPage from "./pages/SocraticSessionPage";
import ComparisonSessionPage from "./pages/ComparisonSessionPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const isAdmin = useMemo(() => {
    try {
      const token = localStorage.getItem("socratia_token");
      if (!token) return false;

      const raw = localStorage.getItem("socratia_user");
      const user = raw ? JSON.parse(raw) : null;

      return user?.role === "admin";
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("socratia_token");
    if (!token) return;

    // Only enforce on protected pages
    const protectedPaths = ["/workspace", "/session", "/compare"];
    const isProtected = protectedPaths.some((p) =>
      location.pathname.startsWith(p)
    );
    if (!isProtected) return;

    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          // Token invalid/expired -> logout
          localStorage.removeItem("socratia_token");
          localStorage.removeItem("socratia_user");
          navigate("/signin", { replace: true });
          return;
        }

        // Optional: refresh stored user data from token payload
        // (keeps Navbar consistent even after refresh)
        localStorage.setItem(
          "socratia_user",
          JSON.stringify({
            email: data?.user?.email,
            role: data?.user?.role,
            sub: data?.user?.sub,
          })
        );
      } catch {
        // If backend is down, do nothing (don’t lock user out)
      }
    })();
  }, [location.pathname, navigate]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      <Route path="/workspace" element={<WorkspacePage />} />
      <Route path="/session" element={<SocraticSessionPage />} />
      <Route path="/compare" element={<ComparisonSessionPage />} />

      <Route
        path="/admin"
        element={isAdmin ? <AdminPage /> : <WorkspacePage />}
      />
    </Routes>
  );
}
