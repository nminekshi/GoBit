import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-white text-gray-900">
      <div className="mx-auto flex w-full max-w-full flex-col gap-10 px-4 py-12 md:flex-row md:items-start md:px-8 lg:px-12">
        <section className="flex-1 space-y-6">
          <header>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              About GoBit
            </h1>
            <p className="mt-3 text-base font-mono text-gray-500 sm:text-lg">
              Smart Deals Start Here
            </p>
          </header>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Our Mission</h2>
            <p className="text-lg leading-relaxed text-gray-700">
              To revolutionize online auctions by providing a secure, transparent, and
              user-friendly platform for buyers and sellers worldwide.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Our Vision</h2>
            <p className="text-lg leading-relaxed text-gray-700">
              Empowering people to discover unique opportunities and connect globally
              through innovative auction experiences.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Our Values</h2>
            <ul className="list-disc space-y-1 pl-6 text-lg text-gray-700">
              <li>Integrity &amp; Transparency</li>
              <li>Customer-Centric Approach</li>
              <li>Innovation &amp; Excellence</li>
              <li>Community Empowerment</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Our Team</h2>
            <p className="text-lg leading-relaxed text-gray-700">
              GoBit is powered by a passionate team of auction experts, technologists,
              and customer support professionals dedicated to your success.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Our History</h2>
            <p className="text-lg leading-relaxed text-gray-700">
              Founded in 2022, GoBit has grown from a local startup to a global leader
              in online auctions, serving thousands of users and facilitating
              significant sales volume across a wide range of categories.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Why GoBit?</h2>
            <ul className="list-disc space-y-1 pl-6 text-lg text-gray-700">
              <li>Global reach with local expertise</li>
              <li>Secure payment and transaction systems</li>
              <li>Comprehensive customer support</li>
              <li>Real-time auction updates</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">How GoBit Works</h2>
            <p className="text-lg leading-relaxed text-gray-700">
              Create your account in a few simple steps, explore verified listings, and
              place real-time bids from any device. Our platform handles the complex
              parts&mdash;from fair bidding rules to payment workflows&mdash;so you can
              focus on finding the right opportunity.
            </p>
            <ul className="list-disc space-y-1 pl-6 text-gray-700">
              <li>Browse curated auctions by category, value, and closing time.</li>
              <li>Follow your favorite items and receive instant bid updates.</li>
              <li>Complete your purchase securely once the auction ends.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">For Buyers &amp; Sellers</h2>
            <p className="text-lg leading-relaxed text-gray-700">
              Whether you are discovering hidden gems or unlocking value from your own
              assets, GoBit is designed to support every step of the journey.
            </p>
            <div className="grid gap-4 text-gray-700 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="mb-1 text-lg font-semibold">For Buyers</h3>
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  <li>Transparent bidding and final prices</li>
                  <li>Verified sellers and item details</li>
                  <li>Real-time notifications on bids and wins</li>
                </ul>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="mb-1 text-lg font-semibold">For Sellers</h3>
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  <li>Simple listing tools and category guidance</li>
                  <li>Dynamic bidding to maximize final value</li>
                  <li>Analytics that help you understand demand</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Trust &amp; Security</h2>
            <p className="text-lg leading-relaxed text-gray-700">
              Safety is at the core of everything we build. We continuously monitor
              activity on the platform, protect your data with industry-standard
              security practices, and provide clear policies so you always know what to
              expect.
            </p>
            <ul className="list-disc space-y-1 pl-6 text-gray-700">
              <li>Protected transactions and secure payment gateways</li>
              <li>Strict verification and review processes for suspicious activity</li>
              <li>Dedicated support team to help resolve any issues</li>
            </ul>
          </section>
        </section>

        <aside className="flex-1 space-y-4">
          <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:h-80 md:h-[420px]">
            <Image
              src="/im.png"
              alt="GoBit platform illustration"
              fill
              priority
              className="object-cover object-center"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/40 via-slate-900/10 to-transparent" />
            <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex flex-col gap-1 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
                Trusted Auction Platform
              </p>
              <p className="max-w-xs text-sm text-slate-100">
                Connecting buyers and sellers through secure, real-time digital auctions
                across multiple categories and regions.
              </p>
            </div>
          </div>

          <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:h-80">
            <Image
              src="/a.png"
              alt="GoBit auction categories overview"
              fill
              className="object-cover object-center"
            />
          </div>
        </aside>
      </div>
    </main>
  );
}
