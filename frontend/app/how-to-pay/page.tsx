export default function HowToPayPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-10 text-gray-900 md:px-12 lg:px-20">
      <header className="mb-10 max-w-3xl">
        <h1 className="text-4xl font-bold md:text-5xl mb-4">How to Pay</h1>
        <p className="text-lg text-gray-700">
          After you win an auction, GoBit guides you through a simple and secure payment flow. Use your preferred method, follow the on-screen steps, and keep your receipt for delivery or pickup.
        </p>
      </header>

      <main className="grid gap-10 lg:grid-cols-[1.5fr_minmax(0,1fr)]">
        <section className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-3">Step-by-step payment process</h2>
            <ol className="space-y-4 rounded-3xl bg-gray-50 p-6 text-lg shadow-sm">
              <li>
                <span className="font-semibold">1. Check your invoice</span>
                <p className="text-base text-gray-700">
                  Once you win, we email you an invoice with the final amount, buyer fees, taxes, and the payment deadline.
                </p>
              </li>
              <li>
                <span className="font-semibold">2. Choose a payment method</span>
                <p className="text-base text-gray-700">
                  On the payment screen, select card payment or bank transfer and review the summary before you continue.
                </p>
              </li>
              <li>
                <span className="font-semibold">3. Complete the payment</span>
                <p className="text-base text-gray-700">
                  Enter your details on the secure gateway, confirm the amount, and approve any one-time passwords (OTP) sent by your bank.
                </p>
              </li>
              <li>
                <span className="font-semibold">4. Receive confirmation</span>
                <p className="text-base text-gray-700">
                  You will see an on-screen success message and receive a confirmation email or SMS once your payment is verified.
                </p>
              </li>
              <li>
                <span className="font-semibold">5. Arrange delivery or pickup</span>
                <p className="text-base text-gray-700">
                  Follow the instructions in your confirmation to schedule delivery, collection, or transfer of ownership with the seller.
                </p>
              </li>
            </ol>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">Payment methods we support</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl bg-gray-50 p-5 text-base shadow-sm">
                <h3 className="text-xl font-semibold mb-2">Card payments</h3>
                <p className="text-gray-700 mb-2">
                  Pay instantly with Visa, Mastercard, or Amex using our PCI-compliant payment gateway.
                </p>
                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                  <li>Best for quick settlement and smaller items.</li>
                  <li>Card details are encrypted and never stored in plain text.</li>
                  <li>3D Secure / OTP verification may be required by your bank.</li>
                </ul>
              </div>

              <div className="rounded-3xl bg-gray-50 p-5 text-base shadow-sm">
                <h3 className="text-xl font-semibold mb-2">Bank transfer</h3>
                <p className="text-gray-700 mb-2">
                  Transfer funds directly to our verified bank account using the reference shown on your invoice.
                </p>
                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                  <li>Suitable for higher-value items and larger orders.</li>
                  <li>Processing times can take 1–2 business days depending on your bank.</li>
                  <li>Upload or share the transfer slip so we can confirm faster.</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">Smart payment tips</h2>
            <ul className="space-y-3 rounded-3xl bg-gray-50 p-6 text-lg shadow-sm">
              <li>Always double-check the amount and item details before you confirm payment.</li>
              <li>Use a card or account that supports online transactions and has enough available limit.</li>
              <li>Keep copies of your invoice, bank slips, and confirmation emails for your records.</li>
              <li>If a payment fails, wait a few minutes before trying again to avoid duplicate charges.</li>
              <li>Contact your bank if you see any security prompts or blocked transactions.</li>
            </ul>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl bg-gray-900 p-6 text-white">
            <h3 className="text-xl font-semibold mb-2">Payment deadlines</h3>
            <p className="text-sm text-gray-100 mb-2">
              Each auction has a specific payment window, usually 24–72 hours after you win.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-100">
              <li>Pay within the deadline to avoid late fees or cancellation.</li>
              <li>Check your invoice for the exact due date and time.</li>
              <li>Let us know early if you expect a delay due to bank processing.</li>
            </ul>
          </div>

          <div className="rounded-3xl bg-gray-50 p-6 text-gray-900">
            <h3 className="text-xl font-semibold mb-2">Need payment help?</h3>
            <p className="mb-3 text-base">
              Our payments desk can help with failed transactions, bank transfers, and receipts.
            </p>
            <p className="text-base mb-1">
              Email
              {" "}
              <a href="mailto:payments@gobit.com" className="text-blue-500 underline">
                payments@gobit.com
              </a>
              {" "}
              or call <span className="font-semibold">+94 77 123 4567</span>.
            </p>
            <p className="text-sm text-gray-600">
              Please include your invoice number and auction lot ID so we can assist you faster.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
