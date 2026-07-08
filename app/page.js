import { prisma } from "@/lib/prisma";

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
    take: 20,
  });

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          Find your next hostel or bedsitter
        </h1>
        <p className="text-gray-600 mb-6">
          Verified listings near your campus.
        </p>

        <form className="flex flex-wrap gap-3 mb-8" method="GET">
          <select
            name="county"
            defaultValue={county}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">All counties</option>
            <option value="Nairobi">Nairobi</option>
            <option value="Kiambu">Kiambu</option>
            <option value="Machakos">Machakos</option>
          </select>

          <select
            name="type"
            defaultValue={propertyType}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">Property type</option>
            <option value="BEDSITTER">Bedsitter</option>
            <option value="HOSTEL_ROOM">Hostel room</option>
            <option value="ONE_BEDROOM">1 bedroom</option>
          </select>

          <button
            type="submit"
            className="bg-gray-900 text-white text-sm rounded-md px-4 py-2"
          >
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
              <div
                key={listing.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden"
              >
                <div className="h-28 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                  No photo yet
                </div>
                <div className="p-4">
                  <p className="font-medium text-gray-900">{listing.title}</p>
                  <p className="text-sm text-gray-500 mb-2">
                    {listing.landmark || `${listing.area}, ${listing.county}`}
                  </p>
                  <p className="font-semibold text-gray-900">
                    KES {Number(listing.price).toLocaleString()}
                    <span className="text-xs font-normal text-gray-500"> /month</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
