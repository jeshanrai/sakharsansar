"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/api";
import { Eye, EyeOff, ArrowRight, Mail, Lock, Sparkles, AlertCircle, ShieldCheck } from "lucide-react";

export default function PortfolioLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

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
        setError(data.error || "Invalid email or password");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      router.push("/portfolio/dashboard");
    } catch {
      setError("Cannot reach the server. Try again in a moment.");
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#FAF6EE] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#B8763E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6EE] flex">
      {/* ─── Brand panel (desktop) ──────────────────────── */}
      <aside className="hidden lg:flex relative w-[44%] xl:w-[48%] bg-gradient-to-br from-[#1A1410] via-[#3D2817] to-[#5A3B22] text-[#F5EDE0] p-10 xl:p-14 flex-col justify-between overflow-hidden">
        {/* Ambient blurs */}
        <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-[#E8A857]/25 to-transparent blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-[28rem] h-[28rem] rounded-full bg-gradient-to-tr from-[#B8763E]/20 to-transparent blur-3xl" />
        {/* Grain (subtle) */}
        <div
          className="absolute inset-0 opacity-[0.07] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/></svg>\")",
          }}
        />

        <div className="relative">
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="relative w-[200px] h-11 brightness-0 invert">
              <Image src="/word-logo.svg" alt="SakharSansar" fill priority className="object-contain object-left" />
            </div>
            <p className="mt-3 text-[11px] tracking-[0.22em] uppercase text-[#E8A857] font-semibold">Admin Studio</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8A857]/15 text-[#E8A857] text-[11px] tracking-[0.2em] uppercase font-semibold mb-6">
            <Sparkles className="w-3 h-3" />
            <span>Welcome back</span>
          </div>
          <h1 className="font-serif text-[44px] xl:text-[52px] leading-[1.05] tracking-tight">
            The studio<br />
            <span className="italic text-[#E8A857]">behind the sweetness.</span>
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-[#F5EDE0]/70 max-w-md">
            Track sales, expenses, and deliveries from the wood-fired heart of Sankhuwasabha. Built for the hands that pour the jaggery.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Stat label="Sales tracked" value="₹ 1.2M+" />
            <Stat label="Active orders" value="48" />
            <Stat label="Couriers" value="6" />
          </div>
        </motion.div>

        <div className="relative flex items-center justify-between text-[11px] text-[#F5EDE0]/45">
          <p className="tracking-wide">© {new Date().getFullYear()} SakharSansar</p>
          <p className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400/70" /> Encrypted session</p>
        </div>
      </aside>

      {/* ─── Form panel ─────────────────────────────────── */}
      <main className="flex-1 flex flex-col px-5 sm:px-10 lg:px-14 xl:px-20 py-10 sm:py-14 relative">
        {/* Mobile-only header */}
        <div className="lg:hidden flex items-center justify-between mb-10">
          <div className="relative w-[140px] h-8">
            <Image src="/word-logo.svg" alt="SakharSansar" fill priority className="object-contain object-left" />
          </div>
          <p className="text-[10px] tracking-[0.22em] uppercase text-[#B8763E] font-semibold">Admin</p>
        </div>

        <div className="flex-1 flex flex-col justify-center w-full max-w-md mx-auto lg:mx-0">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-[11px] tracking-[0.22em] uppercase text-[#B8763E] font-semibold">Sign in</p>
            <h2 className="font-serif text-3xl sm:text-[40px] leading-[1.05] text-[#1A1410] mt-2 tracking-tight">
              Step into your<br /><span className="italic text-[#B8763E]">studio.</span>
            </h2>
            <p className="mt-3 text-[15px] text-[#1A1410]/55 leading-relaxed">
              Enter your credentials below. Your session is private to your device.
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mt-9 flex flex-col gap-5"
          >
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -6, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-200/60 text-rose-700 text-sm px-4 py-3 rounded-2xl">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Field
              label="Email address"
              icon={Mail}
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@sakharsansar.com"
              autoComplete="email"
              required
            />

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] tracking-[0.18em] uppercase text-[#1A1410]/55 font-semibold">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[11px] text-[#B8763E] font-semibold hover:underline underline-offset-4"
                  onClick={() => alert("Reach out to your studio admin to reset your password.")}
                >
                  Forgot?
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1410]/35 group-focus-within:text-[#B8763E] transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full h-12 pl-11 pr-11 rounded-2xl bg-white border border-[#1A1410]/10 text-[15px] text-[#1A1410] placeholder:text-[#1A1410]/25 shadow-[0_1px_2px_rgba(26,20,16,0.04)] focus:outline-none focus:border-[#B8763E]/60 focus:ring-4 focus:ring-[#B8763E]/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg flex items-center justify-center text-[#1A1410]/40 hover:text-[#1A1410] hover:bg-[#FAF6EE] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 group relative h-12 rounded-2xl bg-[#1A1410] text-[#FAF6EE] font-semibold text-[15px] overflow-hidden flex items-center justify-center gap-2 hover:bg-[#3D2817] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#1A1410]/15 hover:shadow-xl hover:-translate-y-px transition-all"
            >
              {/* Honey shine on hover */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-[#E8A857]/15 to-transparent" />
              {loading ? (
                <span className="w-5 h-5 border-2 border-[#FAF6EE]/30 border-t-[#FAF6EE] rounded-full animate-spin" />
              ) : (
                <>
                  <span className="relative">Sign in to dashboard</span>
                  <ArrowRight className="w-4 h-4 relative group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>

            <p className="text-center text-[11px] text-[#1A1410]/40 mt-2 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600/70" />
              Protected by token-based authentication
            </p>
          </motion.form>
        </div>

        <p className="text-center lg:text-left text-[11px] text-[#1A1410]/35 mt-8 tracking-wide">
          Need access? Ask your studio lead to provision an admin account.
        </p>
      </main>
    </div>
  );
}

/* ─── Inline field component ─── */
function Field({
  label,
  icon: Icon,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  required,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-[11px] tracking-[0.18em] uppercase text-[#1A1410]/55 font-semibold block mb-2">
        {label}
      </label>
      <div className="relative group">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1410]/35 group-focus-within:text-[#B8763E] transition-colors" />
        <input
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white border border-[#1A1410]/10 text-[15px] text-[#1A1410] placeholder:text-[#1A1410]/25 shadow-[0_1px_2px_rgba(26,20,16,0.04)] focus:outline-none focus:border-[#B8763E]/60 focus:ring-4 focus:ring-[#B8763E]/10 transition-all"
        />
      </div>
    </div>
  );
}

/* ─── Small stat tile on the brand panel ─── */
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#F5EDE0]/8 backdrop-blur-sm border border-[#F5EDE0]/12 rounded-2xl px-4 py-3">
      <p className="text-[10px] tracking-[0.18em] uppercase text-[#F5EDE0]/55 font-medium">{label}</p>
      <p className="font-serif text-lg text-[#F5EDE0] mt-0.5 tabular-nums">{value}</p>
    </div>
  );
}
