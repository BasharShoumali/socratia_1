import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import WorkspacePage from "./pages/WorkspacePage";
import SocraticSessionPage from "./pages/SocraticSessionPage";
import ComparisonSessionPage from "./pages/ComparisonSessionPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      <Route path="/workspace" element={<WorkspacePage />} />
      <Route path="/session" element={<SocraticSessionPage />} />
      <Route path="/compare" element={<ComparisonSessionPage />} />
    </Routes>
  );
}
