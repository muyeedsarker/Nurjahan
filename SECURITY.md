# Nurjahan.com Security Notes

- Firestore rules require the custom claim `admin: true` for admin payment reads and updates.
- Set the claim once with the Firebase Admin SDK for the intended admin UID. Do not expose a client-side way to self-promote.
- Register a reCAPTCHA Enterprise Web key in Firebase App Check and replace `REPLACE_WITH_NURJAHAN_RECAPTCHA_ENTERPRISE_SITE_KEY` in `firebase-config.js`.
- Enable App Check enforcement for Cloud Firestore and Firebase AI Logic in Firebase Console after registering the web app.
- Deploy `functions/` before using Admin Approve/Reject; `reviewPayment` performs server-side bKash/Nagad TRX duplicate protection.
