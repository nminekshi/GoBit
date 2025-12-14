export default function InquiryFormPage() {
  return (
    <div className="min-h-screen bg-white p-12 text-gray-900">
      <h1 className="text-4xl font-bold mb-6">Inquiry Form</h1>
      <p className="mb-4 text-lg">Submit your questions or requests directly to our support team for quick assistance with any auction-related matter.</p>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">How It Works</h2>
        <ul className="list-disc pl-8 mb-4 text-lg">
          <li>Fill out the inquiry form with your question or request</li>
          <li>Our support team will review and respond promptly (usually within 24 hours)</li>
          <li>All inquiries are confidential and handled with care</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Example Questions</h2>
        <ul className="list-disc pl-8 mb-4 text-lg">
          <li>How do I register for an auction?</li>
          <li>Can I get more details about a specific item?</li>
          <li>What are the payment options?</li>
        </ul>
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-2">Contact Information</h2>
        <p className="mb-4 text-lg">For urgent inquiries, email <a href="mailto:support@gobit.com" className="text-blue-400 underline">support@gobit.com</a> or call +94 77 123 4567.</p>
      </section>
    </div>
  );
}
