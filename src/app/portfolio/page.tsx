"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { apiFetch } from "@/lib/api";
import { Eye, EyeOff, LogIn } from "lucide-react";

export default function PortfolioLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Check existing session
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      apiFetch("/auth/me")
        .then((res) => {
          if (res.ok) router.replace("/portfolio/dashboard");
          else {
            localStorage.removeItem("token");
            setChecking(false);
          }
        })
        .catch(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      router.push("/portfolio/dashboard");
    } catch {
      setError("Cannot connect to server");
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#F4F1ED] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C17A2A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F1ED] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image src="/company-logo.svg" alt="SakharSansar" width={80} height={80} className="h-20 w-20" />
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="font-poppins text-2xl font-bold text-[#2C1500]">Admin Portal</h1>
            <p className="text-[#2C1500]/50 text-sm mt-2">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-wider text-[#2C1500]/50 uppercase">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F4F1ED] rounded-xl px-4 py-3 text-sm text-[#2C1500] border border-transparent focus:border-[#C17A2A] focus:bg-white outline-none transition-all"
                placeholder="admin@sakharsansar.com"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-wider text-[#2C1500]/50 uppercase">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#F4F1ED] rounded-xl px-4 py-3 pr-12 text-sm text-[#2C1500] border border-transparent focus:border-[#C17A2A] focus:bg-white outline-none transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2C1500]/30 hover:text-[#2C1500] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full flex items-center justify-center gap-2 py-3.5 bg-[#C17A2A] text-white font-semibold rounded-xl hover:bg-[#A8671F] disabled:opacity-50 transition-all"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#2C1500]/30 mt-6">SakharSansar Admin Panel</p>
      </div>
    </div>
  );
}
