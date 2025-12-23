export default function CompanyProfilePage() {
  return (
    <div className="min-h-screen w-full bg-white p-0 m-0">
      <div className="w-full bg-white p-12 text-gray-900">
        <h1 className="text-4xl font-bold mb-2">Company Profile</h1>
        <div className="text-xl text-gray-500 font-mono mb-4">Smart Deals Start Here</div>
        <div className="w-full h-96 flex justify-center items-center mb-8">
          <img src="Company Profile.png" alt="GoBit Office" className="w-full h-full object-contain rounded" />
        </div>
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Company History</h2>
              <p className="mb-4 text-lg">Founded in 2022, GoBit has grown from a local startup to a global leader in online auctions, facilitating billions in sales and serving thousands of users.</p>
            </section>
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Leadership</h2>
              <p className="mb-4 text-lg">Our leadership team brings decades of experience in technology, business, and customer service, driving GoBit’s vision and growth.</p>
            </section>
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Milestones</h2>
              <ul className="list-disc pl-8 mb-4 text-lg">
                <li>Over 50,000 active users</li>
                <li>Billions in total sales</li>
                <li>24/7 multilingual support</li>
                <li>Expansion to 15+ countries</li>
              </ul>
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-2">Global Presence</h2>
              <p className="text-lg">GoBit operates globally, serving a diverse community of auction enthusiasts and business partners from Colombo to New York.</p>
            </section>
      </div>
    </div>
  );
}
