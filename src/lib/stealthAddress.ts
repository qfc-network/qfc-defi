/**
 * Stealth Address SDK — client-side helpers for EIP-5564 stealth transfers.
 *
 * Usage:
 *   // Recipient registers once
 *   const keys = generateStealthKeys();
 *   await registerMetaAddress(signer, registryAddr, keys);
 *
 *   // Sender sends to stealth address
 *   const { stealthAddr, ephemeralPubKey, viewTag } = computeStealthAddress(recipientMeta);
 *   await sendStealth(signer, registryAddr, tokenAddr, stealthAddr, amount, ephemeralPubKey, viewTag);
 *
 *   // Recipient scans for incoming transfers
 *   const transfers = await scanAnnouncements(provider, registryAddr, viewingKey, fromBlock);
 */

import { ethers } from "ethers";

// --- Types ---

export interface StealthKeys {
  spendingKey: Uint8Array;   // 32 bytes private key
  viewingKey: Uint8Array;    // 32 bytes private key
  spendingPubKey: string;    // hex compressed pubkey (33 bytes)
  viewingPubKey: string;     // hex compressed pubkey (33 bytes)
}

export interface StealthTransferData {
  stealthAddress: string;
  ephemeralPubKey: string;
  viewTag: string;
}

export interface ScannedTransfer {
  token: string;
  amount: bigint;
  stealthAddress: string;
  ephemeralPubKey: string;
  viewTag: string;
  timestamp: number;
}

// --- ABI ---

const STEALTH_ABI = [
  "function registerMetaAddress(bytes _spendingPubKey, bytes _viewingPubKey) external",
  "function updateMetaAddress(bytes _spendingPubKey, bytes _viewingPubKey) external",
  "function sendStealth(address _token, address _stealthAddress, uint256 _amount, bytes _ephemeralPubKey, bytes32 _viewTag) external",
  "function getMetaAddress(address _user) external view returns (bytes spendingPubKey, bytes viewingPubKey)",
  "function getAnnouncements(uint256 _fromIndex, uint256 _count) external view returns (tuple(address token, uint256 amount, address stealthAddress, bytes ephemeralPubKey, bytes32 viewTag, uint256 timestamp)[])",
  "function scanByViewTag(bytes32 _viewTag, uint256 _fromIndex, uint256 _maxResults) external view returns (tuple(address token, uint256 amount, address stealthAddress, bytes ephemeralPubKey, bytes32 viewTag, uint256 timestamp)[])",
  "function announcementCount() external view returns (uint256)",
];

// --- Key generation ---

/**
 * Generate a new stealth keypair (spending + viewing keys)
 */
export function generateStealthKeys(): StealthKeys {
  const spendingWallet = ethers.Wallet.createRandom();
  const viewingWallet = ethers.Wallet.createRandom();

  return {
    spendingKey: ethers.getBytes(spendingWallet.privateKey),
    viewingKey: ethers.getBytes(viewingWallet.privateKey),
    spendingPubKey: spendingWallet.signingKey.compressedPublicKey,
    viewingPubKey: viewingWallet.signingKey.compressedPublicKey,
  };
}

/**
 * Compute a stealth address for a recipient
 * Simplified: stealthAddr = hash(ephemeralPriv, viewingPubKey) → derive address
 */
export function computeStealthAddress(
  recipientSpendingPubKey: string,
  recipientViewingPubKey: string,
): StealthTransferData {
  // Generate ephemeral keypair
  const ephemeralWallet = ethers.Wallet.createRandom();
  const ephemeralPubKey = ephemeralWallet.signingKey.compressedPublicKey;

  // Compute shared secret: hash(ephemeralPrivKey, viewingPubKey)
  const sharedSecret = ethers.keccak256(
    ethers.solidityPacked(
      ["bytes", "bytes"],
      [ephemeralWallet.privateKey, recipientViewingPubKey]
    )
  );

  // viewTag = first 32 bytes of shared secret (for fast scanning)
  const viewTag = sharedSecret;

  // Derive stealth address: hash(sharedSecret, spendingPubKey) → address
  const stealthAddress = ethers.getAddress(
    "0x" + ethers.keccak256(
      ethers.solidityPacked(
        ["bytes32", "bytes"],
        [sharedSecret, recipientSpendingPubKey]
      )
    ).slice(26) // last 20 bytes
  );

  return { stealthAddress, ephemeralPubKey, viewTag };
}

/**
 * Scan announcements to find transfers addressed to us
 * Uses viewTag for fast filtering
 */
export function checkViewTag(
  viewingKey: Uint8Array,
  ephemeralPubKey: string,
  expectedViewTag: string,
): boolean {
  const sharedSecret = ethers.keccak256(
    ethers.solidityPacked(
      ["bytes", "bytes"],
      [ethers.hexlify(viewingKey), ephemeralPubKey]
    )
  );
  // Note: in real ECDH, shared secret = viewingKey * ephemeralPubKey (point multiplication)
  // This simplified version uses hash-based derivation for demonstration
  return sharedSecret === expectedViewTag;
}

// --- Contract interaction helpers ---

/**
 * Register stealth meta-address on-chain
 */
export async function registerMetaAddress(
  signer: ethers.Signer,
  registryAddress: string,
  keys: StealthKeys,
): Promise<ethers.TransactionReceipt | null> {
  const contract = new ethers.Contract(registryAddress, STEALTH_ABI, signer);
  const tx = await contract.registerMetaAddress(keys.spendingPubKey, keys.viewingPubKey);
  return tx.wait();
}

/**
 * Send tokens to a stealth address
 */
export async function sendStealth(
  signer: ethers.Signer,
  registryAddress: string,
  tokenAddress: string,
  stealthData: StealthTransferData,
  amount: bigint,
): Promise<ethers.TransactionReceipt | null> {
  // First approve the registry to spend tokens
  const erc20 = new ethers.Contract(tokenAddress, [
    "function approve(address spender, uint256 amount) external returns (bool)",
  ], signer);
  const approveTx = await erc20.approve(registryAddress, amount);
  await approveTx.wait();

  const contract = new ethers.Contract(registryAddress, STEALTH_ABI, signer);
  const tx = await contract.sendStealth(
    tokenAddress,
    stealthData.stealthAddress,
    amount,
    stealthData.ephemeralPubKey,
    stealthData.viewTag,
  );
  return tx.wait();
}

/**
 * Fetch announcements from the registry
 */
export async function fetchAnnouncements(
  provider: ethers.Provider,
  registryAddress: string,
  fromIndex: number = 0,
  count: number = 100,
): Promise<ScannedTransfer[]> {
  const contract = new ethers.Contract(registryAddress, STEALTH_ABI, provider);
  const raw = await contract.getAnnouncements(fromIndex, count);
  return raw.map((a: {
    token: string;
    amount: bigint;
    stealthAddress: string;
    ephemeralPubKey: string;
    viewTag: number;
    timestamp: bigint;
  }) => ({
    token: a.token,
    amount: a.amount,
    stealthAddress: a.stealthAddress,
    ephemeralPubKey: a.ephemeralPubKey,
    viewTag: a.viewTag,
    timestamp: Number(a.timestamp),
  }));
}

// --- Serialization ---

export function serializeKeys(keys: StealthKeys): string {
  return JSON.stringify({
    spendingKey: ethers.hexlify(keys.spendingKey),
    viewingKey: ethers.hexlify(keys.viewingKey),
    spendingPubKey: keys.spendingPubKey,
    viewingPubKey: keys.viewingPubKey,
  });
}

export function deserializeKeys(json: string): StealthKeys {
  const data = JSON.parse(json);
  return {
    spendingKey: ethers.getBytes(data.spendingKey),
    viewingKey: ethers.getBytes(data.viewingKey),
    spendingPubKey: data.spendingPubKey,
    viewingPubKey: data.viewingPubKey,
  };
}
