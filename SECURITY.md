# Security Policy

## Reporting a vulnerability

If you find a security vulnerability in Nurjahan.com, please do not publish exploit details in a public issue. Contact the repository owner privately through GitHub so the issue can be reviewed and fixed.

## Security principles

- Never commit passwords, OTPs, private keys, service-account credentials, payment PINs, or other secrets.
- Firebase access must be controlled by Authentication, Firestore/Storage Security Rules, and App Check where appropriate.
- The public website must not expose admin credentials or private customer data.
- Administrative actions must require authenticated, authorized access.

## Scope

This policy covers the Nurjahan.com website code and its connected application services. A public copy or fork of the code does not grant access to the production Firebase project or administrative accounts.
