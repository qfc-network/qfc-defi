/**
 * Browser-side ZK Proof Generator for ShieldedPool
 *
 * Loads snarkjs in the browser to generate Groth16 proofs client-side.
 * The proving key (zkey) and witness generator (wasm) are fetched from
 * a CDN or the relayer service.
 *
 * Usage:
 *   const prover = new ZKProver("/circuits/withdraw.wasm", "/circuits/withdraw_final.zkey");
 *   await prover.init();
 *   const { proof, publicSignals } = await prover.generateWithdrawProof(input);
 */

export interface WithdrawInput {
  // Public
  root: string;
  nullifierHash: string;
  recipient: string;
  denomination: string;
  // Private
  secret: string;
  nullifier: string;
  pathElements: string[];
  pathIndices: number[];
}

export interface ComplianceWithdrawInput extends WithdrawInput {
  associationSetRoot: string;
  depositorAddress: string;
  assocPathElements: string[];
  assocPathIndices: number[];
}

export interface Groth16Proof {
  pA: [string, string];
  pB: [[string, string], [string, string]];
  pC: [string, string];
}

export interface ProofResult {
  proof: Groth16Proof;
  publicSignals: string[];
}

/**
 * Load snarkjs dynamically (works in browser and Node.js)
 */
type SnarkProofLike = {
  pi_a: [string, string, ...unknown[]];
  pi_b: [[string, string, ...unknown[]], [string, string, ...unknown[]], ...unknown[]];
  pi_c: [string, string, ...unknown[]];
};

type SnarkjsLike = {
  groth16: {
    fullProve: (
      input: WithdrawInput | ComplianceWithdrawInput,
      wasmUrl: string,
      zkeyUrl: string,
    ) => Promise<{ proof: SnarkProofLike; publicSignals: string[] }>;
    verify: (verificationKey: unknown, publicSignals: string[], proof: unknown) => Promise<boolean>;
  };
};

async function loadSnarkjs(): Promise<SnarkjsLike> {
  // In Next.js, snarkjs must be loaded dynamically on client side
  if (typeof window !== "undefined") {
    // Browser: load from CDN or bundled
    const snarkjs = await import("snarkjs");
    return snarkjs as SnarkjsLike;
  }
  // Node.js fallback via dynamic import to satisfy eslint
  const snarkjs = await import("snarkjs");
  return snarkjs as SnarkjsLike;
}

export class ZKProver {
  private wasmUrl: string;
  private zkeyUrl: string;
  private snarkjs: SnarkjsLike | null = null;
  private ready = false;

  /**
   * @param wasmUrl URL to the witness generator WASM file
   * @param zkeyUrl URL to the final proving key (.zkey)
   */
  constructor(wasmUrl: string, zkeyUrl: string) {
    this.wasmUrl = wasmUrl;
    this.zkeyUrl = zkeyUrl;
  }

  /**
   * Initialize the prover (load snarkjs)
   */
  async init(): Promise<void> {
    this.snarkjs = await loadSnarkjs();
    this.ready = true;
  }

  /**
   * Generate a Groth16 withdrawal proof
   * @param input The circuit inputs (public + private)
   * @returns proof and publicSignals formatted for Solidity
   */
  async generateWithdrawProof(input: WithdrawInput): Promise<ProofResult> {
    if (!this.ready || !this.snarkjs) throw new Error("Prover not initialized. Call init() first.");

    const { proof, publicSignals } = await this.snarkjs.groth16.fullProve(
      input,
      this.wasmUrl,
      this.zkeyUrl,
    );

    return {
      proof: formatProofForSolidity(proof),
      publicSignals,
    };
  }

  /**
   * Generate a Groth16 compliance withdrawal proof
   */
  async generateComplianceProof(input: ComplianceWithdrawInput): Promise<ProofResult> {
    if (!this.ready || !this.snarkjs) throw new Error("Prover not initialized. Call init() first.");

    const { proof, publicSignals } = await this.snarkjs.groth16.fullProve(
      input,
      this.wasmUrl,
      this.zkeyUrl,
    );

    return {
      proof: formatProofForSolidity(proof),
      publicSignals,
    };
  }

  /**
   * Verify a proof locally (for debugging, before submitting on-chain)
   */
  async verifyLocally(
    verificationKeyUrl: string,
    publicSignals: string[],
    proof: unknown,
  ): Promise<boolean> {
    if (!this.ready || !this.snarkjs) throw new Error("Prover not initialized. Call init() first.");

    const vKey: unknown = await fetch(verificationKeyUrl).then(r => r.json());
    return this.snarkjs.groth16.verify(vKey, publicSignals, proof);
  }
}

/**
 * Format a snarkjs proof for Solidity verifyProof() call
 * Note: pB coordinates are swapped (snarkjs convention vs Solidity convention)
 */
function formatProofForSolidity(proof: SnarkProofLike): Groth16Proof {
  return {
    pA: [proof.pi_a[0], proof.pi_a[1]],
    pB: [
      [proof.pi_b[0][1], proof.pi_b[0][0]], // swapped
      [proof.pi_b[1][1], proof.pi_b[1][0]], // swapped
    ],
    pC: [proof.pi_c[0], proof.pi_c[1]],
  };
}

// --- Convenience: circuit artifact URLs ---

export const CIRCUIT_URLS = {
  withdraw: {
    wasm: "/circuits/withdraw.wasm",
    zkey: "/circuits/withdraw_final.zkey",
    vkey: "/circuits/verification_key.json",
  },
  compliance: {
    wasm: "/circuits/withdrawCompliant.wasm",
    zkey: "/circuits/compliant_final.zkey",
    vkey: "/circuits/compliant_verification_key.json",
  },
} as const;

/**
 * Create a pre-configured prover for standard withdrawals
 */
export function createWithdrawProver(baseUrl = ""): ZKProver {
  return new ZKProver(
    `${baseUrl}${CIRCUIT_URLS.withdraw.wasm}`,
    `${baseUrl}${CIRCUIT_URLS.withdraw.zkey}`,
  );
}

/**
 * Create a pre-configured prover for compliance withdrawals
 */
export function createComplianceProver(baseUrl = ""): ZKProver {
  return new ZKProver(
    `${baseUrl}${CIRCUIT_URLS.compliance.wasm}`,
    `${baseUrl}${CIRCUIT_URLS.compliance.zkey}`,
  );
}
