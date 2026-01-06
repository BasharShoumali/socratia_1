import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./components/pages/HomePage";
import SignInPage from "./components/pages/SignInPage";
import SignUpPage from "./components/pages/signup/SignUpPage";
import WorkspacePage from "./components/pages/workspace/WorkspacePage";
import SocraticSessionPage from "./components/pages/socratic/SocraticSessionPage";
import ComparisonPage from "./components/pages/comparison/ComparisonSessionPage";
import AdminUsersPage from "./components/pages/admin/AdminUsersPage";
function getNavbarVariant(pathname, isAuth) {
  if (isAuth) return "app";
  if (pathname === "/signin") return "signin";
  if (pathname === "/signup") return "signup";
  return "home";
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = !!localStorage.getItem("socratia_token");
  const variant = getNavbarVariant(location.pathname, isAuthenticated);

  return (
    <div className="min-h-screen bg-[#06080f] text-white">
      <Navbar variant={variant} />

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              onStart={() => {
                const isAuthenticated =
                  !!localStorage.getItem("socratia_token");
                navigate(isAuthenticated ? "/workspace" : "/signin");
              }}
            />
          }
        />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/workspace" element={<WorkspacePage />} />
        <Route path="/socratic-session" element={<SocraticSessionPage />} />
        <Route path="/comparison" element={<ComparisonPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
      </Routes>
    </div>
  );
}
