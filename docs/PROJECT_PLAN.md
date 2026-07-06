# bushel-mobile — Project Plan

Native mobile companion to Bushel (Bay Branch Farm). Independent seeds project (DEC-052 in bushel). Phases numbered from 1; own version line (starts `0.1.0`), own `/retro`.

**Scope (DEC-050):** receive push + read active orders + one mutation (mark-fulfilled). NOT an admin port. iOS remote push is gated on the deferred $99 Apple Developer enrollment — Android proves the loop.

## Velocity

| Phase | Points | Weeks | Points/week |
|---|---|---|---|
| 1 | 15 (est.) | — | — |

No history yet — first phase. Estimates carried from the bushel Phase 11 poker (the tasks that moved here under DEC-052).

## Phase 1 — Expo app: login, push, one mutation, sideload (15 pts)

Depends on bushel task **11.1 (#261)** — the `/api/*` routes + bearer guard. The scaffold + login screen can start before 11.1 merges; the orders-list and mark-fulfilled screens integrate against 11.1's contract (check `gh issue view 261 --repo mobiustripper42/bushel`). Cross-repo `closes` does not auto-close — this repo's PRs `closes` its own issues.

Scaffold (Expo Router + TS, v0.1.0) already landed on `main` during bootstrap.

| # | Task | Pts | Status |
|---|---|---|---|
| 1.1 | Email-code login (request code → exchange for bearer, store in `expo-secure-store`) + read-only active-orders screen | 5 | [#1](https://github.com/mobiustripper42/bushel-mobile/issues/1) |
| 1.2 | `expo-notifications` + Expo push API; register device token to bushel; order-arrival fan-out to Annabel. **v1 = Android-only push** (iOS remote push deferred behind the $99 Apple Dev gate) | 5 | [#2](https://github.com/mobiustripper42/bushel-mobile/issues/2) |
| 1.3 | Mark-fulfilled mutation — one write path through bushel 11.1 `/api/*`; optimistic UI. Exactly one mutation (rehearsal, not an admin port) | 2 | [#3](https://github.com/mobiustripper42/bushel-mobile/issues/3) |
| 1.4 | Android EAS build → sideloaded APK for Annabel ($0, no Mac). Emma's iPhone: free-signed 7-day build, install-only; document the iOS-push-$99 gate + the 7-day re-sign reality | 3 | [#4](https://github.com/mobiustripper42/bushel-mobile/issues/4) |

**Parity note (DEC-050):** Phase 1's `/retro` runs the first web↔app parity pass — which admin capabilities bushel shipped this window the app should pick up. This downstream repo owns that obligation.

Recreated from bushel issues #262–#265 (closed "not planned" → moved here under DEC-052).
