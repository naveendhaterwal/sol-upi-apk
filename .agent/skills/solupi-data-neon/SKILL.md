---
name: solupi-data-neon
description: Data-layer instructions for SolUPI using Neon PostgreSQL. Defines schema, migrations, SQLx compatibility, env setup, and backend-facing contracts.
---
# solupi-data-neon

Use this skill to own the database contract for SolUPI.

## Primary Responsibility

Set up the PostgreSQL schema and configuration so the Rust backend can reliably store:

- users
- transactions

## Required Stack

- Neon PostgreSQL
- Environment variables only
- SQLx-ready schema and queries

## Existing Repo Gaps To Fix

- Current backend still uses Prisma-style code instead of SQLx
- Transaction schema currently uses `amount_crypto`; target contract needs `amount_sol`
- Root-level env guidance is missing

## Required Schema

### users

- `id`
- `wallet_address`
- `created_at`

### transactions

- `id`
- `wallet_address`
- `merchant_name`
- `upi_id`
- `amount_inr`
- `amount_sol`
- `txn_hash`
- `status`
- `created_at`

## Implementation Rules

- Prefer UUID primary keys
- Store timestamps with timezone
- Add uniqueness where it protects integrity
- Keep queries simple and hackathon-stable
- Make the schema match the API response fields exactly

## Deliverables

- SQL schema or migration files
- `.env.example` entries for Neon connection
- Notes for local database bootstrap
- Backend-facing data model contract

## Done When

- Schema can be applied cleanly to Neon or local Postgres
- Backend can insert and fetch transactions without field translation hacks
- Naming is consistent across DB, Rust structs, and frontend types

