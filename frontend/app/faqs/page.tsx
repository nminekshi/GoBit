export default function FAQsPage() {
  return (
    <div className="min-h-screen bg-white p-12 text-gray-900">
      <h1 className="text-4xl font-bold mb-6">FAQs</h1>
      <p className="mb-4 text-lg">Find answers to common questions about registration, bidding, payments, and shipping in our comprehensive FAQ section.</p>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Popular Questions</h2>
        <ul className="list-disc pl-8 mb-4 text-lg">
          <li>How do I register?</li>
          <li>How do I place a bid?</li>
          <li>What payment methods are accepted?</li>
          <li>How is shipping handled?</li>
          <li>How do I contact support?</li>
          <li>Can I cancel a bid?</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Tips for Users</h2>
        <ul className="list-disc pl-8 mb-4 text-lg">
          <li>Read all auction rules before bidding</li>
          <li>Keep your account information up to date</li>
          <li>Contact support for any issues</li>
        </ul>
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-2">Need More Help?</h2>
        <p className="mb-4 text-lg">Contact our support team at <a href="mailto:support@gobit.com" className="text-blue-400 underline">support@gobit.com</a> for any other questions.</p>
      </section>
    </div>
  );
}
