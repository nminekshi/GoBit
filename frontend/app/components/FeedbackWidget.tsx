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
        <span className="font-semibold text-base mt-2 mb-2 text-center">Rate Your Experience With Us</span>
        <button
          className="px-4 py-2 bg-white text-[#075985] rounded font-semibold shadow hover:bg-gray-100 transition w-full text-xl mb-4"
          onClick={() => setShowFeedbackModal(true)}
        >
          Send feedback
        </button>
      </div>

      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4 text-[#075985]">Send Feedback</h2>
            <form onSubmit={handleFeedbackSubmit}>
              <textarea
                className="w-full h-24 p-2 border border-gray-300 rounded mb-4 text-gray-900"
                placeholder="Write your feedback here..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                required
              />
              <div className="flex justify-end gap-2">
                <button type="button" className="px-4 py-2 bg-gray-200 text-gray-700 rounded" onClick={() => setShowFeedbackModal(false)}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#075985] text-white rounded font-semibold">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
