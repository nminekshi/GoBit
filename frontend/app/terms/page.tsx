export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-10 text-gray-900 md:px-12 lg:px-20">
      <header className="mb-10 max-w-3xl">
        <h1 className="text-4xl font-bold md:text-5xl mb-3">Terms and Conditions</h1>
        <p className="text-lg text-gray-700">
          These terms provide a simple overview of how GoBit works and what is
          expected from buyers and sellers. They are a general guide and do not
          replace any specific agreements you may sign with us.
        </p>
      </header>

      <main className="grid gap-10 lg:grid-cols-[1.5fr_minmax(0,1fr)] items-start">
        <section className="space-y-8">
          <div className="w-full h-64 md:h-72 flex justify-center items-center rounded-3xl bg-gray-50 overflow-hidden">
            <img
              src="/Terms and Conditions.png"
              alt="Terms and Conditions"
              className="h-full w-full object-contain md:object-cover"
            />
          </div>

          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Using GoBit</h2>
              <p className="text-base text-gray-700">
                By creating an account or placing a bid, you confirm that you are
                legally allowed to participate in online auctions and that the
                information you provide is true, accurate, and up to date.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">Accounts & security</h2>
              <ul className="list-disc pl-6 space-y-1 text-base text-gray-700">
                <li>You are responsible for keeping your login details secure.</li>
                <li>Notify GoBit immediately if you suspect unauthorised access.</li>
                <li>We may verify your identity before allowing certain actions.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">Bidding & purchases</h2>
              <ul className="list-disc pl-6 space-y-1 text-base text-gray-700">
                <li>Each bid you place is binding and may result in a purchase.</li>
                <li>Only bid if you intend and are able to complete the payment.</li>
                <li>Some lots may have reserve prices or special conditions.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">Payments & fees</h2>
              <ul className="list-disc pl-6 space-y-1 text-base text-gray-700">
                <li>Payments must be made within the timeframe shown on your invoice.</li>
                <li>Buyer fees, taxes, and other charges will be clearly displayed.</li>
                <li>Items may be cancelled or re‑listed if payment is not received in time.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">Prohibited behaviour</h2>
              <ul className="list-disc pl-6 space-y-1 text-base text-gray-700">
                <li>Providing false information or impersonating another person.</li>
                <li>Manipulating bids, prices, or auction outcomes.</li>
                <li>Uploading content that is illegal, offensive, or infringes rights.</li>
              </ul>
            </div>
          </section>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl bg-gray-50 p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">User responsibilities</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li>Register with accurate, up-to-date contact details.</li>
              <li>Review auction information carefully before placing a bid.</li>
              <li>Complete payment and collection within the stated deadlines.</li>
              <li>Follow any additional terms shown on individual lots.</li>
              <li>Use GoBit in line with local laws and regulations.</li>
            </ul>
          </div>

          <div className="rounded-3xl bg-gray-900 p-6 text-white">
            <h3 className="text-xl font-semibold mb-2">Disputes & support</h3>
            <p className="text-sm text-gray-100 mb-3">
              If something goes wrong, contact our support team as soon as
              possible. We aim to review disputes fairly and keep the marketplace
              safe for everyone.
            </p>
            <p className="text-sm text-gray-200 mb-1">
              Email
              {" "}
              <a href="mailto:support@gobit.com" className="text-emerald-300 underline">
                support@gobit.com
              </a>
              {" "}
              with your account details, lot ID, and a brief description of the
              issue.
            </p>
            <p className="text-xs text-gray-400 mt-3">
              This page is a simplified overview only. For any conflict, the
              most recent official terms communicated by GoBit will apply.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
