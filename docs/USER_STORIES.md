# bushel-mobile — User Stories

Two users, both farm-side. The app is not customer-facing (customers order via bushel's tokenized SMS links).

## Annabel — Admin, Android (primary)
- As Annabel, I log in with an email code so the app holds a bearer session without a password.
- As Annabel, I **get a push notification when an order arrives** so I don't have to watch SMS/email — this is the whole point.
- As Annabel, I open the app to a **read-only list of active orders** so I can see what's open at a glance.
- As Annabel, I **mark an order fulfilled** from the app so the one thing I do most is one tap; the UI updates optimistically.
- As Annabel, I install the app as a **sideloaded APK** (no Play Store, no Mac, $0).

## Emma — iPhone (secondary, install-only in V1)
- As Emma, I install a **free-signed build** on my iPhone and open the app to view active orders.
- As Emma, I understand the build **re-signs every 7 days** and that **remote push does not work on iOS yet** (gated on the deferred $99 Apple Developer enrollment).
