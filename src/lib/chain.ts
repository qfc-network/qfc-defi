import { ethers } from "ethers";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "http://localhost:8545";
const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "31337");

export function getProvider(): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(RPC_URL, CHAIN_ID);
}

export async function getSigner(): Promise<ethers.JsonRpcSigner | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eth = typeof window !== "undefined" ? (window as any).ethereum : null;
  if (!eth) return null;
  const provider = new ethers.BrowserProvider(eth);
  return provider.getSigner();
}

export function getContract(
  address: string,
  abi: string[],
  signerOrProvider: ethers.Signer | ethers.Provider
): ethers.Contract {
  return new ethers.Contract(address, abi, signerOrProvider);
}

export { CHAIN_ID, RPC_URL };
