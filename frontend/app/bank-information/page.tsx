export default function BankInformationPage() {
  return (
    <div className="min-h-screen bg-white p-12 text-gray-900">
      <h1 className="text-4xl font-bold mb-6">Bank Information</h1>
      <p className="mb-4 text-lg">For direct bank transfers, please request our bank details from support. All transactions are secure and confidential.</p>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Payment Options</h2>
        <ul className="list-disc pl-8 mb-4 text-lg">
          <li>Bank transfer (contact support for details)</li>
          <li>Online payment via credit/debit card</li>
          <li>Other payment methods available upon request</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Example Bank Details</h2>
        <ul className="list-none pl-8 mb-4 text-lg">
          <li><span className="font-semibold">Bank Name:</span> GoBit National Bank</li>
          <li><span className="font-semibold">Account Name:</span> GoBit Auctions Ltd</li>
          <li><span className="font-semibold">Account Number:</span> 1234567890</li>
          <li><span className="font-semibold">Branch:</span> Colombo Main</li>
          <li><span className="font-semibold">SWIFT Code:</span> GOBITLKA</li>
        </ul>
        <p className="mb-4 text-lg">Please use your Auction ID as the payment reference and email your payment slip to <a href="mailto:payments@gobit.com" className="text-blue-400 underline">payments@gobit.com</a> for confirmation.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Security & Privacy</h2>
        <p className="mb-4 text-lg">All payment transactions are protected with industry-standard encryption. Your financial information is never shared with third parties.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Payment Instructions</h2>
        <ol className="list-decimal pl-8 mb-4 text-lg">
          <li>Choose your preferred payment method</li>
          <li>Complete the payment using the provided details</li>
          <li>Send your payment confirmation to our support team</li>
          <li>Wait for verification before item shipment</li>
        </ol>
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-2">Contact Information</h2>
        <p className="mb-4 text-lg">For bank details or payment assistance, please contact <a href="mailto:payments@gobit.com" className="text-blue-400 underline">payments@gobit.com</a> or call +94 77 123 4567.</p>
      </section>
    </div>
  );
}
