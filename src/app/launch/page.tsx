"use client";

import { useState } from "react";
import { MOCK_LAUNCHES, LaunchData } from "@/lib/mock-data";
import { formatUSD, formatPercent } from "@/lib/format";
import Modal from "@/components/Modal";
import TokenInput from "@/components/TokenInput";
import TxButton from "@/components/TxButton";
import { TOKENS } from "@/lib/mock-data";

type ViewTab = "active" | "contributions";

export default function LaunchPage() {
  const [viewTab, setViewTab] = useState<ViewTab>("active");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLaunch, setSelectedLaunch] = useState<LaunchData | null>(null);
  const [amount, setAmount] = useState("");

  const activeLaunches = MOCK_LAUNCHES.filter((l) => !l.finalized && l.endTime > Date.now());
  const myContributions = MOCK_LAUNCHES.filter((l) => l.userContribution > 0);

  const openDetail = (launch: LaunchData) => {
    setSelectedLaunch(launch);
    setAmount("");
    setModalOpen(true);
  };

  const handleTx = async () => {
    await new Promise((r) => setTimeout(r, 1500));
    setAmount("");
    setModalOpen(false);
  };

  const daysLeft = (endTime: number) => {
    const ms = endTime - Date.now();
    if (ms <= 0) return "Ended";
    const d = Math.ceil(ms / 86400000);
    return `${d}d left`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Launchpad</h1>
        <p className="mt-1 text-gray-400">Participate in new token launches on QFC</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-gray-800 p-1 sm:w-fit">
        <button
          onClick={() => setViewTab("active")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            viewTab === "active" ? "bg-gray-700 text-white" : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Active Launches ({activeLaunches.length})
        </button>
        <button
          onClick={() => setViewTab("contributions")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            viewTab === "contributions" ? "bg-gray-700 text-white" : "text-gray-400 hover:text-gray-300"
          }`}
        >
          My Contributions ({myContributions.length})
        </button>
      </div>

      {/* Launch Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(viewTab === "active" ? activeLaunches : myContributions).map((launch) => {
          const progress = (launch.raised / launch.hardCap) * 100;

          return (
            <div key={launch.id} className="rounded-xl border border-gray-800 bg-gray-900/60 p-5 transition-colors hover:border-gray-700">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">{launch.tokenName}</h3>
                  <p className="text-xs text-gray-500">${launch.tokenSymbol}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                  launch.finalized
                    ? "bg-gray-500/20 text-gray-400"
                    : launch.endTime < Date.now()
                    ? "bg-rose-500/20 text-rose-400"
                    : "bg-emerald-500/20 text-emerald-400"
                }`}>
                  {launch.finalized ? "Completed" : daysLeft(launch.endTime)}
                </span>
              </div>

              <p className="mb-4 text-sm text-gray-400">{launch.description}</p>

              <div className="mb-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Token Price</span>
                  <span className="text-white">${launch.price} QUSD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Hard Cap</span>
                  <span className="text-white">{formatUSD(launch.hardCap)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Raised</span>
                  <span className="text-white">{formatUSD(launch.raised)}</span>
                </div>
                {launch.userContribution > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Your Contribution</span>
                    <span className="text-cyan-400">{formatUSD(launch.userContribution)}</span>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="mb-1 flex justify-between text-xs text-gray-500">
                  <span>{formatPercent(progress)} filled</span>
                  <span>{formatUSD(launch.raised)} / {formatUSD(launch.hardCap)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600" style={{ width: `${Math.min(progress, 100)}%` }} />
                </div>
              </div>

              <button
                onClick={() => openDetail(launch)}
                className={`w-full rounded-lg py-2 text-sm font-medium transition-colors ${
                  launch.finalized
                    ? "border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500"
                }`}
              >
                {launch.finalized ? "View Details" : "Contribute"}
              </button>
            </div>
          );
        })}

        {(viewTab === "active" ? activeLaunches : myContributions).length === 0 && (
          <div className="col-span-full py-16 text-center text-gray-500">
            {viewTab === "active" ? "No active launches right now" : "You haven't contributed to any launches yet"}
          </div>
        )}
      </div>

      {/* Launch Detail Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={selectedLaunch ? selectedLaunch.tokenName : ""}>
        {selectedLaunch && (
          <div className="space-y-4">
            <p className="text-sm text-gray-400">{selectedLaunch.description}</p>

            <div className="rounded-lg bg-gray-800/50 p-3 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Token Price</span>
                <span className="text-white">${selectedLaunch.price} QUSD</span>
              </div>
              <div className="mt-2 flex justify-between text-gray-400">
                <span>Progress</span>
                <span className="text-white">{formatPercent((selectedLaunch.raised / selectedLaunch.hardCap) * 100)}</span>
              </div>
              <div className="mt-2 flex justify-between text-gray-400">
                <span>Remaining</span>
                <span className="text-white">{formatUSD(selectedLaunch.hardCap - selectedLaunch.raised)}</span>
              </div>
              {selectedLaunch.userContribution > 0 && (
                <div className="mt-2 flex justify-between text-gray-400">
                  <span>Your Contribution</span>
                  <span className="text-cyan-400">{formatUSD(selectedLaunch.userContribution)}</span>
                </div>
              )}
            </div>

            {!selectedLaunch.finalized && selectedLaunch.endTime > Date.now() && (
              <>
                <TokenInput
                  label="Contribute QUSD"
                  value={amount}
                  onChange={setAmount}
                  tokenSymbol="QUSD"
                  tokenIcon={TOKENS.QUSD.icon}
                  balance={50000}
                  priceUSD={TOKENS.QUSD.priceUSD}
                  onMax={() => setAmount(String(selectedLaunch.hardCap - selectedLaunch.raised))}
                />
                <TxButton label="Contribute" onClick={handleTx} disabled={!amount} />
              </>
            )}

            {selectedLaunch.finalized && selectedLaunch.userContribution > 0 && (
              <TxButton label="Claim Tokens" onClick={handleTx} />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
