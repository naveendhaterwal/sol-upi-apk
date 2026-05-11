# SolUPI MVP Plan

## Current Status

The requested global Codex skill bundle was installed successfully with:

```bash
npx antigravity-awesome-skills --codex
```

Project-local execution skills for SolUPI now live under:

- `.agent/skills/solupi-orchestrator`
- `.agent/skills/solupi-data-neon`
- `.agent/skills/solupi-backend-axum`
- `.agent/skills/solupi-wallet-payments`
- `.agent/skills/solupi-frontend-figma`
- `.agent/skills/solupi-qa-launch`

## Repo Audit

### Frontend

- Expo app already exists in `frontend/`
- Expo Router screens already exist for wallet setup, home, scan, pay, success, and activity
- Solana and secure storage dependencies are present
- `package.json` has duplicate dependency entries and needs cleanup
- Current UI should be treated as starter implementation, not final Figma fidelity

### Backend

- Rust service already exists in `backend/`
- Current backend is Prisma-based, but target architecture requires `SQLx`
- Current routes do not match final API contract
- `/price` is mocked and must not survive into final MVP
- Dodo checkout remnants should be removed

### Database

- Initial schema exists
- Column naming needs alignment from `amount_crypto` to `amount_sol`
- Env and migration flow need cleanup for Neon

## Assigned Workstreams

### 1. Orchestration

- Skill: `solupi-orchestrator`
- Role: keep scope tight and enforce the build order

### 2. Data Layer

- Skill: `solupi-data-neon`
- Role: own Neon schema, field names, env contract, and SQLx compatibility

### 3. Backend API

- Skill: `solupi-backend-axum`
- Role: own Axum routes, SQLx migration off Prisma, balance route, and transaction persistence

### 4. Wallet and On-Chain Payments

- Skill: `solupi-wallet-payments`
- Role: own wallet generation/import, secure storage, quotes, and Solana devnet transaction flow

### 5. Frontend and Figma Fidelity

- Skill: `solupi-frontend-figma`
- Role: own mobile UX, Figma parity, navigation, and state integration

### 6. QA and Demo Polish

- Skill: `solupi-qa-launch`
- Role: own validation, edge-case handling, demo stability, and submission readiness

## Build Order

1. Normalize database contract and environment variables
2. Rebuild backend around Axum + SQLx + Neon
3. Finalize wallet storage and Solana service layer
4. Implement Figma-faithful UI screens and state flows
5. Connect scan, pay, receipt, and history end to end
6. Run QA pass and prepare setup instructions

## MVP Acceptance Criteria

The build is complete when a user can:

1. Create or import a wallet
2. Scan a valid UPI QR
3. See merchant, UPI ID, INR amount, and SOL equivalent
4. Submit a real Solana devnet transaction
5. View a success receipt with signature and explorer link
6. Open transaction history fetched from the backend

## Important Constraints

- No NFTs
- No rewards
- No staking
- No fake balances
- No fake tx hashes
- No off-scope crypto features
- Figma remains the visual source of truth

