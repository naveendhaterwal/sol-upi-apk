---
name: solupi-orchestrator
description: Master execution plan for the SolUPI hackathon MVP. Use this first to sequence frontend, backend, Solana, data, and QA work without drifting from the Scan -> Pay -> Success scope.
---
# solupi-orchestrator

Use this skill before any implementation work on SolUPI.

## Mission

Build a hackathon-ready mobile fintech MVP called `SolUPI` with this exact product scope:

1. Create or import wallet
2. Scan a UPI QR code
3. Parse merchant and amount
4. Convert INR to SOL
5. Sign and submit a real Solana devnet payment
6. Persist the transaction in Neon PostgreSQL through the Rust backend
7. Show success receipt and history

Do not add unrelated crypto or fintech features.

## Source of Truth

- Product scope: the user brief in this workspace
- Design source: the provided Figma file and node
- Chain environment:
  - RPC: `https://sol-devnet-rpc.rpcfast.com`
  - WebSocket: `wss://sol-devnet-rpc.rpcfast.com`

## Required Workstreams

Invoke these project skills in this order:

1. `solupi-data-neon`
2. `solupi-backend-axum`
3. `solupi-wallet-payments`
4. `solupi-frontend-figma`
5. `solupi-qa-launch`

## External Skills To Reference

- `figma:figma-implement-design`
- `figma:figma-use`
- `expo:building-native-ui`
- `expo:native-data-fetching`
- `responsive-design`
- `rust-pro`
- `backend-dev-guidelines`
- `using-neon`
- `postgresql`
- `zustand-store-ts`
- `tanstack-query-expert`

## Non-Negotiable Rules

- Use the provided Figma as visual source of truth.
- Keep the UX tightly centered on `Scan -> Pay -> Success`.
- Use real Solana devnet RPC calls and real transaction signatures.
- Never hardcode wallet balances, tx hashes, RPC data, or secrets.
- Store wallet secrets only with `expo-secure-store`.
- Use environment variables for all backend and frontend configuration.
- Keep code modular and hackathon-demo friendly.

## Definition of Done

- Frontend and backend both run locally from this repository
- Wallet creation and import work on-device
- UPI QR parsing works for `upi://pay?...`
- INR to SOL conversion is dynamic
- Payment confirmation submits a real devnet transfer
- Backend persists and returns transaction history
- Success screen shows explorer link and signature

