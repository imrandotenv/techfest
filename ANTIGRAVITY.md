# Antigravity Workspace Directives: SETTech

## Architecture & Compliance Rules

### 1. Dual-Floating Navigation System (`floating-navigation-dock`)
- Desktop (>= 768px): Detached floating glassmorphic pill navbar pinned at top-center (`fixed top-4 sm:top-5 left-1/2 -translate-x-1/2 w-[94%] max-w-5xl z-50`).
- Mobile (< 768px): Detached floating bottom thumb-zone dock centered at bottom (`fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] left-1/2 -translate-x-1/2 z-40 md:hidden w-[92%] max-w-sm`).
- Safe clear padding: Pages must maintain `pt-24 md:pt-28 pb-28` to avoid header/footer overlap.

### 2. Legal, Privacy & Cookie Policy Synchronization (`.agent/rules/legal-sync.md`)
Whenever any update adds or updates a third-party processor (e.g., Groq, Gemini, Clerk), database, telemetry, or browser storage item (`localStorage`, `cookie`):
- **ALWAYS** update `src/config/legal.ts` with:
  1. Detailed processor entry in `LEGAL_CONFIG.processors`
  2. Complete storage key entry in `LEGAL_CONFIG.storageItems`
  3. Incremented `LEGAL_CONFIG.policyVersion`
  4. Current `LEGAL_CONFIG.lastUpdated` date
- Keep `/privacy`, `/terms`, `/cookies`, and `/disclaimer` accurate without manual code duplication.
- Ensure all 4 legal routes remain declared as public in `src/middleware.ts`.
- Maintain strict alignment with India's **DPDP Act, 2023** and **IT Act, 2000**.
