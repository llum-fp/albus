import { Outlet, useNavigate, Navigate, useLocation } from "react-router-dom";
import { BookOpen, Settings, Sun, Moon, GraduationCap, LogOut, User, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { getUser, clearUser } from "./auth";

export default function App() {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  if (!user) return <Navigate to="/login" replace />;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  function logout() {
    clearUser();
    navigate("/login");
  }

  const initial = user.name.charAt(0).toUpperCase();
  const isOnAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-scene flex flex-col">

      {/* Grain */}
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
          <button onClick={() => navigate("/learn")} className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap size={14} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-primary tracking-tight">Albus</span>
          </button>

          {/* Right side */}
          <div className="flex items-center gap-3">

            {/* Dark mode toggle */}
            <label className="flex items-center gap-1.5 cursor-pointer opacity-50 hover:opacity-90 transition-opacity">
              <Sun size={13} />
              <input
                type="checkbox"
                className="toggle toggle-primary toggle-xs"
                checked={dark}
                onChange={() => setDark(!dark)}
              />
              <Moon size={13} />
            </label>

            {/* User avatar dropdown */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors font-bold text-sm select-none"
              >
                {initial}
              </div>
              <ul
                tabIndex={0}
                className="mt-2 z-50 p-2 shadow-lg menu menu-sm dropdown-content bg-base-100 rounded-xl w-52 border border-base-200"
              >
                {/* User info */}
                <li className="menu-title">
                  <span className="text-xs uppercase font-semibold tracking-wider opacity-40">
                    Sesión activa
                  </span>
                </li>
                <li>
                  <span className="font-semibold text-sm py-2 gap-2 pointer-events-none">
                    <User size={15} /> {user.name}
                  </span>
                </li>

                <div className="divider my-0.5" />

                {/* Navigation */}
                <li>
                  <a
                    onClick={() => navigate("/learn")}
                    className={`font-medium text-sm py-2 gap-2 ${!isOnAdmin ? "text-primary" : ""}`}
                  >
                    <BookOpen size={15} /> Portal Learn
                  </a>
                </li>
                {user.role === "admin" && (
                  <li>
                    <a
                      onClick={() => navigate("/admin")}
                      className={`font-medium text-sm py-2 gap-2 ${isOnAdmin ? "text-primary" : ""}`}
                    >
                      <ShieldCheck size={15} /> Panel Admin
                    </a>
                  </li>
                )}

                <div className="divider my-0.5" />

                {/* Logout */}
                <li>
                  <a
                    onClick={logout}
                    className="text-error font-medium text-sm py-2 gap-2"
                  >
                    <LogOut size={15} /> Cerrar sesión
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="text-center text-xs text-base-content/25 font-medium py-4 border-t border-base-200">
        Albus · OmniAccess Training
      </footer>
    </div>
  );
}
