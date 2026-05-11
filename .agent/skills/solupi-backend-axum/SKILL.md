---
name: solupi-backend-axum
description: Rust backend instructions for SolUPI. Build a clean Axum API with SQLx, Neon Postgres, balance lookup, transaction persistence, and hackathon-ready env configuration.
---
# solupi-backend-axum

Own the Rust backend for SolUPI.

## Primary Responsibility

Replace the current partial backend with a clean Axum service aligned to the user brief.

## Required Endpoints

### `POST /pay`

- Validate payload
- Persist transaction record
- Return saved transaction

### `GET /transactions/:wallet`

- Return wallet transaction history in reverse chronological order

### `GET /balance/:wallet`

- Fetch the wallet balance dynamically from Solana devnet RPC
- Return lamports-derived SOL balance

## Current Audit Notes

- Existing backend exposes `/price` instead of `/balance/:wallet`
- Existing `/price` is mocked and not acceptable for final MVP
- Existing code still contains Dodo checkout leftovers and Prisma coupling

## Implementation Rules

- Use `axum`
- Use `sqlx`
- Use `reqwest`
- Keep route handlers, models, db access, and services separated
- Read all secrets and URLs from env
- Return stable JSON contracts that the frontend can consume directly

## Suggested Structure

- `src/main.rs`
- `src/routes/`
- `src/handlers/`
- `src/db/`
- `src/models/`
- `src/services/`

## Environment Contract

- `DATABASE_URL`
- `PORT`
- `SOLANA_RPC_URL`

## Done When

- Service boots from env
- History and pay routes work against Neon
- Balance route returns live chain data
- No mock payment or fake blockchain logic remains

