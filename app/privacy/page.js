export const metadata = {
  title: "Privacy Policy — Hostel Platform",
  description: "How Hostel Platform collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#EEF2F4] px-6 py-10">
      <div className="max-w-2xl mx-auto bg-white border border-[#D3DCE0] rounded-xl p-8">
        <h1 className="text-2xl font-semibold text-[#142430] mb-2">Privacy policy</h1>
        <p className="text-sm text-gray-500 mb-6">Last updated: 8 July 2026</p>

        <div className="space-y-6 text-[#142430] text-sm leading-relaxed">
          <section>
            <h2 className="font-semibold text-base mb-2">1. Who we are</h2>
            <p>
              Hostel Platform ("we", "us") helps people find and list rental
              housing, including student hostels and bedsitters, in Kenya. This
              policy explains what personal data we collect, why, and what
              rights you have over it, in line with Kenya's Data Protection
              Act, 2019.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">2. What we collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Full name, email address, and phone number when you create an account.</li>
              <li>Your account role (seeker, landlord, or admin).</li>
              <li>Listing details you submit if you are a landlord, including property location, price, and photos.</li>
              <li>Messages you send when contacting a landlord through the platform.</li>
              <li>Reports you file about a listing, and reviews you leave.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">3. Why we collect it</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To create and secure your account, including verifying your identity.</li>
              <li>To let seekers find listings and contact landlords directly.</li>
              <li>To review and approve listings before they go live, for the safety of everyone using the platform.</li>
              <li>To investigate reports of fraudulent or misleading listings.</li>
              <li>To send you account-related notifications, such as listing approval status.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">4. Who can see your data</h2>
            <p>
              Your phone number is shared with a seeker only after they choose
              to contact you about your listing. Your name may be visible to
              admins reviewing listings or reports. We do not sell your data
              to third parties or use it for advertising.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">5. How long we keep it</h2>
            <p>
              We keep account and listing data for as long as your account is
              active. If you delete your account, we remove your personal
              details within 30 days, except where we are required to keep
              records for legal or safety reasons (for example, an open fraud
              report involving your account).
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">6. Your rights</h2>
            <p>
              You can ask us to show you the personal data we hold about you,
              correct it, or delete it. To make a request, contact us at{" "}
              <a href="mailto:privacy@example.com" className="text-[#2568A8] underline">
                privacy@example.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">7. Changes to this policy</h2>
            <p>
              We may update this policy as the platform grows. We will post
              the date of the latest change at the top of this page.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
