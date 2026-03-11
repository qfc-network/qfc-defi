"use client";

import { useState } from "react";
import { MOCK_VAULTS, VaultData } from "@/lib/mock-data";
import { formatPercent, formatCompact, formatUSD } from "@/lib/format";
import Modal from "@/components/Modal";
import TokenInput from "@/components/TokenInput";
import TxButton from "@/components/TxButton";

type ModalAction = "deposit" | "withdraw";

export default function VaultsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<ModalAction>("deposit");
  const [selectedVault, setSelectedVault] = useState<VaultData | null>(null);
  const [amount, setAmount] = useState("");

  const openModal = (vault: VaultData, action: ModalAction) => {
    setSelectedVault(vault);
    setModalAction(action);
    setAmount("");
    setModalOpen(true);
  };

  const handleTx = async () => {
    await new Promise((r) => setTimeout(r, 1500));
    setAmount("");
    setModalOpen(false);
  };

  const totalDeposited = MOCK_VAULTS.reduce((acc, v) => acc + v.userDeposit * v.asset.priceUSD, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Yield Vaults</h1>
        <p className="mt-1 text-gray-400">Deposit assets into automated yield strategies</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
          <p className="text-sm text-gray-500">Your Total Deposits</p>
          <p className="mt-1 text-2xl font-bold text-white">{formatUSD(totalDeposited)}</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
          <p className="text-sm text-gray-500">Vaults Available</p>
          <p className="mt-1 text-2xl font-bold text-white">{MOCK_VAULTS.length}</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
          <p className="text-sm text-gray-500">Total TVL</p>
          <p className="mt-1 text-2xl font-bold text-white">
            ${formatCompact(MOCK_VAULTS.reduce((acc, v) => acc + v.tvl, 0))}
          </p>
        </div>
      </div>

      {/* Vault Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_VAULTS.map((vault) => (
          <div key={vault.symbol} className="rounded-xl border border-gray-800 bg-gray-900/60 p-5 transition-colors hover:border-gray-700">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{vault.asset.icon}</span>
                <div>
                  <h3 className="font-semibold text-white">{vault.name}</h3>
                  <p className="text-xs text-gray-500">{vault.symbol}</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm font-semibold text-emerald-400">
                {formatPercent(vault.apy)} APY
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">TVL</span>
                <span className="text-white">${formatCompact(vault.tvl)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Share Price</span>
                <span className="text-white">{vault.sharePrice.toFixed(4)} {vault.asset.symbol}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Your Deposit</span>
                <span className="text-white">
                  {vault.userDeposit > 0
                    ? `${vault.userDeposit.toLocaleString()} ${vault.asset.symbol}`
                    : "—"}
                </span>
              </div>
              {vault.userDeposit > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Your Shares</span>
                  <span className="text-white">{vault.userShares.toLocaleString()} {vault.symbol}</span>
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => openModal(vault, "deposit")}
                className="flex-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 py-2 text-sm font-medium text-white hover:from-cyan-400 hover:to-blue-500"
              >
                Deposit
              </button>
              {vault.userDeposit > 0 && (
                <button
                  onClick={() => openModal(vault, "withdraw")}
                  className="flex-1 rounded-lg border border-gray-700 bg-gray-800 py-2 text-sm font-medium text-white hover:bg-gray-700"
                >
                  Withdraw
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Deposit/Withdraw Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedVault ? `${modalAction === "deposit" ? "Deposit to" : "Withdraw from"} ${selectedVault.name}` : ""}
      >
        {selectedVault && (
          <div className="space-y-4">
            <TokenInput
              label={modalAction === "deposit" ? "Deposit Amount" : "Withdraw Amount"}
              value={amount}
              onChange={setAmount}
              tokenSymbol={modalAction === "deposit" ? selectedVault.asset.symbol : selectedVault.symbol}
              tokenIcon={selectedVault.asset.icon}
              priceUSD={selectedVault.asset.priceUSD}
              balance={modalAction === "deposit" ? 10000 : selectedVault.userShares}
              onMax={() => setAmount(String(modalAction === "deposit" ? 10000 : selectedVault.userShares))}
            />
            <div className="rounded-lg bg-gray-800/50 p-3 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>APY</span>
                <span className="text-emerald-400">{formatPercent(selectedVault.apy)}</span>
              </div>
              <div className="mt-2 flex justify-between text-gray-400">
                <span>Share Price</span>
                <span className="text-white">{selectedVault.sharePrice.toFixed(4)} {selectedVault.asset.symbol}</span>
              </div>
              {amount && (
                <div className="mt-2 flex justify-between text-gray-400">
                  <span>{modalAction === "deposit" ? "Shares to receive" : "Assets to receive"}</span>
                  <span className="text-white">
                    {modalAction === "deposit"
                      ? (parseFloat(amount) / selectedVault.sharePrice).toFixed(4)
                      : (parseFloat(amount) * selectedVault.sharePrice).toFixed(4)}
                    {" "}{modalAction === "deposit" ? selectedVault.symbol : selectedVault.asset.symbol}
                  </span>
                </div>
              )}
            </div>
            <TxButton
              label={`${modalAction === "deposit" ? "Deposit" : "Withdraw"} ${modalAction === "deposit" ? selectedVault.asset.symbol : selectedVault.symbol}`}
              onClick={handleTx}
              disabled={!amount}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
