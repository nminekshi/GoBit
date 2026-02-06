"use client";
import { useState } from "react";

const categories = [
  "All",
  "Electronics",
  "Fashion",
  "Collectibles",
  "Luxury",
  "Home & Garden",
];

const auctions = [
  {
    id: 1,
    title: "iPhone 14 Pro - Like New",
    category: "Electronics",
    img: "/images/iphone14pro.jpg",
    currentBid: 750,
    aiPredicted: "780-820",
    timeLeft: "2h 34m",
    bids: 23,
    aiVerified: true,
    recommended: true,
  },
  {
    id: 2,
    title: "Sony WH-1000XM5 Headphones",
    category: "Electronics",
    img: "/images/headphones.jpg",
    currentBid: 320,
    aiPredicted: "340-370",
    timeLeft: "1h 12m",
    bids: 12,
    aiVerified: true,
    recommended: false,
  },
  {
    id: 3,
    title: "MacBook Pro 14",
    
    category: "Electronics",
    img: "/images/macbook.jpg",
    currentBid: 1200,
    aiPredicted: "1250-1350",
    timeLeft: "3h 5m",
    bids: 31,
    aiVerified: true,
    recommended: false,
  },
];

export default function ExploreAuctionsPage() {
  const [selectedCategory, setSelectedCategory] = useState("Electronics");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Most Bids");

  const filteredAuctions = auctions.filter(
    (a) =>
      (selectedCategory === "All" || a.category === selectedCategory) &&
      a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8f9fb] px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Browse Auctions</h1>
        <p className="text-lg text-gray-500 mb-8">Discover items curated by AI based on your interests</p>
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row md:items-center gap-4 mb-8">
          <input
            type="text"
            placeholder="Search auctions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 rounded-lg border border-gray-200 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#f8f9fb]"
          />
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="rounded-lg border border-gray-200 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#f8f9fb]"
          >
            <option>Most Bids</option>
            <option>Ending Soon</option>
            <option>Lowest Price</option>
            <option>Highest Price</option>
          </select>
        </div>
        <div className="flex gap-3 mb-8 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-lg font-semibold text-lg transition border border-gray-200 ${selectedCategory === cat ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <span className="text-purple-500 text-2xl">&#9881;</span> Recommended for You
          </h2>
          {auctions.filter(a => a.recommended).map(a => (
            <div key={a.id} className="flex items-center gap-6 bg-purple-50 border border-purple-200 rounded-2xl p-4 mb-4 shadow-sm">
              <div className="relative w-24 aspect-square overflow-hidden rounded-xl">
                <img src={a.img} alt={a.title} className="absolute inset-0 h-full w-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="text-lg font-bold text-gray-800 mb-1">{a.title}</div>
                <div className="text-gray-500 text-sm mb-1">{a.category}</div>
                <div className="flex gap-6 text-base mb-1">
                  <span>Current Bid <span className="text-blue-600 font-bold">${a.currentBid}</span></span>
                  <span>AI Predicted <span className="text-green-600 font-bold">${a.aiPredicted}</span></span>
                </div>
                <div className="flex gap-6 text-gray-500 text-sm">
                  <span>{a.timeLeft}</span>
                  <span>&#128100; {a.bids} bids</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">All Auctions ({filteredAuctions.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredAuctions.map(a => (
              <div key={a.id} className="bg-white rounded-2xl shadow p-4 flex flex-col">
                <div className="relative mb-3 overflow-hidden rounded-xl aspect-[4/3]">
                  <img src={a.img} alt={a.title} className="absolute inset-0 h-full w-full object-cover" />
                  {a.aiVerified && (
                    <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">AI Verified</span>
                  )}
                </div>
                <div className="font-bold text-lg text-gray-800 mb-1">{a.title}</div>
                <div className="text-gray-500 text-sm mb-1">{a.category}</div>
                <div className="flex gap-4 text-base mb-1">
                  <span>Current Bid <span className="text-blue-600 font-bold">${a.currentBid}</span></span>
                  <span>AI Predicted <span className="text-green-600 font-bold">${a.aiPredicted}</span></span>
                </div>
                <div className="flex gap-4 text-gray-500 text-sm mb-2">
                  <span>{a.timeLeft}</span>
                  <span>&#128100; {a.bids} bids</span>
                </div>
                <button className="mt-auto px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition">Bid Now</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
