"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ListingCard from "@/components/ListingCard";

export default function SavedListingsPage() {
  const router = useRouter();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    loadSaved(token);
  }, []);

  async function loadSaved(token) {
    setLoading(true);
    try {
      const res = await fetch("/api/listings/saved", {
        headers: { Authorization: "Bearer " + token },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not load saved listings.");
      } else {
        setListings(data.saved);
      }
    } catch (err) {
      setError("Could not reach the server.");
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#EEF2F4] px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[#142430]">Your saved listings</h1>
          <a href="/" className="text-sm text-[#2568A8] underline">Back to browse</a>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-sm text-[#B4462F]">{error}</p>
        ) : listings.length === 0 ? (
          <p className="text-sm text-gray-500">
            You haven&apos;t saved any listings yet. Browse listings and tap the heart to save one.
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
