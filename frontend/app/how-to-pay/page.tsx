export default function HowToPayPage() {
  return (
    <div className="min-h-screen bg-white p-12 text-gray-900">
      <h1 className="text-4xl font-bold mb-6">How to Pay</h1>
      <p className="mb-4 text-lg">Secure payment options are available including Visa, Mastercard, and Amex. Follow the instructions after winning an auction to complete your purchase safely.</p>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Payment Methods</h2>
        <ul className="list-disc pl-8 mb-4 text-lg">
          <li>Online payment via credit/debit card</li>
          <li>Direct bank transfer</li>
          <li>Contact support for other payment methods</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Payment Tips</h2>
        <ul className="list-disc pl-8 mb-4 text-lg">
          <li>Double-check payment details before submitting</li>
          <li>Keep your payment confirmation for reference</li>
          <li>Contact support if you encounter any issues</li>
        </ul>
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-2">Need Help?</h2>
        <p className="mb-4 text-lg">For payment assistance, email <a href="mailto:payments@gobit.com" className="text-blue-400 underline">payments@gobit.com</a> or call +94 77 123 4567.</p>
      </section>
    </div>
  );
}
