export default function CompanyProfilePage() {
  return (
    <div className="min-h-screen bg-white px-6 py-10 text-gray-900 md:px-12 lg:px-20">
      <header className="mb-10 max-w-3xl">
        <h1 className="text-4xl font-bold md:text-5xl mb-3">Company Profile</h1>
        <p className="text-lg text-gray-700">
          GoBit is a technology-driven auction platform built in Sri Lanka and
          trusted by buyers and sellers around the world. We connect real
          inventory with real people through fair, transparent online auctions.
        </p>
      </header>

      <main className="grid gap-10 lg:grid-cols-[1.5fr_minmax(0,1fr)] items-start">
        <section className="space-y-8">
          <div className="w-full h-72 md:h-80 flex justify-center items-center rounded-3xl bg-gray-50 overflow-hidden">
            <img
              src="/Company Profile.png"
              alt="GoBit Office"
              className="h-full w-full object-contain md:object-cover"
            />
          </div>

          <section className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Our story</h2>
              <p className="text-base text-gray-700">
                Founded in 2022, GoBit started as a small team passionate about
                making auctions simpler and more trustworthy. Today, we support
                thousands of users and handle high-value transactions across
                multiple categories every day.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">What we do</h2>
              <p className="text-base text-gray-700">
                GoBit connects buyers and sellers through timed and live online
                auctions. From cars and property to electronics and collectibles,
                we provide the tools to list items, verify documents, manage
                payments, and arrange delivery in one streamlined flow.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">Leadership</h2>
              <p className="text-base text-gray-700">
                Our leadership team blends experience in fintech, engineering,
                and customer experience. Their focus is simple: build tools that
                feel powerful for experts and approachable for first‑time
                bidders.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">Milestones</h2>
              <ul className="list-disc pl-6 space-y-1 text-base text-gray-700">
                <li>50,000+ registered users and growing each month.</li>
                <li>Billions of LKR in total auction volume.</li>
                <li>24/7 multilingual support channels for our community.</li>
                <li>Expansion from Colombo to 15+ international markets.</li>
                <li>Launch of mobile-first experience for on-the-go bidding.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">Global presence</h2>
              <p className="text-base text-gray-700">
                From local dealers to international buyers, GoBit connects
                participants across time zones. Our infrastructure is built to
                handle cross-border interest while keeping compliance and
                security at the center.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">Technology & security</h2>
              <p className="text-base text-gray-700">
                We invest heavily in infrastructure, fraud monitoring, and data
                protection. Encrypted payments, audited processes, and
                continuous monitoring help keep every transaction as safe as
                possible for both buyers and sellers.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">Our values</h2>
              <ul className="list-disc pl-6 space-y-1 text-base text-gray-700">
                <li><span className="font-semibold">Transparency</span> – clear fees, clear timelines, and no hidden steps.</li>
                <li><span className="font-semibold">Trust</span> – verified users, reviewed listings, and responsive support.</li>
                <li><span className="font-semibold">Accessibility</span> – tools that work for first-time bidders and experts alike.</li>
                <li><span className="font-semibold">Innovation</span> – constantly improving the auction experience with new features.</li>
              </ul>
            </div>
          </section>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl bg-gray-50 p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">At a glance</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li>Headquarters: Colombo, Sri Lanka.</li>
              <li>Coverage: 15+ countries across Asia, Europe, and beyond.</li>
              <li>Categories: vehicles, real estate, electronics, luxury items, and more.</li>
              <li>Mission: make trusted auctions accessible to everyone.</li>
            </ul>
          </div>

          <div className="rounded-3xl bg-emerald-500 p-6 text-slate-950 shadow-lg shadow-emerald-500/30">
            <h3 className="text-xl font-semibold mb-2">Our promise</h3>
            <p className="text-base mb-3">
              We are committed to transparency, safety, and support at every
              step of the auction journey – from listing and bidding to payment
              and collection.
            </p>
            <p className="text-sm font-medium">
              Have questions about partnering with GoBit? Reach out through our
              inquiry form and our team will get in touch.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
