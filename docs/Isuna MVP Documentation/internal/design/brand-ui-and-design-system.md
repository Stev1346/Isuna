# Brand, UI and Design System

> **Classification:** Internal  
> **Authority:** Visual and interaction authority  
> **Audience:** Founder and Cursor  
> **Status:** Founding MVP baseline  
> **Last reviewed:** 2026-07-16


## 1. Brand story

**Isuna** comes from the Yoruba word **Ìṣúná**, meaning “budget.” The name connects the product to the founder’s Yoruba and Nigerian heritage while the product serves a broad Canadian audience. The expression should be precise, quiet and confident. Avoid generic “African” motifs, currency symbols as decoration, kente-like patterns without context, tribalized iconography, or visual storytelling that treats a living language as ornament.

### Pronunciation guidance

Confirm the founder-approved spoken pronunciation before publishing phonetic audio or spelling. Public text may say: “Isuna is inspired by Ìṣúná, the Yoruba word for budget.” Use the diacritics when explaining the source word and the simplified **Isuna** for the product mark/domain.

## 2. Brand personality

| Attribute | Expression |
|---|---|
| Modern | Clear typography, responsive layouts, purposeful technology |
| Calm | Generous space, restrained colour, no alarmist copy |
| Trustworthy | Traceable numbers, visible states, consistent controls |
| Intelligent | Useful prioritization and transparent formulas, not “magic” |
| Approachable | Plain language, guided steps, forgiving forms |
| Secure | Deliberate confirmations, privacy cues, no theatrical padlocks |
| Respectful | Non-judgemental financial language and accurate cultural origin |

## 3. Design principles

1. **One page, one primary question.** A dashboard answers “what needs attention?”; a reconciliation page answers “does this match the statement?”
2. **Show status and source.** KPIs include as-of/freshness and link to details.
3. **Progressive disclosure.** Start with a clear summary; reveal calculations and history on demand.
4. **Calm density.** Financial tables can be compact, but never cramped.
5. **Meaning before decoration.** Every chart, colour and icon earns its place.
6. **Accessible by construction.** Native controls and audited primitives first.
7. **Destructive actions are unmistakable.** Explain effect, scope, reversibility and required authentication.
8. **No moral scoring.** Variance and debt states are factual, not shameful.
9. **Responsive equivalence.** Mobile users can complete the workflow, not merely view a reduced dashboard.
10. **Historical distinction.** Closed/superseded records look read-only and clearly versioned.

## 4. Recommended visual direction

A light, warm-neutral interface with deep blue-green brand actions, slate typography and selective semantic accents. Surfaces are mostly flat with subtle borders; elevation is reserved for menus/dialogs. Charts are sparse, direct-labelled where practical, and paired with summaries.

The brand mark may explore a refined wordmark and abstract concept of alignment, layers or an open ledger—not a coin stack, piggy bank, wallet, calculator or stereotyped cultural ornament.

## 5. Colour system

Colours below are starting design tokens and must be contrast-tested in actual components. Names communicate purpose; numeric values may be tuned during visual testing.

### Primary brand — Isuna Teal

| Token | Hex | Use |
|---|---:|---|
| `brand-50` | `#EFFAF8` | Subtle selected background |
| `brand-100` | `#D8F3EE` | Informational brand tint |
| `brand-200` | `#AFE5DA` | Borders on tinted surfaces |
| `brand-300` | `#78CFC0` | Decorative/supporting only |
| `brand-400` | `#3FAF9E` | Charts, non-text accents |
| `brand-500` | `#168C7E` | Brand identity, selected icons |
| `brand-600` | `#0B7066` | Primary button on light background |
| `brand-700` | `#085B54` | Hover/active and accessible text |
| `brand-800` | `#084943` | Dark brand text |
| `brand-900` | `#073C38` | Deep emphasis |

### Neutral — Warm Slate

| Token | Hex | Use |
|---|---:|---|
| `neutral-0` | `#FFFFFF` | Raised surface |
| `neutral-25` | `#FCFCFA` | App background |
| `neutral-50` | `#F7F7F4` | Secondary surface |
| `neutral-100` | `#EEEFEA` | Subtle borders/rows |
| `neutral-200` | `#DDE0DA` | Standard border |
| `neutral-300` | `#C3C8C1` | Disabled border |
| `neutral-400` | `#929A92` | Placeholder/disabled text after contrast check |
| `neutral-500` | `#687169` | Secondary text/icons |
| `neutral-600` | `#4E5750` | Supporting text |
| `neutral-700` | `#38413B` | Body text |
| `neutral-800` | `#252C27` | Headings |
| `neutral-900` | `#171C18` | Maximum emphasis |

### Semantic colours

| Meaning | Main | Tint | Dark/text | Pair with |
|---|---:|---:|---:|---|
| Positive/complete | `#2F7D52` | `#EAF6EF` | `#205C3B` | Check icon + “Complete” |
| Warning/incomplete | `#A86408` | `#FFF5DE` | `#7B4800` | Triangle/clock + explanation |
| Negative/urgent | `#B33A3A` | `#FDEEEE` | `#842929` | Error icon + action text |
| Informational | `#2F67A8` | `#EDF4FC` | `#244F80` | Info icon + context |
| Closed historical | `#625A78` | `#F1EFF7` | `#4B445D` | Archive/lock icon + “Closed” |
| Destructive | `#A92929` | `#FCEAEA` | `#7E1F1F` | Trash icon + explicit verb |

Do not use positive red/negative green reversals based on account signs. A liability decrease can be positive but should be labelled “Down $X” with contextual semantic styling.

### Chart palette

Use no more series than the decision requires:

1. Brand teal `#168C7E`
2. Informational blue `#2F67A8`
3. Muted violet `#7667A8`
4. Amber `#A86408`
5. Rose `#A34D68`
6. Neutral slate `#687169`

Direct labels, patterns/dashes and legends must make series distinguishable without colour. Avoid red/green-only comparisons.

## 6. Light mode

Default MVP mode. App background `neutral-25`, primary surfaces white, secondary/grouped surfaces `neutral-50`, 1px neutral borders, body text `neutral-700/800`. Reserve brand tint for selected navigation and primary calls to action.

## 7. Dark-mode considerations

Dark mode is a Should/Could-have, not allowed to delay accessibility of light mode. When added:

- use near-black warm slate, not pure black;
- recalculate every contrast pair rather than inverting tokens;
- reduce saturated semantic backgrounds;
- test charts and print separately;
- respect system preference and persist explicit choice;
- ensure PDFs remain deliberate light print documents unless a dark report is explicitly designed.

## 8. Contrast guidance

Target WCAG 2.2 AA:

- normal text at least 4.5:1;
- large text at least 3:1;
- active UI components and meaningful graphics at least 3:1 against adjacent colours;
- visible focus indicator with sufficient contrast and thickness;
- disabled controls still understandable but may use different requirements—do not hide labels.

Automated checks are necessary but not sufficient. Test focus, zoom, forced-colour/high-contrast and screen-reader announcements manually.

## 9. Typography

Recommended: **Inter** or a similarly legible variable sans-serif available under an acceptable web licence; system stack is a safe fallback. Avoid loading many weights.

| Style | Size/line-height | Weight | Use |
|---|---|---|---|
| Display | 36/44 | 650–700 | Marketing only, sparingly |
| H1 | 30/38 | 650–700 | Page title |
| H2 | 24/32 | 650 | Major section |
| H3 | 20/28 | 600 | Card/section title |
| Body | 16/24 | 400 | Default |
| Body small | 14/20 | 400 | Supporting data, never primary action |
| Label | 14/20 | 550–600 | Forms/tables |
| KPI | 28/34 | 650 | Primary numeric value |
| Caption | 12/18 | 450 | Dates/source only with contrast and not critical alone |

Use tabular numerals for aligned amounts. Preserve user zoom; do not encode core content in pseudo-elements.

## 10. Spacing, radius and elevation

### Spacing scale

`2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80` px. Use 8px rhythm for major layout; 4px subdivisions for control details.

### Radius

- small controls/tags: 6px;
- inputs/buttons/cards: 8px;
- large panels/dialogs: 12px;
- pills only for short statuses, not every button.

### Elevation

- cards: border, no shadow by default;
- sticky header/dropdown: subtle shadow;
- modal/popover: stronger but soft shadow and border;
- never use elevation as the only grouping cue.

## 11. Icons

Use one consistent outlined icon set with accessible licences. Icons are 16/20/24px, paired with text for ambiguous actions. Decorative icons use `aria-hidden`; icon-only buttons require accessible names and tooltips are not the sole label.

## 12. Core components

### Buttons

- **Primary:** one main action per region; brand-600 background, white text.
- **Secondary:** neutral border/surface for common alternatives.
- **Tertiary/ghost:** low-emphasis navigation/action.
- **Destructive:** reserved for irreversible/high-impact action; confirmation required by risk.
- Loading state preserves width, disables repeat and provides status text.

### Forms

- Visible persistent label; placeholder is example, not label.
- Description explains financial definition before entry when needed.
- Error appears near field and in summary for long forms; associate programmatically.
- Money input shows currency separately, accepts localized user entry, parses to minor units server-side and re-renders normalized value.
- Never use a generic HTML number step for authoritative currency without tested parsing.
- Autosave is explicit; otherwise provide clear Save/Cancel.

### Tables

Use for transactions and reconciliation, with:

- semantic table markup on desktop;
- sticky header only when it does not obscure focus;
- right-aligned tabular amounts;
- selected row state with checkbox and text;
- column priority/responsive card/list alternative on mobile;
- pagination or bounded virtualisation after accessibility review;
- totals separated from data rows;
- row action menu with visible accessible trigger.

### Cards

Cards group one concept and avoid nesting. Each KPI card contains label, value, comparison, freshness/status and link. A card is not automatically clickable unless implemented as a clear link without nested interaction conflicts.

### KPI component

```text
[Label]                         [Status badge]
$123,456
↑ $4,210 (3.5%) since last closed month
As of June 30 · 1 account needs reconciliation
[View accounts]
```

The arrow has text. “Since last closed month” prevents comparing live partial data to an arbitrary prior day.

### Progress indicators

Progress bar includes numeric label and target text. Bars cap visually at 100%, while overfunding is stated. Unknown progress uses an indeterminate/skeleton state, never 0%.

### Alerts

- Inline notice for contextual information.
- Banner for page-level blockers.
- Toast only for short confirmation, never the sole place for an error or important action.
- Alert contains status word, explanation and next step.

### Empty states

Explain why empty, what value appears after setup, and one primary next action. Do not show celebratory emptiness for debt or financial hardship.

### Loading states

Use skeletons only when layout is known; preserve headings and announce longer operations. Disable duplicate submission and show durable report/export status. Avoid infinite spinners without explanation or retry.

### Error states

State what could not be completed, whether data changed, a safe retry and a correlation ID for unexpected errors. Do not expose SQL/provider details.

### Modal and confirmation patterns

Use dialogs for focused confirmation, not long workflows. Destructive confirmation includes scope, consequences, recoverability and exact action verb. Household deletion and close correction require stronger confirmation and recent authentication.

## 13. Dashboard composition

Desktop:

```text
Page title + period/freshness controls
Attention summary / next actions
3–4 primary KPI cards in first row
Cash-flow or net-worth trend (one meaningful chart)
Budget/debt/savings progress modules
Upcoming bills/expenses and action items
Data quality/reconciliation strip
```

Rules:

- 3–8 primary KPIs.
- Maximum two charts on default view.
- Every metric links to detail.
- Previous comparison names its basis.
- Incomplete onboarding/fresh data gets a status, not a misleading zero.
- Next actions appear above secondary analysis.

## 14. Navigation

Desktop left navigation or compact top/side hybrid:

- Overview
- Transactions
- Budget
- Accounts
- Goals (Debt, Savings, Investments)
- Meetings
- Reports
- Household settings

Show current household and switcher separately from navigation. Closed reports use a history sub-navigation, not a top-level explosion. Mobile uses a compact bottom or drawer pattern with no more than five primary destinations and a clear More/menu.

## 15. Mobile behaviour

- Primary forms and meeting are single-column.
- Tables become prioritized rows/cards with expandable details.
- Amount/date/status remain visible before notes.
- Filters open in a sheet/dialog and summarize active filters.
- Sticky bottom action may be used for Save/Continue if it does not cover content/focus.
- Do not rely on hover.
- Touch targets at least approximately 44×44 CSS px where practical.
- Charts have text summaries and accessible data table/detail link.

## 16. Closed historical records

Use purple-neutral semantic treatment, lock/archive icon, “Closed” label, close date and version. Inputs become readable static fields. Correction is a distinct owner action. Superseded versions show a banner linking to the current version; never overwrite the URL content without version context.

## 17. Accessibility requirements

- One H1 and logical heading levels.
- Landmarks and skip link.
- Keyboard order follows visual order.
- Visible focus not clipped by containers.
- Form errors summarized and linked.
- Dynamic save/progress announcements use restrained live regions.
- Dialog focus trap/return handled by accessible primitive.
- Reduced motion; no essential animation.
- Charts expose title, summary and data values.
- Monetary signs are announced meaningfully where needed.
- Test at 200%/400% zoom and narrow reflow.
- Use native select/input where it meets the need before custom widgets.

## 18. Example page layouts

### Onboarding accounts

Left/top progress showing completed and next steps; short explanation; account cards/list; “Add account” form in page or dialog; opening balance guidance; Save and Continue. Secondary “Finish later” is visible. Close-blocking implications appear without alarm.

### Transactions

Period/account/search filters, import/manual action, review-status summary, transaction table, bulk review only when safe, detail drawer/page. Uncategorized and suspected duplicate states use labels and icons.

### Reconciliation

Statement input summary, application balance, prominent difference, transaction review list, exception pathway separated from ordinary completion, clear close-readiness result.

### Monthly Money Meeting

Section progress, one topic at a time, factual source cards, reflection fields, decisions/actions panel, persistent save status, final close checklist. Two members can see attribution without turning the page into chat.

### Month close

Readiness banner; checklist grouped by blocking/warning; exception summary; snapshot contents explanation; typed/explicit confirmation; result page with snapshot version and separate PDF generation status.

## 19. MVP component inventory

### Foundations

Design tokens, typography, container/grid, focus ring, visually hidden utility, formatters.

### Primitives

Button, icon button, link, input, textarea, native/custom select, checkbox, radio, switch, date input/picker only if accessible, field/error summary, dialog, alert dialog, popover, dropdown, tabs, accordion, tooltip, badge, separator, skeleton, spinner.

### Application components

App shell, household switcher, breadcrumbs, page header, period selector, status/freshness badge, money display/input, KPI card, comparison label, progress bar, chart wrapper+summary, data table, filter bar, empty/error state, onboarding progress, reconciliation summary, close-readiness checklist, meeting section navigator, action item row/form, audit-history row, report status/download, confirmation panel.

Build only components required by the next feature. A component enters the shared library after at least two valid uses or when accessibility/consistency demands centralization.
