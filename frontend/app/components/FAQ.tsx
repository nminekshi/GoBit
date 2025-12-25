"use client";
import { useState } from "react";

type FAQItem = {
  question: string;
  answer: string;
};

const items: FAQItem[] = [
  {
    question: "How do I place a bid?",
    answer:
      "Browse to an item page and click the Bid Now button. Enter your maximum bid and confirm. We’ll automatically bid on your behalf up to that amount.",
  },
  {
    question: "Do I need to verify my account?",
    answer:
      "Yes. For security, we require email verification and, for higher-value auctions, a quick identity check before you can place bids.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept major credit/debit cards, bank transfers, and supported digital wallets. Some high-value items may require bank transfer only.",
  },
  {
    question: "Are there any buyer fees?",
    answer:
      "A buyer’s premium may apply depending on the category and seller. You’ll see all fees clearly before confirming your bid.",
  },
  {
    question: "Can I cancel a bid?",
    answer:
      "Bids are binding and generally cannot be canceled. If you made a genuine mistake, contact support immediately for assistance.",
  },
  {
    question: "How are items authenticated?",
    answer:
      "Every listing goes through document verification, provenance checks, and optional third-party inspection before it goes live.",
  },
  {
    question: "What if I win but can’t pay immediately?",
    answer:
      "You’ll have a short payment window. Reach out to our support team to arrange an extension or the item may be offered to the next highest bidder.",
  },
  {
    question: "Can I see an item in person before bidding?",
    answer:
      "Many sellers allow virtual tours or scheduled previews. Submit a request on the listing page and we’ll coordinate with the seller.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="w-screen bg-gray-50 text-gray-900 px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-center text-3xl md:text-4xl font-bold mt-4">
          Frequently Asked Questions
        </h2>

        <div className="mt-10 space-y-4">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            const contentId = `faq-content-${index}`;
            const buttonId = `faq-button-${index}`;
            return (
              <div
                key={index}
                className="rounded-2xl bg-white shadow-sm border border-gray-200 overflow-hidden"
              >
                <button
                  id={buttonId}
                  aria-controls={contentId}
                  aria-expanded={isOpen}
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between gap-6 text-left px-6 py-5 hover:bg-gray-50"
                >
                  <span className="text-base md:text-lg font-semibold text-gray-900">
                    {item.question}
                  </span>
                  <span
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-700"
                    aria-hidden="true"
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <div
                  id={contentId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`px-6 transition-[max-height] duration-300 ease-in-out ${
                    isOpen ? "max-h-96 py-0 pb-5" : "max-h-0"
                  } overflow-hidden text-gray-700`}
                >
                  <p className="text-sm md:text-base leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <a
            href="/faqs"
            className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-[#2c3847] text-white font-semibold hover:bg-gray-900 transition"
          >
            View all FAQs
          </a>
        </div>
      </div>
    </section>
  );
}
