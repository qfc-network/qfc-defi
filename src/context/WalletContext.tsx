"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  qfcBalance: number;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  qfcBalance: 0,
  connect: async () => {},
  disconnect: () => {},
});

const STORAGE_KEY = "qfc_defi_wallet";

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [qfcBalance] = useState(1960);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setAddress(saved);
  }, []);

  const connect = useCallback(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const eth = typeof window !== "undefined" ? (window as any).ethereum : null;
    if (eth) {
      try {
        const accounts = await eth.request({ method: "eth_requestAccounts" });
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          localStorage.setItem(STORAGE_KEY, accounts[0]);
          return;
        }
      } catch {
        // fallthrough to mock
      }
    }
    const mock = "0x1a2B3c4D5e6F7890AbCdEf1234567890aBcDeF12";
    setAddress(mock);
    localStorage.setItem(STORAGE_KEY, mock);
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <WalletContext.Provider value={{ address, isConnected: !!address, qfcBalance, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
