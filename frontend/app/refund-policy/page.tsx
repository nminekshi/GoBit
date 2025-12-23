export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen w-full bg-white p-0 m-0">
      <div className="w-full bg-white p-12 text-gray-900">
        <h1 className="text-4xl font-bold mb-2">Refund Policy</h1>
        <div className="text-xl text-gray-500 font-mono mb-4">Smart Deals Start Here</div>
        <img src="/refund.jpg" alt="Refund Policy" className="w-full h-96 object-cover rounded mb-8" />
        <p className="mb-4 text-lg">GoBit strives for customer satisfaction. If you are not satisfied with your purchase, please review our refund policy below:</p>
        <ul className="list-disc pl-8 space-y-2 mb-6 text-lg">
          <li>Refunds are processed within 7 business days of approval.</li>
          <li>Requests must be submitted within 14 days of purchase.</li>
          <li>Items must be returned in original condition.</li>
          <li>Some items may be non-refundable (see auction details).</li>
          <li>Contact our support team for assistance with your refund request.</li>
        </ul>
        <p className="mb-4 text-lg">We value your trust and aim to resolve all refund requests promptly and fairly.</p>
      </div>
    </div>
  );
}

