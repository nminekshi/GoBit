export default function CareersPage() {
  return (
    <div className="min-h-screen w-full bg-white p-0 m-0">
      <div className="w-full bg-white p-12 text-gray-900">
        <h1 className="text-4xl font-bold mb-2">Careers at GoBit</h1>
        <div className="text-xl text-gray-500 font-mono mb-4">Smart Deals Start Here</div>
        <div className="w-full h-96 flex justify-center items-center mb-8">
            <img src="Careers.png" alt="Careers at GoBit" className="w-full h-96 object-contain rounded mb-8" />
        </div>
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Our Culture</h2>
              <p className="mb-4 text-lg">We foster an inclusive, collaborative, and innovative work environment where every team member is valued and empowered.</p>
            </section>
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Benefits</h2>
              <ul className="list-disc pl-8 mb-4 text-lg">
                <li>Competitive salaries and benefits</li>
                <li>Opportunities for growth and advancement</li>
                <li>Remote and flexible work options</li>
                <li>Health and wellness programs</li>
              </ul>
            </section>
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Open Positions</h2>
              <ul className="list-disc pl-8 mb-4 text-lg">
                <li>Software Engineer</li>
                <li>Product Manager</li>
                <li>Customer Support Specialist</li>
                <li>Marketing Coordinator</li>
              </ul>
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-2">Application Process</h2>
              <p className="text-lg">Send your CV to <a href="mailto:careers@gobit.com" className="text-blue-400 underline">careers@gobit.com</a> to apply. We look forward to hearing from you!</p>
            </section>
      </div>
    </div>
  );
}
