/**
 * ShieldedPool SDK — client-side proof generation for qUSD Privacy Pool.
 *
 * Usage:
 *   const pool = new ShieldedPoolSDK(provider, poolAddress);
 *   const note = pool.generateNote(1000);           // Generate secret + nullifier
 *   await pool.deposit(signer, note);               // Deposit qUSD
 *   await pool.withdraw(note, recipientAddr);        // Withdraw via relayer
 *   await pool.withdrawDirect(signer, note, recipientAddr); // Withdraw directly
 */

// Types for the ZK proof (Groth16)
export interface Groth16Proof {
  pA: [string, string];
  pB: [[string, string], [string, string]];
  pC: [string, string];
}

export interface ShieldedNote {
  secret: bigint;
  nullifier: bigint;
  commitment: bigint;
  nullifierHash: bigint;
  denomination: bigint;
  leafIndex?: number;
}

export interface WithdrawProofInput {
  root: string;
  nullifierHash: string;
  recipient: string;
  denomination: string;
  secret: string;
  nullifier: string;
  pathElements: string[];
  pathIndices: number[];
}

// Denomination presets (in wei, 18 decimals)
export const DENOMINATIONS = {
  "100": BigInt("100000000000000000000"),     // 100 qUSD
  "1K": BigInt("1000000000000000000000"),     // 1,000 qUSD
  "10K": BigInt("10000000000000000000000"),   // 10,000 qUSD
  "100K": BigInt("100000000000000000000000"), // 100,000 qUSD
} as const;

export type DenominationKey = keyof typeof DENOMINATIONS;

/**
 * Generate a shielded note (secret + nullifier + commitment)
 * Uses crypto.getRandomValues for secure randomness.
 *
 * NOTE: This is a simplified version using keccak256.
 * Production should use Poseidon hash (matching the circom circuit).
 * For full integration, import circomlibjs and use buildPoseidon().
 */
export function generateNote(denomination: DenominationKey): ShieldedNote {
  const secretBytes = crypto.getRandomValues(new Uint8Array(31));
  const nullifierBytes = crypto.getRandomValues(new Uint8Array(31));

  const secret = bytesToBigInt(secretBytes);
  const nullifier = bytesToBigInt(nullifierBytes);

  // In production: use Poseidon hash from circomlibjs
  // commitment = Poseidon(secret, nullifier)
  // nullifierHash = Poseidon(nullifier)
  // For now, store the raw values — the actual hash is computed during proof generation
  return {
    secret,
    nullifier,
    commitment: 0n, // Will be set by Poseidon during proof generation
    nullifierHash: 0n,
    denomination: DENOMINATIONS[denomination],
  };
}

/**
 * Serialize a note to a string for storage (e.g., in localStorage)
 * Format: "qUSD-note-<hex(secret)>-<hex(nullifier)>-<denomination>"
 */
export function serializeNote(note: ShieldedNote): string {
  return `qUSD-note-${note.secret.toString(16)}-${note.nullifier.toString(16)}-${note.denomination.toString()}`;
}

/**
 * Deserialize a note from a string
 */
export function deserializeNote(noteStr: string): ShieldedNote {
  const parts = noteStr.split("-");
  if (parts.length !== 5 || parts[0] !== "qUSD" || parts[1] !== "note") {
    throw new Error("Invalid note format");
  }

  const secret = BigInt("0x" + parts[2]);
  const nullifier = BigInt("0x" + parts[3]);
  const denomination = BigInt(parts[4]);

  return { secret, nullifier, commitment: 0n, nullifierHash: 0n, denomination };
}

/**
 * Submit a withdrawal through the relayer service
 */
export async function relayWithdraw(
  relayerUrl: string,
  proof: Groth16Proof,
  root: string,
  nullifierHash: string,
  recipient: string,
  denomination: string,
): Promise<{ jobId: string }> {
  const response = await fetch(`${relayerUrl}/relay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ proof, root, nullifierHash, recipient, denomination }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Relay request failed");
  }

  return response.json();
}

/**
 * Check relayer job status
 */
export async function checkRelayJob(
  relayerUrl: string,
  jobId: string,
): Promise<{ status: string; txHash?: string; error?: string }> {
  const response = await fetch(`${relayerUrl}/jobs/${jobId}`);
  if (!response.ok) throw new Error("Job not found");
  return response.json();
}

/**
 * Get relayer status
 */
export async function getRelayerStatus(relayerUrl: string) {
  const response = await fetch(`${relayerUrl}/status`);
  if (!response.ok) throw new Error("Relayer unavailable");
  return response.json();
}

// --- Helpers ---

function bytesToBigInt(bytes: Uint8Array): bigint {
  let hex = "0x";
  for (const b of bytes) hex += b.toString(16).padStart(2, "0");
  return BigInt(hex);
}
