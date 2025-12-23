"use client";

const categories = [
  { name: "Electronics", href: "/categories/electronics", icon: "📱" },
  { name: "Watches", href: "/categories/watches", icon: "⌚️" },
  { name: "Computers", href: "/categories/computers", icon: "💻" },
  { name: "Vehicles", href: "/categories/vehicles", icon: "🚗" },
  { name: "Real Estate", href: "/categories/realestate", icon: "🏠" },
  { name: "Art", href: "/categories/art", icon: "🎨" },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12">
      <h1 className="text-5xl font-bold text-gray-700 mb-10">Categories</h1>
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
        {categories.map((cat) => (
          <a
            key={cat.name}
            href={cat.href}
            className="flex flex-col items-center bg-gray-100 rounded-xl shadow p-8 border border-gray-200 hover:scale-105 hover:shadow-xl transition-transform duration-300 cursor-pointer text-center"
          >
            <span className="text-5xl mb-4">{cat.icon}</span>
            <span className="font-semibold text-2xl text-gray-700">{cat.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
