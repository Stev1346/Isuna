# How Isuna Works

> **Visibility:** Public  
> **Status:** Founding MVP documentation; capabilities may not yet be available  
> **Last reviewed:** 2026-07-16


## 1. Create an account

A user registers with email and password or a supported sign-in provider, verifies the account and enters the protected application. Secure session handling is planned for both server-rendered pages and browser interactions.

## 2. Create a household

The first user creates a private household workspace and becomes its Owner. The Owner can invite a partner as an Editor. Each person uses their own account rather than sharing a password.

## 3. Complete guided setup

The onboarding checklist helps the household add:

- country, province or territory and currency;
- income information;
- accounts and liabilities;
- opening balances or values;
- debt details;
- savings goals;
- investment accounts and contributions;
- a monthly budget;
- the first transaction or CSV import.

Progress is intended to be saved so the household can finish gradually.

## 4. Maintain the monthly record

Transactions can be entered manually or imported from a mapped CSV. Users review categories, splits, transfers, duplicates and notes. Account values are dated so Isuna can explain how current the information is.

## 5. Compare the budget with actual activity

A monthly budget shows planned and actual amounts and the difference between them. Supporting transactions remain available so a summary can be investigated rather than treated as a mystery number.

## 6. Reconcile accounts

For an account statement, the household records the statement date and balance. Isuna compares that balance with its own records. Differences must be resolved or clearly documented as an approved exception before close.

## 7. View the dashboard

The executive dashboard is intended to show a small set of important measures such as net worth, cash flow, debt, emergency savings, investment balance and data that still needs attention. Numbers link to their supporting details and display freshness or reconciliation status.

## 8. Complete the Monthly Money Meeting

The household reviews the month in guided sections. Members can record wins, challenges, upcoming bills and expenses, decisions, action items and next-month goals. The meeting can be resumed if it is not finished in one sitting.

## 9. Close the month

Before close, Isuna checks required information and reconciliations again. When the authorized Owner closes a ready month, the application creates a permanent versioned snapshot. The close also carries unfinished action items forward and prepares the next period.

A report is generated from the snapshot—not from later-changing account data. If an authorized correction is needed, Isuna preserves the original and creates a new superseding version.

## 10. Review the quarter

After three eligible months are closed, the household can review income, spending, budget performance, debt, savings, investments, net-worth change, trends, goals and priorities. The quarterly record identifies the exact monthly snapshots it used.

## 11. Control household data

The planned MVP includes a way for an authorized Owner to request a household export and to request household deletion under the published retention and backup policy. Important destructive actions require clear confirmation and additional security checks.

## What the MVP does not do

The founding MVP does not connect directly to banks, move money, pay bills, provide live investment prices, calculate a credit score, file taxes, read receipts with OCR or provide personalized financial advice.
