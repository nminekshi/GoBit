import React from "react";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex flex-col items-center px-4 py-8">
      <nav className="w-full max-w-6xl flex justify-between items-center py-6 mb-8">
        <div className="text-2xl font-bold text-indigo-700 tracking-tight">Bidify Admin</div>
        <div className="flex gap-4">
          <Link href="/admin/dashboard" className="text-indigo-700 font-semibold">Dashboard</Link>
          <Link href="/" className="text-gray-600 hover:text-indigo-600">Home</Link>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">Logout</button>
        </div>
      </nav>
      <section className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-indigo-700 mb-2">Total Users</h2>
            <p className="text-2xl font-extrabold text-gray-800">120</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-indigo-700 mb-2">Active Auctions</h2>
            <p className="text-2xl font-extrabold text-gray-800">8</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-indigo-700 mb-2">Revenue</h2>
            <p className="text-2xl font-extrabold text-gray-800">$12,500</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-indigo-700 mb-4">User Management</h2>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-2">User</th>
                <th className="py-2">Email</th>
                <th className="py-2">Role</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2">Jane Doe</td>
                <td className="py-2">jane@example.com</td>
                <td className="py-2">Customer</td>
                <td className="py-2 text-green-600 font-semibold">Active</td>
              </tr>
              <tr>
                <td className="py-2">John Smith</td>
                <td className="py-2">john@example.com</td>
                <td className="py-2">Customer</td>
                <td className="py-2 text-red-600 font-semibold">Banned</td>
              </tr>
              <tr>
                <td className="py-2">Admin User</td>
                <td className="py-2">admin@bidify.com</td>
                <td className="py-2">Admin</td>
                <td className="py-2 text-green-600 font-semibold">Active</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex justify-end">
          <Link href="/admin/auctions" className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold shadow hover:bg-indigo-700 transition">Manage Auctions</Link>
        </div>
      </section>
    </main>
  );
}
