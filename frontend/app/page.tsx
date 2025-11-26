
import Link from "next/link";

export default function Home() {
  return (
  <main className="min-h-screen bg-linear-to-br from-indigo-100 via-blue-50 to-white flex flex-col items-center justify-center px-4 py-8">
      <nav className="w-full max-w-6xl flex justify-between items-center py-6 mb-12">
        <div className="text-2xl font-bold text-indigo-700 tracking-tight">Bidify</div>
        <div className="flex gap-4">
          <Link href="/login" className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition">Sign In</Link>
          <Link href="/signup" className="px-6 py-2 bg-white border border-indigo-600 text-indigo-700 rounded-lg shadow hover:bg-indigo-50 transition">Sign Up</Link>
        </div>
      </nav>
  <section className="w-full max-w-5xl text-center flex flex-col items-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
          Welcome to <span className="text-indigo-600">Bidify</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
          The modern, secure, and transparent online bidding platform. Discover, bid, and win your favorite items with real-time updates and a seamless experience.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <button className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold shadow hover:bg-indigo-700 transition">Get Started</button>
          <button className="px-8 py-3 bg-white border border-indigo-600 text-indigo-700 rounded-lg font-semibold shadow hover:bg-indigo-50 transition">Learn More</button>
        </div>
        <div className="w-full flex flex-col md:flex-row gap-8 justify-center mt-8">
          <div className="flex-1 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 text-left border border-indigo-100 hover:scale-105 hover:shadow-2xl transition-transform duration-300">
            <h2 className="text-xl font-bold text-indigo-700 mb-2 flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3"/></svg>
              Live Auctions
            </h2>
            <p className="text-gray-600">Bid in real-time on a variety of items, from electronics to collectibles. Stay ahead with instant notifications.</p>
          </div>
          <div className="flex-1 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 text-left border border-indigo-100 hover:scale-105 hover:shadow-2xl transition-transform duration-300">
            <h2 className="text-xl font-bold text-indigo-700 mb-2 flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
              Secure Payments
            </h2>
            <p className="text-gray-600">All transactions are encrypted and protected, ensuring your data and payments are always safe.</p>
          </div>
          <div className="flex-1 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 text-left border border-indigo-100 hover:scale-105 hover:shadow-2xl transition-transform duration-300">
            <h2 className="text-xl font-bold text-indigo-700 mb-2 flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3"/></svg>
              Transparent Process
            </h2>
            <p className="text-gray-600">Track your bids and auction history with full transparency and detailed analytics.</p>
          </div>
        </div>
        {/* Featured Goods Section */}
  <div className="w-full max-w-5xl mt-20">
          <h2 className="text-3xl font-bold text-indigo-700 mb-8 text-center">Featured Goods</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {/* Example Goods - Replace with dynamic data as needed */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 flex flex-col items-center border border-indigo-100 hover:scale-105 hover:shadow-2xl transition-transform duration-300">
              <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80" alt="iPhone 15 Pro" className="w-32 h-32 object-cover rounded-xl mb-4 shadow" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">iPhone 15 Pro</h3>
              <p className="text-indigo-600 font-semibold mb-2">Current Bid: $900</p>
              <button className="px-4 py-2 bg-linear-to-r from-indigo-500 to-blue-500 text-white rounded-lg shadow hover:from-indigo-600 hover:to-blue-600 transition font-semibold">Bid Now</button>
            </div>
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 flex flex-col items-center border border-indigo-100 hover:scale-105 hover:shadow-2xl transition-transform duration-300">
              <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80" alt="Vintage Watch" className="w-32 h-32 object-cover rounded-xl mb-4 shadow" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Vintage Watch</h3>
              <p className="text-indigo-600 font-semibold mb-2">Current Bid: $320</p>
              <button className="px-4 py-2 bg-linear-to-r from-indigo-500 to-blue-500 text-white rounded-lg shadow hover:from-indigo-600 hover:to-blue-600 transition font-semibold">Bid Now</button>
            </div>
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 flex flex-col items-center border border-indigo-100 hover:scale-105 hover:shadow-2xl transition-transform duration-300">
              <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80" alt="Gaming Laptop" className="w-32 h-32 object-cover rounded-xl mb-4 shadow" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Gaming Laptop</h3>
              <p className="text-indigo-600 font-semibold mb-2">Current Bid: $1200</p>
              <button className="px-4 py-2 bg-linear-to-r from-indigo-500 to-blue-500 text-white rounded-lg shadow hover:from-indigo-600 hover:to-blue-600 transition font-semibold">Bid Now</button>
            </div>
          </div>
        </div>

  {/* Detailed Bidding System Section */}
  <div className="w-full max-w-5xl mt-24">
          <h2 className="text-3xl font-bold text-indigo-700 mb-8 text-center">How Bidding Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 flex flex-col items-center border border-indigo-100 hover:scale-105 hover:shadow-2xl transition-transform duration-300">
              <div className="w-14 h-14 flex items-center justify-center bg-linear-to-br from-indigo-200 to-blue-100 rounded-full mb-4 shadow">
                <span className="text-2xl font-bold text-indigo-700">1</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Register & Browse</h3>
              <p className="text-gray-600 text-center">Create your account and explore a wide range of auctions and goods.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 flex flex-col items-center border border-indigo-100 hover:scale-105 hover:shadow-2xl transition-transform duration-300">
              <div className="w-14 h-14 flex items-center justify-center bg-linear-to-br from-indigo-200 to-blue-100 rounded-full mb-4 shadow">
                <span className="text-2xl font-bold text-indigo-700">2</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Place Bids</h3>
              <p className="text-gray-600 text-center">Bid on your favorite items in real-time. Get instant updates if you are outbid.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 flex flex-col items-center border border-indigo-100 hover:scale-105 hover:shadow-2xl transition-transform duration-300">
              <div className="w-14 h-14 flex items-center justify-center bg-linear-to-br from-indigo-200 to-blue-100 rounded-full mb-4 shadow">
                <span className="text-2xl font-bold text-indigo-700">3</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Win & Pay</h3>
              <p className="text-gray-600 text-center">If you win, complete your purchase securely and track your order in your dashboard.</p>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-10 border border-indigo-100">
            <h3 className="text-xl font-bold text-indigo-700 mb-4 text-center">Live Auction Timeline Example</h3>
            <ol className="relative border-l-2 border-indigo-200 ml-4">
              <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-10 h-10 bg-linear-to-br from-indigo-200 to-blue-100 rounded-full -left-5 ring-4 ring-white shadow">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3"/></svg>
                </span>
                <h4 className="font-semibold text-indigo-700">Auction Starts</h4>
                <p className="text-gray-600">The auction for the item begins. Users can start placing bids.</p>
              </li>
              <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-10 h-10 bg-linear-to-br from-indigo-200 to-blue-100 rounded-full -left-5 ring-4 ring-white shadow">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                </span>
                <h4 className="font-semibold text-indigo-700">Bidding Phase</h4>
                <p className="text-gray-600">Participants place bids. The highest bid is always visible. Outbid notifications are sent instantly.</p>
              </li>
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-10 h-10 bg-linear-to-br from-indigo-200 to-blue-100 rounded-full -left-5 ring-4 ring-white shadow">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3"/></svg>
                </span>
                <h4 className="font-semibold text-indigo-700">Auction Ends</h4>
                <p className="text-gray-600">The auction closes. The highest bidder wins and can proceed to payment.</p>
              </li>
            </ol>
          </div>
        </div>
      </section>
      <footer className="w-full max-w-6xl mt-16 text-center text-gray-500 text-sm border-t border-gray-200 pt-8 pb-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
          <div className="flex gap-6 justify-center">
            <Link href="/" className="hover:text-indigo-600 transition">Home</Link>
            <Link href="/auctions" className="hover:text-indigo-600 transition">Auctions</Link>
            <Link href="/dashboard" className="hover:text-indigo-600 transition">Dashboard</Link>
            <Link href="/contact" className="hover:text-indigo-600 transition">Contact</Link>
          </div>
          <div className="flex gap-4 justify-center">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-indigo-600 transition">
              <svg className="w-5 h-5 inline" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195A4.92 4.92 0 0 0 16.616 3c-2.73 0-4.942 2.21-4.942 4.932 0 .386.045.763.127 1.124C7.728 8.807 4.1 6.884 1.671 3.965c-.423.722-.666 1.561-.666 2.475 0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.237-.616c-.054 2.281 1.581 4.415 3.949 4.89-.385.104-.792.16-1.211.16-.296 0-.583-.028-.862-.08.584 1.823 2.28 3.152 4.29 3.188A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.057 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.636A9.936 9.936 0 0 0 24 4.557z"/></svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-indigo-600 transition">
              <svg className="w-5 h-5 inline" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.597 0 0 .592 0 1.326v21.348C0 23.408.597 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.403 24 24 23.408 24 22.674V1.326C24 .592 23.403 0 22.675 0"/></svg>
            </a>
            <a href="mailto:support@bidify.com" aria-label="Email" className="hover:text-indigo-600 transition">
              <svg className="w-5 h-5 inline" fill="currentColor" viewBox="0 0 24 24"><path d="M12 13.065L.8 6.2V18a2 2 0 0 0 2 2h18.4a2 2 0 0 0 2-2V6.2l-11.2 6.865zm11.2-8.13A2 2 0 0 0 20.8 4H3.2a2 2 0 0 0-2 2l11.8 7.235L23.2 6.935z"/></svg>
            </a>
          </div>
        </div>
        <div className="text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Bidify. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
