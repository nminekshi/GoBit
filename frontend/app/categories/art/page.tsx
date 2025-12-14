"use client";
import CategorySidebar from "../../components/CategorySidebar";
import { useState } from "react";

const items = [
  { name: "Abstract Painting", img: "/images/Abstract Painting.png", currentBid: 12000, endsIn: "7h 40m" },
  { name: "Sculpture", img: "/images/Sculpture.png", currentBid: 9000, endsIn: "9h 15m" },
  { name: "Modern Art Canvas", img: "/images/Modern Art Canvas.png", currentBid: 15000, endsIn: "8h 20m" },
  { name: "Classic Oil Painting", img: "/images/Classic Oil Painting.png", currentBid: 18000, endsIn: "10h 10m" },
  { name: "Bronze Statue", img: "/images/Bronze Statue.png", currentBid: 7000, endsIn: "11h 30m" },
  { name: "Street Art Mural", img: "/images/Street Art Mural.png", currentBid: 5000, endsIn: "12h 50m" },
];

export default function ArtAuction() {
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
      <div className="w-full max-w-7xl flex gap-8">
        <div className="hidden md:block w-72 shrink-0">
          <CategorySidebar category="art" />
        </div>
        <div className="flex-1">
          <h1 className="text-5xl font-bold text-gray-700 mb-10">Art Auction</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {items.map(item => (
              <div key={item.name} className="bg-gray-100 rounded-xl shadow p-6 flex flex-col items-center">
                <div className="w-64 h-48 flex justify-center items-center mb-4">
                  <img src={item.img} alt={item.name} className="w-full h-full object-contain rounded" />
                </div>
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">{item.name}</h2>
                <div className="text-lg text-gray-800 mb-2">Current Bid: <span className="font-bold text-black">${item.currentBid}</span></div>
                <div className="text-sm text-gray-700 mb-4">Ends in: {item.endsIn}</div>
                <button onClick={() => openModal(item)} className="px-8 py-2 bg-black text-white rounded-lg font-semibold shadow hover:bg-gray-900 transition">Bid Now</button>
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
      </div>
    </div>
  );
}
