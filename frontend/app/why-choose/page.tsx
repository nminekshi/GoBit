export default function WhyChoosePage() {
  return (
    <div className="min-h-screen w-full bg-white p-0 m-0">
      <div className="w-full bg-white p-12 text-gray-900">
        <h1 className="text-4xl font-bold mb-2">Why Choose GoBit</h1>
        <div className="text-xl text-gray-500 font-mono mb-4">Smart Deals Start Here</div>
        <div className="w-full h-96 flex justify-center items-center mb-8">
          <img src="Why.png" alt="Why Choose GoBit" className="w-full h-full object-contain rounded" />
        </div>
        <ul className="list-disc pl-8 space-y-2 mb-6 text-lg">
          <li>Trusted by thousands of users worldwide</li>
          <li>Secure and transparent bidding process</li>
          <li>Wide range of categories and products</li>
          <li>24/7 customer support</li>
          <li>Easy-to-use mobile and web platforms</li>
          <li>Real-time auction updates and notifications</li>
          <li>Expert advice and resources for buyers and sellers</li>
        </ul>
        <p className="mb-4 text-lg">GoBit stands out for its commitment to user satisfaction, innovation, and security. Our platform is designed to make online auctions accessible, enjoyable, and rewarding for everyone.</p>
        <p className="text-lg">Join GoBit today and experience the difference!</p>
      </div>
    </div>
  );
}
