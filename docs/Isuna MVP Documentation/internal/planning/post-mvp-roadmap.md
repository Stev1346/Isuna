# Post-MVP Roadmap

> **Classification:** Internal  
> **Authority:** Future strategy authority  
> **Audience:** Founder and Cursor  
> **Status:** Founding MVP baseline  
> **Last reviewed:** 2026-07-16


## Roadmap policy

These phases communicate direction, not dates or commitments. Begin a phase only after the entry conditions are met and user evidence shows it solves a priority problem. Each phase receives a new PRD, threat/privacy review and revised architecture—not a quiet expansion of the MVP.

## 1. Automation and convenience

- **Objective:** Reduce manual maintenance after the monthly loop proves retention.
- **User value/features:** Recurring transaction matching, improved saved CSV mappings, reminders, rules, bulk review, statement/import assistance.
- **Dependencies:** Reliable manual workflows, event/notification infrastructure, measured pain points.
- **Risks:** Incorrect automation can silently corrupt categories or confidence.
- **Security concerns:** Rule explainability, opt-in, undo, audit and no sensitive notification content.
- **Monetization potential:** Higher paid tier or retention value.
- **Success criteria:** Maintenance time falls without reconciliation exceptions/errors rising.
- **Conditions before beginning:** At least two closed cycles per active beta household and clear repeated manual friction.
## 2. Connected financial accounts

- **Objective:** Import consented account data while preserving reconciliation and user control.
- **User value/features:** Flinks/Plaid/Open Banking provider integration, connection health, consent renewal, transaction sync, balance sync, duplicate/merge.
- **Dependencies:** Provider due diligence, stable ledger/import IDs, sync state machine, support capacity.
- **Risks:** Coverage gaps, duplicates, stale data, provider cost/outage, consent confusion.
- **Security concerns:** Token vault/provider handling, least scope, webhook verification, revocation, data residency and breach contracts.
- **Monetization potential:** Premium connectivity tier; household subscription.
- **Success criteria:** High connection success, low duplicate rate, faster close, explainable freshness.
- **Conditions before beginning:** Manual close loop is valuable; provider and legal/privacy review approved.
## 3. Advanced planning

- **Objective:** Support longer-term trade-offs with transparent scenario modelling.
- **User value/features:** Advanced debt schedules, mortgage renewal scenarios, goals timeline, retirement/FI ranges, pensions/taxes inputs, scenario comparison.
- **Dependencies:** Validated calculations, expert review, historical data and disclaimers.
- **Risks:** False precision, regulatory/advice perception, complex UX.
- **Security concerns:** Version assumptions, no recommendations, protect sensitive inputs, independent model validation.
- **Monetization potential:** Premium planning tier or professional collaboration.
- **Success criteria:** Users understand assumptions and scenarios influence documented decisions without support confusion.
- **Conditions before beginning:** Core calculations reviewed independently and product has sufficient longitudinal data.
## 4. Mobile experience

- **Objective:** Make maintenance and meetings excellent on mobile, then consider native capabilities.
- **User value/features:** PWA/offline-safe read, quick transaction review, camera-free imports, notifications; native app only with demonstrated need.
- **Dependencies:** Responsive web maturity, API/session model, mobile usage evidence.
- **Risks:** Offline conflicts, duplicated platforms, app-store burden.
- **Security concerns:** Secure storage, biometric/session design, lost device, push privacy, no unsafe cached reports.
- **Monetization potential:** Included premium value or mobile tier unlikely initially.
- **Success criteria:** Mobile completion and retention improve without data conflicts.
- **Conditions before beginning:** Responsive web users show unmet native needs and team capacity exists.
## 5. Professional adviser tools

- **Objective:** Enable household-authorized collaboration with qualified professionals without turning consumer roles into chaos.
- **User value/features:** Read-only/share scopes, consent windows, adviser workspace, comments/tasks, report packs, organization admin.
- **Dependencies:** Granular authorization redesign, identity verification, contracts and market validation.
- **Risks:** Privacy, professional liability, two-sided sales/support, role complexity.
- **Security concerns:** Explicit consent, least access, session/audit, tenant boundaries between adviser firms and households.
- **Monetization potential:** B2B/adviser seat and client household plans.
- **Success criteria:** Advisers and households complete reviews faster with no permission incidents.
- **Conditions before beginning:** Consumer product stable; professional discovery validates willingness/payments and legal model.
## 6. International expansion

- **Objective:** Adapt the operating system to additional countries without false localization.
- **User value/features:** Currencies, locales, account/tax wrappers, privacy notices, institutions, fiscal periods and terminology.
- **Dependencies:** Country abstraction, FX accounting design, local experts/legal counsel, provider coverage.
- **Risks:** Regulatory, currency and tax complexity; fragmented support.
- **Security concerns:** Regional hosting/subprocessors, consent, data transfer, localized deletion/breach duties.
- **Monetization potential:** Country-specific plans/partnerships.
- **Success criteria:** One country achieves activation/retention comparable to Canada with low localization defects.
- **Conditions before beginning:** Canadian model proven and a specific market has evidence, expertise and support capacity.
## 7. Privacy-conscious AI

- **Objective:** Assist organization and explanation without becoming an autonomous financial adviser or leaking household data.
- **User value/features:** Natural-language navigation, user-approved categorization suggestions, meeting-summary drafting, anomaly questions, document explanation with strict scope.
- **Dependencies:** Deterministic core, consent/data controls, evaluation set, provider contracts, human review.
- **Risks:** Hallucination, advice claims, bias, data retention/training, prompt injection, overreliance.
- **Security concerns:** Opt-in, data minimization/redaction, no provider training where contractually supported, retrieval boundaries, action confirmation, audit/evaluation.
- **Monetization potential:** Premium assistant add-on only if it creates value responsibly.
- **Success criteria:** Suggestions are accurate/understood, users retain control, privacy/security evaluations pass.
- **Conditions before beginning:** Legal/privacy/security review, robust evals and clear non-advice UX; never used to fix weak deterministic product.

## Explicit sequencing guidance

Automation can begin before connected accounts because it improves the manual model without outsourcing truth. Connected accounts should precede broad mobile/native or AI investment because data quality and sync state become foundational. Advanced planning requires independently reviewed calculations. Adviser, international and AI phases are separate strategic bets and should not be run simultaneously by a solo founder without narrowed experiments or additional capacity.

## Ongoing non-goals unless strategy changes

Isuna should not become a bank, custody platform, payment rail, tax filer, lender, unlicensed advice service or advertising-data broker. Any movement toward these categories requires a new legal/regulatory/business strategy, not merely a feature ticket.
