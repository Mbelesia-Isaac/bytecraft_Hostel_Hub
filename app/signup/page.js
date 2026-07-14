"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function getPasswordChecks(password) {
  return {
    length: password.length >= 8,
    hasLetter: /[a-zA-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialOrCase: /[A-Z]/.test(password) && /[a-z]/.test(password) || /[^a-zA-Z0-9]/.test(password),
  };
}

function getStrengthLabel(checks, length) {
  const passedCore = checks.length && checks.hasLetter && checks.hasNumber;
  if (!passedCore) return { label: "Too weak", color: "#B4462F" };
  if (length >= 12 && checks.hasSpecialOrCase) return { label: "Strong", color: "#1F6F54" };
  if (length >= 10) return { label: "Good", color: "#2568A8" };
  return { label: "Okay", color: "#E2A63B" };
}

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "SEEKER",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const checks = getPasswordChecks(form.password);
  const strength = getStrengthLabel(checks, form.password.length);
  const passwordsMatch = form.password && form.password === form.confirmPassword;
  const canSubmit = checks.length && checks.hasLetter && checks.hasNumber && passwordsMatch;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!passwordsMatch) {
      setError("Passwords don't match.");
      return;
    }
    if (!checks.length || !checks.hasLetter || !checks.hasNumber) {
      setError("Password must be at least 8 characters with a letter and a number.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: form.role,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "LANDLORD" && data.user.accountStatus === "PENDING") {
        router.push("/landlord/pending");
      } else if (data.user.role === "LANDLORD") {
        router.push("/landlord");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError("Could not reach the server. Try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#EEF2F4] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md bg-white border border-[#D3DCE0] rounded-xl p-8">
        <h1 className="text-2xl font-semibold text-[#142430] mb-1">Create an account</h1>
        <p className="text-sm text-gray-500 mb-6">
          Find a hostel, or list one, in a few minutes.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#142430] mb-1">I am a</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, role: "SEEKER" })}
                className={`flex-1 py-2 rounded-md text-sm border ${
                  form.role === "SEEKER" ? "bg-[#2568A8] text-white border-[#2568A8]" : "border-[#D3DCE0] text-[#142430]"
                }`}
              >
                Seeker
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, role: "LANDLORD" })}
                className={`flex-1 py-2 rounded-md text-sm border ${
                  form.role === "LANDLORD" ? "bg-[#2568A8] text-white border-[#2568A8]" : "border-[#D3DCE0] text-[#142430]"
                }`}
              >
                Landlord
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#142430] mb-1">Full name</label>
            <input name="fullName" value={form.fullName} onChange={handleChange} required
              className="w-full border border-[#D3DCE0] rounded-md px-3 py-2 text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#142430] mb-1">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required
              className="w-full border border-[#D3DCE0] rounded-md px-3 py-2 text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#142430] mb-1">Phone (e.g. 0712345678)</label>
            <input name="phone" value={form.phone} onChange={handleChange} required
              className="w-full border border-[#D3DCE0] rounded-md px-3 py-2 text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#142430] mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full border border-[#D3DCE0] rounded-md px-3 py-2 pr-16 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#2568A8]"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {form.password && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-1.5 rounded-full bg-[#D3DCE0] overflow-hidden">
                    <div
                      className="h-full transition-all"
                      style={{
                        width: strength.label === "Too weak" ? "25%" : strength.label === "Okay" ? "50%" : strength.label === "Good" ? "75%" : "100%",
                        backgroundColor: strength.color,
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium" style={{ color: strength.color }}>
                    {strength.label}
                  </span>
                </div>
                <ul className="text-xs text-gray-500 space-y-0.5">
                  <li style={{ color: checks.length ? "#1F6F54" : undefined }}>
                    {checks.length ? "✓" : "○"} At least 8 characters
                  </li>
                  <li style={{ color: checks.hasLetter ? "#1F6F54" : undefined }}>
                    {checks.hasLetter ? "✓" : "○"} Contains a letter
                  </li>
                  <li style={{ color: checks.hasNumber ? "#1F6F54" : undefined }}>
                    {checks.hasNumber ? "✓" : "○"} Contains a number
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#142430] mb-1">Confirm password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full border rounded-md px-3 py-2 pr-16 text-sm"
                style={{
                  borderColor: form.confirmPassword && !passwordsMatch ? "#B4462F" : "#D3DCE0",
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#2568A8]"
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
            {form.confirmPassword && !passwordsMatch && (
              <p className="text-xs text-[#B4462F] mt-1">Passwords don&apos;t match</p>
            )}
          </div>

          {error && (
            <p className="text-sm text-[#B4462F] bg-[#FBEDEA] border border-[#B4462F]/30 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !canSubmit}
            className="w-full bg-[#2568A8] text-white text-sm font-medium rounded-md py-2.5 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Already have an account? <a href="/login" className="text-[#2568A8] underline">Log in</a>
        </p>
      </div>
    </main>
  );
}
