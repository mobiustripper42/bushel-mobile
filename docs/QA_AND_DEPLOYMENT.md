# QA & Deployment Runbook — bushel-mobile

The noob-proof map for **how a change gets from my keyboard onto Annabel's phone**.
This is a native Expo/React Native app, so the web workflow you may have seen
(Vercel preview URLs, Playwright, 375px screenshots) **does not apply** — that's
bushel's world. This doc is the app's world.

> **TL;DR of the whole lifecycle:**
> unit tests (CI, automatic) → live testing on a real phone via Expo Go (you) →
> acceptance against the issue's criteria (you) → EAS cloud build → sideload the
> APK onto the Android phone. iOS is deferred (see the iOS section).

---

## The four testing layers

Only layer 1 is automated. The rest happen on a physical phone — there is no
"just look at the preview URL" for a native app.

| # | Layer | Where it runs | Who | When |
|---|-------|---------------|-----|------|
| 1 | **Unit tests** (jest-expo) | Your laptop + CI | Automatic | Every PR |
| 2 | **Live dev testing** (Expo Go) | A real phone over WiFi | You | While a feature is being built |
| 3 | **Acceptance / QA** | A real phone | You | Before a task is called done |
| 4 | **Release build** (EAS → sideload) | Expo cloud → the phone | You | At a release (issue #4) |

### Layer 1 — Unit tests (automated)

- `npm test` runs the jest-expo suite. It tests **pure logic** — the API client,
  token storage, payload parsing — with `fetch` and `expo-secure-store` mocked.
  No phone, no network. Fast.
- This is the **"no test, no push"** gate. CI (`.github/workflows/ci.yml`) runs
  `typecheck` + `lint` + `test` on every PR. Red CI = the PR doesn't merge.
- It does **not** prove the app *looks right* or that push works — that's what a
  phone is for.

### Layer 2 — Live dev testing on a phone (Expo Go)

This is the loop you'll live in while a feature is being built.

1. `npm run start` — starts the Metro bundler, prints a **QR code** in the terminal.
2. On an **Android phone**, install **Expo Go** (free, Play Store).
3. Scan the QR code with Expo Go → the app loads on your phone and
   **hot-reloads** as code changes. Phone and laptop must be on the **same WiFi**.
4. Shake the phone (or `m` in the terminal) for the dev menu — reload, inspect, etc.

**What works in Expo Go:** the UI, navigation, login, `expo-secure-store`,
API calls. So **all of issue #1 is testable this way.**

**What does NOT work in Expo Go:** **remote push notifications** (issue #2). Push
needs a real build (a "dev client" or an EAS build), not the generic Expo Go
sandbox. We cross that bridge at #2 — don't expect push to work over Expo Go.

### Layer 3 — Acceptance / QA

Before calling a task done, walk its **issue's acceptance criteria** on the phone.
E.g. issue #1: request a login code → receive the email → enter the code → land on
the active-orders screen showing real orders. If every criterion passes on-device,
it's done.

### Layer 4 — Release build (EAS → sideload)

See **Deployment** below. This is issue #4's job; you don't do it per-task.

---

## Pointing the app at a backend (the "base URL")

The app talks to bushel's HTTP API (`/api/mobile/*`). Which bushel?

- **Default:** production — `https://order.baybranchfarm.com`. Baked into the app
  as the default. This is what a released APK always uses.
- **Dev override (paste-and-go):** in a **dev build**, the login screen shows a
  **"Server URL"** field. Paste any URL there (e.g. a Vercel preview deploy of
  bushel) and it sticks on-device until you change it. Hidden in the released APK.

### Testing against a Vercel preview deploy

bushel makes a **unique preview URL per push**. To test the app against an
in-flight bushel change, copy that preview URL from Vercel and paste it into the
app's Server URL field.

**Caveat:** Vercel preview deploys are often behind **deployment protection**
(Vercel SSO / password). If so, the app's request hits Vercel's auth wall and gets
**HTML back instead of JSON** — it'll look like a broken API. Production is public,
so it always works. Previews only work if protection is off or you use a bypass
token.

### Sanity check that a backend is reachable

```bash
curl -i https://order.baybranchfarm.com/api/mobile/orders
# 401 {"error":"Unauthorized"}  → route exists, backend is deployed. Good.
# 404                            → that deploy doesn't have the /api/mobile routes.
# HTML                           → (preview) it's behind Vercel protection.
```

---

## Deployment (EAS → sideload)

**EAS** = Expo Application Services, Expo's cloud build service. You need a **free
Expo account** (`npx eas login`). Builds happen in Expo's cloud and give you a
download link — no Android Studio / Xcode needed for the build itself.

### Android (the real target — $0, full push)

```bash
npx eas build --platform android --profile preview   # builds a sideloadable APK
```

1. EAS builds in the cloud, gives you a **download URL** for an `.apk`.
2. Send the APK to Annabel's Android (email/Drive/USB).
3. On her phone: tap the APK → Android warns "install from unknown source" →
   allow it for the installer app → install.
4. Done. Full remote push works on Android with no paid account.

"Sideload" just means installing an app outside the Play Store. It's normal and
free on Android.

### iOS (deferred — read before spending money)

**Do not buy an iPhone or pay the $99 right now.** Here's the honest state:

- **The iOS Simulator is macOS + Xcode only.** You're on Linux — **it does not
  exist on your machine.** And even on a Mac, the simulator **cannot receive real
  remote push**, so it wouldn't prove the thing that matters anyway.
- **The $99 Apple Developer Program is not mainly about "longer than 7 days."**
  For this app it's about one thing: **iOS remote push does not work at all
  without it** (no paid account = no APNs key = the server literally cannot push
  to an iPhone). The 7-day expiry is a *separate* free-tier limitation.
- **Free-signed install:** a build signed with a free Apple ID runs on a
  registered iPhone but **expires after 7 days** (re-sign weekly) and **still has
  no remote push.**
- So a cheap physical iPhone would only prove *"the app renders on iOS"* — **not
  push.** Push on iOS stays blocked until the $99.

**The plan (DEC-050 / project constraints):** Android proves the push loop first;
iOS remote push is deferred behind the $99 enrollment. Emma's Phase-1 iOS story is
"install-only, 7-day, no push," and realistically may not happen. That's fine and
intentional. Revisit iOS only when push there becomes a real goal.

---

## What does NOT apply here (so you're not confused by the seeds docs)

The seeds `CLAUDE.md` shell is written for a webapp. These parts are **N/A** for
this repo (already noted in `.claude/CLAUDE-context.md § Workflow Overrides`):

- **Vercel preview URLs on PRs** — no. This app isn't deployed to Vercel. (bushel
  is; that's why bushel *has* preview URLs we can point the app at.)
- **Playwright integration tests** — no. Native app; testing is jest-expo + manual
  on-device.
- **375px web screenshots** — no. "Mobile viewport" verification means an actual
  phone, not a browser at 375px.
- **pgTAP / RLS tests** — no. No database in this repo; all data lives in bushel.
