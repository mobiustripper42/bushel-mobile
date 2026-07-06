# bushel-mobile — Decisions

Architectural decisions for **this repo**, numbered `DEC-001` from here. bushel-mobile keeps its own DEC ledger (it is an independent seeds project). The **founding decision lives in bushel** — `DEC-052` (bushel-mobile is an independent seeds project; a phase never spans repos) — and its parent `DEC-050` (separate Expo repo, push-first, thin scope). Both are referenced, not duplicated, here.

## Inherited from bushel (context, not re-litigated)
- **bushel DEC-052** — this repo is a fully independent seeds project (own CLAUDE.md shell, skills/agents, `sessions` branch, SemVer, `/retro`). A phase is a single-repo accounting unit.
- **bushel DEC-050** — separate Expo repo; push notifications are the point; thin scope (read + one mutation), not an admin port; per-phase web↔app parity pass owned by this repo's `/retro`.
- **bushel DEC-047** — admin auth is email login code → self-rolled HMAC session, bearer-consumable. This app stores that session as a bearer token.

## bushel-mobile decisions

_(None yet — add DEC-001 when the first app-side architectural choice is made, e.g. router structure, API-client shape, or secure-storage pattern.)_
