export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-10 text-gray-900 md:px-12 lg:px-20">
      <header className="mb-10 max-w-3xl">
        <h1 className="text-4xl font-bold md:text-5xl mb-3">Careers at GoBit</h1>
        <p className="text-lg text-gray-700">
          Join a team that is reshaping how people buy and sell through online
          auctions. We blend technology, design, and customer care to build a
          marketplace that people trust.
        </p>
      </header>

      <main className="grid gap-10 lg:grid-cols-[1.5fr_minmax(0,1fr)] items-start">
        <section className="space-y-8">
          <div className="w-full h-64 md:h-72 flex justify-center items-center rounded-3xl bg-gray-50 overflow-hidden">
            <img
              src="/Careers.png"
              alt="Careers at GoBit"
              className="h-full w-full object-contain md:object-cover"
            />
          </div>

          <section className="space-y-7">
            <div>
              <h2 className="text-2xl font-bold mb-2">Our culture</h2>
              <p className="text-base text-gray-700">
                We foster an inclusive, collaborative environment where ideas
                can come from anywhere. You will work closely with engineers,
                designers, and business teams who care deeply about solving
                problems for our users.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">How we work</h2>
              <ul className="list-disc pl-6 space-y-1 text-base text-gray-700">
                <li>Hybrid-friendly setup with remote and on‑site options.</li>
                <li>Small, focused teams that ship iteratively.</li>
                <li>Regular feedback, learning sessions, and internal demos.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">Benefits</h2>
              <ul className="list-disc pl-6 space-y-1 text-base text-gray-700">
                <li>Competitive salaries and performance-linked bonuses.</li>
                <li>Clear growth paths, mentorship, and training support.</li>
                <li>Flexible hours and remote work opportunities.</li>
                <li>Health, wellness, and work-life balance initiatives.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">Teams hiring</h2>
              <ul className="list-disc pl-6 space-y-1 text-base text-gray-700">
                <li>Product & Engineering – building the GoBit platform.</li>
                <li>Operations – keeping auctions and logistics running smoothly.</li>
                <li>Customer Support – helping users succeed at every step.</li>
                <li>Marketing & Growth – telling the GoBit story to the world.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">Sample open roles</h2>
              <ul className="list-disc pl-6 space-y-1 text-base text-gray-700">
                <li>Software Engineer (Frontend / Backend / Full‑stack)</li>
                <li>Product Manager</li>
                <li>Customer Support Specialist</li>
                <li>Marketing Coordinator</li>
              </ul>
            </div>
          </section>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl bg-gray-50 p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Why join GoBit?</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li>Real impact on a product used by thousands of people.</li>
              <li>Ownership over meaningful projects, not just busywork.</li>
              <li>Supportive teammates who want you to grow.</li>
            </ul>
          </div>

          <div className="rounded-3xl bg-emerald-500 p-6 text-slate-950 shadow-lg shadow-emerald-500/30">
            <h3 className="text-xl font-semibold mb-2">How to apply</h3>
            <p className="text-base mb-3">
              Send your CV and a short note about why you would like to work at
              GoBit.
            </p>
            <p className="text-sm mb-3">
              Email
              {" "}
              <a href="mailto:careers@gobit.com" className="font-semibold underline">
                careers@gobit.com
              </a>
              {" "}
              with your preferred role in the subject line.
            </p>
            <p className="text-xs font-medium">
              We review every application and will contact you if there is a
              strong match. Even if you do not see the perfect role listed,
              feel free to reach out.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
