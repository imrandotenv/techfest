# SETTech (`settech.ceimran.in`) — Exhibition Presentation Scripts & Judge Q&A

> **Presenter:** 2nd-Year B.Tech CSE Student, Sanaka Educational Trust's Group of Institutions (SETGOI), Durgapur  
> **Live Production URL:** `https://settech.ceimran.in`  
> **Use Case:** Tech Exhibition / Project Showcase (Non-Technical & Technical Evaluations)

---

## Script 1: Non-Technical Exhibition Speech (2.5 to 3 Minutes)

**Target Audience:** Non-CS faculty, college management, guests, parents, and students from all B.Tech branches.  
**Tone:** Warm, confident, conversational English — zero technical jargon.

### 0:00 – 0:30 | Hook & Real Student Problem
> `[SHOW ON SCREEN: Landing page at https://settech.ceimran.in]`

Good morning respected professors, guests, and my fellow students!  
Let me ask you a quick question—how many of you have missed an important MAKAUT circular, lost a PDF of last year's question paper, or scrolled through ten different WhatsApp groups the night before an internal exam just to find one syllabus copy?  

Every single semester at SETGOI, our notes, lab manuals, attendance updates, and exam notices get buried inside endless chat messages. Important links disappear, unverified notes circulate, and first-year students even struggle to find which block or lab room to go to.

### 0:30 – 1:15 | Introducing SETTech (`settech.ceimran.in`)
> `[SHOW ON SCREEN: Student Cockpit at /student (or /dashboard)]`

To solve this everyday student problem, we built **SETTech**—live right now at **`settech.ceimran.in`**.  
SETTech is a single, organized B.Tech academic workspace designed specifically for **SETGOI students affiliated to MAKAUT**.  

As soon as a student signs in with Google, they land on their personal semester cockpit. It automatically knows their branch—whether CSE, ECE, EE, ME, or CE—and their current semester. Right at the top, they can see a live **MAKAUT Exam Countdown**, their current **CGPA**, **75% attendance safety bar** showing exactly how many classes they can safely miss or must attend, and official college notices pinned by faculty.

### 1:15 – 2:15 | Live Walkthrough
> `[SHOW ON SCREEN: Open /notes and filter by CSE -> Semester 3]`

First, let's look at the **Notes & PYQ Vault** at `/notes`. Everything here is mapped strictly to official MAKAUT subject codes like `PCC-CS301` for Data Structures or `ESC301` for Analog & Digital Electronics, including both Theory papers and Practical Lab manuals. Students can upload notes, and once a professor approves them, they receive a green **Faculty Verified** badge so juniors never study from wrong material.

> `[SHOW ON SCREEN: Switch to /lectures]`

Next, we separated **Course Lectures** into `/lectures`. Here, every MAKAUT subject is paired with official **SWAYAM and NPTEL video courses** taught by IIT and IISc professors, so students can learn directly from trusted lectures and even bookmark courses for their MAR points.

> `[SHOW ON SCREEN: Open /viva]`

Before practical exams, students are often nervous about external viva questions. So we built the **AI Viva Studio** at `/viva`. Students can pick their subject, speak into their microphone in English or Hinglish, and practice with an AI examiner that evaluates their answer, explains the concept, and asks follow-up questions.

> `[SHOW ON SCREEN: Open /tools, then /forum, then /campus]`

We also included `/tools` with an official **MAKAUT 10-point SGPA/CGPA calculator** and a **75% attendance calculator**, a **Campus Forum** at `/forum` where professors can post highlighted **Official Faculty Answers**, and an interactive **3D Campus Map** at `/campus` so freshers and visitors can explore SETGOI's blocks, labs, HOD offices, and 24/7 emergency helplines.

### 2:15 – 2:45 | Institutional Impact & Closing
> `[SHOW ON SCREEN: Point to the printed /poster QR code on the desk]`

For our faculty and administration, SETTech takes less than ten seconds to broadcast an official notice to an entire department or verify a student's notes with one click—reducing confusion across campus.  

SETTech is completely free, live today on both desktop and mobile, and ready for every SETGOI student. If you'd like to try it right now on your phone, simply open your camera and scan the QR code on our poster—it will take you straight to **`settech.ceimran.in`**.  

Thank you, and I'd love to answer any questions you have!

---

## Script 2: Technical Deep-Dive Speech (3.5 to 4 Minutes)

**Target Audience:** CSE professors, HODs, and technical judges evaluating architecture, security, data modeling, and scalability.  
**Tone:** Crisp, architectural, engineering-focused spoken English.

### 0:00 – 0:40 | System Architecture Overview
> `[SHOW ON SCREEN: Landing page at https://settech.ceimran.in, then open /admin]`

Good morning Professors and technical evaluators. I'm presenting **SETTech** (`https://settech.ceimran.in`), a full-stack institutional academic platform engineered for SETGOI using **Next.js App Router with Turbopack**, **TypeScript**, and **Tailwind CSS** in a unified Swiss-minimalist light-mode design system.

On the backend, we run **Neon Serverless PostgreSQL** with **Prisma ORM** for strongly typed relational persistence, paired with **Clerk Production Authentication** using `svix`-verified webhooks to keep user records synchronized between Clerk and Neon DB.

### 0:40 – 1:40 | Zero-Trust RBAC & Live Role Switcher Demo
> `[SHOW ON SCREEN: On /admin, highlight the top bar Role View Switcher (Admin View | Faculty View | Student View)]`

One of our core engineering priorities was **Zero-Trust Role-Based Access Control** separating `STUDENT`, `FACULTY`, and `ADMIN` clearances:
1. At the edge, Next.js Middleware gates unauthenticated traffic immediately.
2. In the Node.js server runtime, every protected layout and API route resolves the caller via `getCurrentAuthUser()`, cross-checking Clerk `publicMetadata` against Neon DB—with automatic email-based `clerkId` reconciliation (`resolveAndHealUser`) so Dev-to-Prod migrations or stale JWT claims never lock out legitimate admins or allow privilege escalation.
3. Every privileged mutation—role promotions, notice publications, note verifications, or syllabus overrides—writes an immutable record to our `AuditLog` table in PostgreSQL.

> `[SHOW ON SCREEN: Click "Faculty View" in the top bar, show the Amber Preview Banner & Faculty Desk, then click "Student View" to show the Student Cockpit, then click "Return to Admin View"]`

To test multi-role UX in production without maintaining three separate browser sessions, we built a `RolePreviewContext` persisted in `sessionStorage`. When I switch to **Faculty View** or **Student View**, the `WorkspaceShell` dynamically swaps the sidebar navigation and view components while preserving my real `ADMIN` server authorization under the hood.

### 1:40 – 2:40 | Core Engineering Modules
> `[SHOW ON SCREEN: Click "Syllabus & Subjects" tab in /admin, then briefly show /notes and /lectures]`

Let's look at three key engineering modules:
1. **Dynamic MAKAUT Syllabus Engine:** We modeled `SyllabusSubject` and `CourseLecture` in Prisma, seeded with 134 branch- and semester-mapped MAKAUT Theory, Practical Lab, and Elective papers across CSE, ECE, EE, ME, and CE. Notice how `/notes` is strictly isolated for downloadable PDFs and PYQs, while `/lectures` serves curated SWAYAM/NPTEL courses. Any edit an Admin makes in the **Syllabus & Subjects** tab revalidates and updates `/notes`, `/lectures`, and `/viva` immediately.
2. **Relational Forum & Verification Pipeline:** `/forum` uses `ForumPost`, `ForumReply`, and a composite-unique `ForumVote` table (`@@unique([userId, postId])`) to guarantee atomic per-user upvote toggling and prevent duplicate votes. Replies from `FACULTY` or `ADMIN` accounts are automatically tagged `isOfficialAnswer: true`.
3. **AI Viva Voice Pipeline & 3D Campus:** `/viva` streams browser `MediaRecorder` audio to **Groq Whisper** for speech-to-text, evaluates answers via **Groq / Gemini** with Neon-backed per-user rate limiting (`RateLimit` model), and synthesizes natural Indian English and Hinglish responses using **Edge-TTS** neural voices. Meanwhile, `/campus` renders an interactive **Three.js** 3D campus visualizer directly in the browser.

### 2:40 – 3:30 | Production Deployment & Future Roadmap
> `[SHOW ON SCREEN: Open /poster to show print-ready QR distribution]`

The entire platform is deployed on Vercel with custom domain DNS and SSL on `settech.ceimran.in`, responsive mobile thumb-zone navigation at `390×844`, and `300 DPI` PNG / A4 PDF poster generation at `/poster`.  
For our next phase, we plan to add **PWA offline caching** for downloaded MAKAUT notes in low-connectivity campus zones and direct **iCampus ERP attendance sync**.  

Thank you—I'm ready for your technical questions.

---

## Pre-Demo Laptop Checklist (5 Steps Before Judges Arrive)

1. **Pre-Open Key Tabs in Order:**
   - Tab 1: `https://settech.ceimran.in` (Landing Page)
   - Tab 2: `https://settech.ceimran.in/admin` (Logged in as Admin so the **Admin | Faculty | Student View** switcher is ready for instant 1-click demos)
   - Tab 3: `https://settech.ceimran.in/notes` & Tab 4: `https://settech.ceimran.in/lectures`
   - Tab 5: `https://settech.ceimran.in/viva` & Tab 6: `https://settech.ceimran.in/campus`
2. **Verify Logged-In Session:** Refresh `/admin` once 5 minutes before judging so Clerk session cookies and Neon DB connection pools are warm (zero cold-start lag).
3. **Check Microphone & Speaker Volume:** Test one quick voice turn on `/viva` if presenting in a quiet room, or keep `Mute Voice` ready if the exhibition hall is noisy.
4. **Have the QR Poster Visible:** Display the printed `/poster` A4 sheet on your desk (and/or keep `/poster` open) so judges can scan `settech.ceimran.in` on their own phones.
5. **Close Distractions:** Turn off desktop notifications, close unrelated tabs, and set browser zoom to `100%`.

---

## Judge Q&A Cheat Sheet (6 Likely Questions & Crisp Answers)

1. **Q: How do you prevent students from uploading fake, wrong, or spam notes?**  
   **A:** Every student submission enters Neon PostgreSQL with `verified: false` and sits in the Faculty/Admin Verification Queue. Only authenticated `FACULTY` or `ADMIN` accounts can stamp a resource as **Faculty Verified** (or reject/delete it), and every moderation action is recorded in our `AuditLog` table.

2. **Q: How is student and institutional data secured?**  
   **A:** Authentication is handled by Clerk Production Auth with HTTP-only session cookies, and every protected API route validates `auth()` + role clearance on the server before touching Neon PostgreSQL. Students cannot self-elevate roles via `/api/onboarding` or `/api/profile`, and admin mutations are restricted by strict server-side RBAC checks.

3. **Q: Can this scale to all departments and semesters at SETGOI?**  
   **A:** Yes. The syllabus engine (`SyllabusSubject` and `CourseLecture` tables) models CSE, ECE, EE, ME, and CE across Semesters 1 to 8, including Theory, Lab, and Elective papers. Plus, the **Syllabus & Subjects** manager in `/admin` lets faculty/admins add or update electives without any code changes or redeployments.

4. **Q: What happens if campus Wi-Fi or mobile internet is slow?**  
   **A:** All UI shells use lightweight Swiss-minimalist vector components and server-rendered streaming, so pages load quickly even on 4G. In addition, our SGPA/CGPA calculators, 75% attendance tracker, and PDF merger in `/tools` run 100% client-side in the browser with zero network round-trips.

5. **Q: How do you prevent abuse or high API costs on the AI Viva Simulator?**  
   **A:** `/api/viva` enforces a Neon PostgreSQL-backed `RateLimit` guard per user/IP, caps conversation context length, and uses fast, cost-efficient Groq inference with Gemini fallback and Edge-TTS neural synthesis.

6. **Q: Why did you separate `/lectures` from `/notes`?**  
   **A:** During testing, mixing external NPTEL video links with downloadable PDFs made `/notes` cluttered. Separating `/lectures` gives students a dedicated space for IIT/IISc SWAYAM & NPTEL courses (with bookmarking for MAR points), while keeping `/notes` 100% focused on exam PDFs, solved PYQs, and lab manuals.
