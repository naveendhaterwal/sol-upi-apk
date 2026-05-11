---
name: solupi-wallet-payments
description: Solana wallet and payment instructions for SolUPI. Covers secure wallet storage, QR parsing, INR to SOL conversion, devnet transfers, signing, and receipt metadata.
---
# solupi-wallet-payments

Own the wallet and payment execution path.

## Primary Responsibility

Implement the real on-chain part of SolUPI:

1. Create wallet
2. Import wallet
3. Store secrets securely
4. Fetch live balance
5. Parse scanned UPI QR data
6. Convert INR to SOL
7. Sign and send a real devnet transaction
8. Return the signature and explorer URL

## Required Libraries

- `@solana/web3.js`
- `expo-secure-store`
- `expo-camera`

## Chain Config

- RPC: `https://sol-devnet-rpc.rpcfast.com`
- WebSocket: `wss://sol-devnet-rpc.rpcfast.com`

## Product Constraints

- No fake signatures
- No fake balances
- No mocked success state for final flow
- Do not broaden scope to tokens, NFTs, or staking

## Implementation Guidance

- Use `Keypair` for wallet generation
- Support import from secret key or supported encoded key format
- Store private material only through secure storage
- Resolve SOL balance from RPC on screen load and after payment
- Parse UPI payloads from `upi://pay?pa=...&pn=...&am=...`
- Compute SOL amount from a live quote source or backend-provided rate
- Build a devnet transfer transaction and confirm it

## Frontend Contract

Expose reusable utilities or services for:

- wallet create/import/load
- balance fetch
- qr parse
- inr-to-sol quote
- transaction build/send/confirm

## Done When

- A fresh wallet can be created and restored
- Scan data maps cleanly to merchant, UPI ID, and INR amount
- User can submit a real devnet payment and receive a valid signature

