---
name: solupi-qa-launch
description: QA and hackathon-finish instructions for SolUPI. Validate the complete Scan -> Pay -> Success flow, environment setup, edge cases, and demo readiness.
---
# solupi-qa-launch

Use this skill near the end of the build.

## Primary Responsibility

Verify that SolUPI works as a believable hackathon MVP and is demo-safe.

## Test Matrix

### Wallet

- create wallet
- import wallet
- app restart persistence
- balance refresh

### Scanner

- permission granted
- permission denied
- valid UPI QR
- invalid QR
- QR with missing amount

### Payment

- insufficient balance
- successful devnet transaction
- failed RPC submission
- backend save failure after chain success

### History

- new transaction visible after payment
- search works
- loading and empty states render correctly

## Demo Readiness Checks

- `.env.example` exists for frontend and backend
- run commands are documented
- explorer link opens correctly
- receipt data matches saved backend data
- no placeholder copy from previous project remains

## Output

- concise test checklist
- known limitations list
- final polish tasks for hackathon submission

