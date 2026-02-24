import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function AppLayout({ children }) {
  const navigate = useNavigate();
  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  })();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navClass = ({ isActive }) => `navItem ${isActive ? "active" : ""}`;
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };


  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brandLogo">TF</div>
          <div>
            TaskFlow
            <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>
              Student project hub
            </div>
          </div>
        </div>

        <nav className="nav">
          <NavLink to="/home" className={navClass}>Home</NavLink>
          <NavLink to="/projects" className={navClass}>Projects</NavLink>
          <NavLink to="/habits" className={navClass}>Habits</NavLink>
        </nav>

        <div className="sidebarFooter">
          <div className="userBox">
            <div style={{ fontWeight: 700 }}>{user?.name || "User"}</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>
              {user?.email || ""}
            </div>

            <button className="btn btnDanger" style={{ width: "100%", marginTop: 10 }} onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div>
            <div style={{ fontWeight: 800 }}>
              Welcome back, {user?.name || "User"} 👋
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>
              Build • Learn • Track
            </div>
          </div>
          <div className="row" style={{ gap: 10, alignItems: "center" }}>
            <button className="btn" onClick={toggleTheme}>
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>

            <button className="btn btnPrimary" onClick={() => navigate("/projects")}>
              + New Project
            </button>
          </div>

        </div>

        {children}
      </main>
    </div>
  );
}
