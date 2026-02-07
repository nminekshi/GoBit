export default function FAQsPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-10 text-gray-900 md:px-12 lg:px-20">
      <header className="mb-10 max-w-3xl">
        <h1 className="text-4xl font-bold md:text-5xl mb-3">Frequently Asked Questions</h1>
        <p className="text-lg text-gray-700">
          Find quick answers about registration, bidding, payments, and more.
          This page covers the questions we hear most often from GoBit users.
        </p>
      </header>

      <main className="grid gap-10 lg:grid-cols-[1.5fr_minmax(0,1fr)] items-start">
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Getting started</h2>
            <div>
              <h3 className="text-lg font-semibold">How do I register?</h3>
              <p className="text-base text-gray-700">
                Click the Register button in the top navigation, fill in your
                basic details, and verify your email and phone number. Once
                verified, you can log in and start exploring auctions.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Do I need to verify my account?</h3>
              <p className="text-base text-gray-700">
                Yes. Verification helps us keep the marketplace safe. You may be
                asked to confirm your identity or provide additional documents
                for higher-value bidding.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Bidding & auctions</h2>
            <div>
              <h3 className="text-lg font-semibold">How do I place a bid?</h3>
              <p className="text-base text-gray-700">
                Open the lot page, enter an amount higher than the current bid,
                and confirm. You can place multiple bids while the auction is
                live. When the timer ends, the highest valid bid wins.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Can I cancel a bid?</h3>
              <p className="text-base text-gray-700">
                Bids are generally binding and cannot be cancelled once placed.
                If you believe there was a serious mistake, contact support
                immediately and we will review the case.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">What happens if I win?</h3>
              <p className="text-base text-gray-700">
                You will receive a confirmation with the final amount, fees,
                and payment deadline. Follow the How to Pay guide and arrange
                delivery or pickup as instructed.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Payments & fees</h2>
            <div>
              <h3 className="text-lg font-semibold">What payment methods are accepted?</h3>
              <p className="text-base text-gray-700">
                We typically accept card payments and bank transfers. Check the
                How to Pay page and your invoice for the methods available for
                each auction.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Are there extra fees?</h3>
              <p className="text-base text-gray-700">
                Some auctions include buyer fees, taxes, or handling charges.
                These will always be shown on the lot page or invoice before you
                complete payment.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Shipping & collection</h2>
            <div>
              <h3 className="text-lg font-semibold">How is shipping handled?</h3>
              <p className="text-base text-gray-700">
                Shipping or collection options depend on the item and seller.
                Details are listed on the lot page. In some cases you arrange
                your own transport after payment.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">When do I need to collect the item?</h3>
              <p className="text-base text-gray-700">
                Collection deadlines vary by auction. Check your invoice or
                confirmation email for the exact timeframe.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Account & security</h2>
            <div>
              <h3 className="text-lg font-semibold">I forgot my password. What should I do?</h3>
              <p className="text-base text-gray-700">
                Use the "Forgot password" option on the login page, enter your
                registered email, and follow the instructions in the reset
                link. If you do not receive an email, check your spam folder or
                contact support.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">How do I update my phone number or address?</h3>
              <p className="text-base text-gray-700">
                After logging in, go to your account/profile section and edit
                your details. Keeping this information current helps us reach
                you quickly about bids, wins, and payments.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">What if I see suspicious activity?</h3>
              <p className="text-base text-gray-700">
                Change your password immediately and contact GoBit support.
                We can help review recent activity, secure your account, and
                provide next steps.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Troubleshooting</h2>
            <div>
              <h3 className="text-lg font-semibold">My bid is not going through. Why?</h3>
              <p className="text-base text-gray-700">
                Common reasons include bidding below the minimum increment,
                network issues, or the auction already closing. Refresh the
                page, check the current bid and remaining time, and try again.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">I did not receive a confirmation email.</h3>
              <p className="text-base text-gray-700">
                First, check your spam or promotions folders. If you still
                cannot find it, ensure your email address is correct in your
                profile and then contact support so we can resend the message.
              </p>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl bg-gray-50 p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Quick tips for users</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li>Read the auction rules and lot description fully.</li>
              <li>Keep your contact and payment details up to date.</li>
              <li>Set a clear budget before you start bidding.</li>
              <li>Use the Inquiry Form if you need more information.</li>
            </ul>
          </div>

          <div className="rounded-3xl bg-gray-900 p-6 text-white">
            <h3 className="text-xl font-semibold mb-2">Still need help?</h3>
            <p className="text-sm text-gray-100 mb-2">
              Our support team is here to help with anything that is not
              covered on this page.
            </p>
            <p className="text-sm text-gray-200 mb-1">
              Email
              {" "}
              <a href="mailto:support@gobit.com" className="text-emerald-300 underline">
                support@gobit.com
              </a>
              {" "}
              or use the Inquiry Form for more detailed questions.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
