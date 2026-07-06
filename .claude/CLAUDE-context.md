# bushel-mobile — Project Context

Everything specific to **this** project. The seeds-managed `CLAUDE.md` shell reads this file at session start and treats it as authoritative for project-specific facts. Nothing here syncs from seeds — it's yours to edit freely (DEC-S019).

bushel-mobile is a **fully independent seeds project**, not a satellite of bushel (DEC-052 in the bushel repo). Own version line, own `sessions` branch, own `/retro`, phases numbered from 1. A phase never spans repos.

## What We're Building

The native mobile companion to **Bushel** (Bay Branch Farm's inventory & order system, `order.baybranchfarm.com`). An Expo/React Native app whose **point is push notifications** — a long-term path off SMS/Twilio for order-arrival alerts — plus a read-only active-orders view and exactly one mutation (mark-fulfilled). It is **not an admin port**; the web app stays the admin surface (DEC-050). This app is the muster-rehearsal for going native.

Roles:
- **Annabel (Admin, Android)** — receives order-arrival push, views active orders, marks orders fulfilled. Android sideload APK ($0, full push).
- **Emma (iPhone)** — free-signed 7-day install, install/run only. **iOS remote push is gated on the deferred $99 Apple Developer enrollment** (APNs key requires paid membership); Android proves the loop first.

## Stack
- **App:** Expo (SDK 57) / React Native, TypeScript **strict**, Expo Router (file-based routes under `src/app/`).
- **Backend:** Bushel's `/api/*` routes (bushel task 11.1 / #261) — Server Actions are uncallable from native, so bushel exposes REST. **No database in this repo.**
- **Auth (DEC-047):** request an email login code → exchange it for the **HMAC session as a bearer token** → store in `expo-secure-store` → send on every `/api/*` call. No new auth work beyond bushel 11.1's guard.
- **API base:** `https://order.baybranchfarm.com/api/*`.
- **Push:** `expo-notifications` + the Expo push API; device token registered to bushel. **v1 = Android-only push.**
- **Build/distribution:** EAS build → sideloaded Android APK (free tier). iOS: free-signed 7-day build, install-only.

## Core Data Model
No local database. State is the bearer session token (secure storage) + whatever bushel's `/api/*` returns (active orders, fulfillment state). Model of record lives in bushel.

## Commands
```bash
# Development
npm run start        # Expo dev server (Metro)
npm run android      # run on Android device/emulator
npm run ios          # run on iOS (needs macOS for native build; use Expo Go otherwise)
npm run web          # run in browser
npm run lint

# Builds (EAS)
npx eas build --platform android --profile preview   # sideloadable APK
npx eas build --platform ios --profile preview       # free-signed, install-only
```

## Additional Docs
Project-specific docs beyond the baseline table in the `CLAUDE.md` shell's `## Key Docs`. (None yet — delete this note when you add the first.)

## Workflow Overrides
Overrides to the shell's `## Micro Workflow`. The shell's default workflow is webapp-shaped (Playwright + pgTAP + 375px screenshot). This is a native app with no database, so:

> **Step 5 (test)** — no pgTAP, no vitest-pg, no RLS tests. Keep **test-first when behavior changes**; unit-test pure logic (token handling, API client, notification payload parsing). **Step 6 (verify)** — no Playwright and no 375px web screenshot; verify on-device via Expo dev client / EAS build (Android is the primary target). **Step 7** — no mobile web screenshot.

There is **no database**, so the shell's Migration Protocol does not apply (see below).

## Migration Protocol (project)
**N/A — no database.** All persistence and schema live in bushel. This repo only calls bushel's `/api/*`.

## Conventions

### TypeScript
- Strict mode on. No `any`.
- Type the `/api/*` responses explicitly; mirror bushel's route contracts (11.1 / #261).

### Structure & Routing
- Expo Router: screens are files under `src/app/`. Shared UI in `src/components/`, hooks in `src/hooks/`.
- Keep components under 200 lines. Split if larger.
- One typed API client (`src/lib/api.ts` or similar) that attaches the bearer token and centralizes the base URL.

### Auth & Storage
- Bearer session token from bushel (DEC-047) stored via **`expo-secure-store`** — never `AsyncStorage`, never plaintext.
- The login flow is: request email code → exchange for session token → persist → attach `Authorization: Bearer <token>` on every `/api/*` request.

### Notifications
- `expo-notifications` for permissions + token; register the Expo push token to bushel so order-arrival events fan out.
- **Android-only push in v1.** iOS remote push is deferred behind the $99 Apple Developer enrollment — code defensively so an iOS build that can't receive remote push still runs.

### Mutations
- Exactly one write path in Phase 1: **mark-fulfilled**, through bushel's 11.1 `/api/*`. Optimistic UI, reconcile on response. Resist adding a second mutation (DEC-050 — this is a rehearsal, not an admin port).

### Naming
- Files: `kebab-case.tsx` / `kebab-case.ts`
- Components: `PascalCase`
- Route files follow Expo Router conventions.

### Testing
- **Test the user, not the function.** Test-first when behavior changes.
- Unit-test pure logic (token exchange, API client, payload parsing). No pg/RLS/Playwright layers.
- Verify UX **on-device** (Android primary) — Expo dev client during development, EAS build for release verification.

## Standing Constraints (DEC-050 / DEC-052 — don't re-litigate)
- **Thin scope:** receive push + read active orders + one mutation (mark-fulfilled). NOT an admin port.
- **iOS push gated** on the deferred $99 Apple Developer enrollment; Android proves the loop.
- **Parity pass every `/retro`:** each phase close runs the web↔app parity check — which admin capabilities bushel shipped this window should the app pick up. This **downstream repo owns the obligation** so it can't be dropped.
- **No precedent for muster** — this structure is bushel-specific.

## Workflow Notes (project)
- **Expo has changed — read the versioned docs.** Before writing Expo/RN code, consult the exact SDK docs at `https://docs.expo.dev/versions/v57.0.0/`. (This replaces the scaffold's root `AGENTS.md` pointer.)
- **11.1 dependency:** the orders-list and mark-fulfilled screens integrate against bushel task 11.1 (#261). The scaffold + login screen can start before it merges; the data/mutation screens build against its route shapes (check `gh issue view 261 --repo mobiustripper42/bushel` for status). Cross-repo `closes` does not auto-close — bushel-mobile PRs `closes` their own issues.
