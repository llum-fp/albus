import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BookOpen, Settings, Sun, Moon, GraduationCap } from "lucide-react";
import { useState, useEffect } from "react";

export default function App() {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="min-h-screen bg-scene flex flex-col">

      {/* Grain texture */}
      <svg className="grain-overlay" xmlns="http://www.w3.org/2000/svg">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      {/* Navbar */}
      <div className="bg-base-100/80 backdrop-blur-sm border-b border-base-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 lg:px-8 h-14 flex items-center justify-between">

          {/* Logo */}
          <button
            onClick={() => navigate("/learn")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap size={14} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-primary tracking-tight">Albus</span>
          </button>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Nav links */}
            <nav className="hidden md:flex bg-base-200/70 rounded-xl p-1 gap-1">
              <NavLink
                to="/learn"
                className={({ isActive }) => `nav-pill ${isActive ? "active" : ""}`}
              >
                <BookOpen size={15} strokeWidth={2} /> Learn
              </NavLink>
              <NavLink
                to="/admin"
                className={({ isActive }) => `nav-pill ${isActive ? "active" : ""}`}
              >
                <Settings size={15} strokeWidth={2} /> Admin
              </NavLink>
            </nav>

            {/* Dark mode toggle */}
            <label className="flex items-center gap-2 cursor-pointer opacity-50 hover:opacity-90 transition-opacity">
              <Sun size={14} />
              <input
                type="checkbox"
                className="toggle toggle-primary toggle-xs"
                checked={dark}
                onChange={() => setDark(!dark)}
              />
              <Moon size={14} />
            </label>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="flex md:hidden border-t border-base-200 bg-base-200/40 px-4 py-1 gap-1">
          <NavLink
            to="/learn"
            className={({ isActive }) => `nav-pill flex-1 justify-center ${isActive ? "active" : ""}`}
          >
            <BookOpen size={15} strokeWidth={2} /> Learn
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) => `nav-pill flex-1 justify-center ${isActive ? "active" : ""}`}
          >
            <Settings size={15} strokeWidth={2} /> Admin
          </NavLink>
        </div>
      </div>

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="text-center text-xs text-base-content/25 font-medium py-4 border-t border-base-200">
        Albus · OmniAccess Training
      </footer>
    </div>
  );
}
