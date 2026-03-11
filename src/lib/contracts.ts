// Contract addresses — populated via NEXT_PUBLIC_* env vars
export const ADDRESSES = {
  QFC_TOKEN: process.env.NEXT_PUBLIC_QFC_TOKEN || "0x0000000000000000000000000000000000000000",
  QUSD_TOKEN: process.env.NEXT_PUBLIC_QUSD_TOKEN || "0x0000000000000000000000000000000000000000",
  STQFC_TOKEN: process.env.NEXT_PUBLIC_STQFC_TOKEN || "0x0000000000000000000000000000000000000000",
  TTK_TOKEN: process.env.NEXT_PUBLIC_TTK_TOKEN || "0x0000000000000000000000000000000000000000",
  QDOGE_TOKEN: process.env.NEXT_PUBLIC_QDOGE_TOKEN || "0x0000000000000000000000000000000000000000",
  CDP_VAULT: process.env.NEXT_PUBLIC_CDP_VAULT || "0x0000000000000000000000000000000000000000",
  PRICE_FEED: process.env.NEXT_PUBLIC_PRICE_FEED || "0x0000000000000000000000000000000000000000",
  LIQUIDATOR: process.env.NEXT_PUBLIC_LIQUIDATOR || "0x0000000000000000000000000000000000000000",
  LENDING_POOL: process.env.NEXT_PUBLIC_LENDING_POOL || "0x0000000000000000000000000000000000000000",
  STAKING_POOL: process.env.NEXT_PUBLIC_STAKING_POOL || "0x0000000000000000000000000000000000000000",
  LIQUID_STAKING: process.env.NEXT_PUBLIC_LIQUID_STAKING || "0x0000000000000000000000000000000000000000",
  YIELD_VAULT_QFC: process.env.NEXT_PUBLIC_YIELD_VAULT_QFC || "0x0000000000000000000000000000000000000000",
  YIELD_VAULT_QUSD: process.env.NEXT_PUBLIC_YIELD_VAULT_QUSD || "0x0000000000000000000000000000000000000000",
  LAUNCHPAD: process.env.NEXT_PUBLIC_LAUNCHPAD || "0x0000000000000000000000000000000000000000",
  SIMPLE_SWAP: process.env.NEXT_PUBLIC_SIMPLE_SWAP || "0x0000000000000000000000000000000000000000",
};

export const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 value) returns (bool)",
  "function transfer(address to, uint256 value) returns (bool)",
  "function transferFrom(address from, address to, uint256 value) returns (bool)",
];

export const CDP_VAULT_ABI = [
  "function depositCollateral() payable",
  "function withdrawCollateral(uint256 amount)",
  "function mintQUSD(uint256 amount)",
  "function burnQUSD(uint256 amount)",
  "function positions(address) view returns (uint256 collateral, uint256 debt, uint256 lastFeeUpdate, uint256 accruedFees)",
  "function getCollateralRatio(address user) view returns (uint256)",
  "function getTotalDebt(address user) view returns (uint256)",
  "function MIN_COLLATERAL_RATIO() view returns (uint256)",
  "function LIQUIDATION_THRESHOLD() view returns (uint256)",
  "function STABILITY_FEE_RATE() view returns (uint256)",
  "event CollateralDeposited(address indexed user, uint256 amount)",
  "event CollateralWithdrawn(address indexed user, uint256 amount)",
  "event QUSDMinted(address indexed user, uint256 amount)",
  "event QUSDBurned(address indexed user, uint256 amount)",
  "event Liquidated(address indexed user, address indexed liquidator, uint256 debtRepaid, uint256 collateralSeized)",
];

export const STAKING_POOL_ABI = [
  "function stake(uint256 amount)",
  "function withdraw(uint256 amount)",
  "function claimRewards()",
  "function exit()",
  "function earned(address account) view returns (uint256)",
  "function getStakeInfo(address account) view returns (uint256 staked, uint256 earned, uint256 lockEnd, uint256 rewardPerToken)",
  "function totalStaked() view returns (uint256)",
  "function rewardRate() view returns (uint256)",
  "function lockPeriod() view returns (uint256)",
  "event Staked(address indexed user, uint256 amount)",
  "event Withdrawn(address indexed user, uint256 amount)",
  "event RewardPaid(address indexed user, uint256 reward)",
];

export const LIQUID_STAKING_ABI = [
  "function stake(uint256 amount) returns (uint256 stQfcAmount)",
  "function requestUnstake(uint256 stQfcAmount) returns (uint256 requestId)",
  "function claimUnstake(uint256 requestId)",
  "function exchangeRate() view returns (uint256)",
  "function totalStaked() view returns (uint256)",
  "function pendingWithdrawals(address user) view returns (uint256[] requestIds, uint256[] amounts, uint256[] claimableAt)",
  "event Staked(address indexed user, uint256 qfcAmount, uint256 stQfcAmount)",
  "event UnstakeRequested(address indexed user, uint256 requestId, uint256 stQfcAmount, uint256 claimableAt)",
  "event UnstakeClaimed(address indexed user, uint256 requestId, uint256 qfcAmount)",
];

export const VAULT_ABI = [
  "function deposit(uint256 assets, address receiver) returns (uint256 shares)",
  "function withdraw(uint256 assets, address receiver, address owner) returns (uint256 shares)",
  "function redeem(uint256 shares, address receiver, address owner) returns (uint256 assets)",
  "function totalAssets() view returns (uint256)",
  "function sharePrice() view returns (uint256)",
  "function convertToAssets(uint256 shares) view returns (uint256)",
  "function convertToShares(uint256 assets) view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function asset() view returns (address)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "event Deposit(address indexed caller, address indexed owner, uint256 assets, uint256 shares)",
  "event Withdraw(address indexed caller, address indexed receiver, address indexed owner, uint256 assets, uint256 shares)",
];

export const LENDING_POOL_ABI = [
  "function supply(address asset, uint256 amount)",
  "function withdraw(address asset, uint256 amount)",
  "function borrow(address asset, uint256 amount)",
  "function repay(address asset, uint256 amount)",
  "function getAccountData(address user) view returns (uint256 totalCollateral, uint256 totalDebt, uint256 availableBorrow, uint256 healthFactor)",
  "function getMarketData(address asset) view returns (uint256 totalSupply, uint256 totalBorrow, uint256 supplyAPY, uint256 borrowAPY, uint256 liquidity)",
  "function getUserAssetData(address user, address asset) view returns (uint256 supplied, uint256 borrowed)",
  "event Supply(address indexed user, address indexed asset, uint256 amount)",
  "event Withdraw(address indexed user, address indexed asset, uint256 amount)",
  "event Borrow(address indexed user, address indexed asset, uint256 amount)",
  "event Repay(address indexed user, address indexed asset, uint256 amount)",
];

export const LAUNCHPAD_ABI = [
  "function createLaunch(address token, uint256 price, uint256 hardCap, uint256 startTime, uint256 endTime)",
  "function contribute(uint256 launchId) payable",
  "function claimTokens(uint256 launchId)",
  "function refund(uint256 launchId)",
  "function getLaunchInfo(uint256 launchId) view returns (address token, uint256 price, uint256 hardCap, uint256 raised, uint256 startTime, uint256 endTime, bool finalized)",
  "function getUserContribution(uint256 launchId, address user) view returns (uint256)",
  "function launchCount() view returns (uint256)",
  "event LaunchCreated(uint256 indexed launchId, address indexed token, uint256 hardCap)",
  "event Contributed(uint256 indexed launchId, address indexed user, uint256 amount)",
  "event TokensClaimed(uint256 indexed launchId, address indexed user, uint256 amount)",
];
