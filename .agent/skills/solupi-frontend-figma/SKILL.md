---
name: solupi-frontend-figma
description: Frontend build instructions for SolUPI. Implement the Expo React Native app to match Figma precisely while integrating wallet, scanner, payment confirmation, success, and transaction history flows.
---
# solupi-frontend-figma

Own the mobile UI and app flow for SolUPI.

## Primary Responsibility

Build a polished Expo React Native UI that matches the provided Figma as closely as possible while supporting the required MVP flow.

## Required Flow

1. Wallet setup
2. Home
3. QR scan
4. Payment details and confirmation
5. Payment success receipt
6. Transaction history

## UI Rules

- Figma is the visual source of truth
- Match spacing, corner radius, gradients, hierarchy, and navigation style
- Keep premium fintech polish
- Use smooth but restrained motion
- Avoid redesigning the app or inventing extra sections

## Existing Repo Notes

- The frontend already uses Expo Router and has starter screens
- Dependency list contains duplicate entries and should be cleaned up
- Current UI should be treated as scaffold, not final design fidelity

## Required Stack

- React Native
- Expo
- TypeScript
- Zustand
- React Query
- Expo Router or equivalent navigation already present in repo

## Recommended External Skills

- `figma:figma-implement-design`
- `figma:figma-use`
- `expo:building-native-ui`
- `expo:native-data-fetching`
- `responsive-design`
- `zustand-store-ts`
- `tanstack-query-expert`

## Screen Responsibilities

### Wallet Setup

- Create/import wallet
- Secure onboarding
- Clear primary CTA

### Home

- Balance card
- Large `Tap to Scan` card
- Recent transactions preview
- Bottom tab navigation

### Scanner

- Camera permission states
- QR framing UI
- Parse and validate UPI payload

### Pay

- Merchant
- UPI ID
- INR amount
- SOL amount
- Fees
- Wallet balance
- `Pay Now` CTA

### Success

- Amount
- Merchant
- Timestamp
- Transaction signature
- Explorer link

### Activity

- Search
- Status
- Merchant
- Amount
- Empty and loading states

## Done When

- The visual system consistently matches the Figma file
- All screens are connected to real state and APIs
- The demo flow feels smooth on mobile from onboarding through receipt

