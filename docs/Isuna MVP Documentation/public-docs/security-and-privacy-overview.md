# Security and Privacy Overview

> **Visibility:** Public  
> **Status:** Founding MVP documentation; capabilities may not yet be available  
> **Last reviewed:** 2026-07-16


## Our approach

Financial information is sensitive. Isuna is being designed so security, privacy, data integrity and user control are part of the product rather than optional add-ons.

This page describes the planned approach in plain language. It does not disclose internal defensive details, guarantee that any system is immune from attack, or claim a certification that has not been earned.

## Individual accounts and household roles

Each household member uses an individual account. Planned household roles distinguish ordinary financial editing from higher-impact Owner actions such as inviting members, exporting the household or requesting deletion.

## Household separation

Household records are designed to be separated at more than one layer. The application checks the signed-in user and household role on the server, while database access rules add a separate boundary. Knowing or changing a record identifier should not provide access to another household.

## Private files and reports

Imported files, generated reports and export archives are intended to use private storage. Access is checked before a temporary download is created. Financial reports are not intended to use public links.

## Historical integrity

A closed month is designed to become an immutable, versioned record. Later changes to live accounts should not silently rewrite the previous report. Authorized corrections create a new version and preserve the earlier history.

## Secure service providers

The planned architecture uses established providers for hosting, authentication/database/storage, payments, email and monitoring. Isuna remains responsible for configuring those services carefully, limiting access, reviewing vendor terms and explaining relevant subprocessors and data locations before launch.

## Payment information

If paid subscriptions are enabled, payment collection is planned through Stripe-hosted Checkout. Isuna does not intend to collect or store raw payment-card numbers in its own forms. Payment status is accepted only from verified server-side provider events.

## Privacy by design

The product is intended to:

- collect only information needed for stated features;
- explain important purposes and choices;
- avoid sending financial amounts, transaction descriptions, notes or report contents to general analytics by default;
- keep original CSV files only under a clear retention choice;
- support access, export and deletion processes;
- maintain retention and backup rules;
- use Canadian privacy principles as a baseline and obtain appropriate legal/privacy review.

## Monitoring without unnecessary financial content

Operational monitoring is useful for detecting errors and incidents, but sensitive form content, tokens, transaction descriptions, CSV rows and reports should not be placed in ordinary logs or error monitoring. Isuna plans to use allowlisted technical metadata and correlation identifiers instead.

## Development safety

The founder remains the sole developer and reviews all code. AI-assisted development tools are intended to receive sanitized code and synthetic data—not production credentials or customer financial records. Security-sensitive migrations, access rules and provider integrations require manual review and tests.

## Incident preparedness

Before public launch, Isuna plans to maintain an incident response process, tested backups and restoration, alerting, provider contacts and a way to report security concerns. If an incident occurs, the response will be based on evidence and applicable notification requirements.

## User responsibilities

Users also help protect their information by using a unique password, protecting their email account and devices, signing out of shared devices, reviewing household members and reporting unexpected activity promptly.

## Security reports

A public vulnerability-reporting method will be maintained in the repository `SECURITY.md`. Do not send real financial records or passwords in a report.
