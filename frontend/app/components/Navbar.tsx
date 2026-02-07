"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type AuthUser = {
  username: string;
  role?: string;
  avatar?: string | null;
  email?: string | null;
};

function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("auth");
      if (!raw) {
        setUser(null);
        setMenuOpen(false);
        return;
      }
      const parsed = JSON.parse(raw);
      const storedName = window.localStorage.getItem("profileName");
      const storedEmail = window.localStorage.getItem("profileEmail");
      if (parsed?.user?.username || storedName) {
        const username = parsed?.user?.username || storedName || "User";
        const email = parsed?.user?.email || storedEmail || null;
        const avatar = parsed?.user?.avatar || parsed?.user?.photoURL || window.localStorage.getItem("profileAvatar");
        setUser({ username, role: parsed?.user?.role, avatar, email });
      } else {
        setUser(null);
        setMenuOpen(false);
      }
    } catch {
      setUser(null);
      setMenuOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (!event.key) return;
      if (!"profileAvatar,profileName,profileEmail".includes(event.key)) return;
      setUser((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          avatar: window.localStorage.getItem("profileAvatar"),
          username: window.localStorage.getItem("profileName") || prev.username,
          email: window.localStorage.getItem("profileEmail") || prev.email,
        };
      });
    };
    const onProfileUpdate = () => {
      setUser((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          avatar: window.localStorage.getItem("profileAvatar"),
          username: window.localStorage.getItem("profileName") || prev.username,
          email: window.localStorage.getItem("profileEmail") || prev.email,
        };
      });
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("profile-updated", onProfileUpdate);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("profile-updated", onProfileUpdate);
    };
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("auth");
    }
    setUser(null);
    setMenuOpen(false);
    router.push("/");
  };

  const linkBase =
    "text-base md:text-lg font-medium flex items-center transition-colors";
  const activeLink = "text-emerald-400 border-b-2 border-emerald-400 pb-1";
  const inactiveLink = "text-slate-100 hover:text-emerald-300";

  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-20">
      <nav className="max-w-full mx-auto flex flex-col md:flex-row items-center justify-between py-3 md:py-4 px-4 md:px-8">
        <div className="flex items-center gap-2 md:gap-3">
          <img src="/logo.png" alt="GoBit Logo" className="h-17 md:h-20 w-auto" />
        </div>

        <div className="flex-1 flex items-center justify-center gap-6 md:gap-8 mt-3 md:mt-0 ml-0 md:ml-8">
          <Link
            href="/"
            className={`${linkBase} ${
              pathname === "/" ? activeLink : inactiveLink
            }`}
          >
            Home
          </Link>
          <Link
            href="/ongoing-auctions"
            className={`${linkBase} ${
              pathname === "/ongoing-auctions" ? activeLink : inactiveLink
            }`}
          >
            On-going auctions
          </Link>
          <Link
            href="/trending-auctions"
            className={`${linkBase} ${
              pathname === "/trending-auctions" ? activeLink : inactiveLink
            }`}
          >
            Trending auction
          </Link>
          <Link
            href="/categories"
            className={`${linkBase} ${
              pathname?.startsWith("/categories") ? activeLink : inactiveLink
            }`}
          >
            Categories
          </Link>
        </div>

        <div className="relative flex items-center gap-3 md:gap-4 mt-3 md:mt-0" ref={menuRef}>
          {user ? (
            <>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full bg-transparent px-2 py-1 pr-2 transition hover:bg-slate-800/60"
              >
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-sm font-semibold text-slate-100 md:h-11 md:w-11">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    (user.username?.charAt(0) || "U").toUpperCase()
                  )}
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm md:text-base font-semibold text-slate-50">{user.username}</span>
                  {user.role && (
                    <span className="text-xs md:text-sm text-emerald-300 capitalize">{user.role} account</span>
                  )}
                </div>
                <ChevronDown className={`h-4 w-4 text-slate-200 transition ${menuOpen ? "rotate-180" : "rotate-0"}`} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-slate-800 bg-[#0f1729] p-3 shadow-xl shadow-black/40">
                  <div className="rounded-xl bg-slate-900/70 p-3 text-slate-50">
                    <p className="text-base font-semibold">{user.username}</p>
                        <p className="text-sm text-slate-300">{user.email || `${user.username}@gmail.com`}</p>
                  </div>
                  <div className="mt-2 divide-y divide-slate-800 text-slate-100">
                    <Link
                      href="/buyer/dashboard"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-slate-800"
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="text-lg">👤</span> Dashboard
                    </Link>
                    <Link
                      href="/buyer/settings"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-slate-800"
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="text-lg">🛠️</span> Account Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-400 transition hover:bg-slate-800"
                    >
                      <span className="text-lg">↩️</span> Logout
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-base md:text-lg font-medium text-slate-200 hover:text-emerald-300 transition-colors flex items-center"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="px-5 md:px-6 py-2.5 bg-emerald-500 text-slate-950 text-base md:text-lg rounded-xl font-semibold shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 transition-colors flex items-center"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;