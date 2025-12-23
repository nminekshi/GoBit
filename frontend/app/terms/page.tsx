export default function TermsPage() {
  return (
    <div className="min-h-screen w-full bg-white p-0 m-0">
      <div className="w-full bg-white p-12 text-gray-900">
        <h1 className="text-4xl font-bold mb-2">Terms and Conditions</h1>
        <div className="text-xl text-gray-500 font-mono mb-4">Smart Deals Start Here</div>
        <div className="w-full h-96 flex justify-center items-center mb-8">
              <img src="Terms and Conditions.png" alt="Terms and Conditions" className="w-full h-96 object-contain rounded mb-8" />
            </div>
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Legal Notes</h2>
              <p className="mb-4 text-lg">By using GoBit, you agree to our terms and conditions. Please read them carefully before participating in any auction or using our services.</p>
            </section>
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-2">User Responsibilities</h2>
              <ul className="list-disc pl-8 space-y-2 mb-6 text-lg">
                <li>All users must register and provide accurate information.</li>
                <li>Bids are binding and cannot be withdrawn.</li>
                <li>Payments must be made within the specified timeframe.</li>
                <li>GoBit reserves the right to suspend accounts for violations.</li>
                <li>All transactions are subject to verification and approval.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-2">Dispute Resolution</h2>
              <p className="mb-4 text-lg">For any disputes, please contact our support team. We are committed to maintaining a safe and fair auction environment for all users and will work to resolve issues promptly.</p>
            </section>
      </div>
    </div>
  );
}
