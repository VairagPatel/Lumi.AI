import { useState, useCallback, useMemo } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { getUserDisplayName, getUserInitials, createUserDisplay } from "../utils/userDisplay";
import { useDebounce } from "../utils/performance.jsx";

const Header = () => {
  const { user, isAuthenticated, logout: storeLogout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const navigate = useNavigate();

  // Memoize user display to prevent unnecessary recalculations
  const userDisplay = useMemo(() => {
    return user ? createUserDisplay(user) : null;
  }, [user]);

  // Debounce tooltip show/hide for better performance
  const debouncedShowTooltip = useDebounce((show) => {
    setShowTooltip(show);
  }, 150);

  const logout = useCallback(async () => {
    await storeLogout();
    navigate("/auth");
  }, [storeLogout, navigate]);

  const toggleMenu = useCallback(() => {
    setOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setOpen(false);
  }, []);

  // User Avatar Component - Memoized for performance
  const UserAvatar = useMemo(() => ({ user, size = "sm" }) => {
    const sizeClasses = {
      sm: "w-8 h-8 text-sm",
      md: "w-10 h-10 text-base"
    };

    return (
      <div 
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] text-white font-semibold flex items-center justify-center shadow-md`}
        role="img"
        aria-label={`Avatar for ${userDisplay?.displayName || 'User'}`}
      >
        {userDisplay?.initials || 'U'}
      </div>
    );
  }, [userDisplay]);

  // User Display Component with Tooltip - Optimized with callbacks
  const UserDisplayComponent = useCallback(({ user, isMobile = false }) => {
    const handleMouseEnter = useCallback(() => {
      if (!isMobile) debouncedShowTooltip(true);
    }, [isMobile]);

    const handleMouseLeave = useCallback(() => {
      if (!isMobile) debouncedShowTooltip(false);
    }, [isMobile]);

    const handleKeyDown = useCallback((e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setShowTooltip(!showTooltip);
      }
      if (e.key === 'Escape') {
        setShowTooltip(false);
      }
    }, [showTooltip]);
    
    return (
      <div 
        className="relative flex items-center gap-2"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        tabIndex={0}
        role="button"
        aria-label={`User menu for ${userDisplay?.displayName || 'User'}`}
        aria-expanded={showTooltip}
        aria-haspopup="true"
        onKeyDown={handleKeyDown}
      >
        <UserAvatar user={user} size="sm" />
        <span className="text-sm font-medium text-gray-700 hidden sm:inline" aria-hidden="true">
          👋 {userDisplay?.displayName || 'User'}
        </span>
        
        {/* Tooltip */}
        {showTooltip && !isMobile && userDisplay && (
          <div 
            className="absolute top-full right-0 mt-2 p-3 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-[200px]"
            role="tooltip"
            aria-live="polite"
            id="user-tooltip"
          >
            <div className="text-sm space-y-1">
              {userDisplay.fullName && (
                <div>
                  <span className="font-medium text-gray-600">Name:</span>
                  <span className="ml-2 text-gray-800">{userDisplay.fullName}</span>
                </div>
              )}
              {userDisplay.username && (
                <div>
                  <span className="font-medium text-gray-600">Username:</span>
                  <span className="ml-2 text-gray-800">{userDisplay.username}</span>
                </div>
              )}
              <div>
                <span className="font-medium text-gray-600">Email:</span>
                <span className="ml-2 text-gray-800">{userDisplay.email}</span>
              </div>
            </div>
            {/* Tooltip arrow */}
            <div className="absolute -top-1 right-4 w-2 h-2 bg-white border-l border-t border-gray-200 transform rotate-45" aria-hidden="true"></div>
          </div>
        )}
      </div>
    );
  }, [userDisplay, showTooltip, debouncedShowTooltip]);

  const linkBase =
    "relative px-2 py-1 transition-colors hover:text-[#00C4CC]";
  const activeUnderline =
    "after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:rounded-full after:bg-gradient-to-r after:from-[#00E5A0] after:to-[#00C4CC]";

  const NavItem = useCallback(({ to, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${linkBase} ${isActive ? `text-[#00C4CC] font-semibold ${activeUnderline}` : "text-[#0D1B2A]"}`}
      onClick={closeMenu}
      aria-current={({ isActive }) => isActive ? 'page' : undefined}
    >
      {children}
    </NavLink>
  ), [linkBase, activeUnderline, closeMenu]);

  return (
    <header className="sticky top-0 z-40" role="banner">
      {/* Glassy bar */}
      <div className="backdrop-blur-lg bg-white/70 border-b border-gray-200/70 shadow-sm">
        <nav className="container mx-auto flex items-center justify-between px-4 md:px-8 py-3" role="navigation" aria-label="Main navigation">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
            onClick={closeMenu}
          >
            <div className="relative">
              {/* Logo with enhanced design */}
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00E5A0] via-[#00D4AA] to-[#00C4CC] text-white grid place-items-center font-black shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-lg">L</span>
              </div>
              {/* Enhanced glow effect */}
              <span className="pointer-events-none absolute inset-0 rounded-2xl blur-xl bg-gradient-to-br from-[#00E5A0]/30 to-[#00C4CC]/30 -z-10 group-hover:blur-2xl transition-all duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] bg-clip-text text-transparent group-hover:from-[#00C4CC] group-hover:to-[#00E5A0] transition-all duration-300">
                LumiAI
              </span>
              <span className="text-xs text-[#0D1B2A]/50 font-medium -mt-1 hidden sm:block">
                AI Art Studio
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <NavItem to="/">Home</NavItem>
            {isAuthenticated && user && <NavItem to="/create">Create</NavItem>}
            <NavItem to="/gallery">Gallery</NavItem>
            <NavItem to="/features">Features</NavItem>
            <NavItem to="/pricing">Pricing</NavItem>
            <NavItem to="/faq">FAQ</NavItem>
            {isAuthenticated && user && <NavItem to="/profile">Profile</NavItem>}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                <UserDisplayComponent user={user} />
                <button
                  onClick={logout}
                  className="px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-[#EF4444] to-[#DC2626] shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/auth">
                  <button className="px-4 py-2 text-[#0D1B2A] font-semibold hover:text-[#00C4CC] transition-colors">
                    Login
                  </button>
                </Link>
                <Link to="/auth">
                  <button className="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200">
                    Get Started
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-[#0D1B2A] hover:bg-white/60 transition"
            onClick={toggleMenu}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
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
          <div 
            className="md:hidden border-t border-gray-200/70 bg-white/80 backdrop-blur-lg"
            id="mobile-menu"
            role="menu"
            aria-label="Mobile navigation menu"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <NavItem to="/">Home</NavItem>
              {isAuthenticated && user && <NavItem to="/create">Create</NavItem>}
              <NavItem to="/gallery">Gallery</NavItem>
              <NavItem to="/features">Features</NavItem>
              <NavItem to="/pricing">Pricing</NavItem>
              <NavItem to="/faq">FAQ</NavItem>
              {isAuthenticated && user && <NavItem to="/profile">Profile</NavItem>}

              <div className="pt-2 space-y-3">
                {isAuthenticated && user ? (
                  <>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <UserAvatar user={user} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-800 truncate">
                          {getUserDisplayName(user)}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        closeMenu();
                      }}
                      className="w-full px-4 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-[#ff5a5a] to-[#ff7a7a] shadow-md hover:shadow-lg active:scale-95 transition"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link to="/auth" onClick={closeMenu}>
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
