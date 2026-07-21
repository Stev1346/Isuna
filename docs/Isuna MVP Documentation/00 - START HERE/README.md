# Isuna MVP Documentation — Start Here

> **Classification:** Internal  
> **Authority:** Navigation authority  
> **Audience:** Founder and Cursor  
> **Status:** Founding MVP baseline  
> **Last reviewed:** 2026-07-16


## Purpose of this package

This directory is the founding documentation system for **Isuna**, a Canadian-first Family Financial Operating System. It translates the product idea into one coordinated plan that can guide an empty GitHub repository to a production-ready MVP without turning Cursor into an autonomous implementation agent.

The governing development relationship is non-negotiable:

- **The founder is the sole developer.** The founder writes, adapts, runs, tests, debugs, deploys, and understands the code.
- **Cursor is the senior mentor.** Cursor explains concepts, proposes focused snippets, reviews work, identifies risks, and stops at checkpoints.
- Documentation defines intent and constraints; code and migrations implement them. Neither should silently contradict the other.

## Read these first

Read in this order before creating application code:

1. [`documentation-map.md`](documentation-map.md) — where every document fits.
2. [`open-decisions.md`](open-decisions.md) — defaults that can be changed deliberately.
3. [`../internal/product/product-vision-and-strategy.md`](../internal/product/product-vision-and-strategy.md) — why Isuna exists.
4. [`../internal/requirements/master-prd.md`](../internal/requirements/master-prd.md) — what the MVP must do.
5. [`../internal/architecture/system-architecture.md`](../internal/architecture/system-architecture.md) — how the system is divided.
6. [`../internal/security/security-and-privacy-plan.md`](../internal/security/security-and-privacy-plan.md) — how sensitive data is protected.
7. [`../internal/planning/mvp-roadmap-and-sprints.md`](../internal/planning/mvp-roadmap-and-sprints.md) — delivery order.
8. [`../internal/development/cursor-senior-developer-guide.md`](../internal/development/cursor-senior-developer-guide.md) — the operating contract for Cursor.

## What Cursor should read

Do not load the entire documentation tree into every Cursor chat. Give Cursor the smallest authoritative context for the current task:

| Work type | Required documents |
|---|---|
| Any sprint | roadmap, implementation playbook, Cursor guide |
| Product behaviour | master PRD, scope, user stories |
| Database or migration | database model, RLS guide, security plan |
| Financial formula | financial calculation rules, relevant acceptance criteria |
| Month close or reports | month-close design, calculation rules, database model |
| UI work | brand/UI system, product principles, accessibility requirements |
| Release | testing/release plan, threat checklist, launch criteria |

Cursor must explicitly state which documents it read and identify conflicts rather than choosing silently.

## Documentation and development lifecycle

1. A product requirement is approved in the PRD or scope document.
2. A user story and observable acceptance criteria define completion.
3. Architecture documents define data ownership, boundaries, authorization, and invariants.
4. The roadmap places work in a sprint.
5. The implementation playbook breaks the feature into teachable steps.
6. The founder implements one step, tests it, and asks Cursor for review.
7. Migrations, tests, and documentation are committed with the feature.
8. Closed-period behaviour, security rules, and public claims receive extra review.

## Information classification

### Private/internal

Everything under `internal/` and `00 - START HERE/open-decisions.md` is private by default. It contains threat scenarios, authorization details, database design, launch assumptions, business hypotheses, and implementation strategy. Do not publish it without a deliberate security and confidentiality review.

### Public-safe

Everything under `public-docs/` and `repository-files/` is written to be publishable. Public-safe does **not** mean automatically approved; review product status, pricing, legal wording, contact details, and promised capabilities before release.

## Sources of truth

Use this precedence order when documents overlap:

1. **Approved decision record in `open-decisions.md`**
2. **Master PRD and MVP scope** for product behaviour
3. **Architecture and security documents** for technical and protection invariants
4. **User stories and acceptance criteria** for observable behaviour
5. **Roadmap and implementation playbook** for sequence
6. **Public documents** for externally approved wording
7. **Code comments and tickets** for local implementation detail

A lower-level source may be more detailed, but it may not contradict a higher-level source. When a deliberate change is made, update all directly affected authoritative documents in the same pull request.

## Updating documentation

- Prefer editing the authoritative document and linking to it elsewhere rather than copying paragraphs.
- Add a short `Decision changed` note to `open-decisions.md` when a default becomes final.
- Update diagrams and permission matrices with schema or authorization changes.
- Update acceptance criteria before or with behaviour changes—not weeks afterward.
- Include documentation impact in every pull-request checklist.
- Use ISO dates (`YYYY-MM-DD`) and Canadian dollars as `CAD` in examples.
- Mark assumptions, examples, and production requirements clearly.

## Avoiding conflicting sources of truth

Before merging a change, ask:

- Which document owns this rule?
- Does the same rule appear elsewhere as copied text?
- Does the schema still enforce the written invariant?
- Do public claims match the implemented product?
- Do tests prove the acceptance criteria?
- Would a new Cursor chat reach the same design conclusion from these documents?

When uncertainty remains, record it in `open-decisions.md`; do not let an undocumented implementation choice become accidental product policy.

## Package boundaries

This package intentionally contains no production application, credentials, complete feature implementations, or giant migration. It is a practical baseline, not a substitute for design review, legal advice, privacy counsel, security testing, or financial expertise.
