"use client"
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section - Full Screen */}
      <section className="w-screen h-screen min-h-[600px] flex flex-col md:flex-row items-center justify-center p-0 m-0 overflow-hidden">
        <div className="flex-1 flex flex-col items-start justify-center gap-6 pl-8 md:pl-24">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-800 leading-tight">
            Explore<br />Auctions<br />Beyond<br />the Ordinary
          </h1>
          <Link href="/ongoing-auctions">
            <button className="mt-2 px-8 py-3 bg-black text-white rounded-lg font-semibold text-lg shadow hover:bg-gray-900 transition">Explore Auctions</button>
          </Link>
        </div>
        <div className="flex-1 flex justify-center items-center mt-10 md:mt-0">
          <img
            src="remove.png"
            alt="Auction Hero"
            className="max-w-[600px] md:max-w-[700px] lg:max-w-[800px] w-full h-auto object-contain"
            style={{ filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.18))', border: 'none' }}
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 px-4 md:px-0 pb-16">
        <div className="flex flex-col items-center">
          <span className="text-3xl mb-2">👤</span>
          <span className="text-3xl font-extrabold text-gray-900">50K+</span>
          <span className="text-gray-500 font-medium mt-1">Active Bidder</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-3xl mb-2">📈</span>
          <span className="text-3xl font-extrabold text-gray-900">$2.1B</span>
          <span className="text-gray-500 font-medium mt-1">Total Sales</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-3xl mb-2">⏰</span>
          <span className="text-3xl font-extrabold text-gray-900">24/7</span>
          <span className="text-gray-500 font-medium mt-1">Live Supports</span>
        </div>
      </section>
    </div>
  );
}
