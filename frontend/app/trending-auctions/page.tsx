"use client";
import Link from "next/link";
import { useState } from "react";

const trendingAuctions = [
  {
    name: "Apple Watch Ultra",
    img: "/images/Apple Watch Ultra.png",
    category: "Watches",
    currentBid: 600,
    endsIn: "45m",
    link: "/categories/watches"
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    img:"/images/Sony WH-1000XM5 Headphones.png",
    category: "Electronics",
    currentBid: 250,
    endsIn: "3h 5m",
    link: "/categories/electronics"
  },
  {
    name: "HP Spectre x360",
    img: "/images/HP Spectre x360.png",
    category: "Computers",
    currentBid: 1300,
    endsIn: "3h 30m",
    link: "/categories/computers"
  },
  {
    name: "BMW X5",
    img: "/images/BMW X5 .png",
    category: "Vehicles",
    currentBid: 42000,
    endsIn: "5h 10m",
    link: "/categories/vehicles"
  },
  {
    name: "Luxury Penthouse",
    img: "/images/Luxury Penthouse.png",
    category: "Real Estate",
    currentBid: 1200000,
    endsIn: "15h 20m",
    link: "/categories/realestate"
  },
  {
    name: "Modern Art Canvas",
    img: "/images/Modern Art Canvas.png",
    category: "Art",
    currentBid: 15000,
    endsIn: "8h 20m",
    link: "/categories/art"
  }
];

export default function TrendingAuctionsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [bid, setBid] = useState("");
  const [error, setError] = useState("");

  const openModal = (item: any) => {
    setSelectedItem(item);
    setBid("");
    setError("");
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
    setBid("");
    setError("");
  };
  const handleBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bid || isNaN(Number(bid)) || Number(bid) <= (selectedItem?.currentBid || 0)) {
      setError("Please enter a valid bid higher than the current bid.");
      return;
    }
    // Here you would handle the bid submission (API call, etc.)
    closeModal();
    alert("Your bid has been placed!");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12">
      <h1 className="text-5xl font-bold text-gray-700 mb-10">Trending Auctions</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-6xl">
        {trendingAuctions.map(item => (
          <div key={item.name} className="bg-gray-100 rounded-xl shadow p-6 flex flex-col items-center">
            <div className="flex justify-center items-center w-full h-48 mb-4">
              <img src={item.img} alt={item.name} className="max-h-full max-w-full object-contain rounded" />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-900">{item.name}</h2>
            <div className="text-lg text-gray-900 mb-1">Category: <span className="font-bold text-black">{item.category}</span></div>
            <div className="text-lg text-gray-900 mb-2">Current Bid: <span className="font-bold text-black">${item.currentBid}</span></div>
            <div className="text-sm text-gray-700 mb-4">Ends in: {item.endsIn}</div>
            <button onClick={() => openModal(item)} className="px-8 py-2 bg-black text-white rounded-lg font-semibold shadow hover:bg-gray-900 transition mb-2">Bid Now</button>
            <Link href={item.link} className="px-8 py-2 bg-gray-300 text-gray-900 rounded-lg font-semibold shadow hover:bg-gray-400 transition">Go to Auction</Link>
          </div>
        ))}
      </div>

      {/* Bid Modal */}
      {modalOpen && selectedItem && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative">
            <button onClick={closeModal} className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-black">&times;</button>
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">Bid for {selectedItem.name}</h2>
            <div className="mb-2 text-center text-gray-600">Current Bid: <span className="font-bold text-black">${selectedItem.currentBid}</span></div>
            <form onSubmit={handleBid} className="flex flex-col gap-4 mt-4">
              <input
                type="number"
                min={selectedItem.currentBid + 1}
                value={bid}
                onChange={e => setBid(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-700"
                placeholder={`Enter your bid (> ${selectedItem.currentBid})`}
                autoFocus
              />
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              <div className="flex gap-4 justify-center mt-2">
                <button type="submit" className="px-8 py-2 bg-black text-white rounded-lg font-semibold shadow hover:bg-gray-900 transition">Place Bid</button>
                <button type="button" onClick={closeModal} className="px-8 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold shadow hover:bg-gray-400 transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
