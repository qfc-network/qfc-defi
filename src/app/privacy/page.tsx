"use client";

import { useState } from "react";
import StatCard from "@/components/StatCard";
import TxButton from "@/components/TxButton";
import { formatCompact } from "@/lib/format";
import {
  DenominationKey,
  generateNote,
  serializeNote,
} from "@/lib/shieldedPool";

type Tab = "deposit" | "withdraw";

const DENOM_OPTIONS: { key: DenominationKey; label: string }[] = [
  { key: "100", label: "100 qUSD" },
  { key: "1K", label: "1,000 qUSD" },
  { key: "10K", label: "10,000 qUSD" },
  { key: "100K", label: "100,000 qUSD" },
];

// Mock pool stats
const POOL_STATS = {
  totalDeposits: 2847,
  poolBalance: 4_250_000,
  anonymitySet: 2847,
  relayerFee: 0.5,
};

export default function PrivacyPage() {
  const [tab, setTab] = useState<Tab>("deposit");
  const [selectedDenom, setSelectedDenom] = useState<DenominationKey>("1K");
  const [noteString, setNoteString] = useState("");
  const [generatedNote, setGeneratedNote] = useState("");
  const [withdrawAddr, setWithdrawAddr] = useState("");
  const [proofStatus, setProofStatus] = useState<"" | "generating" | "done" | "error">("");

  const tabs: { key: Tab; label: string }[] = [
    { key: "deposit", label: "Deposit" },
    { key: "withdraw", label: "Withdraw" },
  ];

  const handleDeposit = async () => {
    // Generate note
    const note = generateNote(selectedDenom);
    const serialized = serializeNote(note);
    setGeneratedNote(serialized);

    // In production: call pool.deposit(commitment, denomination)
    await new Promise((r) => setTimeout(r, 1500));
  };

  const handleWithdraw = async () => {
    if (!noteString || !withdrawAddr) return;

    try {
      setProofStatus("generating");
      // In production:
      // 1. Deserialize note
      // 2. Fetch Merkle proof from indexer
      // 3. Generate Groth16 proof in browser (snarkjs)
      // 4. Submit to relayer or directly to contract
      await new Promise((r) => setTimeout(r, 3000)); // Simulate proof generation
      setProofStatus("done");

      // Simulate relayer submission
      await new Promise((r) => setTimeout(r, 1500));
    } catch {
      setProofStatus("error");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Privacy Pool</h1>
        <p className="mt-1 text-gray-400">
          Shield your qUSD — break on-chain transaction linkability with zero-knowledge proofs
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Pool Balance" value={`$${formatCompact(POOL_STATS.poolBalance)}`} subtitle="qUSD shielded" />
        <StatCard label="Total Deposits" value={formatCompact(POOL_STATS.totalDeposits)} subtitle="commitments" />
        <StatCard label="Anonymity Set" value={formatCompact(POOL_STATS.anonymitySet)} subtitle="depositors" />
        <StatCard label="Relayer Fee" value={`${POOL_STATS.relayerFee}%`} subtitle="of withdrawal" />
      </div>

      {/* How it works */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
        <h3 className="mb-3 text-sm font-semibold text-gray-300">How it works</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-sm font-bold text-cyan-400">1</div>
            <div>
              <p className="text-sm font-medium text-white">Deposit</p>
              <p className="text-xs text-gray-500">Lock qUSD, receive a secret note</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-sm font-bold text-purple-400">2</div>
            <div>
              <p className="text-sm font-medium text-white">Wait</p>
              <p className="text-xs text-gray-500">More deposits = larger anonymity set</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-bold text-emerald-400">3</div>
            <div>
              <p className="text-sm font-medium text-white">Withdraw</p>
              <p className="text-xs text-gray-500">Use ZK proof to withdraw to a new address</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main panel */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Denomination selector */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
            <h3 className="mb-4 text-sm font-semibold text-gray-300">Select Denomination</h3>
            <div className="grid grid-cols-2 gap-2">
              {DENOM_OPTIONS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSelectedDenom(key)}
                  className={`rounded-lg border px-4 py-3 text-sm font-medium transition ${
                    selectedDenom === key
                      ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                      : "border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Fixed denominations ensure all deposits look identical, maximizing privacy.
            </p>
          </div>

          {/* ZK proof info */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
            <h3 className="mb-3 text-sm font-semibold text-gray-300">ZK Proof Details</h3>
            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Proving system</span>
                <span className="text-gray-300">Groth16 (BN128)</span>
              </div>
              <div className="flex justify-between">
                <span>Hash function</span>
                <span className="text-gray-300">Poseidon</span>
              </div>
              <div className="flex justify-between">
                <span>Merkle tree depth</span>
                <span className="text-gray-300">20 levels (~1M)</span>
              </div>
              <div className="flex justify-between">
                <span>Constraints</span>
                <span className="text-gray-300">5,381</span>
              </div>
              <div className="flex justify-between">
                <span>Proof generation</span>
                <span className="text-gray-300">~30-45s (browser)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Deposit / Withdraw tabs */}
        <div className="lg:col-span-3">
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
            <div className="mb-5 flex gap-1 rounded-lg bg-gray-800/60 p-1">
              {tabs.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => { setTab(key); setGeneratedNote(""); setProofStatus(""); }}
                  className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${
                    tab === key ? "bg-gray-700 text-white" : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {tab === "deposit" && (
              <div className="space-y-4">
                <div className="rounded-lg bg-gray-800/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">You deposit</span>
                    <span className="text-lg font-bold text-white">
                      {selectedDenom === "100K" ? "100,000" : selectedDenom === "10K" ? "10,000" : selectedDenom === "1K" ? "1,000" : "100"} qUSD
                    </span>
                  </div>
                </div>

                <TxButton label="Deposit & Generate Note" onClick={handleDeposit} />

                {generatedNote && (
                  <div className="space-y-2">
                    <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
                      <p className="mb-2 text-xs font-semibold text-emerald-400">
                        YOUR SECRET NOTE — SAVE THIS!
                      </p>
                      <textarea
                        readOnly
                        value={generatedNote}
                        className="w-full rounded bg-gray-900 p-2 font-mono text-xs text-gray-300"
                        rows={3}
                      />
                      <button
                        onClick={() => navigator.clipboard.writeText(generatedNote)}
                        className="mt-2 rounded bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-500"
                      >
                        Copy to clipboard
                      </button>
                    </div>
                    <p className="text-xs text-red-400">
                      If you lose this note, you lose your funds. Store it securely.
                    </p>
                  </div>
                )}
              </div>
            )}

            {tab === "withdraw" && (
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm text-gray-400">Secret Note</label>
                  <textarea
                    value={noteString}
                    onChange={(e) => setNoteString(e.target.value)}
                    placeholder="qUSD-note-abc123...-def456...-1000000000000000000000"
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 font-mono text-xs text-gray-300 placeholder:text-gray-600 focus:border-cyan-500 focus:outline-none"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-gray-400">Recipient Address</label>
                  <input
                    type="text"
                    value={withdrawAddr}
                    onChange={(e) => setWithdrawAddr(e.target.value)}
                    placeholder="0x... (use a fresh address for maximum privacy)"
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-sm text-gray-300 placeholder:text-gray-600 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="rounded-lg bg-gray-800/50 p-3 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Withdrawal method</span>
                    <span className="text-purple-400">Via Relayer (no gas needed)</span>
                  </div>
                  <div className="mt-1 flex justify-between text-gray-400">
                    <span>Relayer fee</span>
                    <span className="text-white">{POOL_STATS.relayerFee}%</span>
                  </div>
                </div>

                {proofStatus === "generating" && (
                  <div className="flex items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 p-3">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-purple-400 border-t-transparent" />
                    <span className="text-sm text-purple-300">Generating ZK proof... (~30-45s)</span>
                  </div>
                )}

                {proofStatus === "done" && (
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400">
                    Proof verified. Withdrawal submitted to relayer.
                  </div>
                )}

                <TxButton
                  label={proofStatus === "generating" ? "Generating proof..." : "Generate Proof & Withdraw"}
                  onClick={handleWithdraw}
                  disabled={!noteString || !withdrawAddr || proofStatus === "generating"}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
