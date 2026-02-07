"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type AuthUser = {
  username: string;
  role?: string;
  avatar?: string | null;
};

function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("auth");
      if (!raw) {
        setUser(null);
        return;
      }
      const parsed = JSON.parse(raw);
      if (parsed?.user?.username) {
        const avatar = parsed.user.avatar || parsed.user.photoURL || window.localStorage.getItem("profileAvatar");
        setUser({ username: parsed.user.username, role: parsed.user.role, avatar });
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("auth");
    }
    setUser(null);
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

        <div className="flex items-center gap-3 md:gap-4 mt-3 md:mt-0">
          {user ? (
            <>
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-700 bg-slate-800 text-sm font-semibold text-slate-100 md:h-11 md:w-11">
                {user.avatar ? (
                  <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  (user.username?.charAt(0) || "U").toUpperCase()
                )}
              </div>
              <div className="flex flex-col items-end mr-1">
                <span className="text-sm md:text-base font-semibold text-slate-50">
                  Hi, {user.username}
                </span>
                {user.role && (
                  <span className="text-xs md:text-sm text-emerald-300 capitalize">
                    {user.role} account
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 md:px-5 py-2 bg-slate-800 text-slate-100 text-sm md:text-base rounded-xl font-medium border border-slate-600 hover:bg-slate-700 transition-colors"
              >
                Log out
              </button>
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