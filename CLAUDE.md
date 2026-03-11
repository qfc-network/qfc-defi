# CLAUDE.md — QFC DeFi Dashboard

## Project Overview

QFC DeFi is a Next.js 14 frontend for the QFC blockchain's DeFi protocol suite. It provides a unified dashboard for borrowing (CDP), lending, staking (liquid), yield vaults (ERC4626), and a token launchpad. Currently runs on **mock data** — contract integration is stubbed but not yet wired.

**Live:** `defi.testnet.qfc.network` (port 3280)

## Tech Stack

- **Framework:** Next.js 14.2.35 (App Router, React 18, TypeScript 5)
- **Web3:** ethers.js 6.16.0
- **Styling:** Tailwind CSS 3.4.1 (dark mode only, `class="dark"` on `<html>`)
- **Build:** Docker multi-stage (Node 20 Alpine), standalone output
- **CI/CD:** GitHub Actions → GHCR (`ghcr.io/<org>/qfc-defi`)

## Key Commands

```bash
npm run dev          # Dev server on :3280
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (WalletProvider wraps all pages)
│   ├── page.tsx            # Dashboard — portfolio overview
│   ├── globals.css         # Tailwind base + custom styles
│   ├── borrow/page.tsx     # CDP: deposit QFC → mint QUSD
│   ├── lend/page.tsx       # Aave-like supply/borrow markets
│   ├── stake/page.tsx      # Liquid staking: QFC → stQFC (7-day unstake)
│   ├── vaults/page.tsx     # ERC4626 yield vaults
│   └── launch/page.tsx     # Token launchpad / IDO
├── components/
│   ├── Navbar.tsx          # Top nav + wallet connect button
│   ├── StatCard.tsx        # Simple stat display (label + value)
│   ├── PositionCard.tsx    # Dashboard position card (links to feature)
│   ├── HealthBar.tsx       # Color-coded health factor bar
│   ├── TokenInput.tsx      # Amount input with balance display + MAX
│   ├── TxButton.tsx        # Button with tx lifecycle states
│   └── Modal.tsx           # Generic modal dialog
├── context/
│   └── WalletContext.tsx   # MetaMask wallet connect (useWallet hook)
└── lib/
    ├── contracts.ts        # Contract addresses (from env) + ABIs
    ├── chain.ts            # getProvider / getSigner / getContract helpers
    ├── format.ts           # Number/address formatting utils
    └── mock-data.ts        # All mock data (tokens, positions, markets, vaults, launches)
```

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/contracts.ts` | Central registry of contract addresses + human-readable ABIs |
| `src/lib/chain.ts` | ethers.js provider/signer/contract factory |
| `src/lib/mock-data.ts` | All hardcoded mock data — **replace with contract calls** |
| `src/context/WalletContext.tsx` | Wallet state (address, balance, connect/disconnect) |
| `src/components/TxButton.tsx` | Transaction button state machine: idle → loading → pending → success/error |
| `.env.example` | All `NEXT_PUBLIC_*` env vars with zero-address defaults |

## Environment Variables

All prefixed `NEXT_PUBLIC_` (client-side accessible). Copy `.env.example` → `.env.local`.

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_RPC_URL` | JSON-RPC endpoint (default: `http://localhost:8545`) |
| `NEXT_PUBLIC_CHAIN_ID` | Chain ID (default: `31337` / Hardhat) |
| `NEXT_PUBLIC_QFC_TOKEN` | QFC governance token address |
| `NEXT_PUBLIC_QUSD_TOKEN` | QUSD stablecoin address |
| `NEXT_PUBLIC_STQFC_TOKEN` | stQFC liquid staking derivative |
| `NEXT_PUBLIC_TTK_TOKEN` | Test token address |
| `NEXT_PUBLIC_QDOGE_TOKEN` | QDOGE meme token address |
| `NEXT_PUBLIC_CDP_VAULT` | CDP vault contract |
| `NEXT_PUBLIC_PRICE_FEED` | Price oracle contract |
| `NEXT_PUBLIC_LIQUIDATOR` | Liquidation contract |
| `NEXT_PUBLIC_LENDING_POOL` | Lending pool contract |
| `NEXT_PUBLIC_STAKING_POOL` | Staking rewards contract |
| `NEXT_PUBLIC_LIQUID_STAKING` | Liquid staking contract |
| `NEXT_PUBLIC_YIELD_VAULT_QFC` | QFC yield vault |
| `NEXT_PUBLIC_YIELD_VAULT_QUSD` | QUSD yield vault |
| `NEXT_PUBLIC_LAUNCHPAD` | Launchpad contract |
| `NEXT_PUBLIC_SIMPLE_SWAP` | DEX swap contract |

## Adding New Pages

1. Create `src/app/<route>/page.tsx` — Next.js auto-routes it
2. Add `"use client"` directive at top (all pages are client-rendered)
3. Import `useWallet` from `@/context/WalletContext` for wallet state
4. Add nav link in `src/components/Navbar.tsx` (both desktop `navLinks` array and mobile menu)
5. Use existing components: `StatCard`, `TokenInput`, `TxButton`, `Modal`, `HealthBar`

## Adding New Components

1. Create `src/components/YourComponent.tsx`
2. Add `"use client"` if it uses hooks/state
3. Follow existing patterns: Tailwind classes, dark theme colors (gray-800/900, cyan-400/500)
4. Import with `@/components/YourComponent`

## Contract Integration

All pages currently use mock data from `src/lib/mock-data.ts`. To wire real contracts:

### 1. Set addresses in `.env.local`

Populate the `NEXT_PUBLIC_*` vars with deployed contract addresses. They flow into `src/lib/contracts.ts` → `ADDRESSES` object.

### 2. Read from contracts

```typescript
import { getProvider, getContract } from "@/lib/chain";
import { ADDRESSES, CDP_VAULT_ABI } from "@/lib/contracts";

const provider = getProvider();
const vault = getContract(ADDRESSES.CDP_VAULT, CDP_VAULT_ABI, provider);
const position = await vault.positions(userAddress);
```

### 3. Write to contracts

```typescript
import { getSigner, getContract } from "@/lib/chain";
import { ADDRESSES, CDP_VAULT_ABI } from "@/lib/contracts";

const signer = await getSigner(); // MetaMask prompt
const vault = getContract(ADDRESSES.CDP_VAULT, CDP_VAULT_ABI, signer!);
const tx = await vault.depositCollateral({ value: ethers.parseEther("1.0") });
await tx.wait();
```

### 4. Replace mock data

In each page, replace hardcoded values from `mock-data.ts` with `useEffect` calls that read from contracts. Use `TxButton` for write operations — it handles the idle → loading → pending → success/error lifecycle.

### Available ABIs

| ABI constant | Contract | Key functions |
|-------------|----------|---------------|
| `ERC20_ABI` | Any ERC20 | `balanceOf`, `approve`, `transfer` |
| `CDP_VAULT_ABI` | CDP Vault | `depositCollateral`, `mintQUSD`, `burnQUSD`, `withdrawCollateral` |
| `LENDING_POOL_ABI` | Lending | `supply`, `withdraw`, `borrow`, `repay`, `getAccountData` |
| `STAKING_POOL_ABI` | Staking | `stake`, `withdraw`, `claimRewards`, `getStakeInfo` |
| `LIQUID_STAKING_ABI` | Liquid Staking | `stake`, `requestUnstake`, `claimUnstake`, `exchangeRate` |
| `VAULT_ABI` | ERC4626 Vault | `deposit`, `withdraw`, `redeem`, `convertToAssets` |
| `LAUNCHPAD_ABI` | Launchpad | `createLaunch`, `contribute`, `claimTokens`, `getLaunchInfo` |

## Deployment

### Docker

```bash
docker build -t qfc-defi .
docker run -p 3280:3280 --env-file .env.local qfc-defi
```

Multi-stage build: deps → build → runner (standalone Node server on port 3280).

### CI/CD (GitHub Actions)

`.github/workflows/docker.yml` triggers on push/PR to `main`:
- Builds Docker image
- Pushes to `ghcr.io/<org>/qfc-defi` with SHA + branch + `latest` tags
- Only pushes on `main` (PRs build-only)

Production runs at `defi.testnet.qfc.network`.

## Gotchas

- **All client-side:** Every page has `"use client"`. No SSR, no API routes.
- **Mock data everywhere:** Nothing reads from real contracts yet. All values come from `src/lib/mock-data.ts`. The `TxButton` click handlers simulate a 1500ms delay, no actual tx is sent.
- **Wallet fallback:** If no MetaMask, `WalletContext` uses a hardcoded mock address (`0x1a2B...eF12`) and pretends to be connected.
- **Zero-address defaults:** All contract addresses default to `0x000...000` if env vars are missing. The app won't crash, but contract calls will revert.
- **Standalone output:** `next.config.mjs` sets `output: "standalone"` for Docker. The Dockerfile copies `.next/standalone` and `.next/static` to the runner stage.
- **Port 3280:** Both dev server (`npm run dev -p 3280`) and Docker container expose port 3280, not the Next.js default 3000.
- **No tests:** No test framework is configured. Add vitest or jest if needed.
- **Tailwind dark-only:** The app assumes dark mode. The `<html>` tag has `class="dark"`. No light mode support.
- **Human-readable ABIs:** `contracts.ts` uses ethers.js human-readable ABI format (string arrays), not JSON ABI files.
