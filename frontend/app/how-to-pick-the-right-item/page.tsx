export default function HowToPickTheRightItemPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-10 text-gray-900 md:px-12 lg:px-20">
      <header className="mb-10 max-w-3xl">
        <h1 className="text-4xl font-bold md:text-5xl mb-3">How to Pick the Right Item</h1>
        <p className="text-lg text-gray-700">
          Find the item that truly matches your needs and budget by reviewing
          details carefully, using filters wisely, and asking questions before
          you bid.
        </p>
      </header>

      <main className="grid gap-10 lg:grid-cols-[1.5fr_minmax(0,1fr)] items-start">
        <section className="space-y-8">
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Smart ways to choose</h2>
              <ul className="list-disc pl-6 space-y-1 text-base text-gray-700">
                <li>Use category, price, and location filters to narrow results.</li>
                <li>Open the lot page and read the full description and notes.</li>
                <li>Check all available photos and documents (reports, certificates, etc.).</li>
                <li>Compare similar items that have sold recently on GoBit.</li>
                <li>Ask the seller or GoBit support if anything is unclear.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">Key things to review</h2>
              <ul className="list-disc pl-6 space-y-1 text-base text-gray-700">
                <li>Item condition, age, mileage, or usage history.</li>
                <li>Included accessories, documents, or warranties.</li>
                <li>Any mentioned defects, missing parts, or "as is" notes.</li>
                <li>Buyer fees, taxes, and estimated total cost.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Common mistakes to avoid</h2>
              <ul className="list-disc pl-6 space-y-1 text-base text-gray-700">
                <li>Skipping the inspection report or photos.</li>
                <li>Bidding without a clear maximum budget.</li>
                <li>Ignoring collection or delivery timeframes and costs.</li>
                <li>Waiting until the last seconds without understanding the rules.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">Build your checklist</h2>
              <p className="text-base text-gray-700 mb-2">
                Before you bid, run through a quick checklist so you feel
                confident about your choice.
              </p>
              <ul className="list-disc pl-6 space-y-1 text-base text-gray-700">
                <li>The item matches my needs and budget.</li>
                <li>I understand the condition and any known issues.</li>
                <li>I know the total cost (item price + fees + taxes).</li>
                <li>I can pay and collect within the required timeframe.</li>
              </ul>
            </div>
          </section>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl bg-gray-50 p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Need help deciding?</h3>
            <p className="text-sm text-gray-700 mb-2">
              Our team can walk you through lot details, fees, and timelines so
              you can make a more informed choice.
            </p>
            <p className="text-sm text-gray-700">
              Email
              {" "}
              <a href="mailto:support@gobit.com" className="text-emerald-500 underline">
                support@gobit.com
              </a>
              {" "}
              or call
              {" "}
              <span className="font-semibold">+94 77 123 4567</span>
              {" "}
              for guidance before you bid.
            </p>
          </div>

          <div className="rounded-3xl bg-gray-900 p-6 text-white">
            <h3 className="text-xl font-semibold mb-2">Helpful guides</h3>
            <p className="text-sm text-gray-100 mb-2">
              Use our other guides to understand the full journey:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-100">
              <li>How to Buy – step-by-step bidding process.</li>
              <li>How to Pay – payment options and deadlines.</li>
              <li>Inquiry Form – ask specific questions about any lot.</li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}
