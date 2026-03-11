"use client";

import { useState } from "react";

type TxState = "idle" | "loading" | "pending" | "success" | "error";

interface TxButtonProps {
  label: string;
  onClick: () => Promise<void>;
  disabled?: boolean;
  className?: string;
}

export default function TxButton({ label, onClick, disabled, className }: TxButtonProps) {
  const [state, setState] = useState<TxState>("idle");
  const [error, setError] = useState("");

  const handleClick = async () => {
    setState("loading");
    setError("");
    try {
      setState("pending");
      await onClick();
      setState("success");
      setTimeout(() => setState("idle"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transaction failed");
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    }
  };

  const isDisabled = disabled || state === "loading" || state === "pending";

  const stateStyles: Record<TxState, string> = {
    idle: "from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500",
    loading: "from-cyan-500/60 to-blue-600/60 cursor-wait",
    pending: "from-amber-500 to-amber-600 cursor-wait",
    success: "from-emerald-500 to-emerald-600",
    error: "from-rose-500 to-rose-600",
  };

  const labels: Record<TxState, string> = {
    idle: label,
    loading: "Preparing...",
    pending: "Confirming...",
    success: "Success!",
    error: error || "Failed",
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={`w-full rounded-xl bg-gradient-to-r px-4 py-3 text-sm font-semibold text-white transition-all disabled:opacity-50 ${stateStyles[state]} ${className || ""}`}
      >
        <span className="flex items-center justify-center gap-2">
          {(state === "loading" || state === "pending") && (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {labels[state]}
        </span>
      </button>
    </div>
  );
}
