"use client";

import { useState } from "react";
import { MOCK_STAKING, TOKENS } from "@/lib/mock-data";
import { formatPercent } from "@/lib/format";
import TokenInput from "@/components/TokenInput";
import TxButton from "@/components/TxButton";
import StatCard from "@/components/StatCard";

type Tab = "stake" | "unstake" | "claim";

export default function StakePage() {
  const [tab, setTab] = useState<Tab>("stake");
  const [amount, setAmount] = useState("");
  const s = MOCK_STAKING;

  const tabs: { key: Tab; label: string }[] = [
    { key: "stake", label: "Stake" },
    { key: "unstake", label: "Unstake" },
    { key: "claim", label: "Claim" },
  ];

  const handleTx = async () => {
    await new Promise((r) => setTimeout(r, 1500));
    setAmount("");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Stake QFC</h1>
        <p className="mt-1 text-gray-400">Stake QFC to receive stQFC — earn staking rewards with liquid flexibility</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Your Staked QFC" value={`${s.stakedQFC.toLocaleString()} QFC`} subtitle={`≈ $${(s.stakedQFC * 12.5).toLocaleString()}`} />
        <StatCard label="stQFC Balance" value={s.stQFCBalance.toLocaleString()} subtitle={`1 stQFC = ${s.exchangeRate} QFC`} />
        <StatCard label="Estimated APY" value={formatPercent(s.estimatedAPY)} subtitle="Rewards auto-compound" />
        <StatCard label="Total Staked" value={`${(s.totalStaked / 1e6).toFixed(2)}M QFC`} subtitle="Protocol-wide" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Action Panel */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6 lg:col-span-2">
          <div className="mb-6 flex gap-1 rounded-lg bg-gray-800 p-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); setAmount(""); }}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  tab === t.key ? "bg-gray-700 text-white" : "text-gray-400 hover:text-gray-300"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "stake" && (
            <div className="space-y-4">
              <TokenInput
                label="Stake QFC"
                value={amount}
                onChange={setAmount}
                tokenSymbol="QFC"
                tokenIcon={TOKENS.QFC.icon}
                balance={1960}
                priceUSD={TOKENS.QFC.priceUSD}
                onMax={() => setAmount("1960")}
              />
              <div className="rounded-lg bg-gray-800/50 p-3 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>You will receive</span>
                  <span className="text-white">
                    {amount ? (parseFloat(amount) / s.exchangeRate).toFixed(4) : "0"} stQFC
                  </span>
                </div>
                <div className="mt-2 flex justify-between text-gray-400">
                  <span>Exchange Rate</span>
                  <span className="text-white">1 stQFC = {s.exchangeRate} QFC</span>
                </div>
              </div>
              <TxButton label="Stake QFC" onClick={handleTx} disabled={!amount} />
            </div>
          )}

          {tab === "unstake" && (
            <div className="space-y-4">
              <TokenInput
                label="Unstake stQFC"
                value={amount}
                onChange={setAmount}
                tokenSymbol="stQFC"
                tokenIcon={TOKENS.stQFC.icon}
                balance={s.stQFCBalance}
                priceUSD={TOKENS.stQFC.priceUSD}
                onMax={() => setAmount(String(s.stQFCBalance))}
              />
              <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-3 text-sm text-amber-300">
                Unstaking has a {s.lockPeriod}-day cooldown period. After the cooldown, you can claim your QFC from the Claim tab.
              </div>
              <div className="rounded-lg bg-gray-800/50 p-3 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>You will receive (after cooldown)</span>
                  <span className="text-white">
                    {amount ? (parseFloat(amount) * s.exchangeRate).toFixed(4) : "0"} QFC
                  </span>
                </div>
              </div>
              <TxButton label="Request Unstake" onClick={handleTx} disabled={!amount} />
            </div>
          )}

          {tab === "claim" && (
            <div className="space-y-4">
              {s.pendingWithdrawals.length === 0 ? (
                <div className="py-12 text-center text-gray-500">No pending withdrawals</div>
              ) : (
                <div className="space-y-3">
                  {s.pendingWithdrawals.map((w) => {
                    const isClaimable = w.status === "claimable";
                    const timeLeft = Math.max(0, w.claimableAt - Date.now());
                    const daysLeft = Math.ceil(timeLeft / 86400000);

                    return (
                      <div key={w.requestId} className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-800/50 p-4">
                        <div>
                          <p className="text-sm font-medium text-white">{w.amount} stQFC</p>
                          <p className="text-xs text-gray-500">
                            ≈ {(w.amount * s.exchangeRate).toFixed(2)} QFC
                          </p>
                        </div>
                        <div className="text-right">
                          {isClaimable ? (
                            <button
                              onClick={handleTx}
                              className="rounded-lg bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/30"
                            >
                              Claim
                            </button>
                          ) : (
                            <div>
                              <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-400">
                                {daysLeft}d remaining
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Info Sidebar */}
        <div className="space-y-4 lg:col-span-1">
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
            <h3 className="mb-3 text-sm font-semibold text-gray-300">How stQFC Works</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <p>Stake your QFC tokens to receive stQFC, a liquid staking derivative that accrues staking rewards over time.</p>
              <p>The stQFC/QFC exchange rate increases as rewards accumulate, meaning your stQFC becomes worth more QFC over time.</p>
              <p>You can use stQFC in other DeFi protocols while your QFC earns staking rewards.</p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
            <h3 className="mb-3 text-sm font-semibold text-gray-300">Rewards Earned</h3>
            <p className="text-2xl font-bold text-emerald-400">{s.rewardsEarned} QFC</p>
            <p className="mt-1 text-sm text-gray-500">≈ ${(s.rewardsEarned * 12.5).toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
