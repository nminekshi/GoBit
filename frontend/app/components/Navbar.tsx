"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { orbitron } from "../fonts/orbitron";

export default function Navbar() {
  const pathname = usePathname();
  return (
    <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-20">
      <nav className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between py-4 px-4 md:px-8">
        <div className="flex flex-col items-center md:items-start">
          <img src="/logo.png" alt="GoBit Logo" className="h-16 w-auto" />
        </div>
        <div className="flex-1 flex items-center justify-center gap-8 mt-4 md:mt-0 ml-0 md:ml-8">
          <Link href="/" className={`${pathname === "/" ? "font-bold text-black border-b-2 border-black pb-1" : "text-gray-700 hover:text-black transition"} flex items-center`}>Home</Link>
          <Link href="/ongoing-auctions" className={`${pathname === "/ongoing-auctions" ? "font-bold text-black border-b-2 border-black pb-1" : "text-gray-700 hover:text-black transition"} flex items-center`}>On-going Auctions</Link>
          <Link href="/trending-auctions" className={`${pathname === "/trending-auctions" ? "font-bold text-black border-b-2 border-black pb-1" : "text-gray-700 hover:text-black transition"} flex items-center`}>Trending Auction</Link>
          <Link href="/categories" className={`${pathname === "/categories" ? "font-bold text-black border-b-2 border-black pb-1" : "text-gray-700 hover:text-black transition"} flex items-center`}>Categories</Link>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Link href="/login" className="text-lg font-semibold text-gray-500 hover:text-black transition flex items-center">LogIn</Link>
          <Link href="/register" className="px-6 py-2 bg-black text-white rounded-lg font-semibold shadow hover:bg-gray-900 transition flex items-center">Register</Link>
        </div>
      </nav>
    </header>
  );
}
