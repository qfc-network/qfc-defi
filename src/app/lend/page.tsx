"use client";

import { useState } from "react";
import { MOCK_LENDING_MARKETS, MOCK_LENDING_ACCOUNT, LendingMarket } from "@/lib/mock-data";
import { formatCompact, formatPercent, formatUSD } from "@/lib/format";
import HealthBar from "@/components/HealthBar";
import Modal from "@/components/Modal";
import TokenInput from "@/components/TokenInput";
import TxButton from "@/components/TxButton";

type ModalAction = "supply" | "withdraw" | "borrow" | "repay";

export default function LendPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<ModalAction>("supply");
  const [selectedMarket, setSelectedMarket] = useState<LendingMarket | null>(null);
  const [amount, setAmount] = useState("");
  const acct = MOCK_LENDING_ACCOUNT;

  const openModal = (market: LendingMarket, action: ModalAction) => {
    setSelectedMarket(market);
    setModalAction(action);
    setAmount("");
    setModalOpen(true);
  };

  const handleTx = async () => {
    await new Promise((r) => setTimeout(r, 1500));
    setAmount("");
    setModalOpen(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Lending</h1>
        <p className="mt-1 text-gray-400">Supply assets to earn interest, borrow against your collateral</p>
      </div>

      {/* Account Overview */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4">
          <p className="text-xs text-gray-500">Total Supplied</p>
          <p className="mt-1 text-lg font-bold text-white">{formatUSD(acct.totalCollateral)}</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4">
          <p className="text-xs text-gray-500">Total Borrowed</p>
          <p className="mt-1 text-lg font-bold text-white">{formatUSD(acct.totalDebt)}</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4">
          <p className="text-xs text-gray-500">Available to Borrow</p>
          <p className="mt-1 text-lg font-bold text-white">{formatUSD(acct.availableBorrow)}</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4">
          <p className="text-xs text-gray-500">Borrow Limit</p>
          <div className="mt-1 flex items-center gap-2">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-800">
              <div className="h-full rounded-full bg-cyan-500" style={{ width: `${acct.borrowLimit}%` }} />
            </div>
            <span className="text-sm font-medium text-white">{acct.borrowLimit}%</span>
          </div>
        </div>
        <div className="col-span-2 rounded-xl border border-gray-800 bg-gray-900/60 p-4 lg:col-span-1">
          <HealthBar healthFactor={acct.healthFactor} />
        </div>
      </div>

      {/* Supply Markets */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">Supply Markets</h2>
        <div className="overflow-x-auto rounded-xl border border-gray-800">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-left text-xs text-gray-500">
                <th className="p-4">Asset</th>
                <th className="p-4">Supply APY</th>
                <th className="p-4">Total Supply</th>
                <th className="p-4">Liquidity</th>
                <th className="p-4">Your Supplied</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {MOCK_LENDING_MARKETS.map((m) => (
                <tr key={m.token.symbol} className="transition-colors hover:bg-gray-900/50">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{m.token.icon}</span>
                      <div>
                        <p className="font-medium text-white">{m.token.symbol}</p>
                        <p className="text-xs text-gray-500">{m.token.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-emerald-400">{formatPercent(m.supplyAPY)}</td>
                  <td className="p-4 text-sm text-gray-300">{formatCompact(m.totalSupply * m.token.priceUSD)}</td>
                  <td className="p-4 text-sm text-gray-300">{formatCompact(m.liquidity * m.token.priceUSD)}</td>
                  <td className="p-4 text-sm text-white">
                    {m.userSupplied > 0 ? `${m.userSupplied.toLocaleString()} ${m.token.symbol}` : "—"}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => openModal(m, "supply")} className="rounded-lg bg-cyan-500/20 px-3 py-1.5 text-xs font-medium text-cyan-400 hover:bg-cyan-500/30">
                        Supply
                      </button>
                      {m.userSupplied > 0 && (
                        <button onClick={() => openModal(m, "withdraw")} className="rounded-lg bg-gray-700 px-3 py-1.5 text-xs font-medium text-gray-300 hover:bg-gray-600">
                          Withdraw
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Borrow Markets */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">Borrow Markets</h2>
        <div className="overflow-x-auto rounded-xl border border-gray-800">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-left text-xs text-gray-500">
                <th className="p-4">Asset</th>
                <th className="p-4">Borrow APY</th>
                <th className="p-4">Total Borrow</th>
                <th className="p-4">Liquidity</th>
                <th className="p-4">Your Borrowed</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {MOCK_LENDING_MARKETS.map((m) => (
                <tr key={m.token.symbol} className="transition-colors hover:bg-gray-900/50">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{m.token.icon}</span>
                      <div>
                        <p className="font-medium text-white">{m.token.symbol}</p>
                        <p className="text-xs text-gray-500">{m.token.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-amber-400">{formatPercent(m.borrowAPY)}</td>
                  <td className="p-4 text-sm text-gray-300">{formatCompact(m.totalBorrow * m.token.priceUSD)}</td>
                  <td className="p-4 text-sm text-gray-300">{formatCompact(m.liquidity * m.token.priceUSD)}</td>
                  <td className="p-4 text-sm text-white">
                    {m.userBorrowed > 0 ? `${m.userBorrowed.toLocaleString()} ${m.token.symbol}` : "—"}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => openModal(m, "borrow")} className="rounded-lg bg-amber-500/20 px-3 py-1.5 text-xs font-medium text-amber-400 hover:bg-amber-500/30">
                        Borrow
                      </button>
                      {m.userBorrowed > 0 && (
                        <button onClick={() => openModal(m, "repay")} className="rounded-lg bg-gray-700 px-3 py-1.5 text-xs font-medium text-gray-300 hover:bg-gray-600">
                          Repay
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Supply/Withdraw/Borrow/Repay Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={selectedMarket ? `${modalAction.charAt(0).toUpperCase() + modalAction.slice(1)} ${selectedMarket.token.symbol}` : ""}>
        {selectedMarket && (
          <div className="space-y-4">
            <TokenInput
              label={`${modalAction.charAt(0).toUpperCase() + modalAction.slice(1)} Amount`}
              value={amount}
              onChange={setAmount}
              tokenSymbol={selectedMarket.token.symbol}
              tokenIcon={selectedMarket.token.icon}
              priceUSD={selectedMarket.token.priceUSD}
              balance={
                modalAction === "withdraw" ? selectedMarket.userSupplied :
                modalAction === "repay" ? selectedMarket.userBorrowed :
                10000
              }
              onMax={() => setAmount(String(
                modalAction === "withdraw" ? selectedMarket.userSupplied :
                modalAction === "repay" ? selectedMarket.userBorrowed :
                10000
              ))}
            />
            <div className="rounded-lg bg-gray-800/50 p-3 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>{modalAction === "supply" || modalAction === "withdraw" ? "Supply APY" : "Borrow APY"}</span>
                <span className={modalAction === "supply" || modalAction === "withdraw" ? "text-emerald-400" : "text-amber-400"}>
                  {formatPercent(modalAction === "supply" || modalAction === "withdraw" ? selectedMarket.supplyAPY : selectedMarket.borrowAPY)}
                </span>
              </div>
            </div>
            <TxButton
              label={`${modalAction.charAt(0).toUpperCase() + modalAction.slice(1)} ${selectedMarket.token.symbol}`}
              onClick={handleTx}
              disabled={!amount}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
