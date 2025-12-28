export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-10 text-gray-900 md:px-12 lg:px-20">
      <header className="mb-10 max-w-3xl">
        <h1 className="text-4xl font-bold md:text-5xl mb-3">Privacy Policy</h1>
        <p className="text-lg text-gray-700">
          Your privacy matters to us. This page explains, in simple language,
          what information GoBit collects, how we use it, and the choices you
          have.
        </p>
      </header>

      <main className="grid gap-10 lg:grid-cols-[1.5fr_minmax(0,1fr)] items-start">
        <section className="space-y-8">
          <div className="w-full h-64 md:h-72 flex justify-center items-center rounded-3xl bg-gray-50 overflow-hidden">
            <img
              src="/Privacy Policy.png"
              alt="Privacy Policy"
              className="h-full w-full object-contain md:object-cover"
            />
          </div>

          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Information we collect</h2>
              <p className="text-base text-gray-700 mb-2">
                We collect only the information needed to create and manage your
                account and to process auctions safely.
              </p>
              <ul className="list-disc pl-6 space-y-1 text-base text-gray-700">
                <li>Contact details such as name, email, phone number, and address.</li>
                <li>Account details like login credentials and security settings.</li>
                <li>Transaction details related to bids, payments, and invoices.</li>
                <li>Technical data such as device type, browser, and usage logs.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">How we use your data</h2>
              <ul className="list-disc pl-6 space-y-1 text-base text-gray-700">
                <li>To create and secure your GoBit account.</li>
                <li>To run auctions, process payments, and send confirmations.</li>
                <li>To detect fraud, keep the platform safe, and meet legal duties.</li>
                <li>To improve our services and provide support when you need it.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">Sharing and third parties</h2>
              <p className="text-base text-gray-700">
                We do not sell your personal data. Limited information may be
                shared with trusted partners such as payment providers, banks, or
                logistics partners when required to complete a transaction or
                comply with the law.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">Data security</h2>
              <p className="text-base text-gray-700">
                All sensitive data is protected with industry-standard
                encryption and access controls. While no system can be 100%
                secure, we continuously monitor and improve our security
                measures.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">Your rights</h2>
              <ul className="list-disc pl-6 space-y-1 text-base text-gray-700">
                <li>Request access to the personal data we hold about you.</li>
                <li>Ask us to correct inaccurate or incomplete information.</li>
                <li>Request deletion of your account where legally possible.</li>
                <li>Control the notifications and marketing messages you receive.</li>
              </ul>
            </div>
          </section>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl bg-gray-50 p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Quick summary</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li>We collect only what we need to run GoBit safely.</li>
              <li>Your personal data is not sold to advertisers.</li>
              <li>Encryption and safeguards protect your transactions.</li>
              <li>You can ask to view, update, or remove your data.</li>
            </ul>
          </div>

          <div className="rounded-3xl bg-gray-900 p-6 text-white">
            <h3 className="text-xl font-semibold mb-2">Privacy questions</h3>
            <p className="text-sm text-gray-100 mb-3">
              If you have any questions about how we handle your information,
              or if you want to exercise your privacy rights, please contact us.
            </p>
            <p className="text-sm text-gray-200 mb-1">
              Email
              {" "}
              <a href="mailto:privacy@gobit.com" className="text-emerald-300 underline">
                privacy@gobit.com
              </a>
              {" "}
              with your account email and a brief description of your request.
            </p>
            <p className="text-xs text-gray-400 mt-3">
              This page is a simplified explanation of our privacy practices.
              Where required, more detailed notices or agreements may apply.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
