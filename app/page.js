import { prisma } from "@/lib/prisma";
import ListingCard from "@/components/ListingCard";

export default async function HomePage({ searchParams }) {
  const params = await searchParams;
  const county = params?.county || "";
  const propertyType = params?.type || "";

  const listings = await prisma.listing.findMany({
    where: {
      status: "APPROVED",
      ...(county ? { county: { equals: county, mode: "insensitive" } } : {}),
      ...(propertyType ? { propertyType } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { photos: true },
    take: 20,
  });

  return (
    <main className="min-h-screen bg-[#EEF2F4] px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-semibold text-[#142430]">
            Find your next hostel or bedsitter
          </h1>
          <div className="flex gap-3 text-sm">
            <a href="/saved" className="text-[#2568A8] underline">Saved</a>
            <a href="/login" className="text-[#2568A8] underline">Log in</a>
          </div>
        </div>
        <p className="text-gray-600 mb-6">Verified listings near your campus.</p>

        <form className="flex flex-wrap gap-3 mb-8" method="GET">
          <select name="county" defaultValue={county} className="border border-[#D3DCE0] rounded-md px-3 py-2 text-sm bg-white">
            <option value="">All counties</option>
            <option value="Nairobi">Nairobi</option>
            <option value="Kiambu">Kiambu</option>
            <option value="Machakos">Machakos</option>
          </select>

          <select name="type" defaultValue={propertyType} className="border border-[#D3DCE0] rounded-md px-3 py-2 text-sm bg-white">
            <option value="">Property type</option>
            <option value="BEDSITTER">Bedsitter</option>
            <option value="HOSTEL_ROOM">Hostel room</option>
            <option value="ONE_BEDROOM">1 bedroom</option>
          </select>

          <button type="submit" className="bg-[#2568A8] text-white text-sm rounded-md px-4 py-2">
            Search
          </button>
        </form>

        {listings.length === 0 ? (
          <p className="text-gray-500">
            No listings match yet — try a different county or check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
