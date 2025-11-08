import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Header = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const linkBase =
    "relative px-2 py-1 transition-colors hover:text-[#00C4CC]";
  const activeUnderline =
    "after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:rounded-full after:bg-gradient-to-r after:from-[#00E5A0] after:to-[#00C4CC]";

  const NavItem = ({ to, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${linkBase} ${isActive ? `text-[#00C4CC] font-semibold ${activeUnderline}` : "text-[#0D1B2A]"}`}
      onClick={() => setOpen(false)}
    >
      {children}
    </NavLink>
  );

  return (
    <header className="sticky top-0 z-40">
      {/* Glassy bar */}
      <div className="backdrop-blur-lg bg-white/70 border-b border-gray-200/70 shadow-sm">
        <nav className="container mx-auto flex items-center justify-between px-4 md:px-8 py-3">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            onClick={() => setOpen(false)}
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] text-white grid place-items-center font-extrabold shadow-md">
                L
              </div>
              {/* soft glow */}
              <span className="pointer-events-none absolute inset-0 rounded-full blur-xl bg-[#00E5A0]/20 -z-10" />
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] bg-clip-text text-transparent">
              LumiAI
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/create">Create</NavItem>
            <NavItem to="/features">Features</NavItem>
            <NavItem to="/gallery">Gallery</NavItem>
            <NavItem to="/faq">FAQ</NavItem>
            {user && <NavItem to="/profile">Profile</NavItem>}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm font-medium text-gray-700">
                  👋 {user.email}
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-[#ff5a5a] to-[#ff7a7a] shadow-md hover:shadow-lg active:scale-95 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/auth">
                <button className="px-5 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] shadow-md hover:shadow-lg active:scale-95 transition">
                  Login / Sign Up
                </button>
              </Link>
            )}
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-[#0D1B2A] hover:bg-white/60 transition"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg
              className={`transition-transform ${open ? "rotate-90" : ""}`}
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {open ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <path d="M3 6h18" />
                  <path d="M3 12h18" />
                  <path d="M3 18h18" />
                </>
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-gray-200/70 bg-white/80 backdrop-blur-lg">
            <div className="container mx-auto px-4 py-3 flex flex-col gap-3">
              <NavItem to="/">Home</NavItem>
              <NavItem to="/create">Create</NavItem>
              <NavItem to="/features">Features</NavItem>
              <NavItem to="/gallery">Gallery</NavItem>
              <NavItem to="/faq">FAQ</NavItem>
              {user && <NavItem to="/profile">Profile</NavItem>}

              <div className="pt-2">
                {user ? (
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="w-full px-4 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-[#ff5a5a] to-[#ff7a7a] shadow-md hover:shadow-lg active:scale-95 transition"
                  >
                    Logout
                  </button>
                ) : (
                  <Link to="/auth" onClick={() => setOpen(false)}>
                    <button className="w-full px-4 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] shadow-md hover:shadow-lg active:scale-95 transition">
                      Login / Sign Up
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
