export default function AboutPage() {
  return (
    <div className="min-h-screen w-full bg-white p-0 m-0">
      <div className="w-full bg-white p-12 text-gray-900">
        <h1 className="text-4xl font-bold mb-2">About GoBit</h1>
        <div className="text-xl text-gray-500 font-mono mb-4">Smart Deals Start Here</div>
        <div className="w-full h-96 flex justify-center items-center mb-8">
          <img src="About.png" alt="GoBit Team" className="w-full h-full object-contain rounded" />
        </div>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Our Mission</h2>
          <p className="mb-4 text-lg">To revolutionize online auctions by providing a secure, transparent, and user-friendly platform for buyers and sellers worldwide.</p>
          <h2 className="text-2xl font-bold mb-2">Our Vision</h2>
          <p className="mb-4 text-lg">Empowering people to discover unique opportunities and connect globally through innovative auction experiences.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Our Values</h2>
          <ul className="list-disc pl-8 mb-4 text-lg">
            <li>Integrity & Transparency</li>
            <li>Customer-Centric Approach</li>
            <li>Innovation & Excellence</li>
            <li>Community Empowerment</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Our Team</h2>
          <p className="mb-4 text-lg">GoBit is powered by a passionate team of auction experts, technologists, and customer support professionals dedicated to your success.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Our History</h2>
          <p className="mb-4 text-lg">Founded in 2022, GoBit has grown from a local startup to a global leader in online auctions, serving thousands of users and facilitating billions in sales.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-2">Why GoBit?</h2>
          <ul className="list-disc pl-8 mb-4 text-lg">
            <li>Global reach with local expertise</li>
            <li>Secure payment and transaction systems</li>
            <li>Comprehensive customer support</li>
            <li>Real-time auction updates</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
