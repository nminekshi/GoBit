import React from "react";
import Link from "next/link";

export default function CustomerDashboard() {
  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex flex-col items-center px-4 py-8">
      <nav className="w-full max-w-6xl flex justify-between items-center py-6 mb-8">
        <div className="text-2xl font-bold text-indigo-700 tracking-tight">GoBit</div>
        <div className="flex gap-4">
          <Link href="/dashboard" className="text-indigo-700 font-semibold">Dashboard</Link>
          <Link href="/" className="text-gray-600 hover:text-indigo-600">Home</Link>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">Logout</button>
        </div>
      </nav>
      <section className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome, Customer!</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-indigo-700 mb-2">Active Bids</h2>
            <p className="text-2xl font-extrabold text-gray-800">3</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-indigo-700 mb-2">Auctions Won</h2>
            <p className="text-2xl font-extrabold text-gray-800">1</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-indigo-700 mb-2">Balance</h2>
            <p className="text-2xl font-extrabold text-gray-800">$250.00</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-indigo-700 mb-4">Your Active Bids</h2>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-2">Item</th>
                <th className="py-2">Current Bid</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2">iPhone 15 Pro</td>
                <td className="py-2">$900</td>
                <td className="py-2 text-green-600 font-semibold">Winning</td>
              </tr>
              <tr>
                <td className="py-2">Vintage Watch</td>
                <td className="py-2">$320</td>
                <td className="py-2 text-yellow-600 font-semibold">Outbid</td>
              </tr>
              <tr>
                <td className="py-2">Gaming Laptop</td>
                <td className="py-2">$1200</td>
                <td className="py-2 text-green-600 font-semibold">Winning</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex justify-end">
          <Link href="/auctions" className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold shadow hover:bg-indigo-700 transition">Browse Auctions</Link>
        </div>
      </section>
    </main>
  );
}
