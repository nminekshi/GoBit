export default function PrivacyPage() {
  return (
    <div className="min-h-screen w-full bg-white p-0 m-0">
      <div className="w-full bg-white p-12 text-gray-900">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <div className="text-xl text-gray-500 font-mono mb-4">Smart Deals Start Here</div>
        <div className="w-full h-96 flex justify-center items-center mb-8">
          <img src="Privacy Policy.png" alt="Privacy Policy" className="w-full h-full object-contain rounded" />
        </div>
        <p className="mb-4 text-lg">Your privacy is important to us. GoBit is committed to protecting your personal information and ensuring transparency in how we use your data.</p>
        <ul className="list-disc pl-8 space-y-2 mb-6 text-lg">
          <li>We collect only necessary information for account creation and transactions.</li>
          <li>Your data is never sold to third parties.</li>
          <li>All transactions are secured with industry-standard encryption.</li>
          <li>You can request to view, update, or delete your data at any time.</li>
        </ul>
        <p className="mb-4 text-lg">For questions about our privacy practices, please contact privacy@gobit.com.</p>
      </div>
    </div>
  );
}
