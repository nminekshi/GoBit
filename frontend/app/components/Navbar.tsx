"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";


export default function Navbar() {
  const pathname = usePathname();
  const linkBase = "text-base md:text-lg font-medium flex items-center transition-colors";
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
            className={`${linkBase} ${pathname === "/" ? activeLink : inactiveLink}`}
          >
            Home
          </Link>
          <Link
            href="/ongoing-auctions"
            className={`${linkBase} ${pathname === "/ongoing-auctions" ? activeLink : inactiveLink}`}
          >
            On-going auctions
          </Link>
          <Link
            href="/trending-auctions"
            className={`${linkBase} ${pathname === "/trending-auctions" ? activeLink : inactiveLink}`}
          >
            Trending auction
          </Link>
          <Link
            href="/categories"
            className={`${linkBase} ${pathname?.startsWith("/categories") ? activeLink : inactiveLink}`}
          >
            Categories
          </Link>
        </div>
        <div className="flex items-center gap-3 md:gap-4 mt-3 md:mt-0">
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
        </div>
      </nav>
    </header>
  );
}
