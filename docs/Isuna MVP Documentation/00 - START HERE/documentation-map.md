# Documentation Map

> **Classification:** Internal  
> **Authority:** Inventory authority  
> **Audience:** Founder and Cursor  
> **Status:** Founding MVP baseline  
> **Last reviewed:** 2026-07-16


## How to use this map

Consult the smallest set of documents that can answer the current question. The `Depends on` column identifies context that should be read first when the decision is consequential.

| Document | Purpose | Audience | Visibility | Consult when | Depends on |
|---|---|---|---|---|---|
| 00 - START HERE/README.md | Entry point, authority order, reading workflow | Founder, Cursor | Internal | At project start and when documents conflict | documentation-map; open-decisions |
| 00 - START HERE/documentation-map.md | Inventory and dependency map | Founder, Cursor | Internal | When locating context for work | All documents |
| 00 - START HERE/open-decisions.md | Unresolved choices with recommended defaults | Founder | Internal | Before affected sprint and during architectural review | PRD; architecture; roadmap |
| internal/product/product-vision-and-strategy.md | Vision, market, promise, strategy and risks | Founder, product advisers | Internal | Prioritization and positioning decisions | product principles; PRD |
| internal/product/user-personas-and-jobs.md | Personas and jobs to be done | Founder, design, Cursor | Internal | Discovery, onboarding and workflow design | vision; PRD |
| internal/product/product-principles-and-positioning.md | Product principles, voice and positioning copy | Founder, design, marketing | Internal | Naming, UX copy and public messaging | vision; personas |
| internal/requirements/master-prd.md | Authoritative MVP product requirements | Founder, Cursor, reviewers | Internal | Before feature design and acceptance | vision; scope; stories |
| internal/requirements/mvp-scope-and-non-goals.md | MoSCoW scope and deferrals | Founder, Cursor | Internal | Planning and change control | PRD; roadmap |
| internal/requirements/user-stories-and-acceptance-criteria.md | Testable behaviour by module | Founder, Cursor, QA | Internal | Implementation, test design and demos | PRD; architecture |
| internal/architecture/system-architecture.md | Runtime boundaries, providers and deployment | Founder, Cursor | Internal | Repository setup and cross-cutting design | PRD; security |
| internal/architecture/database-and-data-model.md | Preliminary PostgreSQL model and migration order | Founder, Cursor | Internal | Every schema or data-access change | PRD; RLS; calculations |
| internal/architecture/authentication-multitenancy-and-rls.md | Identity, household permissions and RLS patterns | Founder, Cursor, security reviewer | Internal | Auth, invitations and any household table | database model; security |
| internal/architecture/financial-calculation-rules.md | Canonical financial definitions and test contracts | Founder, Cursor, QA | Internal | Any metric, projection or report | PRD; snapshot design |
| internal/architecture/month-close-and-snapshot-design.md | Closed-period transaction and immutable snapshot rules | Founder, Cursor, QA | Internal | Month close, reports and quarterly review | database; calculations; security |
| internal/security/security-and-privacy-plan.md | Security controls and privacy-management baseline | Founder, Cursor, advisers | Internal | Every sprint and production review | architecture; threat model |
| internal/security/threat-model-and-security-checklist.md | Threat scenarios, mitigations and reusable checklists | Founder, Cursor, security reviewer | Internal | Design review, sprint exit and release | security plan; RLS |
| internal/design/brand-ui-and-design-system.md | Brand, colour, component and responsive rules | Founder, design, Cursor | Internal | Any user-interface work | product principles; accessibility requirements |
| internal/development/repository-and-coding-standards.md | Repository layout and coding conventions | Founder, Cursor | Internal | Setup, code review and new modules | architecture; testing plan |
| internal/development/testing-release-and-quality-plan.md | Testing strategy, CI, releases and quality gates | Founder, Cursor | Internal | Every sprint, PR and release | stories; security |
| internal/development/cursor-senior-developer-guide.md | Exact mentoring contract and reusable prompts | Founder, Cursor | Internal | Every Cursor development session | all relevant internal docs |
| internal/planning/mvp-roadmap-and-sprints.md | Twelve-sprint delivery plan | Founder, Cursor | Internal | Sprint planning and progress review | PRD; scope; testing |
| internal/planning/mvp-implementation-playbook.md | Feature-by-feature implementation sequence | Founder, Cursor | Internal | Starting and completing each feature | architecture; stories; standards |
| internal/planning/post-mvp-roadmap.md | Future phases and entry conditions | Founder, advisers | Internal | Strategy after MVP evidence | vision; non-goals |
| public-docs/README.md | Public documentation entry | Prospective users, contributors | Public | Publishing documentation | public product and disclaimer docs |
| public-docs/product-overview.md | Plain-language product overview | Prospective users | Public | Website and repository overview | approved positioning; disclaimer |
| public-docs/how-isuna-works.md | End-to-end user experience | Prospective users | Public | Explaining the workflow | product overview; disclaimer |
| public-docs/security-and-privacy-overview.md | Reassuring non-sensitive security summary | Prospective users | Public | Trust centre or public docs | security plan; privacy review |
| public-docs/public-roadmap.md | Date-free public phases | Prospective users | Public | Communicating direction | post-MVP roadmap |
| public-docs/financial-disclaimer.md | Financial and professional-advice limitations | All users | Public | Registration, reports and public pages | legal review required |
| repository-files/README.md | Root repository README | Developers, public visitors | Public | Repository home page | public overview; setup standards |
| repository-files/CONTRIBUTING.md | Contribution and founder-review rules | Contributors | Public | Any external contribution | coding; testing; security |
| repository-files/SECURITY.md | Vulnerability-reporting policy | Security reporters | Public | Repository publication | internal incident plan |
| repository-files/.env.example | Environment-variable names without secrets | Developers | Public | Local setup and deployment | architecture; provider docs |
| repository-files/.gitignore | Secret and generated-file exclusions | Developers | Public | Repository setup | coding standards |

## Dependency rules

- Public documents derive from approved internal sources; they never define technical policy.
- The master PRD owns product requirements, while user stories make those requirements testable.
- The database model owns persistent entities; the RLS document owns access-control patterns.
- Financial calculation rules own metric definitions. Dashboards and reports must call the same tested domain functions.
- Month-close design owns historical immutability and supersedes any convenience workflow that would mutate a closed period.
- Security controls apply even when not repeated in feature documents.

## Suggested reading bundles

### Repository foundation

Start Here, open decisions, system architecture, repository standards, testing plan, brand/UI system, Cursor guide, Sprint 0–1.

### Authentication and household access

Master PRD, auth/multitenancy/RLS, database model, security plan, threat model, relevant user stories and implementation playbook sections.

### Financial data module

Master PRD, database model, calculation rules, month-close design, relevant stories, security plan and design system.

### Release review

Launch criteria in the PRD, testing/release plan, threat checklist, privacy plan, public documentation, open decisions and Sprint 12 exit criteria.
