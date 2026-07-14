export default function LandlordPendingPage() {
  return (
    <main className="min-h-screen bg-[#EEF2F4] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md bg-white border border-[#D3DCE0] rounded-xl p-8 text-center">
        <div
          style={{ transform: "rotate(-6deg)" }}
          className="inline-block border-2 border-[#E2A63B] text-[#E2A63B] font-mono text-xs font-bold tracking-wide px-3 py-1 rounded mb-4"
        >
          PENDING REVIEW
        </div>
        <h1 className="text-xl font-semibold text-[#142430] mb-2">
          Your landlord account is under review
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          We manually review new landlord accounts to keep listings trustworthy
          for seekers. This usually takes less than a day. We&apos;ll let you
          know once you&apos;re approved and can start listing properties.
        </p>
        <a href="/" className="inline-block bg-[#2568A8] text-white text-sm font-medium rounded-md px-4 py-2">
          Back to homepage
        </a>
      </div>
    </main>
  );
}
