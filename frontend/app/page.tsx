"use client"
import Link from "next/link";
import FAQ from "./components/FAQ";

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section With Stats */}
      <section className="w-screen min-h-[700px] flex flex-col items-center justify-center px-6 md:px-12 py-10">
        <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl gap-10">
          <div className="flex-1 flex flex-col items-start justify-center gap-6">
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-800 leading-tight">
              Explore<br />Auctions<br />Beyond<br />the Ordinary
            </h1>
            <Link href="/ongoing-auctions">
              <button className="mt-2 px-8 py-3 bg-[#2c3847] text-white rounded-lg font-semibold text-lg shadow hover:bg-gray-900 transition">Explore Auctions</button>
            </Link>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <img
              src="remove.png"
              alt="Auction Hero"
              className="max-w-[600px] md:max-w-[700px] lg:max-w-[800px] w-full h-auto object-contain"
              style={{ filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.18))', border: 'none' }}
            />
          </div>
        </div>

        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 px-4 mt-12">
          <div className="flex flex-col items-center bg-white/80 rounded-2xl p-6 shadow-lg">
            <span className="text-3xl mb-2">👤</span>
            <span className="text-3xl font-extrabold text-gray-900">50K+</span>
            <span className="text-gray-500 font-medium mt-1">Active Bidder</span>
          </div>
          <div className="flex flex-col items-center bg-white/80 rounded-2xl p-6 shadow-lg">
            <span className="text-3xl mb-2">📈</span>
            <span className="text-3xl font-extrabold text-gray-900">$2.1B</span>
            <span className="text-gray-500 font-medium mt-1">Total Sales</span>
          </div>
          <div className="flex flex-col items-center bg-white/80 rounded-2xl p-6 shadow-lg">
            <span className="text-3xl mb-2">⏰</span>
            <span className="text-3xl font-extrabold text-gray-900">24/7</span>
            <span className="text-gray-500 font-medium mt-1">Live Supports</span>
          </div>
        </div>
      </section>

      {/* Most Loved Auctions Section */}
      <section className="bg-[#212d3a] text-white w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] px-6 sm:px-12 lg:px-20 py-24">
        <div className="w-full max-w-[1600px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-4">Highly Favored Auction Listings</h2>
            <p className="mt-4 text-lg text-gray-200 max-w-3xl mx-auto">Explore top-rated listings from active and popular auctions across multiple categories</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {/* Card 1 */}
            <div className="rounded-3xl bg-linear-to-b from-gray-900 to-gray-800 p-5 shadow-2xl flex flex-col h-full">
              <div className="relative rounded-2xl bg-gray-800/60 p-6">
                <img src="/images/Rolex Submariner.png" alt="Rolex Submariner" className="w-full h-56 object-contain" />
                <button aria-label="favorite" className="absolute bottom-3 right-3 text-white/80 hover:text-white">♡</button>
              </div>
              <div className="mt-6 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-white text-lg font-semibold">Rolex Submariner</h3>
                  <p className="text-gray-300 text-sm">Trending Auction</p>
                </div>
                <span className="text-white/90 whitespace-nowrap text-lg">★ 8.5</span>
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <button className="w-full py-3 rounded-2xl bg-white text-gray-900 font-semibold hover:bg-gray-200 transition">Bid Now</button>
                <Link href="/ongoing-auctions" className="w-full">
                  <span className="inline-flex w-full items-center justify-center py-3 rounded-2xl border border-white text-white font-semibold hover:bg-white/10 transition">Go to Auction</span>
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-3xl bg-linear-to-b from-gray-900 to-gray-800 p-5 shadow-2xl flex flex-col h-full">
              <div className="relative rounded-2xl bg-gray-800/60 p-6">
                <img src="/images/Audi Q7.png" alt="Audi Q7" className="w-full h-56 object-contain" />
                <button aria-label="favorite" className="absolute bottom-3 right-3 text-white/80 hover:text-white">♡</button>
              </div>
              <div className="mt-6 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-white text-lg font-semibold">Audi Q7</h3>
                  <p className="text-gray-300 text-sm">Ongoing Auction</p>
                </div>
                <span className="text-white/90 whitespace-nowrap text-lg">★ 8.7</span>
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <button className="w-full py-3 rounded-2xl bg-white text-gray-900 font-semibold hover:bg-gray-200 transition">Bid Now</button>
                <Link href="/ongoing-auctions" className="w-full">
                  <span className="inline-flex w-full items-center justify-center py-3 rounded-2xl border border-white text-white font-semibold hover:bg-white/10 transition">Go to Auction</span>
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-3xl bg-linear-to-b from-gray-900 to-gray-800 p-5 shadow-2xl flex flex-col h-full">
              <div className="relative rounded-2xl bg-gray-800/60 p-6">
                <img src="/images/MacBook Pro 16.png" alt="MacBook Pro 16" className="w-full h-56 object-contain" />
                <button aria-label="favorite" className="absolute bottom-3 right-3 text-white/80 hover:text-white">♡</button>
              </div>
              <div className="mt-6 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-white text-lg font-semibold">MacBook Pro 16"</h3>
                  <p className="text-gray-300 text-sm">Trending Auction</p>
                </div>
                <span className="text-white/90 whitespace-nowrap text-lg">★ 8.6</span>
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <button className="w-full py-3 rounded-2xl bg-white text-gray-900 font-semibold hover:bg-gray-200 transition">Bid Now</button>
                <Link href="/ongoing-auctions" className="w-full">
                  <span className="inline-flex w-full items-center justify-center py-3 rounded-2xl border border-white text-white font-semibold hover:bg-white/10 transition">Go to Auction</span>
                </Link>
              </div>
            </div>

            {/* Card 4 */}
            <div className="rounded-3xl bg-linear-to-b from-gray-900 to-gray-800 p-5 shadow-2xl flex flex-col h-full">
              <div className="relative rounded-2xl bg-gray-800/60 p-6">
                <img src="/images/Beach House.png" alt="Beach House" className="w-full h-56 object-contain" />
                <button aria-label="favorite" className="absolute bottom-3 right-3 text-white/80 hover:text-white">♡</button>
              </div>
              <div className="mt-6 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-white text-lg font-semibold">Beach House</h3>
                  <p className="text-gray-300 text-sm">Ongoing Auction</p>
                </div>
                <span className="text-white/90 whitespace-nowrap text-lg">★ 8.8</span>
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <button className="w-full py-3 rounded-2xl bg-white text-gray-900 font-semibold hover:bg-gray-200 transition">Bid Now</button>
                <Link href="/ongoing-auctions" className="w-full">
                  <span className="inline-flex w-full items-center justify-center py-3 rounded-2xl border border-white text-white font-semibold hover:bg-white/10 transition">Go to Auction</span>
                </Link>
              </div>
            </div>

            {/* Card 5 */}
            <div className="rounded-3xl bg-linear-to-b from-gray-900 to-gray-800 p-5 shadow-2xl flex flex-col h-full">
              <div className="relative rounded-2xl bg-gray-800/60 p-6">
                <img src="/images/Mercedes-Benz C-Class.png" alt="Mercedes-Benz C-Class" className="w-full h-56 object-contain" />
                <button aria-label="favorite" className="absolute bottom-3 right-3 text-white/80 hover:text-white">♡</button>
              </div>
              <div className="mt-6 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-white text-lg font-semibold">Mercedes-Benz</h3>
                  <p className="text-gray-300 text-sm">Trending Auction</p>
                </div>
                <span className="text-white/90 whitespace-nowrap text-lg">★ 9.0</span>
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <button className="w-full py-3 rounded-2xl bg-white text-gray-900 font-semibold hover:bg-gray-200 transition">Bid Now</button>
                <Link href="/ongoing-auctions" className="w-full">
                  <span className="inline-flex w-full items-center justify-center py-3 rounded-2xl border border-white text-white font-semibold hover:bg-white/10 transition">Go to Auction</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="bg-white text-gray-900 px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <p className="text-center uppercase tracking-[0.2em] font-medium text-gray-400">Experiences shared by our valued guests</p>
          <h2 className="text-center text-3xl md:text-4xl font-bold text-gray-900  mt-4">Customer Stories & Testimonials</h2>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8">

            {/* Featured review */}
              <div className="flex flex-col gap-8">
              <div className="bg-[#2c3847] text-white rounded-3xl p-6 shadow-xl border-2 border-black-500">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-lg font-semibold text-gray-900 ">KR</div>
                  <div>
                    <h3 className="text-base font-semibold">Kaniya Rehani</h3>
                    <p className="text-sm text-gray-400">Sri Lanka</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed">The bidding process was smooth and transparent. I found exactly what I was looking for at a great price.</p>
                <div className="mt-4 flex items-center gap-1 text-white  text-lg">
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>☆</span>
                  <span>☆</span>
                </div>
              </div>

              <div className="bg-[#2c3847] text-white rounded-3xl p-6 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-lg font-semibold text-gray-900 ">AR</div>
                  <div>
                    <h3 className="text-base font-semibold">Ariana Ranasinghe</h3>
                    <p className="text-sm text-gray-400">Sri Lanka</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed">Excellent auction experience! The listings were clear, and updates during bidding were very helpful.</p>
                <div className="mt-4 flex items-center gap-1 text-white  text-lg">
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>☆</span>
                </div>
              </div>
            </div>

            {/* Secondary reviews */}
            <div className="flex flex-col gap-8">
              <div className="bg-[#2c3847] text-white rounded-3xl p-6 shadow-xl border-2 border-black-500">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-lg font-semibold text-gray-900 ">MP</div>
                  <div>
                    <h3 className="text-base font-semibold">Marina Perera</h3>
                    <p className="text-sm text-gray-400">Sri Lanka</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed">A reliable platform with high-quality items. I’ve participated in multiple auctions and never been disappointed.</p>
                <div className="mt-4 flex items-center gap-1 text-white  text-lg">
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>☆</span>
                  <span>☆</span>
                </div>
              </div>

              <div className="bg-[#2c3847] text-white rounded-3xl p-6 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-lg font-semibold text-gray-900 ">HG</div>
                  <div>
                    <h3 className="text-base font-semibold">Hareena Gunathilaka</h3>
                    <p className="text-sm text-gray-400">Sri Lanka</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed">Easy to use, secure, and well-organized. This has become my go-to auction site.</p>
                <div className="mt-4 flex items-center gap-1 text-white  text-lg">
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>☆</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />
    </div>
  );
}
