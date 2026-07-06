# bushel-mobile — Spec

The native mobile companion to **Bushel** (`order.baybranchfarm.com`). Expo/React Native. The **point is push notifications** — a long-term path off SMS/Twilio for order-arrival alerts — proven first as a muster rehearsal (DEC-050). This repo is an independent seeds project (DEC-052 in bushel); a phase never spans repos.

## In scope (V1)

- **Email-code login** → HMAC session as a bearer token (DEC-047), stored in `expo-secure-store`, sent on every `/api/*` call.
- **Read-only active-orders screen** — what's open, pulled from bushel's `/api/*`.
- **Push notifications** — `expo-notifications` + Expo push API; device token registered to bushel; order-arrival fan-out. **v1 is Android-only push.**
- **Exactly one mutation** — mark-fulfilled, through bushel 11.1 `/api/*`, optimistic UI.
- **Distribution** — Android sideload APK (Annabel, $0); iPhone free-signed 7-day install-only (Emma).

## Not V1 (explicitly out)

- **An admin port.** The web app stays the admin surface. No second mutation, no inventory/customer management. (DEC-050)
- **iOS remote push.** Gated on the deferred $99 Apple Developer enrollment (APNs key). Android proves the loop; revisit when the enrollment is paid.
- **Any local database.** The model of record lives in bushel; this app only calls `/api/*`.
- **App Store / Play Store distribution.** Sideload + free-sign only for V1.

## Backend contract

Bushel task **11.1 (#261)** exposes the first `/api/*` routes with a bearer-token guard. This app is a pure client of that contract. Server Actions are uncallable from native, which is why bushel adds REST at all.
