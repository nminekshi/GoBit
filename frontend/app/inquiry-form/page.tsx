export default function InquiryFormPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-10 text-gray-900 md:px-12 lg:px-20">
      <header className="mb-10 max-w-3xl">
        <h1 className="text-4xl font-bold md:text-5xl mb-3">Inquiry Form</h1>
        <p className="text-lg text-gray-700">
          Send us your questions about registrations, lots, payments, or
          anything else related to GoBit auctions. Our team usually responds
          within 24 hours.
        </p>
      </header>

      <main className="grid gap-10 lg:grid-cols-[1.5fr_minmax(0,1fr)] items-start">
        <section className="space-y-8">
          <div className="rounded-3xl bg-gray-50 p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Send an inquiry</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="topic">
                  Topic
                </label>
                <select
                  id="topic"
                  name="topic"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm bg-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="">Select a topic</option>
                  <option value="registration">Registration / account</option>
                  <option value="lot">Specific lot or item details</option>
                  <option value="payment">Payments / invoices</option>
                  <option value="technical">Technical issue</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="message">
                  Your question or request
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Describe how we can help you"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm resize-y focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 transition-colors"
              >
                Submit inquiry
              </button>
              <p className="text-xs text-gray-500">
                By submitting, you agree that we may contact you using the
                details provided to respond to your inquiry.
              </p>
            </form>
          </div>

          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">How it works</h2>
              <ul className="list-disc pl-6 space-y-1 text-base text-gray-700">
                <li>Send us your question with as much detail as possible.</li>
                <li>Our support team reviews your request and may contact you for more information.</li>
                <li>You receive a reply by email or phone, usually within one business day.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">Example questions</h2>
              <ul className="list-disc pl-6 space-y-1 text-base text-gray-700">
                <li>Help with registering or verifying my account.</li>
                <li>More details or photos for a specific lot.</li>
                <li>Clarification about fees, invoices, or payment deadlines.</li>
              </ul>
            </div>
          </section>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl bg-gray-50 p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">For urgent issues</h3>
            <p className="text-sm text-gray-700 mb-2">
              If your inquiry is about a payment deadline, a live auction, or
              access problems, please contact us directly.
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
              for faster help.
            </p>
          </div>

          <div className="rounded-3xl bg-gray-900 p-6 text-white">
            <h3 className="text-xl font-semibold mb-2">Tips for a quick reply</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-100">
              <li>Include your GoBit account email and phone number.</li>
              <li>Add the auction name, lot ID, or invoice number if relevant.</li>
              <li>Describe what you tried already and any error messages.</li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}
