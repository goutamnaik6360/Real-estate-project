# ESTATE-SYNC signup email codes

Email OTPs are issued and verified by callable Cloud Functions. The browser never creates accounts before a code is verified. Codes are HMAC-protected in Firestore, expire after five minutes, allow five attempts, and are throttled per email and IP. OTP challenge collections are private to the Admin SDK.

## Required setup

1. Link Firebase project `estate-sync` to the Blaze plan. Firebase requires Blaze to deploy Cloud Functions. Cloud Functions includes a no-cost usage quota, but billing is pay-as-you-go if usage exceeds the quota.
2. Create a Resend account and verify a sender domain so messages can be delivered to signup addresses.
3. From the repository root, install function dependencies: `npm install --prefix functions`.
4. Store the Resend API key in Firebase Secret Manager: `firebase functions:secrets:set RESEND_API_KEY --project estate-sync`.
5. Store a private random secret of at least 32 characters for HMAC: `firebase functions:secrets:set OTP_HMAC_SECRET --project estate-sync`.
6. Deploy: `firebase deploy --only functions --project estate-sync`. The CLI prompts for `EMAIL_FROM`; use a sender address on the domain verified with Resend, such as `ESTATE-SYNC <accounts@your-verified-domain>`.

Do not put the Resend key or HMAC secret in the Vite `.env` file or browser code. Do not commit secret values.

## First Admin account

Admin is not a public signup role. Once Functions and email OTP are deployed, register `naikgoutam948@gmail.com` as a normal account and sign in. The sign-in flow calls `bootstrapFirstAdmin`; the server checks the verified email against `ADMIN_BOOTSTRAP_EMAIL` and atomically grants the initial Admin role only once. Firestore client rules prevent users from granting themselves Admin access. Later Admin accounts must be granted by a trusted project owner.
