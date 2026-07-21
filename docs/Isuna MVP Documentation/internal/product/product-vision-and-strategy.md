# Product Vision and Strategy

> **Classification:** Internal  
> **Authority:** Product strategy authority  
> **Audience:** Founder and Cursor  
> **Status:** Founding MVP baseline  
> **Last reviewed:** 2026-07-16


## Brand meaning

**Isuna** is derived from the Yoruba word **“Ìṣúná,” meaning budget**. The name honours the founder’s Yoruba and Nigerian heritage while remaining approachable in a Canadian market. The cultural connection should be explained accurately and respectfully; it should never be reduced to visual clichés or used as a substitute for a clear product experience.

Pronunciation guidance for public copy should be confirmed with the founder before recording audio. In text, introduce the origin once, then use **Isuna** consistently as the product name.

## Vision

Households should have the clarity, routine, and shared context needed to make financial decisions with confidence—not merely a longer list of transactions.

## Mission

Build a secure, understandable financial operating system that helps households organize their complete financial picture, review it together, act on what matters, and preserve reliable history.

## Product promise

### Alternatives considered

1. Know where your household stands, understand what needs attention, and make better financial decisions together.
2. Turn scattered financial information into a clear household plan.
3. See the full picture. Focus on what matters. Move forward together.
4. Make every month a clearer step toward your household goals.
5. Understand your money, align your household, and decide what comes next.
6. **See your whole financial picture, know what needs attention, and decide what comes next—together.**

### Recommendation

> **See your whole financial picture, know what needs attention, and decide what comes next—together.**

It is direct, outcome-based, emotionally calm, and broader than budgeting. “Whole financial picture” supports the product’s operating-system category; “what needs attention” expresses prioritization; “what comes next” supports meetings and action items; “together” preserves collaboration without excluding individuals.

## Problem statement

Household financial information is fragmented across bank portals, spreadsheets, budgeting apps, loan statements, investment accounts, notes, and conversations. Most tools optimize transaction capture or a single financial task. They do not reliably help a household answer what changed, whether the data is complete, what requires a decision, or what should be preserved as the official record of a month.

The resulting problems include:

- uncertainty about the household’s true position;
- duplicated or inconsistent numbers between partners;
- budgets that are created but not reviewed;
- debt, savings, investment, and net-worth goals managed separately;
- financial meetings that feel improvised or emotionally difficult;
- historical reports that change when live account data changes;
- action items that are agreed but not followed through.

## Proposed solution

Isuna combines structured financial data with a repeatable operating cadence:

1. **Set up the household picture** through guided onboarding.
2. **Maintain trustworthy data** through transactions, categorization, budgets, and reconciliation.
3. **Understand the present** through a focused executive dashboard.
4. **Review and decide** through a Monthly Money Meeting.
5. **Close and preserve** each month as an immutable snapshot.
6. **Learn over time** through quarterly reviews and historical comparisons.

The MVP is successful when this loop works manually and securely. Automation comes later.

## Target market

### Initial beachhead

Canadian individuals and couples who actively want to organize household finances but have outgrown disconnected spreadsheets or transaction-only budgeting tools. Early adopters are comfortable entering or importing data and value a monthly review ritual.

### Secondary early users

- households paying down high-interest debt;
- households coordinating shared and separate accounts;
- families managing sinking funds and large irregular expenses;
- users tracking Canadian registered accounts manually;
- financially engaged households pursuing long-term wealth or independence.

## Canadian-first focus

The MVP defaults to CAD and supports provinces/territories, Canadian account labels (TFSA, RRSP, FHSA, RESP), mortgages, and Canadian privacy expectations. Canadian-first does not mean hard-coding every assumption into the domain model. Country, currency, locale, account taxonomy, and disclosure text must remain configurable for future expansion.

## Long-term opportunity

The strategic opportunity is to become the household’s trusted financial record and decision workspace—not a bank, broker, adviser, tax preparer, or payment network. Future value can come from connected account data, better planning, adviser collaboration, mobile workflows, and privacy-conscious assistance, but only after the manual operating loop proves useful and trustworthy.

## Differentiation

| Dimension | Typical budgeting tool | Isuna direction |
|---|---|---|
| Core object | Transactions or envelopes | Household financial operating cycle |
| Collaboration | Shared login or limited sharing | Explicit household membership and decisions |
| Data quality | Imported data assumed current | Reconciliation and freshness indicators |
| History | Recalculated charts | Immutable closed-period snapshots |
| Guidance | Notifications and charts | Structured monthly and quarterly reviews |
| Scope | Spending focus | Cash flow, debt, savings, investments, mortgage and net worth |
| Outcome | Track money | Understand, decide, act and preserve |

## Business-model hypotheses

These are hypotheses, not commitments:

- Household subscription with a simple monthly/annual price.
- One household plan includes two core members; additional roles are post-MVP.
- A meaningful free trial or private beta lowers trust friction.
- Paid value comes from continuity, reporting, collaboration, history, and automation—not locking users out of their own exports.
- Future adviser or professional tiers may be distinct products rather than permission complexity inside the consumer MVP.

Pricing must be validated through interviews and beta behaviour before public promises.

## Success definition

### Product evidence

- A new household reaches a first reconciled month without founder intervention.
- Two-member households can collaborate without cross-household leakage or ownership confusion.
- Users complete the Monthly Money Meeting and create action items.
- Closed snapshots remain stable when live data changes.
- Users can explain what changed and what they will do next.

### MVP operating metrics

Do not collect sensitive amounts for analytics unless necessary and consented. Prefer:

- onboarding completion rate;
- time to first account and first transaction;
- first reconciliation completion;
- first meeting completion;
- month-close completion;
- return for second monthly cycle;
- invitation acceptance rate;
- export/delete request completion;
- support incidents by workflow;
- security and privacy incidents (target: zero).

## Strategic risks

| Risk | Why it matters | Response |
|---|---|---|
| Scope overload | The concept spans many financial domains | Protect the one complete monthly loop; defer automation and advanced planning |
| Trust failure | Financial data is highly sensitive | Security, privacy, clear limitations and reliable exports are launch requirements |
| Manual-entry burden | MVP lacks bank sync | Excellent CSV mapping, onboarding, copy-forward and freshness cues |
| False precision | Projections and scores can appear authoritative | Transparent formulas, missing-data states, assumptions and disclaimers |
| Solo-developer capacity | Twelve planned sprints may take much longer | Small vertical slices, strict checkpoints, limited dependencies and documented decisions |
| Framework learning | New stack can cause accidental complexity | Modular monolith, official patterns, test foundations and Cursor mentorship |
| Regulatory overclaim | “Secure” or “Canadian” claims may be too broad | Evidence-based public wording and privacy/legal review before launch |

## Guiding priorities

1. Household isolation and data integrity.
2. A complete, understandable monthly operating loop.
3. Reconciliation and historical reliability.
4. Calm, accessible usability.
5. Founder comprehension and maintainability.
6. Evidence before automation or scope expansion.
