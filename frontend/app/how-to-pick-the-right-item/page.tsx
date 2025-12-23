export default function HowToPickTheRightItemPage() {
  return (
    <div className="min-h-screen bg-white p-12 text-gray-900">
      <h1 className="text-4xl font-bold mb-6">How to Pick the Right Item</h1>
      <p className="mb-4 text-lg">Use our filters, read item descriptions, and contact sellers for more details. Our team is here to help you make informed decisions.</p>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Tips for Choosing</h2>
        <ul className="list-disc pl-8 mb-4 text-lg">
          <li>Use category and price filters</li>
          <li>Read detailed item descriptions</li>
          <li>Contact sellers for additional info</li>
          <li>Ask our support team for advice</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Common Mistakes</h2>
        <ul className="list-disc pl-8 mb-4 text-lg">
          <li>Not checking item condition</li>
          <li>Missing auction deadlines</li>
          <li>Overbidding without a budget</li>
        </ul>
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-2">Need Help?</h2>
        <p className="mb-4 text-lg">For personalized advice, email <a href="mailto:support@gobit.com" className="text-blue-400 underline">support@gobit.com</a> or call +94 77 123 4567.</p>
      </section>
    </div>
  );
}
