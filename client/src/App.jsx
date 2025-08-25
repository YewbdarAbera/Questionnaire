import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Submitted from "./pages/Submitted.jsx";

export default function App() {
  return (
    <BrowserRouter>
      {/* Minimal top bar — brand only (no links, no language) */}
      <header className="topbar">
        <div className="brand">🎓 Questionnaire</div>
      </header>

      {/* Page content */}
      <main className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/submitted" element={<Submitted />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
