# MVP Scope and Non-Goals

> **Classification:** Internal  
> **Authority:** Scope authority  
> **Audience:** Founder and Cursor  
> **Status:** Founding MVP baseline  
> **Last reviewed:** 2026-07-16


## Scope rule

A feature belongs in the MVP only when it is necessary to complete the secure monthly operating loop, preserve trustworthy history, satisfy launch safety, or generate essential learning. “Related to personal finance” is not sufficient.

## Must have

| Capability | Rationale |
|---|---|
| Authentication and protected sessions | No household data can be trusted without identity and server-side session handling. |
| Households, owner/editor roles, invitations and switching | Collaboration and tenant isolation are core to the promise. |
| Guided onboarding with progress | Manual MVP setup must be understandable and resumable. |
| Accounts, opening balances and categories | Foundation for every calculation and workflow. |
| Manual transactions, CSV mapping/preview, duplicates, splits and transfers | Required to establish the monthly record without bank sync. |
| Monthly budget and actual variance | Necessary for the meeting and current-position understanding. |
| Reconciliation and close-readiness validation | Creates trustworthy inputs rather than decorative dashboards. |
| Debt, savings and manual investment tracking | Supports the complete household picture at appropriate MVP depth. |
| Net worth and focused dashboard | Answers where the household stands and what needs attention. |
| Monthly Money Meeting, decisions and action items | Primary behavioural differentiation. |
| Immutable month snapshot and report | Core proof of reliable historical record. |
| Quarterly review after three closed months | Proves longitudinal value while reusing snapshots. |
| Data export and deletion | Trust, privacy and user control are launch requirements. |
| Audit events, monitoring, backups and security controls | Sensitive SaaS cannot defer basic operational safety. |

## Should have

Should-have work is planned but may be reduced or feature-flagged when it threatens data integrity, security, accessibility or the complete monthly loop.

| Capability | Rationale |
|---|---|
| Google OAuth | Reduces sign-in friction but email/password is sufficient for first internal test. |
| Simple categorization rules | Improves repeated maintenance; can ship after manual categorization works. |
| Recurring bills and upcoming expenses | Improves next-actions area but does not define the closed record. |
| Basic subscription records and Stripe test-mode flow | Prepares SaaS launch; enforcement can be feature-flagged during beta. |
| Stored private PDFs | Valuable, but browser print can temporarily validate report layout before automated generation. |
| Financial health score | Useful only if transparent and not allowed to delay core KPIs. |

## Could have

| Capability | Rationale |
|---|---|
| Saved CSV mappings per institution/account | Convenience after generic mapping is reliable. |
| Household notification reminders | Retention aid after core meeting workflow proves useful. |
| Additional chart views | Only after user research shows a decision need. |
| Basic FI scenario | Can be omitted if disclaimers and inputs threaten launch quality. |
| Owner-created reusable budget templates | Copy previous month may be enough initially. |

## Not in MVP

| Deferred capability | Why deferred |
|---|---|
| Direct bank synchronization | Provider, consent, reconciliation, liability and reliability complexity would dominate the MVP before the manual loop is proven. |
| Native iOS or Android applications | Responsive web validates workflows first and avoids duplicate platform work. |
| Automated investment-price feeds | Market-data licensing, stale prices and valuation complexity are not required for manual snapshots. |
| Bill payment or money transfers | Introduces custody/payment risk and regulation far beyond organizational software. |
| Credit-score integration | Sensitive third-party data and unclear relevance to the operating loop. |
| Receipt OCR | Accuracy, storage, privacy and edge cases exceed its MVP value. |
| Tax filing | Country-specific regulated complexity and professional-advice risk. |
| Mortgage applications | Lending workflow and regulation are outside the product category. |
| Personalized investment, tax or mortgage advice | Requires qualifications, governance and regulatory analysis; MVP provides organization and user-controlled scenarios only. |
| AI financial advice | High risk of hallucination, disclosure and data exposure before a trusted deterministic core exists. |
| Adviser marketplace | Two-sided marketplace and professional verification are separate businesses. |
| Multi-currency household accounting | FX rates, gains/losses and historical conversion rules would undermine the simple Canadian-first model. |
| Full document management | Reports and temporary imports do not justify broad file lifecycle/search/versioning. |
| Complex scenario engines | False precision and large calculation/UI surface; start with transparent simple inputs. |
| Gamification | Can trivialize stress and distract from calm, factual progress. |
| Microservices | A solo developer needs coherent transactions, deployment and observability; modular boundaries are enough. |

## Change-control test

Before adding scope, answer all five:

1. Which MVP proof statement fails without this capability?
2. Which current Must-have will be delayed or simplified?
3. What new data, security and privacy obligations appear?
4. Can the same learning be obtained manually or with a smaller experiment?
5. Does the founder understand and have capacity to operate it?

If the answers are weak, put the idea in `post-mvp-roadmap.md` rather than the active sprint.

## Minimum launch slice

When schedule pressure is severe, protect this vertical slice in order: identity → household/RLS → accounts/categories → manual transactions → budget → reconciliation → dashboard → meeting → close/snapshot → report → export/delete → security/release. Debt, savings, investments, CSV convenience, quarterly review and billing can then be layered without weakening the core model, but the stated MVP should not be publicly called complete until all Must-have items are delivered.
