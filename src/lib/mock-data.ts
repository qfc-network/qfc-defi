// ── Token types ──
export interface Token {
  symbol: string;
  name: string;
  icon: string;
  decimals: number;
  priceUSD: number;
}

export const TOKENS: Record<string, Token> = {
  QFC: { symbol: "QFC", name: "QFC Token", icon: "◆", decimals: 18, priceUSD: 12.5 },
  QUSD: { symbol: "QUSD", name: "QFC USD", icon: "$", decimals: 18, priceUSD: 1.0 },
  stQFC: { symbol: "stQFC", name: "Staked QFC", icon: "◇", decimals: 18, priceUSD: 13.1 },
  TTK: { symbol: "TTK", name: "Test Token", icon: "●", decimals: 18, priceUSD: 0.85 },
  QDOGE: { symbol: "QDOGE", name: "QFC Doge", icon: "🐕", decimals: 18, priceUSD: 0.024 },
};

// ── User position mock data ──
export const MOCK_USER_POSITION = {
  collateralValue: 24500,
  debtValue: 8200,
  stakedValue: 15600,
  vaultBalance: 5400,
  healthFactor: 1.85,
  qfcBalance: 1960,
};

// ── CDP / Borrow mock data ──
export const MOCK_CDP = {
  collateral: 1200, // QFC deposited
  collateralUSD: 15000,
  debt: 5000, // QUSD minted
  collateralRatio: 300,
  minCollateralRatio: 150,
  liquidationThreshold: 130,
  stabilityFee: 2.5,
  liquidationPrice: 6.25,
  healthFactor: 2.31,
  accruedFees: 12.5,
};

// ── Lending mock data ──
export interface LendingMarket {
  token: Token;
  totalSupply: number;
  totalBorrow: number;
  supplyAPY: number;
  borrowAPY: number;
  liquidity: number;
  userSupplied: number;
  userBorrowed: number;
}

export const MOCK_LENDING_MARKETS: LendingMarket[] = [
  {
    token: TOKENS.QFC,
    totalSupply: 125000,
    totalBorrow: 42000,
    supplyAPY: 4.2,
    borrowAPY: 6.8,
    liquidity: 83000,
    userSupplied: 500,
    userBorrowed: 0,
  },
  {
    token: TOKENS.TTK,
    totalSupply: 890000,
    totalBorrow: 310000,
    supplyAPY: 3.1,
    borrowAPY: 5.4,
    liquidity: 580000,
    userSupplied: 0,
    userBorrowed: 1200,
  },
  {
    token: TOKENS.QDOGE,
    totalSupply: 45000000,
    totalBorrow: 12000000,
    supplyAPY: 8.5,
    borrowAPY: 12.3,
    liquidity: 33000000,
    userSupplied: 100000,
    userBorrowed: 0,
  },
  {
    token: TOKENS.QUSD,
    totalSupply: 2500000,
    totalBorrow: 1800000,
    supplyAPY: 5.6,
    borrowAPY: 7.2,
    liquidity: 700000,
    userSupplied: 2000,
    userBorrowed: 500,
  },
];

export const MOCK_LENDING_ACCOUNT = {
  totalCollateral: 18500,
  totalDebt: 4200,
  availableBorrow: 6100,
  healthFactor: 1.72,
  borrowLimit: 75,
};

// ── Staking mock data ──
export const MOCK_STAKING = {
  stakedQFC: 1200,
  stQFCBalance: 1145.5,
  exchangeRate: 1.0476,
  estimatedAPY: 8.4,
  totalStaked: 2450000,
  rewardsEarned: 45.2,
  pendingWithdrawals: [
    { requestId: 1, amount: 100, claimableAt: Date.now() + 3 * 86400000, status: "pending" as const },
    { requestId: 2, amount: 50, claimableAt: Date.now() - 86400000, status: "claimable" as const },
  ],
  lockPeriod: 7, // days
};

// ── Vault mock data ──
export interface VaultData {
  name: string;
  symbol: string;
  asset: Token;
  apy: number;
  tvl: number;
  userDeposit: number;
  userShares: number;
  sharePrice: number;
}

export const MOCK_VAULTS: VaultData[] = [
  {
    name: "QFC Yield Vault",
    symbol: "yvQFC",
    asset: TOKENS.QFC,
    apy: 12.4,
    tvl: 3200000,
    userDeposit: 400,
    userShares: 385.2,
    sharePrice: 1.0384,
  },
  {
    name: "QUSD Stable Vault",
    symbol: "yvQUSD",
    asset: TOKENS.QUSD,
    apy: 8.2,
    tvl: 5800000,
    userDeposit: 5000,
    userShares: 4890,
    sharePrice: 1.0225,
  },
  {
    name: "TTK Growth Vault",
    symbol: "yvTTK",
    asset: TOKENS.TTK,
    apy: 15.6,
    tvl: 980000,
    userDeposit: 0,
    userShares: 0,
    sharePrice: 1.0612,
  },
];

// ── Launchpad mock data ──
export interface LaunchData {
  id: number;
  tokenName: string;
  tokenSymbol: string;
  price: number;
  hardCap: number;
  raised: number;
  startTime: number;
  endTime: number;
  finalized: boolean;
  description: string;
  userContribution: number;
}

export const MOCK_LAUNCHES: LaunchData[] = [
  {
    id: 0,
    tokenName: "QuantumSwap",
    tokenSymbol: "QSWAP",
    price: 0.15,
    hardCap: 500000,
    raised: 342000,
    startTime: Date.now() - 5 * 86400000,
    endTime: Date.now() + 9 * 86400000,
    finalized: false,
    description: "Next-gen AMM with concentrated liquidity on QFC chain",
    userContribution: 2500,
  },
  {
    id: 1,
    tokenName: "QFC Gaming",
    tokenSymbol: "QGAME",
    price: 0.05,
    hardCap: 200000,
    raised: 200000,
    startTime: Date.now() - 20 * 86400000,
    endTime: Date.now() - 6 * 86400000,
    finalized: true,
    description: "Play-to-earn gaming platform built on QFC blockchain",
    userContribution: 1000,
  },
  {
    id: 2,
    tokenName: "DefiLens",
    tokenSymbol: "LENS",
    price: 0.25,
    hardCap: 750000,
    raised: 89000,
    startTime: Date.now() - 1 * 86400000,
    endTime: Date.now() + 20 * 86400000,
    finalized: false,
    description: "Analytics & portfolio tracker for the QFC DeFi ecosystem",
    userContribution: 0,
  },
];
