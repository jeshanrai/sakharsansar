"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Info, CheckCircle2 } from "lucide-react";

/* ───────────────────── Card ───────────────────── */
export function Card({
  children,
  className = "",
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`bg-white rounded-2xl border border-[#1A1410]/6 ${
        hover ? "shadow-[0_1px_2px_rgba(26,20,16,0.04)] hover:shadow-[0_8px_30px_rgba(26,20,16,0.08)] hover:-translate-y-0.5" : "shadow-[0_1px_2px_rgba(26,20,16,0.04)]"
      } transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
}

/* ───────────────────── SectionHeading ───────────────────── */
export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 mb-6">
      <div className="flex-1 min-w-0">
        {eyebrow && (
          <p className="text-[11px] tracking-[0.22em] uppercase text-[#B8763E] font-medium mb-2">
            {eyebrow}
          </p>
        )}
        <h2 className="font-serif text-2xl sm:text-[28px] leading-tight text-[#1A1410] tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="mt-1.5 text-sm text-[#1A1410]/55 max-w-xl">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ───────────────────── Button ───────────────────── */
export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const sizes = {
    sm: "h-9 px-3.5 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-sm",
  };
  const variants = {
    primary:
      "bg-[#1A1410] text-[#FAF6EE] hover:bg-[#3D2817] shadow-sm hover:shadow-md hover:-translate-y-px",
    secondary:
      "bg-white text-[#1A1410] border border-[#1A1410]/10 hover:border-[#1A1410]/25 shadow-sm",
    ghost: "bg-transparent text-[#1A1410]/70 hover:bg-[#1A1410]/5",
    danger: "bg-rose-500 text-white hover:bg-rose-600 shadow-sm",
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/* ───────────────────── Input ───────────────────── */
export function Input({
  label,
  className = "",
  ...props
}: { label?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[11px] tracking-[0.14em] uppercase text-[#1A1410]/50 font-medium">
          {label}
        </label>
      )}
      <input
        className={`h-11 px-3.5 rounded-xl bg-[#FAF6EE] border border-[#1A1410]/8 text-sm placeholder:text-[#1A1410]/30 focus:outline-none focus:border-[#B8763E]/50 focus:ring-2 focus:ring-[#B8763E]/15 transition-all ${className}`}
        {...props}
      />
    </div>
  );
}

export function Textarea({
  label,
  className = "",
  ...props
}: { label?: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[11px] tracking-[0.14em] uppercase text-[#1A1410]/50 font-medium">
          {label}
        </label>
      )}
      <textarea
        className={`px-3.5 py-3 rounded-xl bg-[#FAF6EE] border border-[#1A1410]/8 text-sm placeholder:text-[#1A1410]/30 focus:outline-none focus:border-[#B8763E]/50 focus:ring-2 focus:ring-[#B8763E]/15 transition-all resize-none ${className}`}
        {...props}
      />
    </div>
  );
}

export function Select({
  label,
  children,
  className = "",
  ...props
}: { label?: string; children: ReactNode } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[11px] tracking-[0.14em] uppercase text-[#1A1410]/50 font-medium">
          {label}
        </label>
      )}
      <select
        className={`h-11 px-3.5 pr-9 rounded-xl bg-[#FAF6EE] border border-[#1A1410]/8 text-sm focus:outline-none focus:border-[#B8763E]/50 focus:ring-2 focus:ring-[#B8763E]/15 transition-all appearance-none cursor-pointer bg-no-repeat bg-[right_12px_center] ${className}`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%231A1410' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")",
        }}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

/* ───────────────────── Modal ───────────────────── */
export function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  const widths = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-2xl" };
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1A1410]/55 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className={`fixed inset-x-3 bottom-3 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 w-auto sm:w-full ${widths[size]} bg-white sm:rounded-3xl rounded-3xl z-[60] shadow-2xl max-h-[92vh] overflow-hidden flex flex-col`}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1A1410]/6">
              <h3 className="font-serif text-xl text-[#1A1410]">{title}</h3>
              <button
                onClick={onClose}
                className="h-9 w-9 rounded-xl bg-[#FAF6EE] flex items-center justify-center text-[#1A1410]/60 hover:bg-[#1A1410]/5 hover:text-[#1A1410] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-5 overflow-y-auto">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ───────────────────── ConfirmDialog ───────────────────── */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  variant = "warning",
  confirmLabel = "Confirm",
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  variant?: "danger" | "warning" | "info";
  confirmLabel?: string;
}) {
  const Icon = variant === "danger" ? AlertTriangle : variant === "info" ? Info : AlertTriangle;
  const tone =
    variant === "danger"
      ? { ring: "bg-rose-50 text-rose-600", btn: "bg-rose-500 hover:bg-rose-600 text-white" }
      : variant === "info"
      ? { ring: "bg-sky-50 text-sky-600", btn: "bg-sky-500 hover:bg-sky-600 text-white" }
      : { ring: "bg-amber-50 text-amber-600", btn: "bg-[#B8763E] hover:bg-[#9A5F2E] text-white" };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1A1410]/55 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-1.5rem)] max-w-sm bg-white rounded-3xl p-6 z-[70] shadow-2xl"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${tone.ring}`}>
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl text-[#1A1410] mb-1.5">{title}</h3>
            <p className="text-sm text-[#1A1410]/55 leading-relaxed mb-6">{message}</p>
            <div className="flex gap-2.5">
              <button
                onClick={onClose}
                className="flex-1 h-11 rounded-xl text-sm font-medium text-[#1A1410]/70 bg-[#FAF6EE] hover:bg-[#1A1410]/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 h-11 rounded-xl text-sm font-medium transition-colors ${tone.btn}`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ───────────────────── Toast ───────────────────── */
export function Toast({ visible, message, kind = "success" }: { visible: boolean; message: string; kind?: "success" | "error" }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-[80] bg-[#1A1410] text-[#FAF6EE] px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5"
        >
          <CheckCircle2 className={`w-4 h-4 ${kind === "success" ? "text-emerald-400" : "text-rose-400"}`} />
          <span className="text-sm font-medium">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ───────────────────── Pill ───────────────────── */
export function Pill({
  children,
  tone,
}: {
  children: ReactNode;
  tone: { bg: string; text: string; dot: string };
}) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${tone.bg} ${tone.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`} />
      {children}
    </span>
  );
}

/* ───────────────────── EmptyState ───────────────────── */
export function EmptyState({
  icon: Icon,
  title,
  message,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  message: string;
}) {
  return (
    <div className="py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#FAF6EE] mx-auto flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-[#1A1410]/30" />
      </div>
      <p className="font-serif text-lg text-[#1A1410]">{title}</p>
      <p className="text-sm text-[#1A1410]/50 mt-1">{message}</p>
    </div>
  );
}
