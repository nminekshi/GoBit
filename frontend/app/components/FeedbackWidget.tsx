"use client";
import React, { useState } from "react";

export default function FeedbackWidget() {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Replace alert with an API call
    setShowFeedbackModal(false);
    setFeedbackText("");
    alert("Thank you for your feedback!");
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center">
        <span className="font-semibold text-lg mt-2 mb-2 text-center text-slate-100">
          Rate your experience with us
        </span>
        <button
          className="px-4 py-2 bg-white text-[#075985] rounded-lg font-semibold shadow-md hover:bg-slate-100 transition w-full text-base md:text-lg mb-4"
          onClick={() => setShowFeedbackModal(true)}
        >
          Send Feedback
        </button>
      </div>

      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 text-[#075985]">Send Feedback</h2>
            <form onSubmit={handleFeedbackSubmit}>
              <textarea
                className="w-full h-28 p-3 border border-gray-300 rounded-lg mb-4 text-gray-900 text-base resize-none focus:outline-none focus:ring-2 focus:ring-[#075985] focus:border-[#075985]"
                placeholder="Write your feedback here..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-700 text-sm md:text-base hover:bg-gray-200 transition"
                  onClick={() => setShowFeedbackModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#075985] text-white text-sm md:text-base font-semibold shadow hover:bg-[#0b6a9a] transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
