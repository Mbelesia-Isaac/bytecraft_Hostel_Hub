export const metadata = {
  title: "Terms of Service — Hostel Platform",
  description: "The rules for using Hostel Platform as a seeker, landlord, or admin.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#EEF2F4] px-6 py-10">
      <div className="max-w-2xl mx-auto bg-white border border-[#D3DCE0] rounded-xl p-8">
        <h1 className="text-2xl font-semibold text-[#142430] mb-2">Terms of service</h1>
        <p className="text-sm text-gray-500 mb-6">Last updated: 8 July 2026</p>

        <div className="space-y-6 text-[#142430] text-sm leading-relaxed">
          <section>
            <h2 className="font-semibold text-base mb-2">1. Using the platform</h2>
            <p>
              By creating an account, you agree to these terms. You must be
              able to enter a legally binding agreement to list or rent a
              property in Kenya to use this platform for those purposes.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">2. For landlords</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Listings must accurately describe the property, price, and location.</li>
              <li>Every listing is reviewed before it becomes visible to seekers. We may reject a listing that appears misleading, duplicated, or fraudulent.</li>
              <li>You must mark a listing as taken once it is no longer available.</li>
              <li>We may remove a listing at any time if it receives credible reports of fraud or misconduct.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">3. For seekers</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>We do our best to verify listings before approval, but we cannot guarantee every detail is accurate. Always inspect a property in person before making any payment.</li>
              <li>Never send money to a landlord before viewing the property. We are not responsible for payments made directly between you and a landlord.</li>
              <li>Report any listing that seems fraudulent or misleading using the report feature.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">4. Account suspension</h2>
            <p>
              We may suspend or remove an account that repeatedly submits
              fraudulent listings, sends abusive messages, or misuses the
              reporting feature.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">5. No liability for transactions</h2>
            <p>
              Hostel Platform is a marketplace connecting seekers and
              landlords. We are not a party to any rental agreement or
              payment made between users, and we are not liable for disputes
              arising from them.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">6. Changes to these terms</h2>
            <p>
              We may update these terms as the platform grows. Continued use
              of the platform after a change means you accept the updated
              terms.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">7. Contact</h2>
            <p>
              Questions about these terms can be sent to{" "}
              <a href="mailto:support@example.com" className="text-[#2568A8] underline">
                support@example.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
