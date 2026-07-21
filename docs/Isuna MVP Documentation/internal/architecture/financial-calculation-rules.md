# Financial Calculation Rules

> **Classification:** Internal  
> **Authority:** Financial definition authority  
> **Audience:** Founder and Cursor  
> **Status:** Founding MVP baseline  
> **Last reviewed:** 2026-07-16


## 1. Canonical money type

Do not pass raw numbers with ambiguous units. A representative TypeScript model:

```ts
export type CurrencyCode = string & { readonly __brand: 'CurrencyCode' };

export type Money = Readonly<{
  minor: bigint;
  currency: CurrencyCode;
}>;

export function assertSameCurrency(a: Money, b: Money): void {
  if (a.currency !== b.currency) throw new CurrencyMismatchError();
}
```

Formatting uses `Intl.NumberFormat` only at the UI/report boundary. Serialization sends bigint as a decimal string, not an unsafe JSON number. The MVP rejects cross-currency aggregation rather than silently converting.

## 2. Calculation governance

- Each calculation has a `ruleVersion` stored with closed snapshots.
- The same implementation or tested equivalent powers current UI, close and report generation.
- Inputs include as-of dates and completeness/freshness metadata.
- Missing data is not zero unless the business definition says so.
- Intermediate decimal calculations use a vetted decimal strategy; binary floating point is not used for money or authoritative rates.
- Rounding happens at documented boundaries. Never repeatedly round intermediate totals without a lender-specific rule.
- Test fixtures include positive, negative, zero, boundary, missing and property-based invariants.

## Monthly cash flow

- **Business definition:** Net operating inflow for the reporting period.
- **Formula:** `eligible income - eligible expenses - debt principal treatment according to reporting view - savings/investment transfers only when the selected view treats allocations as outflow`
- **Inputs:** Posted/review-policy transaction splits, category kinds, transfer flags, period timezone.
- **Output:** `Money` for one currency plus completeness status.
- **Missing-data behaviour:** If required accounts/period are missing, return `unavailable`; uncategorized amount is disclosed separately.
- **Rounding/currency:** Exact minor-unit arithmetic; format only at boundary.
- **Edge cases:** Refunds, transfers, reimbursements, mixed currencies, pending transactions.
- **Suggested TypeScript signature:** ``calculateMonthlyCashFlow(input: CashFlowInput): CashFlowResult``
- **Unit tests:** Positive, negative, zero, transfer excluded, uncategorized disclosed.
- **Disclaimer:** Organizational metric, not an assessment of affordability.

Representative contract:

```ts
type CalculationStatus = 'complete' | 'partial' | 'unavailable';

export type CalculationResult<T> = {
  value: T | null;
  status: CalculationStatus;
  warnings: readonly string[];
  ruleVersion: string;
};
```
## Budget variance

- **Business definition:** Difference between actual and planned for a line.
- **Formula:** `actual - planned, with UI interpretation based on category kind`
- **Inputs:** Planned minor units, eligible actual minor units, category kind.
- **Output:** Signed `Money`; percent variance optional when planned ≠ 0.
- **Missing-data behaviour:** Actual may be partial but freshness is shown; missing plan is “unbudgeted,” not zero variance.
- **Rounding/currency:** Minor units; percentage rounded for display only.
- **Edge cases:** Zero plan, refunds, income categories where positive variance may be favourable.
- **Suggested TypeScript signature:** ``calculateBudgetVariance(planned: Money, actual: Money, kind: CategoryKind): VarianceResult``
- **Unit tests:** Under/over plan; zero plan; income semantic direction.
- **Disclaimer:** No judgemental labels.

Representative contract:

```ts
type CalculationStatus = 'complete' | 'partial' | 'unavailable';

export type CalculationResult<T> = {
  value: T | null;
  status: CalculationStatus;
  warnings: readonly string[];
  ruleVersion: string;
};
```
## Savings rate

- **Business definition:** Share of eligible net income allocated to savings over a period.
- **Formula:** `eligible savings contributions / eligible net income × 100`
- **Inputs:** Defined savings categories/contributions, after-tax household income basis.
- **Output:** Decimal percentage and numerator/denominator.
- **Missing-data behaviour:** Unavailable when income ≤ 0 or basis incomplete.
- **Rounding/currency:** Keep decimal precision internally; display typically 1 decimal point.
- **Edge cases:** Withdrawals, transfers between savings accounts, employer contribution classification.
- **Suggested TypeScript signature:** ``calculateSavingsRate(input: RateInput): RateResult``
- **Unit tests:** 20/100; zero income unavailable; withdrawal reduces numerator.
- **Disclaimer:** Definition must be visible; not comparable across apps without matching basis.

Representative contract:

```ts
type CalculationStatus = 'complete' | 'partial' | 'unavailable';

export type CalculationResult<T> = {
  value: T | null;
  status: CalculationStatus;
  warnings: readonly string[];
  ruleVersion: string;
};
```
## Investing rate

- **Business definition:** Share of eligible net income contributed to investments.
- **Formula:** `eligible personal investment contributions / eligible net income × 100; employer contributions shown separately or included by explicit mode`
- **Inputs:** Contributions, employer contributions, income, chosen mode.
- **Output:** Percentage with component breakdown.
- **Missing-data behaviour:** Unavailable for nonpositive/missing income.
- **Rounding/currency:** Decimal-safe.
- **Edge cases:** Transfers between investment accounts, withdrawals, market gains excluded.
- **Suggested TypeScript signature:** ``calculateInvestingRate(input: InvestingRateInput): RateResult``
- **Unit tests:** Employer excluded/included modes; transfer excluded.
- **Disclaimer:** Not investment advice.

Representative contract:

```ts
type CalculationStatus = 'complete' | 'partial' | 'unavailable';

export type CalculationResult<T> = {
  value: T | null;
  status: CalculationStatus;
  warnings: readonly string[];
  ruleVersion: string;
};
```
## Debt-free percentage

- **Business definition:** Progress from defined starting principal to zero.
- **Formula:** `clamp((starting balance - current balance) / starting balance × 100, 0, 100)`
- **Inputs:** Starting and current principal for included debt.
- **Output:** Percentage plus balances.
- **Missing-data behaviour:** Unavailable if starting balance ≤ 0; paid-off with valid start returns 100%.
- **Rounding/currency:** Display 1 decimal; exact balances.
- **Edge cases:** New borrowing can reduce below zero before clamp; refinances require baseline policy.
- **Suggested TypeScript signature:** ``calculateDebtFreeProgress(starting: Money, current: Money): ProgressResult``
- **Unit tests:** Half paid; over-borrowed clamped with flag; zero start unavailable.
- **Disclaimer:** Progress is not creditworthiness.

Representative contract:

```ts
type CalculationStatus = 'complete' | 'partial' | 'unavailable';

export type CalculationResult<T> = {
  value: T | null;
  status: CalculationStatus;
  warnings: readonly string[];
  ruleVersion: string;
};
```
## Debt interest

- **Business definition:** Interest accrued for one period under a simplified periodic model.
- **Formula:** `opening principal × annual nominal rate × day_count / day_basis, unless actual lender interest is entered`
- **Inputs:** Opening balance, rate, dates/day convention, actual interest override.
- **Output:** Money plus method/assumptions.
- **Missing-data behaviour:** Unavailable if rate/date missing; prefer recorded lender amount when available.
- **Rounding/currency:** Calculate decimal, round once to minor unit using documented half-away/even policy.
- **Edge cases:** Variable rates, compounding, fees, promotional rates, leap year.
- **Suggested TypeScript signature:** ``estimateDebtInterest(input: InterestInput): InterestEstimate``
- **Unit tests:** 0%, 30/365, actual override, rounding edge.
- **Disclaimer:** Estimate may differ from lender calculation.

Representative contract:

```ts
type CalculationStatus = 'complete' | 'partial' | 'unavailable';

export type CalculationResult<T> = {
  value: T | null;
  status: CalculationStatus;
  warnings: readonly string[];
  ruleVersion: string;
};
```
## Snowball ranking

- **Business definition:** Order eligible debts from smallest current balance to largest.
- **Formula:** `ascending current balance; deterministic tie-break by rate descending then created/id`
- **Inputs:** Eligible active debts and exclusions.
- **Output:** Ordered IDs with rationale.
- **Missing-data behaviour:** Debts missing balance are unranked with warning.
- **Rounding/currency:** No monetary rounding beyond stored values.
- **Edge cases:** Zero-balance debt excluded, mortgage inclusion policy, ties.
- **Suggested TypeScript signature:** ``rankDebtsSnowball(debts: readonly Debt[]): RankedDebt[]``
- **Unit tests:** Smallest first; tie; missing balance.
- **Disclaimer:** Strategy education, not individualized advice.

Representative contract:

```ts
type CalculationStatus = 'complete' | 'partial' | 'unavailable';

export type CalculationResult<T> = {
  value: T | null;
  status: CalculationStatus;
  warnings: readonly string[];
  ruleVersion: string;
};
```
## Avalanche ranking

- **Business definition:** Order eligible debts by highest effective interest rate.
- **Formula:** `descending effective annual rate; tie-break balance ascending then stable ID`
- **Inputs:** Active debts, current/effective rates.
- **Output:** Ordered IDs with rationale.
- **Missing-data behaviour:** Missing rate unranked or placed after known rates with warning.
- **Rounding/currency:** Compare decimal rates exactly.
- **Edge cases:** 0% loans, promotional expiry, variable rates, fees not captured.
- **Suggested TypeScript signature:** ``rankDebtsAvalanche(debts: readonly Debt[]): RankedDebt[]``
- **Unit tests:** Highest rate; tie; missing rate.
- **Disclaimer:** Actual optimality depends on terms and behaviour.

Representative contract:

```ts
type CalculationStatus = 'complete' | 'partial' | 'unavailable';

export type CalculationResult<T> = {
  value: T | null;
  status: CalculationStatus;
  warnings: readonly string[];
  ruleVersion: string;
};
```
## Estimated payoff date

- **Business definition:** Projected period when a debt reaches zero under constant assumptions.
- **Formula:** `Iterative amortization: apply periodic interest then payment; stop at balance ≤ 0`
- **Inputs:** Balance, rate model, minimum/extra payment, payment frequency/start.
- **Output:** Estimated date, periods, interest, status.
- **Missing-data behaviour:** Unavailable if payment ≤ interest/fees or required inputs missing; cap iterations.
- **Rounding/currency:** Decimal interest then round by policy each period.
- **Edge cases:** Variable rate, irregular payments, fees, payment below interest, leap dates.
- **Suggested TypeScript signature:** ``estimateDebtPayoff(input: PayoffInput): PayoffEstimate``
- **Unit tests:** Zero balance; normal payoff; negative amortization; iteration cap.
- **Disclaimer:** Scenario only; lender schedule controls.

Representative contract:

```ts
type CalculationStatus = 'complete' | 'partial' | 'unavailable';

export type CalculationResult<T> = {
  value: T | null;
  status: CalculationStatus;
  warnings: readonly string[];
  ruleVersion: string;
};
```
## Net worth

- **Business definition:** Included asset values minus included liability values at an as-of date.
- **Formula:** `Σ included assets - Σ included liabilities`
- **Inputs:** Latest valid values at/before as-of, inclusion flags, one currency.
- **Output:** Money, components, freshness/completeness.
- **Missing-data behaviour:** Unavailable as a complete KPI when required values missing; partial result must be labelled.
- **Rounding/currency:** Minor units.
- **Edge cases:** Property/manual valuation, stale investment balance, excluded accounts, mixed currency.
- **Suggested TypeScript signature:** ``calculateNetWorth(input: NetWorthInput): NetWorthResult``
- **Unit tests:** Positive/negative; excluded; stale flag; missing.
- **Disclaimer:** Not a formal valuation.

Representative contract:

```ts
type CalculationStatus = 'complete' | 'partial' | 'unavailable';

export type CalculationResult<T> = {
  value: T | null;
  status: CalculationStatus;
  warnings: readonly string[];
  ruleVersion: string;
};
```
## Emergency-fund months

- **Business definition:** Months of defined essential expenses covered by eligible liquid reserves.
- **Formula:** `eligible emergency savings / average monthly essential expenses`
- **Inputs:** Goal/account balance and 1–6 closed/open months essential spending basis.
- **Output:** Decimal months and basis.
- **Missing-data behaviour:** Unavailable if denominator ≤ 0 or insufficient expense classification.
- **Rounding/currency:** Ratio to two decimals internally, one display.
- **Edge cases:** Seasonal expenses, credit availability excluded, negative reserve.
- **Suggested TypeScript signature:** ``calculateEmergencyFundMonths(input: EmergencyFundInput): RatioResult``
- **Unit tests:** 3 months; zero expenses unavailable; negative reserve.
- **Disclaimer:** No universal required number is asserted.

Representative contract:

```ts
type CalculationStatus = 'complete' | 'partial' | 'unavailable';

export type CalculationResult<T> = {
  value: T | null;
  status: CalculationStatus;
  warnings: readonly string[];
  ruleVersion: string;
};
```
## Savings-goal progress

- **Business definition:** Portion of target currently funded.
- **Formula:** `current eligible balance / target × 100`
- **Inputs:** Target and linked/manual current balance.
- **Output:** Percentage, remaining amount, overfunded flag.
- **Missing-data behaviour:** Unavailable if target ≤ 0.
- **Rounding/currency:** Minor amounts; display 1 decimal and clamp bar to 100 while showing excess.
- **Edge cases:** Withdrawals, multiple goals sharing account, overfunding.
- **Suggested TypeScript signature:** ``calculateGoalProgress(current: Money, target: Money): GoalProgress``
- **Unit tests:** 50%; overfunded; zero target.
- **Disclaimer:** Suggested contributions are arithmetic only.

Representative contract:

```ts
type CalculationStatus = 'complete' | 'partial' | 'unavailable';

export type CalculationResult<T> = {
  value: T | null;
  status: CalculationStatus;
  warnings: readonly string[];
  ruleVersion: string;
};
```
## Mortgage loan-to-value

- **Business definition:** Mortgage balance relative to current property value.
- **Formula:** `mortgage principal / property value × 100`
- **Inputs:** Current mortgage principal and user-entered property value same currency/date context.
- **Output:** Percentage with value date/freshness.
- **Missing-data behaviour:** Unavailable if property value ≤ 0 or missing.
- **Rounding/currency:** Decimal-safe; display 1 decimal.
- **Edge cases:** Multiple secured loans, stale estimate, selling costs excluded.
- **Suggested TypeScript signature:** ``calculateLoanToValue(input: LtvInput): RatioResult``
- **Unit tests:** 80%; zero value unavailable; multiple liens mode.
- **Disclaimer:** Property value is user estimate unless sourced; not lending advice.

Representative contract:

```ts
type CalculationStatus = 'complete' | 'partial' | 'unavailable';

export type CalculationResult<T> = {
  value: T | null;
  status: CalculationStatus;
  warnings: readonly string[];
  ruleVersion: string;
};
```
## Mortgage amortization

- **Business definition:** Simplified payment schedule under stated rate and frequency.
- **Formula:** `Periodic rate and annuity schedule; Canadian compounding conventions require an explicit tested method rather than generic monthly division`
- **Inputs:** Principal, nominal rate/compounding, payment, frequency, start, optional prepayment.
- **Output:** Schedule summary and rows.
- **Missing-data behaviour:** Unavailable for unsupported frequency/convention or payment not amortizing.
- **Rounding/currency:** Decimal math and lender-aligned rounding documented.
- **Edge cases:** Semi-annual compounding, accelerated biweekly, rate changes, prepayments.
- **Suggested TypeScript signature:** ``buildMortgageAmortization(input: MortgageInput): MortgageSchedule``
- **Unit tests:** Known fixture; 0% case; accelerated payment; non-amortizing.
- **Disclaimer:** Educational estimate; lender statement governs.

Representative contract:

```ts
type CalculationStatus = 'complete' | 'partial' | 'unavailable';

export type CalculationResult<T> = {
  value: T | null;
  status: CalculationStatus;
  warnings: readonly string[];
  ruleVersion: string;
};
```
## FI target

- **Business definition:** Illustrative invested assets associated with spending and withdrawal-rate assumption.
- **Formula:** `annual eligible spending / withdrawal rate`
- **Inputs:** User-defined annual spending basis and withdrawal rate > 0.
- **Output:** Money plus assumptions.
- **Missing-data behaviour:** Unavailable for nonpositive rate or missing spending.
- **Rounding/currency:** Decimal division, final minor-unit rounding.
- **Edge cases:** Taxes, pensions, other income, changing spending excluded unless modelled.
- **Suggested TypeScript signature:** ``calculateFiTarget(input: FiTargetInput): ScenarioMoney``
- **Unit tests:** 40k/4%; 3.5%; zero rate invalid.
- **Disclaimer:** The “4% rule” is a scenario heuristic, not a guarantee.

Representative contract:

```ts
type CalculationStatus = 'complete' | 'partial' | 'unavailable';

export type CalculationResult<T> = {
  value: T | null;
  status: CalculationStatus;
  warnings: readonly string[];
  ruleVersion: string;
};
```
## FI progress

- **Business definition:** Current eligible investable assets relative to FI target.
- **Formula:** `eligible investable assets / FI target × 100`
- **Inputs:** Current assets and calculated target.
- **Output:** Percentage and gap.
- **Missing-data behaviour:** Unavailable if target ≤ 0 or incomplete.
- **Rounding/currency:** Decimal-safe.
- **Edge cases:** Debt netting policy, pensions, home equity inclusion.
- **Suggested TypeScript signature:** ``calculateFiProgress(current: Money, target: Money): ProgressResult``
- **Unit tests:** 25%; over 100; zero target.
- **Disclaimer:** Does not predict retirement readiness.

Representative contract:

```ts
type CalculationStatus = 'complete' | 'partial' | 'unavailable';

export type CalculationResult<T> = {
  value: T | null;
  status: CalculationStatus;
  warnings: readonly string[];
  ruleVersion: string;
};
```
## Safe-withdrawal scenario

- **Business definition:** Illustrative first-year withdrawal under a chosen rate.
- **Formula:** `eligible portfolio × user-selected withdrawal rate`
- **Inputs:** Portfolio amount and rate.
- **Output:** Annual/monthly Money with assumption.
- **Missing-data behaviour:** Unavailable for invalid/missing rate or portfolio.
- **Rounding/currency:** Decimal multiply; round at output.
- **Edge cases:** Taxes, fees, sequence risk, inflation and asset mix not modelled.
- **Suggested TypeScript signature:** ``calculateWithdrawalScenario(input: WithdrawalInput): WithdrawalScenario``
- **Unit tests:** 4%; 3%; zero portfolio.
- **Disclaimer:** Never label “safe” without “scenario”; no guarantee.

Representative contract:

```ts
type CalculationStatus = 'complete' | 'partial' | 'unavailable';

export type CalculationResult<T> = {
  value: T | null;
  status: CalculationStatus;
  warnings: readonly string[];
  ruleVersion: string;
};
```
## Financial health score

- **Business definition:** Transparent informational summary of data quality and selected household indicators, not creditworthiness.
- **Formula:** `Weighted capped components: data/reconciliation 20, cash-flow stability 20, high-interest debt progress 20, emergency reserve 20, savings/investing consistency 20; redistribute no weights only by explicit version rule`
- **Inputs:** Canonical component metrics, completeness and score rule version.
- **Output:** 0–100 plus component values, missing status and explanations.
- **Missing-data behaviour:** Return “not enough data” unless minimum required components exist; never infer missing as zero.
- **Rounding/currency:** Component decimals then final integer display; preserve raw.
- **Edge cases:** Negative income, new household, no debt, intentional low liquidity, stale values.
- **Suggested TypeScript signature:** ``calculateFinancialHealthScore(input: HealthScoreInput): HealthScoreResult``
- **Unit tests:** Complete case; missing data; no debt full/neutral treatment; boundary caps.
- **Disclaimer:** Informational organization score only; not financial advice, credit score or guarantee.

Representative contract:

```ts
type CalculationStatus = 'complete' | 'partial' | 'unavailable';

export type CalculationResult<T> = {
  value: T | null;
  status: CalculationStatus;
  warnings: readonly string[];
  ruleVersion: string;
};
```


## Representative implementation snippets

### Exact money addition

```ts
export function addMoney(values: readonly Money[]): Money {
  if (values.length === 0) throw new Error('Currency is required for an empty total');
  const currency = values[0].currency;
  let minor = 0n;
  for (const value of values) {
    if (value.currency !== currency) throw new CurrencyMismatchError();
    minor += value.minor;
  }
  return { minor, currency };
}
```

### Budget variance

```ts
export function calculateBudgetVariance(
  planned: Money,
  actual: Money,
  kind: 'income' | 'expense' | 'debt' | 'saving' | 'investment'
): { amount: Money; favourable: boolean | null } {
  assertSameCurrency(planned, actual);
  const amount = { minor: actual.minor - planned.minor, currency: planned.currency };
  const favourable = kind === 'income' ? amount.minor >= 0n : amount.minor <= 0n;
  return { amount, favourable };
}
```

### Payoff loop guard (illustrative, not lender-complete)

```ts
export function requireAmortizingPayment(
  paymentMinor: bigint,
  firstPeriodInterestMinor: bigint
): void {
  if (paymentMinor <= firstPeriodInterestMinor) {
    throw new NonAmortizingScenarioError('Payment does not exceed estimated interest');
  }
}
```

## Snapshot calculation record

A closed snapshot records:

- rule-set version;
- period and timezone;
- currency;
- source record/version identifiers or copied details;
- computed KPI values;
- completeness/freshness/exception flags;
- user-controlled scenario assumptions;
- content hash.

Changing a formula changes future/current calculations. Historical closed snapshots remain unchanged unless an authorized correction creates a superseding version.

## Test fixture policy

Use hand-verifiable fixtures and compare against independent calculations. Mortgage/debt fixtures should include lender-style examples reviewed for Canadian conventions before public reliance. Property-based tests should assert invariants such as:

- sum of splits equals transaction amount;
- net worth equals assets minus liabilities;
- a higher payment cannot produce a later payoff under otherwise identical supported assumptions;
- an excluded account never changes net worth;
- transfer pairs do not change household cash-flow totals;
- a snapshot result is deterministic for identical inputs and rule version.
