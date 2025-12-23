export default function AuctionInformationRequestPage() {
  return (
    <div className="min-h-screen bg-white p-12 text-gray-900">
      <h1 className="text-4xl font-bold mb-6">Auction Information Request</h1>
      <p className="mb-4 text-lg">Get detailed information about upcoming auctions, item listings, and bidding procedures by contacting us.</p>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">What You Can Request</h2>
        <ul className="list-disc pl-8 mb-4 text-lg">
          <li>Upcoming auction schedules</li>
          <li>Item details and descriptions</li>
          <li>Bidding rules and procedures</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Example Requests</h2>
        <ul className="list-disc pl-8 mb-4 text-lg">
          <li>Request a catalog for the next auction</li>
          <li>Ask for item condition reports</li>
          <li>Clarify auction start/end times</li>
        </ul>
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-2">Contact Information</h2>
        <p className="mb-4 text-lg">For more information, email <a href="mailto:info@gobit.com" className="text-blue-400 underline">info@gobit.com</a> or call +94 77 123 4567.</p>
      </section>
    </div>
  );
}
