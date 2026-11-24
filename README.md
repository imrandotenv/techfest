# SETTech (Techfest Project)
> **Centralized Academic Vault, Campus Directory & Student Utility Portal** for Sanaka Educational Trust Group of Institutions (SETGOI) Durgapur (MAKAUT Affiliated).

Built with **Next.js 16 (App Router + Turbopack)**, **TypeScript**, **Tailwind CSS**, **Clerk Authentication (3-Role RBAC)**, and **Swiss Editorial Minimalism**.

---

## ⚡ Core Features

- **Notes & Solved PYQ Vault (`/notes`)**:
  - Semester-wise (S1–S8) & branch-specific (CSE, ECE, EE, ME, CE) MAKAUT lecture notes and previous year question papers.
  - Live search by subject code (e.g. `PCC-CS301`), module tag filtering, and inline PDF preview/download.
  - Faculty note upload and moderation workflows.

- **Student Q&A & Discussion Forum (`/forum`)**:
  - Categorized threads covering Placements, Academics, Hackathons, and Coding.
  - Real-time upvoting, nested replies, verified answer pins, and faculty badges.

- **Campus Directory & Transit (`/campus`)**:
  - Comprehensive department listings and faculty office hours.
  - Hostel directory with warden contacts and amenities.
  - Daily bus transit schedules (pickup and evening drop timings across Durgapur & Asansol).
  - 24/7 Campus Medical & Anti-Ragging Emergency SOS helpline (`1800-180-5522`).

- **Academic Utilities Suite (`/tools`)**:
  - Real-time **MAKAUT 10-Point SGPA & CGPA Calculator** with official grading scale reference.
  - Official institution notice board with priority tags (`Urgent`, `Exam`, `Notice`).
  - Browser-side PDF merger for assignment submissions.
  - Academic calendar roadmap with semester milestones.

- **Clerk Authentication & 3-Role RBAC**:
  - Seamless authentication via `@clerk/nextjs` with Light Mode styling.
  - Three distinct permission tiers: `student`, `college` (faculty), and `admin` (super-admin).
  - Admin management console (`/dashboard/admin`) for approving notes and assigning roles.
  - Faculty verification dashboard (`/dashboard/college`) for managing departmental resources.

- **Swiss Editorial Minimalist Design**:
  - Pure `#FAFAFA` canvas background with zero heavy card wrappers.
  - Floating glassmorphic navbar on desktop (`bg-white/90 backdrop-blur-xl border border-zinc-200/80`).
  - Mobile bottom thumb-zone dock (`bottom-4`, `rounded-full`) with integrated slide-up drawer.

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/imrandotenv/techfest.git
cd techfest
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory based on `.env.example`:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Super-Admin Whitelist (comma-separated emails)
SUPER_ADMIN_EMAILS=mail@ceimran.in

# Database URL (PostgreSQL / Supabase / Neon)
DATABASE_URL="postgresql://user:password@localhost:5432/sanakahub?schema=public"

# Google Gemini API (Optional for AI Companion)
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to explore the portal.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS, Lucide React Icons
- **Auth & RBAC**: [Clerk](https://clerk.com/)
- **Database / ORM**: Prisma ORM & PostgreSQL
- **Deployment**: Vercel / Node.js runtime

---

## 📜 License

Created for Sanaka Educational Trust Group of Institutions (SETGOI) Durgapur. Distributed under the MIT License.
