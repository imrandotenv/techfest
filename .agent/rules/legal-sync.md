---
title: Legal, Privacy & Cookie Policy Synchronization Rule
description: Mandates automatic synchronization of src/config/legal.ts whenever new APIs, databases, telemetry, cookies, or user data stores are added to SETTech.
globs: ["src/**/*", "package.json", ".env*"]
---

# SETTech Legal, Privacy & Cookie Policy Sync Rule

## Core Directive
Whenever any task, update, or feature implementation adds, modifies, or removes:
1. **Third-Party APIs or Services** (e.g. LLM providers, Speech APIs, Email dispatchers, CDN providers, Authentication bridges).
2. **Databases & Remote Data Stores** (e.g. Prisma, Neon, Supabase, Redis, Upstash, S3/Cloudflare R2 buckets).
3. **Analytics, Telemetry, or Monitoring SDKs** (e.g. PostHog, Vercel Analytics, Google Analytics, Sentry).
4. **Browser Cookies or Storage Keys** (any `document.cookie`, `localStorage`, `sessionStorage`, or IndexedDB item such as `settech_*`).
5. **User Data Processing Workflows** (e.g. collection of student registration numbers, phone numbers, resume uploads, payment gateways).

You **MUST ALWAYS** perform the following synchronization actions before completing the turn:

### 1. Update `src/config/legal.ts`
- If a new sub-processor is introduced, append an entry to `LEGAL_CONFIG.processors` with `id`, `name`, `provider`, `category`, `purpose`, `dataProcessed`, `retention`, `privacyUrl`, and `location`.
- If a new cookie, localStorage key, or session marker is introduced, append an entry to `LEGAL_CONFIG.storageItems` with `id`, `name`, `type`, `category` (`strictly_necessary` | `functional` | `preferences`), `provider`, `purpose`, `duration`, and `defaultStatus`.
- Increment the `LEGAL_CONFIG.policyVersion` (e.g., from `1.0.0` to `1.1.0`).
- Update `LEGAL_CONFIG.lastUpdated` to the current date (e.g., `November 22, 2026`).

### 2. Verify Legal Route Reflection
- Ensure `/privacy`, `/terms`, `/cookies`, and `/disclaimer` accurately reflect the updated inventory without hardcoded drift.
- Ensure all new legal routes remain declared as public in `src/middleware.ts`.
- Ensure any new cookie or storage keys are accounted for in `src/components/CookieBanner.tsx` preferences categories.

### 3. Maintain Educational & Regulatory Rigor
- Maintain strict alignment with India's **Digital Personal Data Protection (DPDP) Act, 2023** and **Information Technology Act, 2000**.
- Maintain the non-negotiable **Zero Selling of Student Data** and **Zero Ad Trackers** commitment.
- Reiterate that SETTech is an independent student initiative for SETGOI B.Tech students and not an official college administration portal.
