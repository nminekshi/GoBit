export default function HowToBuyPage() {
  return (
    <div className="min-h-screen bg-white p-12 text-gray-900">
      <h1 className="text-4xl font-bold mb-6">How to Buy</h1>
      <p className="mb-4 text-lg">Register, browse auctions, place your bid, and win! Our platform guides you through every step for a seamless buying experience.</p>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Step-by-Step Guide</h2>
        <ol className="list-decimal pl-8 mb-4 text-lg">
          <li>Create an account</li>
          <li>Browse available auctions</li>
          <li>Place your bid</li>
          <li>Win and complete your purchase</li>
        </ol>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Tips for Buyers</h2>
        <ul className="list-disc pl-8 mb-4 text-lg">
          <li>Set a budget before bidding</li>
          <li>Read item descriptions carefully</li>
          <li>Contact support if you have questions</li>
        </ul>
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-2">Need Help?</h2>
        <p className="mb-4 text-lg">Contact our support team at <a href="mailto:support@gobit.com" className="text-blue-400 underline">support@gobit.com</a> for assistance with buying or bidding.</p>
      </section>
    </div>
  );
}
