import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, LogIn, ChevronDown } from "lucide-react";
import { DEMO_USERS, setUser, homeFor } from "../auth";
import type { AuthUser } from "../auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<AuthUser>(DEMO_USERS[0]);

  function login(e: React.FormEvent) {
    e.preventDefault();
    setUser(selected);
    navigate(homeFor(selected));
  }

  return (
    <div className="min-h-screen bg-scene flex flex-col items-center justify-center p-6">

      {/* Grain */}
      <svg className="grain-overlay" xmlns="http://www.w3.org/2000/svg">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      <div className="w-full max-w-sm section-enter">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap size={24} className="text-white" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Albus</h1>
          <p className="text-sm text-base-content/40 font-medium mt-1">OmniAccess Training</p>
        </div>

        {/* Card */}
        <div className="card-clean p-6">
          <form onSubmit={login} className="flex flex-col gap-4">

            <div>
              <label className="block text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-2">
                Entrar como
              </label>
              <div className="relative">
                <select
                  className="select select-bordered w-full font-medium text-sm rounded-xl h-11 appearance-none pr-10"
                  value={selected.name}
                  onChange={(e) => {
                    const u = DEMO_USERS.find((u) => u.name === e.target.value);
                    if (u) setSelected(u);
                  }}
                >
                  {DEMO_USERS.map((u) => (
                    <option key={u.name} value={u.name}>
                      {u.name}{u.role === "admin" ? " · Admin" : ` · ${u.profile}`}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none" />
              </div>

              {/* Role badge */}
              <div className="flex items-center gap-2 mt-2">
                <span className={`badge badge-sm font-semibold ${
                  selected.role === "admin"
                    ? "bg-red-50 border-red-200 text-red-700"
                    : "bg-primary/10 border-0 text-primary"
                }`}>
                  {selected.role === "admin" ? "Administrador" : `Perfil: ${selected.profile}`}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary text-white font-bold rounded-xl h-11 gap-2 mt-1"
            >
              <LogIn size={16} /> Acceder
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-base-content/25 font-medium mt-4">
          Entorno de demo · sin autenticación real
        </p>
      </div>
    </div>
  );
}
