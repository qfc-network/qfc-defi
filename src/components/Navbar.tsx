"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { shortenAddress, formatQfc } from "@/lib/format";

const NAV_LINKS = [
  { href: "/borrow", label: "Borrow" },
  { href: "/lend", label: "Lend" },
  { href: "/stake", label: "Stake" },
  { href: "/vaults", label: "Vaults" },
  { href: "/launch", label: "Launch" },
  { href: "/privacy", label: "Privacy" },
  { href: "/stealth", label: "Stealth" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { address, isConnected, qfcBalance, connect, disconnect } = useWallet();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-bold text-white">
              Q
            </span>
            <span className="text-white">QFC DeFi</span>
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isConnected ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-gray-400 sm:block">{formatQfc(qfcBalance)}</span>
              <button
                onClick={disconnect}
                className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                {shortenAddress(address!)}
              </button>
            </div>
          ) : (
            <button
              onClick={connect}
              className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:from-cyan-400 hover:to-blue-500"
            >
              Connect Wallet
            </button>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 md:hidden"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-gray-800 bg-gray-950 px-4 py-2 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
