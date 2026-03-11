"use client";

import { useState } from "react";
import TokenInput from "@/components/TokenInput";
import TxButton from "@/components/TxButton";
import StatCard from "@/components/StatCard";
import HealthBar from "@/components/HealthBar";
import { MOCK_CDP, TOKENS } from "@/lib/mock-data";
import { formatUSD, formatPercent } from "@/lib/format";

type Tab = "deposit" | "mint" | "repay" | "withdraw";

export default function BorrowPage() {
  const [tab, setTab] = useState<Tab>("deposit");
  const [amount, setAmount] = useState("");
  const cdp = MOCK_CDP;

  const tabs: { key: Tab; label: string }[] = [
    { key: "deposit", label: "Deposit" },
    { key: "mint", label: "Mint QUSD" },
    { key: "repay", label: "Repay" },
    { key: "withdraw", label: "Withdraw" },
  ];

  const handleTx = async () => {
    await new Promise((r) => setTimeout(r, 1500));
    setAmount("");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Borrow QUSD</h1>
        <p className="mt-1 text-gray-400">Deposit QFC as collateral and mint QUSD stablecoin</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Position Stats */}
        <div className="space-y-4 lg:col-span-1">
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
            <h3 className="mb-4 text-sm font-semibold text-gray-300">Your CDP Position</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Collateral</span>
                <span className="text-sm font-medium text-white">{cdp.collateral.toLocaleString()} QFC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Collateral Value</span>
                <span className="text-sm font-medium text-white">{formatUSD(cdp.collateralUSD)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Debt</span>
                <span className="text-sm font-medium text-white">{cdp.debt.toLocaleString()} QUSD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Accrued Fees</span>
                <span className="text-sm font-medium text-amber-400">{cdp.accruedFees} QUSD</span>
              </div>
              <hr className="border-gray-800" />
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Collateral Ratio</span>
                <span className="text-sm font-medium text-emerald-400">{cdp.collateralRatio}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Liquidation Price</span>
                <span className="text-sm font-medium text-rose-400">${cdp.liquidationPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Stability Fee</span>
                <span className="text-sm font-medium text-gray-300">{formatPercent(cdp.stabilityFee)} / yr</span>
              </div>
            </div>
            <div className="mt-4">
              <HealthBar healthFactor={cdp.healthFactor} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Min Ratio" value={`${cdp.minCollateralRatio}%`} />
            <StatCard label="Liq. Threshold" value={`${cdp.liquidationThreshold}%`} />
          </div>
        </div>

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

          <div className="space-y-4">
            {tab === "deposit" && (
              <>
                <TokenInput
                  label="Deposit QFC Collateral"
                  value={amount}
                  onChange={setAmount}
                  tokenSymbol="QFC"
                  tokenIcon={TOKENS.QFC.icon}
                  balance={1960}
                  priceUSD={TOKENS.QFC.priceUSD}
                  onMax={() => setAmount("1960")}
                />
                <TxButton label="Deposit Collateral" onClick={handleTx} disabled={!amount} />
              </>
            )}

            {tab === "mint" && (
              <>
                <TokenInput
                  label="Mint QUSD"
                  value={amount}
                  onChange={setAmount}
                  tokenSymbol="QUSD"
                  tokenIcon={TOKENS.QUSD.icon}
                  priceUSD={TOKENS.QUSD.priceUSD}
                />
                <div className="rounded-lg bg-gray-800/50 p-3 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>New Collateral Ratio</span>
                    <span className="text-white">
                      {amount
                        ? formatPercent((cdp.collateralUSD / (cdp.debt + parseFloat(amount || "0"))) * 100)
                        : `${cdp.collateralRatio}%`}
                    </span>
                  </div>
                </div>
                <TxButton label="Mint QUSD" onClick={handleTx} disabled={!amount} />
              </>
            )}

            {tab === "repay" && (
              <>
                <TokenInput
                  label="Repay QUSD Debt"
                  value={amount}
                  onChange={setAmount}
                  tokenSymbol="QUSD"
                  tokenIcon={TOKENS.QUSD.icon}
                  balance={cdp.debt + cdp.accruedFees}
                  priceUSD={TOKENS.QUSD.priceUSD}
                  onMax={() => setAmount(String(cdp.debt + cdp.accruedFees))}
                />
                <TxButton label="Repay Debt" onClick={handleTx} disabled={!amount} />
              </>
            )}

            {tab === "withdraw" && (
              <>
                <TokenInput
                  label="Withdraw QFC Collateral"
                  value={amount}
                  onChange={setAmount}
                  tokenSymbol="QFC"
                  tokenIcon={TOKENS.QFC.icon}
                  balance={cdp.collateral}
                  priceUSD={TOKENS.QFC.priceUSD}
                  onMax={() => setAmount(String(cdp.collateral))}
                />
                <div className="rounded-lg bg-gray-800/50 p-3 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Remaining Collateral</span>
                    <span className="text-white">
                      {amount ? (cdp.collateral - parseFloat(amount || "0")).toLocaleString() : cdp.collateral.toLocaleString()} QFC
                    </span>
                  </div>
                </div>
                <TxButton label="Withdraw Collateral" onClick={handleTx} disabled={!amount} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
