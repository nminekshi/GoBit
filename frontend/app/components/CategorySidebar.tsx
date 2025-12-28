"use client";
import Link from "next/link";

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

const inputClasses =
  "w-full rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-white/50 focus:outline-none";

const selectClasses =
  "w-full rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white focus:border-white/50 focus:outline-none";

export default function CategorySidebar({ category }: CategorySidebarProps) {
  function renderFilters() {
    switch (category) {
      case "vehicles":
        return (
          <>
            <div className="mb-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-white/60">Vehicle Type</p>
              <select className={selectClasses}>
                <option value="">All</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="truck">Truck</option>
                <option value="hatchback">Hatchback</option>
              </select>
            </div>
            <div className="mb-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-white/60">Year</p>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" className={inputClasses} />
                <input type="number" placeholder="Max" className={inputClasses} />
              </div>
            </div>
            <div className="mb-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-white/60">Mileage</p>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" className={inputClasses} />
                <input type="number" placeholder="Max" className={inputClasses} />
              </div>
            </div>
            <div className="mb-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-white/60">Price</p>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" className={inputClasses} />
                <input type="number" placeholder="Max" className={inputClasses} />
              </div>
            </div>
            <div className="mb-1">
              <p className="mb-2 text-xs uppercase tracking-wide text-white/60">Keywords</p>
              <input type="text" placeholder="Enter keywords" className={inputClasses} />
            </div>
          </>
        );
      case "watches":
        return (
          <>
            <div className="mb-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-white/60">Brand</p>
              <input type="text" placeholder="Brand" className={inputClasses} />
            </div>
            <div className="mb-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-white/60">Condition</p>
              <select className={selectClasses}>
                <option value="">All</option>
                <option value="new">New</option>
                <option value="used">Used</option>
              </select>
            </div>
            <div className="mb-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-white/60">Price</p>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" className={inputClasses} />
                <input type="number" placeholder="Max" className={inputClasses} />
              </div>
            </div>
            <div className="mb-1">
              <p className="mb-2 text-xs uppercase tracking-wide text-white/60">Keywords</p>
              <input type="text" placeholder="Enter keywords" className={inputClasses} />
            </div>
          </>
        );
      case "computers":
        return (
          <>
            <div className="mb-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-white/60">Brand</p>
              <input type="text" placeholder="Brand" className={inputClasses} />
            </div>
            <div className="mb-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-white/60">Type</p>
              <select className={selectClasses}>
                <option value="">All</option>
                <option value="laptop">Laptop</option>
                <option value="desktop">Desktop</option>
              </select>
            </div>
            <div className="mb-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-white/60">RAM (GB)</p>
              <input type="number" placeholder="e.g. 16" className={inputClasses} />
            </div>
            <div className="mb-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-white/60">Storage (GB)</p>
              <input type="number" placeholder="e.g. 512" className={inputClasses} />
            </div>
            <div className="mb-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-white/60">Price</p>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" className={inputClasses} />
                <input type="number" placeholder="Max" className={inputClasses} />
              </div>
            </div>
            <div className="mb-1">
              <p className="mb-2 text-xs uppercase tracking-wide text-white/60">Keywords</p>
              <input type="text" placeholder="Enter keywords" className={inputClasses} />
            </div>
          </>
        );
      case "realestate":
        return (
          <>
            <div className="mb-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-white/60">Property Type</p>
              <select className={selectClasses}>
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
              <p className="mb-2 text-xs uppercase tracking-wide text-white/60">Bedrooms</p>
              <input type="number" placeholder="e.g. 3" className={inputClasses} />
            </div>
            <div className="mb-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-white/60">Location</p>
              <input type="text" placeholder="City or Area" className={inputClasses} />
            </div>
            <div className="mb-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-white/60">Price</p>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" className={inputClasses} />
                <input type="number" placeholder="Max" className={inputClasses} />
              </div>
            </div>
            <div className="mb-1">
              <p className="mb-2 text-xs uppercase tracking-wide text-white/60">Keywords</p>
              <input type="text" placeholder="Enter keywords" className={inputClasses} />
            </div>
          </>
        );
      case "art":
        return (
          <>
            <div className="mb-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-white/60">Medium</p>
              <select className={selectClasses}>
                <option value="">All</option>
                <option value="painting">Painting</option>
                <option value="sculpture">Sculpture</option>
                <option value="mural">Mural</option>
                <option value="statue">Statue</option>
                <option value="canvas">Canvas</option>
              </select>
            </div>
            <div className="mb-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-white/60">Artist</p>
              <input type="text" placeholder="Artist name" className={inputClasses} />
            </div>
            <div className="mb-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-white/60">Price</p>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" className={inputClasses} />
                <input type="number" placeholder="Max" className={inputClasses} />
              </div>
            </div>
            <div className="mb-1">
              <p className="mb-2 text-xs uppercase tracking-wide text-white/60">Keywords</p>
              <input type="text" placeholder="Enter keywords" className={inputClasses} />
            </div>
          </>
        );
      case "electronics":
        return (
          <>
            <div className="mb-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-white/60">Brand</p>
              <input type="text" placeholder="Brand" className={inputClasses} />
            </div>
            <div className="mb-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-white/60">Condition</p>
              <select className={selectClasses}>
                <option value="">All</option>
                <option value="new">New</option>
                <option value="used">Used</option>
              </select>
            </div>
            <div className="mb-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-white/60">Price</p>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" className={inputClasses} />
                <input type="number" placeholder="Max" className={inputClasses} />
              </div>
            </div>
            <div className="mb-1">
              <p className="mb-2 text-xs uppercase tracking-wide text-white/60">Keywords</p>
              <input type="text" placeholder="Enter keywords" className={inputClasses} />
            </div>
          </>
        );
      default:
        return null;
    }
  }

  return (
    <aside className="w-full max-w-xs space-y-6">
      <div className="rounded-3xl border border-white/15 bg-white/5 p-5 text-white backdrop-blur">
        <h3 className="text-sm uppercase tracking-wide text-white/60">Categories</h3>
        <ul className="mt-4 space-y-2 text-sm font-semibold">
          {categories.map((categoryLink) => {
            const isActive = categoryLink.href.endsWith(category);
            return (
              <li key={categoryLink.name}>
                <Link
                  href={categoryLink.href}
                  className={`flex items-center justify-between rounded-2xl border px-3 py-2 transition ${
                    isActive
                      ? "border-white bg-white text-gray-900"
                      : "border-white/10 text-white/70 hover:border-white/40 hover:text-white"
                  }`}
                >
                  <span>{categoryLink.name}</span>
                  {isActive && <span className="text-xs font-normal text-gray-700">Live</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="rounded-3xl border border-white/15 bg-white/5 p-5 text-white backdrop-blur">
        <h3 className="text-sm uppercase tracking-wide text-white/60">Filters</h3>
        <div className="mt-4">
          {renderFilters()}
          <button className="mt-4 w-full rounded-2xl border border-white/40 px-4 py-2 text-sm font-semibold text-white transition hover:border-white">
            Apply filters
          </button>
        </div>
      </div>
    </aside>
  );
}
