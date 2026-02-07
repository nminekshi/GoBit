export default function WhyChoosePage() {
  return (
    <div className="min-h-screen bg-white px-6 py-10 text-gray-900 md:px-12 lg:px-20">
      <header className="mb-10 max-w-3xl">
        <h1 className="text-4xl font-bold md:text-5xl mb-3">Why Choose GoBit</h1>
        <p className="text-lg text-gray-700">
          Smart, secure, and transparent auctions built for real buyers and sellers.
          GoBit combines powerful technology with human support so every bid feels
          confident and every deal feels fair.
        </p>
      </header>

      <main className="grid gap-10 lg:grid-cols-[1.5fr_minmax(0,1fr)] items-start">
        <section className="space-y-10">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl bg-gray-50 p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-2">Trusted marketplace</h2>
              <p className="text-base text-gray-700">
                Thousands of buyers and sellers rely on GoBit every day for vehicles,
                electronics, real estate, luxury items, and more. Every listing is
                reviewed to keep quality and trust high.
              </p>
            </div>
            <div className="rounded-3xl bg-gray-50 p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-2">Secure bidding & payments</h2>
              <p className="text-base text-gray-700">
                Encrypted data, verified sellers, and clear payment flows mean you can
                focus on winning the right item, not worrying about safety.
              </p>
            </div>
            <div className="rounded-3xl bg-gray-50 p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-2">Real-time auction experience</h2>
              <p className="text-base text-gray-700">
                Live updates, instant notifications, and transparent bid history help
                you make smarter decisions in the moments that matter.
              </p>
            </div>
            <div className="rounded-3xl bg-gray-50 p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-2">Support when you need it</h2>
              <p className="text-base text-gray-700">
                Our team is available to help with registration, bidding, payments,
                and delivery so you are never stuck in the process.
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-gray-900 text-white p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4">Built for serious buyers & sellers</h2>
            <p className="text-base text-gray-100 mb-3">
              GoBit is designed for people who care about value, speed, and trust.
              From first-time bidders to professional dealers, our tools make it
              easier to find the right lot, place the right bid, and close the deal
              without surprises.
            </p>
            <p className="text-sm text-gray-200">
              Clear fees, transparent timelines, and step-by-step guides mean you
              always know what happens next.
            </p>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl bg-gray-50 p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Why users stay with GoBit</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li>Wide range of categories and curated lots.</li>
              <li>Transparent bidding with no hidden actions in the background.</li>
              <li>Real-time notifications on bids, wins, and payments.</li>
              <li>Guides like How to Buy and How to Pay for every step.</li>
              <li>Expert tips and resources to help you bid with confidence.</li>
            </ul>
          </div>

          <div className="rounded-3xl bg-emerald-500 p-6 text-slate-950 shadow-lg shadow-emerald-500/30">
            <h3 className="text-xl font-semibold mb-2">Ready to get started?</h3>
            <p className="text-base mb-3">
              Create your free GoBit account, explore live auctions, and see how
              easy it is to discover great deals.
            </p>
            <a
              href="/register"
              className="inline-flex items-center rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              Join GoBit today
            </a>
          </div>
        </aside>
      </main>
    </div>
  );
}
