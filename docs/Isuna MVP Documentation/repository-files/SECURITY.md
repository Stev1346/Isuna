# Security Policy

## Supported versions

Isuna is in founding MVP development. No public production version is currently declared supported. This policy will be updated before launch.

## Reporting a vulnerability

Please do **not** open a public issue for a suspected security or privacy vulnerability.

Use the private security-reporting channel configured for the repository, such as GitHub Private Vulnerability Reporting. If that channel is not enabled, contact the security address published in the repository profile or project website. A specific address will be added before public launch.

Include, when possible:

- a clear description of the issue;
- the affected route, feature or version/commit;
- safe reproduction steps using synthetic data;
- the expected and actual result;
- potential impact;
- any suggested mitigation;
- whether you believe real data may have been accessed.

Do not include passwords, session cookies, provider secrets, real financial records, personal information or another user’s data. Do not continue accessing data beyond what is necessary to demonstrate the issue.

## What to expect

The project will aim to acknowledge a valid report, investigate, communicate material status and coordinate a fix/disclosure appropriate to the development stage. Response targets will be published when operational capacity is established. Please allow time for evidence-based assessment and avoid public disclosure while a report is being investigated.

## Priority areas

Reports involving these areas are especially important:

- access to another household’s data;
- authentication or session bypass;
- privilege escalation from Editor to Owner;
- broken PostgreSQL Row Level Security;
- exposed credentials or service-role keys;
- unauthorized report/export downloads;
- forged payment webhooks or entitlements;
- deletion or immutable snapshot integrity;
- sensitive data in logs or monitoring;
- malicious import/upload handling.

## Safe-harbour intent

A formal safe-harbour policy requires legal review and will be added before launch. In the meantime, act in good faith, avoid privacy violations and service disruption, use synthetic accounts, do not exfiltrate data, and report promptly through the private channel.

## Security is shared

No system can guarantee complete security. Isuna uses layered controls, tests and incident planning, and welcomes responsible reports that help protect users.
