<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# SanakaHub Architecture & Design Rules

## Rule 1: Module Isolation & Clerk RBAC
- Keep feature modules strictly isolated under `src/modules/{rbac,campus,notes,forum,tools}`.
- All protected routes must be verified at the edge in `middleware.ts` via `sessionClaims.metadata.role` and guarded server-side on mutations.

## Rule 2: Dual Floating Navigation Standard (`floating-navigation-dock`)
Always activate and adhere to the `floating-navigation-dock` skill for all navigation structures across SanakaHub:
1. **Desktop Viewports (>= 768px)**:
   - Must use a **detached floating glassmorphic pill navbar** pinned at top-center (`fixed top-4 sm:top-5 left-1/2 -translate-x-1/2 w-[94%] max-w-5xl z-50 pointer-events-auto`).
   - Must use translucent frosted glass (`backdrop-blur-md bg-white/80 border border-zinc-200/80 shadow-md shadow-black/5 rounded-full px-5 py-2.5`).
   - Must provide dynamic scroll detection (`isScrolled`: `window.scrollY > 25`) with elevation enhancement (`bg-white/90 backdrop-blur-xl border-zinc-300/80 shadow-xl ring-1 ring-black/5`).
   - Never render a full-width edge-to-edge navbar header on desktop.
2. **Mobile Viewports (< 768px)**:
   - Must use a **detached floating bottom thumb-zone dock** centered at the bottom of the screen (`fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] left-1/2 -translate-x-1/2 z-40 md:hidden w-[92%] max-w-sm pointer-events-auto rounded-full p-1.5 shadow-xl bg-white/95 backdrop-blur-2xl border border-zinc-200/90`).
   - Must incorporate iOS Home Indicator safe-area padding (`env(safe-area-inset-bottom)`), minimum 48x48px touch targets, and slide-up drawer/sheet integration for secondary links and RBAC portals.
   - Main page layout must always include generous top buffer (`pt-16 md:pt-20`) and bottom buffer (`pb-28 md:pb-12`) so content and interactive elements are never obscured by the floating pills.
