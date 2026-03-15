"use client";

import { useWallet } from "@/context/WalletContext";
import { formatUSD, formatQfc, formatPercent } from "@/lib/format";
import { MOCK_USER_POSITION } from "@/lib/mock-data";
import StatCard from "@/components/StatCard";
import HealthBar from "@/components/HealthBar";
import PositionCard from "@/components/PositionCard";

export default function HomePage() {
  const { isConnected, connect } = useWallet();
  const p = MOCK_USER_POSITION;

  if (!isConnected) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-3xl font-bold text-white">
          Q
        </div>
        <h1 className="mb-2 text-4xl font-bold text-white">QFC DeFi</h1>
        <p className="mb-8 max-w-md text-gray-400">
          Borrow QUSD, lend assets, stake QFC, deposit into yield vaults, and participate in token launches — all on QFC blockchain.
        </p>
        <button
          onClick={connect}
          className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:from-cyan-400 hover:to-blue-500"
        >
          Connect Wallet to Start
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-gray-400">Your DeFi positions at a glance</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Collateral" value={formatUSD(p.collateralValue)} subtitle={formatQfc(p.collateralValue / 12.5)} />
        <StatCard label="Debt" value={formatUSD(p.debtValue)} subtitle="qUSD borrowed" />
        <StatCard label="Staked" value={formatUSD(p.stakedValue)} subtitle="QFC + stQFC" />
        <StatCard label="Vaults" value={formatUSD(p.vaultBalance)} subtitle="Yield deposits" />
        <div className="col-span-2 rounded-xl border border-gray-800 bg-gray-900/60 p-5 lg:col-span-1">
          <p className="text-sm text-gray-500">Net Worth</p>
          <p className="mt-1 text-2xl font-bold text-gradient">
            {formatUSD(p.collateralValue + p.stakedValue + p.vaultBalance - p.debtValue)}
          </p>
          <div className="mt-3">
            <HealthBar healthFactor={p.healthFactor} />
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">Your Positions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <PositionCard
            title="qUSD Borrow (CDP)"
            href="/borrow"
            accentColor="cyan"
            stats={[
              { label: "Collateral", value: formatUSD(15000) },
              { label: "Debt", value: "$5,000 QUSD" },
              { label: "Health", value: "2.31" },
            ]}
          />
          <PositionCard
            title="Lending"
            href="/lend"
            accentColor="blue"
            stats={[
              { label: "Supplied", value: formatUSD(8750) },
              { label: "Borrowed", value: formatUSD(4200) },
              { label: "Net APY", value: formatPercent(3.2) },
            ]}
          />
          <PositionCard
            title="Staking (stQFC)"
            href="/stake"
            accentColor="emerald"
            stats={[
              { label: "Staked", value: "1,200 QFC" },
              { label: "stQFC", value: "1,145.5" },
              { label: "APY", value: formatPercent(8.4) },
            ]}
          />
          <PositionCard
            title="QFC Yield Vault"
            href="/vaults"
            accentColor="purple"
            stats={[
              { label: "Deposited", value: "400 QFC" },
              { label: "Share Value", value: formatUSD(5200) },
              { label: "APY", value: formatPercent(12.4) },
            ]}
          />
          <PositionCard
            title="qUSD Stable Vault"
            href="/vaults"
            accentColor="amber"
            stats={[
              { label: "Deposited", value: "5,000 QUSD" },
              { label: "Share Value", value: "$5,112" },
              { label: "APY", value: formatPercent(8.2) },
            ]}
          />
          <PositionCard
            title="Launchpad"
            href="/launch"
            accentColor="cyan"
            stats={[
              { label: "Active Launches", value: "2" },
              { label: "Your Contributions", value: formatUSD(3500) },
              { label: "Tokens Claimable", value: "1" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
