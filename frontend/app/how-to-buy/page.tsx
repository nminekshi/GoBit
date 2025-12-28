export default function HowToBuyPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-10 text-gray-900 md:px-12 lg:px-20">
      <header className="mb-10 max-w-3xl">
        <h1 className="text-4xl font-bold md:text-5xl mb-4">How to Buy on GoBit</h1>
        <p className="text-lg text-gray-700">
          Create your account, explore live and upcoming auctions, and place secure bids in just a few steps. This guide walks you through the full buying journey from sign-up to collecting your item.
        </p>
      </header>

      <main className="grid gap-10 lg:grid-cols-[1.5fr_minmax(0,1fr)]">
        <section className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-3">Step-by-step buying guide</h2>
            <ol className="space-y-4 rounded-3xl bg-gray-50 p-6 text-lg shadow-sm">
              <li>
                <span className="font-semibold">1. Create your GoBit account</span>
                <p className="text-base text-gray-700">
                  Sign up with your email and mobile number, then verify your details so we can keep your bids secure.
                </p>
              </li>
              <li>
                <span className="font-semibold">2. Explore auctions</span>
                <p className="text-base text-gray-700">
                  Browse categories or use search to find vehicles, electronics, real estate, watches, and more that match your interest and budget.
                </p>
              </li>
              <li>
                <span className="font-semibold">3. Review lot details</span>
                <p className="text-base text-gray-700">
                  Open the lot page to see photos, description, condition, reserve price, fees, and the remaining time before the auction closes.
                </p>
              </li>
              <li>
                <span className="font-semibold">4. Place your bid</span>
                <p className="text-base text-gray-700">
                  Enter a bid higher than the current amount and confirm. You can place multiple bids while the auction is live.
                </p>
              </li>
              <li>
                <span className="font-semibold">5. Win and confirm payment</span>
                <p className="text-base text-gray-700">
                  If you are the highest bidder when the timer ends, you will receive a confirmation with the payment deadline and next steps.
                </p>
              </li>
              <li>
                <span className="font-semibold">6. Arrange delivery or pickup</span>
                <p className="text-base text-gray-700">
                  After payment is completed, follow the instructions in your email to schedule delivery or collection with the seller.
                </p>
              </li>
            </ol>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">Tips for confident bidding</h2>
            <ul className="space-y-3 rounded-3xl bg-gray-50 p-6 text-lg shadow-sm">
              <li>Set a clear budget and stick to it when bidding.</li>
              <li>Read the full lot description and inspection notes before you bid.</li>
              <li>Use the watchlist feature to follow items you are interested in.</li>
              <li>Check auction end times so you are online when bidding closes.</li>
              <li>Review the How to Pay page to understand payment options and timelines.</li>
            </ul>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl bg-gray-900 p-6 text-white">
            <h3 className="text-xl font-semibold mb-2">Before you place a bid</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-100">
              <li>Make sure your profile details and contact number are up to date.</li>
              <li>Check buyer fees, taxes, and any additional charges shown on the lot.</li>
              <li>Ask questions through the inquiry form if anything is unclear.</li>
            </ul>
          </div>

          <div className="rounded-3xl bg-gray-50 p-6 text-gray-900">
            <h3 className="text-xl font-semibold mb-2">Need help?</h3>
            <p className="mb-3 text-base">
              Our support team can guide you through registration, bidding, and payment.
            </p>
            <p className="text-base">
              Email
              {" "}
              <a
                href="mailto:support@gobit.com"
                className="text-blue-500 underline"
              >
                support@gobit.com
              </a>
              {" "}
              or call <span className="font-semibold">+94 77 123 4567</span> for assistance.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
