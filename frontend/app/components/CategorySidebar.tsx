"use client";
import Link from "next/link";
import { useState } from "react";

const categories = [
  { name: "Electronics", href: "/categories/electronics" },
  { name: "Watches", href: "/categories/watches" },
  { name: "Computers", href: "/categories/computers" },
  { name: "Vehicles", href: "/categories/vehicles" },
  { name: "Real Estate", href: "/categories/realestate" },
  { name: "Art", href: "/categories/art" },
];

type CategorySidebarProps = {
  category: string;
};

export default function CategorySidebar({ category }: CategorySidebarProps) {
  const [open, setOpen] = useState<string | null>(null);

  function renderFilters() {
    switch (category) {
      case "vehicles":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
              <select className="w-full rounded-lg border border-gray-300 px-3 py-2">
                <option value="">All</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="truck">Truck</option>
                <option value="hatchback">Hatchback</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" className="w-1/2 rounded-lg border border-gray-300 px-3 py-2 text-gray-900" />
                <input type="number" placeholder="Max" className="w-1/2 rounded-lg border border-gray-300 px-3 py-2 text-gray-900" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Mileage</label>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" className="w-1/2 rounded-lg border border-gray-300 px-3 py-2 text-gray-900" />
                <input type="number" placeholder="Max" className="w-1/2 rounded-lg border border-gray-300 px-3 py-2 text-gray-900" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" className="w-1/2 rounded-lg border border-gray-300 px-3 py-2 text-gray-900" />
                <input type="number" placeholder="Max" className="w-1/2 rounded-lg border border-gray-300 px-3 py-2 text-gray-900" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
              <input type="text" placeholder="Enter keywords" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900" />
            </div>
          </>
        );
      case "watches":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
              <input type="text" placeholder="Brand" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
              <select className="w-full rounded-lg border border-gray-300 px-3 py-2">
                <option value="">All</option>
                <option value="new">New</option>
                <option value="used">Used</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" className="w-1/2 rounded-lg border border-gray-300 px-3 py-2 text-gray-900" />
                <input type="number" placeholder="Max" className="w-1/2 rounded-lg border border-gray-300 px-3 py-2 text-gray-900" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
              <input type="text" placeholder="Enter keywords" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900" />
            </div>
          </>
        );
      case "computers":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
              <input type="text" placeholder="Brand" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select className="w-full rounded-lg border border-gray-300 px-3 py-2">
                <option value="">All</option>
                <option value="laptop">Laptop</option>
                <option value="desktop">Desktop</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">RAM (GB)</label>
              <input type="number" placeholder="e.g. 16" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Storage (GB)</label>
              <input type="number" placeholder="e.g. 512" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" className="w-1/2 rounded-lg border border-gray-300 px-3 py-2 text-gray-900" />
                <input type="number" placeholder="Max" className="w-1/2 rounded-lg border border-gray-300 px-3 py-2 text-gray-900" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
              <input type="text" placeholder="Enter keywords" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900" />
            </div>
          </>
        );
      case "realestate":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <select className="w-full rounded-lg border border-gray-300 px-3 py-2">
                <option value="">All</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="penthouse">Penthouse</option>
                <option value="cabin">Cabin</option>
                <option value="loft">Loft</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
              <input type="number" placeholder="e.g. 3" className="w-full rounded-lg border border-gray-300 px-3 py-2" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input type="text" placeholder="City or Area" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" className="w-1/2 rounded-lg border border-gray-300 px-3 py-2" />
                <input type="number" placeholder="Max" className="w-1/2 rounded-lg border border-gray-300 px-3 py-2" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
              <input type="text" placeholder="Enter keywords" className="w-full rounded-lg border border-gray-300 px-3 py-2" />
            </div>
          </>
        );
      case "art":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Medium</label>
              <select className="w-full rounded-lg border border-gray-300 px-3 py-2">
                <option value="">All</option>
                <option value="painting">Painting</option>
                <option value="sculpture">Sculpture</option>
                <option value="mural">Mural</option>
                <option value="statue">Statue</option>
                <option value="canvas">Canvas</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Artist</label>
              <input type="text" placeholder="Artist name" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" className="w-1/2 rounded-lg border border-gray-300 px-3 py-2" />
                <input type="number" placeholder="Max" className="w-1/2 rounded-lg border border-gray-300 px-3 py-2" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
              <input type="text" placeholder="Enter keywords" className="w-full rounded-lg border border-gray-300 px-3 py-2" />
            </div>
          </>
        );
      case "electronics":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
              <input type="text" placeholder="Brand" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
              <select className="w-full rounded-lg border border-gray-300 px-3 py-2">
                <option value="">All</option>
                <option value="new">New</option>
                <option value="used">Used</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" className="w-1/2 rounded-lg border border-gray-300 px-3 py-2 text-gray-900" />
                <input type="number" placeholder="Max" className="w-1/2 rounded-lg border border-gray-300 px-3 py-2 text-gray-900" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
              <input type="text" placeholder="Enter keywords" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900" />
            </div>
          </>
        );
      default:
        return null;
    }
  }

  return (
    <aside className="w-full max-w-xs">
      <div className="bg-white rounded-xl shadow p-4 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Categories</h3>
        <ul className="flex flex-col gap-2">
          {categories.map((c) => (
            <li key={c.name}>
                <Link href={c.href} className="block px-3 py-2 rounded hover:bg-gray-100 text-gray-800">
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 bg-white rounded-xl shadow p-4 border border-gray-200">
          <h3 className="text-lg font-semibold mb-3 text-gray-900">Filters</h3>
        {renderFilters()}
        <button className="w-full mt-2 px-4 py-2 bg-black text-white rounded-lg">Apply</button>
      </div>
    </aside>
  );
}
