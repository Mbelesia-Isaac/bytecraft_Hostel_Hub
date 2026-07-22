"use client";

import { useState, useEffect } from "react";

export default function ListingCard({ listing }) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [contacting, setContacting] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  async function handleSaveToggle() {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Log in as a seeker to save listings.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/listings/" + listing.id + "/save", {
        method: saved ? "DELETE" : "POST",
        headers: { Authorization: "Bearer " + token },
      });
      if (res.ok) {
        setSaved(!saved);
        setMessage("");
      } else {
        const data = await res.json();
        setMessage(data.error || "Could not update.");
      }
    } catch (err) {
      setMessage("Could not reach the server.");
    }
    setSaving(false);
  }

  async function handleContact() {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Log in as a seeker to contact the landlord.");
      return;
    }
    setContacting(true);
    try {
      const res = await fetch("/api/listings/" + listing.id + "/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ message: "Hi, is " + listing.title + " still available?" }),
      });
      const data = await res.json();
      if (res.ok && data.whatsappLink) {
        window.open(data.whatsappLink, "_blank");
      } else {
        setMessage(data.error || "Could not start conversation.");
      }
    } catch (err) {
      setMessage("Could not reach the server.");
    }
    setContacting(false);
  }

  async function handleReport() {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Log in to report a listing.");
      return;
    }
    const reason = window.prompt("What's wrong with this listing?");
    if (!reason || reason.trim().length < 5) return;

    try {
      const res = await fetch("/api/listings/" + listing.id + "/report", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      setMessage(res.ok ? "Thanks, we'll look into it." : (data.error || "Could not submit report."));
    } catch (err) {
      setMessage("Could not reach the server.");
    }
  }

  return (
    <div className="bg-white border border-[#D3DCE0] rounded-xl overflow-hidden relative">
      <div className="h-32 bg-[#EEF2F4] flex items-center justify-center text-[#8A9187] text-sm">
        {listing.photos && listing.photos.length > 0 ? (
          <img src={listing.photos[0].url} alt={listing.title} className="w-full h-full object-cover" />
        ) : (
          "No photo yet"
        )}
      </div>
      <div className="p-4">
        <p className="font-medium text-[#142430]">{listing.title}</p>
        <p className="text-sm text-gray-500 mb-2">
          {listing.landmark || (listing.area + ", " + listing.county)}
        </p>
        <p className="font-semibold text-[#142430] font-mono mb-3">
          KES {Number(listing.price).toLocaleString()}
          <span className="text-xs font-normal text-gray-500"> /month</span>
        </p>

        <div className="flex gap-2 mb-2">
          <button
            onClick={handleContact}
            disabled={contacting}
            className="flex-1 bg-[#2568A8] text-white text-xs font-medium rounded-md py-2 disabled:opacity-50"
          >
            {contacting ? "..." : "Contact via WhatsApp"}
          </button>
          <button
            onClick={handleSaveToggle}
            disabled={saving}
            className="border border-[#D3DCE0] rounded-md px-3 py-2 text-xs"
            title={saved ? "Unsave" : "Save"}
          >
            {saved ? "♥" : "♡"}
          </button>
        </div>

        <button onClick={handleReport} className="text-xs text-gray-400 underline">
          Report this listing
        </button>

        {message && (
          <p className="text-xs text-[#B4462F] mt-2">{message}</p>
        )}
      </div>
    </div>
  );
}
