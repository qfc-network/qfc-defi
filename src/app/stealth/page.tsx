"use client";

import { useState } from "react";
import StatCard from "@/components/StatCard";
import TxButton from "@/components/TxButton";
import { formatCompact, shortenAddress } from "@/lib/format";
import {
  generateStealthKeys,
  computeStealthAddress,
  serializeKeys,
  StealthKeys,
} from "@/lib/stealthAddress";

type Tab = "receive" | "send" | "scan";

// Mock data
const MOCK_STATS = {
  registeredUsers: 1842,
  totalTransfers: 5691,
  activeAnnouncements: 3204,
};

const MOCK_INCOMING = [
  { token: "qUSD", amount: "5,000", stealthAddr: "0x7a3B...f291", time: "2 hours ago" },
  { token: "qUSD", amount: "1,200", stealthAddr: "0x9c1D...a843", time: "1 day ago" },
];

export default function StealthPage() {
  const [tab, setTab] = useState<Tab>("receive");
  const [keys, setKeys] = useState<StealthKeys | null>(null);
  const [keysJson, setKeysJson] = useState("");
  const [recipientAddr, setRecipientAddr] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [stealthResult, setStealthResult] = useState<{ stealthAddress: string; ephemeralPubKey: string } | null>(null);

  const tabs: { key: Tab; label: string }[] = [
    { key: "receive", label: "Setup Receive" },
    { key: "send", label: "Send Privately" },
    { key: "scan", label: "Scan Incoming" },
  ];

  const handleGenerateKeys = async () => {
    const newKeys = generateStealthKeys();
    setKeys(newKeys);
    setKeysJson(serializeKeys(newKeys));
    // In production: call registerMetaAddress on-chain
    await new Promise((r) => setTimeout(r, 1500));
  };

  const handleSend = async () => {
    if (!recipientAddr || !sendAmount) return;
    // In production:
    // 1. Fetch recipient's meta-address from registry
    // 2. Compute stealth address
    // 3. Send tokens
    const mockResult = computeStealthAddress(
      "0x02" + "a".repeat(64), // mock spending pubkey
      "0x02" + "b".repeat(64), // mock viewing pubkey
    );
    setStealthResult(mockResult);
    await new Promise((r) => setTimeout(r, 1500));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Stealth Address</h1>
        <p className="mt-1 text-gray-400">
          Receive qUSD privately — each transfer goes to a unique one-time address
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Registered Users" value={formatCompact(MOCK_STATS.registeredUsers)} subtitle="stealth-enabled" />
        <StatCard label="Total Transfers" value={formatCompact(MOCK_STATS.totalTransfers)} subtitle="stealth sends" />
        <StatCard label="Announcements" value={formatCompact(MOCK_STATS.activeAnnouncements)} subtitle="pending scan" />
      </div>

      {/* How it works */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
        <h3 className="mb-3 text-sm font-semibold text-gray-300">How Stealth Addresses work</h3>
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { n: "1", color: "cyan", title: "Register", desc: "One-time setup of your stealth meta-address" },
            { n: "2", color: "purple", title: "Share", desc: "Give your main address — sender looks up your pubkeys" },
            { n: "3", color: "emerald", title: "Receive", desc: "Sender generates a unique stealth address for you" },
            { n: "4", color: "amber", title: "Scan", desc: "Check announcements to find transfers meant for you" },
          ].map(({ n, color, title, desc }) => (
            <div key={n} className="flex gap-3">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-${color}-500/20 text-sm font-bold text-${color}-400`}>{n}</div>
              <div>
                <p className="text-sm font-medium text-white">{title}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main panel */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
        <div className="mb-5 flex gap-1 rounded-lg bg-gray-800/60 p-1">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${
                tab === key ? "bg-gray-700 text-white" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Setup Receive */}
        {tab === "receive" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-400">
              Generate your stealth keypair and register it on-chain. This only needs to be done once.
            </p>

            <TxButton label="Generate & Register Stealth Keys" onClick={handleGenerateKeys} />

            {keys && (
              <div className="space-y-3">
                <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-4">
                  <p className="mb-2 text-xs font-semibold text-cyan-400">YOUR STEALTH KEYS — SAVE SECURELY!</p>
                  <textarea
                    readOnly
                    value={keysJson}
                    className="w-full rounded bg-gray-900 p-2 font-mono text-xs text-gray-300"
                    rows={4}
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(keysJson)}
                    className="mt-2 rounded bg-cyan-600 px-3 py-1 text-xs font-medium text-white hover:bg-cyan-500"
                  >
                    Copy to clipboard
                  </button>
                </div>
                <div className="rounded-lg bg-gray-800/50 p-3 text-xs text-gray-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Spending PubKey</span>
                    <span className="font-mono text-gray-300">{shortenAddress(keys.spendingPubKey)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Viewing PubKey</span>
                    <span className="font-mono text-gray-300">{shortenAddress(keys.viewingPubKey)}</span>
                  </div>
                </div>
                <p className="text-xs text-red-400">
                  Losing the viewing key means you cannot scan for incoming transfers.
                  Losing the spending key means you cannot withdraw received funds.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Send Privately */}
        {tab === "send" && (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-gray-400">Recipient Address</label>
              <input
                type="text"
                value={recipientAddr}
                onChange={(e) => setRecipientAddr(e.target.value)}
                placeholder="0x... (recipient's main address — we'll look up their stealth keys)"
                className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-sm text-gray-300 placeholder:text-gray-600 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-gray-400">Amount (qUSD)</label>
              <input
                type="number"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                placeholder="1000"
                className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-sm text-gray-300 placeholder:text-gray-600 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="rounded-lg bg-gray-800/50 p-3 text-sm text-gray-500">
              Tokens will be sent to a one-time stealth address. Only the recipient can find and spend them.
            </div>

            <TxButton label="Send to Stealth Address" onClick={handleSend} disabled={!recipientAddr || !sendAmount} />

            {stealthResult && (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs space-y-1">
                <p className="font-semibold text-emerald-400">Transfer sent!</p>
                <div className="flex justify-between text-gray-400">
                  <span>Stealth Address</span>
                  <span className="font-mono text-gray-300">{shortenAddress(stealthResult.stealthAddress)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Ephemeral PubKey</span>
                  <span className="font-mono text-gray-300">{shortenAddress(stealthResult.ephemeralPubKey)}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Scan Incoming */}
        {tab === "scan" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-400">
              Scan on-chain announcements to find stealth transfers addressed to you.
              Uses your viewing key to identify matching transfers.
            </p>

            <TxButton label="Scan for Incoming Transfers" onClick={async () => { await new Promise(r => setTimeout(r, 2000)); }} />

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-300">Found Transfers</h4>
              {MOCK_INCOMING.map((tx, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800/50 p-3">
                  <div>
                    <span className="text-sm font-medium text-white">{tx.amount} {tx.token}</span>
                    <p className="text-xs text-gray-500">To: {tx.stealthAddr}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{tx.time}</p>
                    <button className="mt-1 rounded bg-emerald-600 px-2 py-0.5 text-xs font-medium text-white hover:bg-emerald-500">
                      Claim
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
