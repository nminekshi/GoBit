export default function AuctionInformationRequestPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-10 text-gray-900 md:px-12 lg:px-20">
      <header className="mb-10 max-w-3xl">
        <h1 className="text-4xl font-bold md:text-5xl mb-3">Auction Information Request</h1>
        <p className="text-lg text-gray-700">
          Request detailed information about upcoming auctions, specific lots,
          and bidding rules so you can prepare with confidence before you place
          a bid.
        </p>
      </header>

      <main className="grid gap-10 lg:grid-cols-[1.5fr_minmax(0,1fr)] items-start">
        <section className="space-y-8">
          <div className="rounded-3xl bg-gray-50 p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Request auction details</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="auction">
                  Auction or lot reference (optional)
                </label>
                <input
                  id="auction"
                  name="auction"
                  type="text"
                  placeholder="Auction name, lot ID, or date"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="request">
                  What information do you need?
                </label>
                <textarea
                  id="request"
                  name="request"
                  rows={4}
                  placeholder="Tell us what details you would like – e.g. schedule, catalog, condition reports, bidding rules."
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm resize-y focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 transition-colors"
              >
                Submit request
              </button>
              <p className="text-xs text-gray-500">
                We will use your contact details only to respond to your
                request.
              </p>
            </form>
          </div>

          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">What you can request</h2>
              <ul className="list-disc pl-6 space-y-1 text-base text-gray-700">
                <li>Upcoming auction schedules and formats.</li>
                <li>Item details, photos, and condition reports.</li>
                <li>Bidding rules, increments, and reserve price information.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">Example requests</h2>
              <ul className="list-disc pl-6 space-y-1 text-base text-gray-700">
                <li>Request a full catalog or lot list for the next auction.</li>
                <li>Ask for inspection notes for a specific vehicle or property.</li>
                <li>Clarify auction start/end times and payment deadlines.</li>
              </ul>
            </div>
          </section>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl bg-gray-50 p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Contact information</h3>
            <p className="text-sm text-gray-700 mb-2">
              Prefer to reach out directly? Our team is happy to help.
            </p>
            <p className="text-sm text-gray-700">
              Email
              {" "}
              <a href="mailto:info@gobit.com" className="text-emerald-500 underline">
                info@gobit.com
              </a>
              {" "}
              or call
              {" "}
              <span className="font-semibold">+94 77 123 4567</span>
              {" "}
              for auction information.
            </p>
          </div>

          <div className="rounded-3xl bg-gray-900 p-6 text-white">
            <h3 className="text-xl font-semibold mb-2">Tips for better answers</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-100">
              <li>Include the auction name, date, or lot ID if you know it.</li>
              <li>Mention your time zone so we can clarify schedules clearly.</li>
              <li>Let us know if you prefer email or phone follow-up.</li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}
