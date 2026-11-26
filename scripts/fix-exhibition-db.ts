import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

function buildRichContent(note: {
  title: string;
  subjectCode: string;
  subjectName: string | null;
  branch: string;
  semester: number;
  category: string;
}): string {
  const code = note.subjectCode;
  const name = note.subjectName || note.title;
  const isLab = note.category === 'LAB_MANUAL';

  if (isLab) {
    return `# ${code} — ${name} (MAKAUT ${note.branch} Sem ${note.semester} Lab Manual)

## 1. Laboratory Objectives & Outcomes
This practical manual covers the official **MAKAUT ${note.branch} Semester ${note.semester}** curriculum for **${name} (${code})** at SETGOI Durgapur. Students are expected to perform circuit/program implementation, verify theoretical laws with observed readings, and prepare for internal & external viva voce examinations.

## 2. Standard Apparatus / Software Environment
- **Hardware / Simulation Suite:** Regulated DC Power Supply (0–30V), Digital Storage Oscilloscope (DSO), Function Generator, Breadboard & Passive/Active Components (or Python 3.11 / AutoCAD / GCC Compiler for software labs).
- **Safety & Pre-Lab Protocol:** Always verify polarity, ground references, and current limits before energizing hardware circuits; maintain modular, commented source files for software experiments.

## 3. Core Experiments & Step-by-Step Procedure

### Experiment 1: Fundamental Verification & Characteristics
1. **Aim:** Verify the primary operating characteristics and governing law of **${name}**.
2. **Procedure:**
   - Set up the test bench or software environment according to the circuit/algorithm schematic.
   - Record at least 8–10 observation points across the linear and saturation operating regions.
   - Plot the input-output characteristic curve and compute percentage error against theoretical values.
3. **Sample Calculation & Observation Table:**
   - Theoretical Value vs. Measured Value: \`% Error = (|Theoretical - Observed| / Theoretical) × 100\`.
   - Ensure error remains within ±5% tolerance.

### Experiment 2: Performance Analysis & Parameter Extraction
1. **Aim:** Evaluate dynamic response, efficiency, or algorithmic complexity under varying load/input conditions.
2. **Algorithm / Circuit Steps:**
   - Initialize boundary conditions and sweep the control parameter (frequency, load resistance, or dataset size \`N\`).
   - Capture peak overshoot, bandwidth, or execution runtime using standard instrumentation.
   - Document edge cases and anomalies in the lab observation notebook.

### Experiment 3: Design & Troubleshooting Exercise
1. **Aim:** Design a real-world engineering subsystem applying **${code}** principles and debug injected faults.
2. **Deliverables:**
   - Clean schematic/code listing with inline comments.
   - Verified output waveforms or console test-case outputs.

## 4. Frequently Asked MAKAUT Lab Viva Questions
1. **Q1:** What is the primary physical or algorithmic principle demonstrated in ${code}?
   - *Expected Key Point:* Explain the governing equation, boundary conditions, and practical engineering trade-offs.
2. **Q2:** Why do observed readings deviate slightly from ideal theoretical calculations?
   - *Expected Key Point:* Account for internal source impedance, contact resistance, tolerance (±5%), quantization, or constant-factor overhead.
3. **Q3:** How would you scale this experiment for industrial deployment?
   - *Expected Key Point:* Discuss thermal stability, fault tolerance, noise immunity, and asymptotic scalability.

---
*Verified SETGOI Academic Resource • Aligned to MAKAUT ${note.branch} Semester ${note.semester} Syllabus*`;
  }

  return `# ${code} — ${name} (MAKAUT ${note.branch} Sem ${note.semester} Complete Study Guide)

## 1. Course Overview & MAKAUT Exam Blueprint
**${name} (${code})** is a core **${note.branch} Semester ${note.semester}** course under the MAKAUT CBCS curriculum.
- **Exam Pattern:** 70 Marks End-Semester Theory (Group A: 10×1 MCQs/Short, Group B: 3×5 Medium Analytical, Group C: 3×15 Long Derivations & Numericals) + 30 Marks Internal Assessment (CA1–CA4).

## 2. Module-Wise High-Yield Concepts

### Module 1: Mathematical Foundations & Core Laws
- **First Principles:** Master the fundamental definitions, governing equations, and boundary conditions for **${name}**.
- **Standard Assumptions:** Clearly state linearity, steady-state, or ideal-component assumptions before starting any derivation in MAKAUT 15-mark questions.
- **Key Formula Summary:** Always include SI units, dimensional checks, and sign conventions in numerical solutions.

### Module 2: Analytical Methods & Problem-Solving Techniques
1. **Systematic Formulation:** Break multi-stage problems into free-body diagrams, equivalent circuits, state tables, or asymptotic recurrences.
2. **Worked Pattern:**
   - Step 1: Identify given parameters and convert to consistent SI units.
   - Step 2: Select the canonical theorem or transform applicable to ${code}.
   - Step 3: Solve algebraically first, then substitute numerical values to minimize rounding error.
3. **Common Pitfalls:** Avoid sign-inversion errors, missing initial conditions in transforms, and unstated stability criteria.

### Module 3: Design Applications & System Trade-Offs
- Compare alternative architectures/methods used in **${name}** across **accuracy, complexity, efficiency, and cost**.
- Practice drawing neat, labeled block diagrams, characteristic curves, and timing/phase diagrams—MAKAUT examiners award dedicated marks for labeled schematics.

## 3. Solved MAKAUT PYQ Practice Bank

### Question 1 (Long Answer — 15 Marks)
**State and derive the core governing theorem of ${name} (${code}) and illustrate with a numerical example.**
- **Model Solution Outline:**
  1. Write the formal statement and mathematical expression.
  2. Present the step-by-step derivation with clearly labeled intermediate variables.
  3. Solve a representative numerical case showing all substitution steps and final boxed answer with units.

### Question 2 (Analytical — 5 Marks)
**Compare the ideal vs. practical behavior of systems studied in ${code} and list two engineering applications.**
- **Model Solution Outline:**
  - Contrast ideal assumptions against real-world non-idealities (losses, parasitics, latency, or finite precision).
  - Cite two concrete industrial applications relevant to ${note.branch} engineers.

## 4. Last-Minute Revision Checklist
- [ ] Memorize all standard theorems, boundary conditions, and transform pairs for ${code}.
- [ ] Practice at least 3 full 15-mark derivations with labeled diagrams.
- [ ] Review Group-A 1-mark definitions and units for rapid accuracy.

---
*Verified SETGOI Academic Resource • Aligned to MAKAUT ${note.branch} Semester ${note.semester} Syllabus*`;
}

async function main() {
  console.log('[Fix DB] 1. Syncing Notice columns over DATABASE_URL pooler...');
  const noticeAlters = [
    `ALTER TABLE "Notice" ADD COLUMN IF NOT EXISTS "subjectCode" TEXT`,
    `ALTER TABLE "Notice" ADD COLUMN IF NOT EXISTS "subjectName" TEXT`,
    `ALTER TABLE "Notice" ADD COLUMN IF NOT EXISTS "targetBranch" TEXT NOT NULL DEFAULT 'ALL'`,
    `ALTER TABLE "Notice" ADD COLUMN IF NOT EXISTS "targetSemester" INTEGER`,
    `ALTER TABLE "Notice" ADD COLUMN IF NOT EXISTS "targetBranches" TEXT[] NOT NULL DEFAULT ARRAY['ALL']::TEXT[]`,
    `ALTER TABLE "Notice" ADD COLUMN IF NOT EXISTS "targetSemesters" INTEGER[] NOT NULL DEFAULT ARRAY[]::INTEGER[]`,
    `ALTER TABLE "Notice" ADD COLUMN IF NOT EXISTS "examDate" TIMESTAMP(3)`,
    `ALTER TABLE "Notice" ADD COLUMN IF NOT EXISTS "eventDate" TIMESTAMP(3)`,
    `ALTER TABLE "Notice" ADD COLUMN IF NOT EXISTS "isPinned" BOOLEAN NOT NULL DEFAULT false`,
    `ALTER TABLE "Notice" ADD COLUMN IF NOT EXISTS "authorName" TEXT`,
    `ALTER TABLE "Notice" ADD COLUMN IF NOT EXISTS "authorRole" TEXT`,
    `ALTER TABLE "Notice" ADD COLUMN IF NOT EXISTS "authorDesignation" TEXT`,
    `ALTER TABLE "Notice" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    `CREATE INDEX IF NOT EXISTS "Notice_subjectCode_idx" ON "Notice"("subjectCode")`,
  ];

  for (const sql of noticeAlters) {
    await prisma.$executeRawUnsafe(sql);
  }
  const testNotices = await prisma.notice.findMany({ take: 1 });
  console.log(`[Fix DB] Notice table synced & verified (current rows: ${testNotices.length}).`);

  console.log('[Fix DB] 2. Enforcing Master Admin flag for mdimransps955@gmail.com...');
  await prisma.user.updateMany({
    where: { email: { equals: 'mdimransps955@gmail.com', mode: 'insensitive' } },
    data: {
      role: 'ADMIN',
      isMasterAdmin: true,
      approvalStatus: 'APPROVED',
      onboardingCompleted: true,
      designation: 'Master Admin',
    },
  });

  console.log('[Fix DB] 3. Enriching all Note records under 500 characters...');
  const allNotes = await prisma.note.findMany({
    select: {
      id: true,
      title: true,
      subjectCode: true,
      subjectName: true,
      branch: true,
      semester: true,
      category: true,
      content: true,
    },
  });
  let enrichedCount = 0;
  for (const note of allNotes) {
    if (!note.content || note.content.length < 500) {
      const rich = buildRichContent(note);
      await prisma.note.update({
        where: { id: note.id },
        data: { content: rich, fileSize: Buffer.byteLength(rich, 'utf8') },
      });
      enrichedCount += 1;
    }
  }
  console.log(`[Fix DB] Enriched ${enrichedCount} Note records.`);

  console.log('[Fix DB] 4. Seeding Notice, CampusEvent & CustomVivaQuestion...');
  const adminUser =
    (await prisma.user.findFirst({ where: { role: 'ADMIN' } })) ||
    (await prisma.user.findFirst());
  const facultyUser =
    (await prisma.user.findFirst({ where: { role: 'FACULTY' } })) || adminUser;

  const existingNoticesCount = await prisma.notice.count();
  if (existingNoticesCount === 0 && adminUser && facultyUser) {
    await prisma.notice.createMany({
      data: [
        {
          title: 'CA-2 Internal Theory Examination Schedule (Sem 3–7)',
          content:
            'Continuous Assessment 2 (CA-2) theory examinations for all B.Tech departments (Semesters 3, 5, and 7) will be conducted next week. Students must carry their SETGOI ID cards and report 15 minutes prior to the scheduled slot.',
          category: 'EXAM',
          targetBranch: 'ALL',
          targetBranches: ['ALL'],
          targetSemesters: [],
          eventDate: new Date('2026-12-05T09:30:00Z'),
          examDate: new Date('2026-12-05T09:30:00Z'),
          isPinned: true,
          authorId: adminUser.id,
          authorName: adminUser.fullName || 'SETGOI Examination Cell',
          authorRole: 'ADMIN',
          authorDesignation: 'Master Admin',
        },
        {
          title: 'PCC-CS391 Data Structures Lab Practical & Viva Evaluation',
          content:
            'All 3rd Semester CSE students must submit their signed PCC-CS391 C/C++ Data Structures Lab Record (Stacks, Queues, Linked Lists, BST & AVL implementations) in Lab 304 before the internal viva voce evaluation.',
          category: 'LAB_VIVA',
          subjectCode: 'PCC-CS301',
          subjectName: 'Data Structure & Algorithms',
          targetBranch: 'CSE',
          targetSemester: 3,
          targetBranches: ['CSE'],
          targetSemesters: [3],
          eventDate: new Date('2026-12-02T10:00:00Z'),
          isPinned: true,
          authorId: facultyUser.id,
          authorName: facultyUser.fullName || 'Dr. Sourav Sengupta',
          authorRole: 'FACULTY',
          authorDesignation: 'Associate Professor',
        },
        {
          title: 'MAKAUT Odd Semester Exam Form Fill-Up & 75% Attendance Cutoff',
          content:
            'As per MAKAUT guidelines, students must maintain a minimum of 75% attendance across theory and sessional papers to remain eligible for Odd Semester university form fill-up. Check your live buffer in the Attendance Auditor.',
          category: 'ACADEMIC',
          targetBranch: 'ALL',
          targetBranches: ['ALL'],
          targetSemesters: [],
          isPinned: false,
          authorId: adminUser.id,
          authorName: adminUser.fullName || 'SETGOI Academic Office',
          authorRole: 'ADMIN',
          authorDesignation: 'Registrar Office',
        },
        {
          title: 'ESC 391 Analog & Digital Electronics Circuit File Submission',
          content:
            '3rd Semester CSE, CSE-AIML, and CSE-DS batches must complete K-Map simplification, Multiplexer/Flip-Flop breadboard verification, and submit circuit observation sheets in Electronics Lab 202.',
          category: 'ASSIGNMENT',
          subjectCode: 'ESC 301',
          subjectName: 'Analog & Digital Electronics',
          targetBranch: 'CSE',
          targetSemester: 3,
          targetBranches: ['CSE', 'CSE-AIML', 'CSE-DS'],
          targetSemesters: [3],
          eventDate: new Date('2026-12-03T11:00:00Z'),
          isPinned: false,
          authorId: facultyUser.id,
          authorName: facultyUser.fullName || 'Dr. Sourav Sengupta',
          authorRole: 'FACULTY',
          authorDesignation: 'Associate Professor',
        },
      ],
    });
    console.log('[Fix DB] Seeded 4 SETGOI Notice records.');
  }

  const existingEventsCount = await prisma.campusEvent.count();
  if (existingEventsCount === 0) {
    await prisma.campusEvent.createMany({
      data: [
        {
          title: 'Coding Maestro — SETGOI Tech-Med-Fest 2026',
          category: 'TECHFEST',
          dateLabel: 'Nov 26–27, 2026',
          venue: 'Central Computing Lab 304',
          description:
            'Flagship competitive programming and DSA problem-solving contest across C++, Java, and Python.',
          isFeatured: true,
        },
        {
          title: 'Tech-Tonic Project Exhibition',
          category: 'TECHFEST',
          dateLabel: 'Nov 26, 2026',
          venue: 'SETGOI Main Auditorium',
          description:
            'Annual B.Tech hardware, IoT, AI/ML, and full-stack software project showcase judged by faculty and industry mentors.',
          isFeatured: true,
        },
        {
          title: 'Think-Ink Technical Poster Presentation',
          category: 'SEMINAR',
          dateLabel: 'Nov 27, 2026',
          venue: 'Academic Block Atrium',
          description:
            'Department-wide technical poster exhibition highlighting student research, campus innovations, and engineering architecture.',
          isFeatured: false,
        },
      ],
    });
    console.log('[Fix DB] Seeded 3 CampusEvent records.');
  }

  const existingCustomVivaCount = await prisma.customVivaQuestion.count();
  if (existingCustomVivaCount === 0) {
    await prisma.customVivaQuestion.createMany({
      data: [
        {
          branch: 'CSE',
          semester: 3,
          subjectCode: 'PCC-CS301',
          question:
            'Why is a circular queue preferred over a linear array queue, and how do we detect full vs empty conditions?',
          expectedKeyPoints:
            'Avoids false overflow by reusing freed front slots in O(1); full is (rear + 1) % N == front; empty is front == -1.',
          createdBy: 'Dr. Sourav Sengupta',
        },
        {
          branch: 'CSE',
          semester: 3,
          subjectCode: 'PCC-CS301',
          question:
            'What is the worst-case time complexity of searching in a Binary Search Tree vs an AVL Tree, and why?',
          expectedKeyPoints:
            'Skewed BST degrades to O(n); AVL maintains height-balance factor {-1, 0, +1} via rotations so search stays O(log n).',
          createdBy: 'Dr. Sourav Sengupta',
        },
        {
          branch: 'CSE',
          semester: 3,
          subjectCode: 'PCC-CS302',
          question:
            'Explain the difference between hardwired control unit and microprogrammed control unit in CPU design.',
          expectedKeyPoints:
            'Hardwired uses combinational logic/FSM (faster, rigid, RISC); microprogrammed uses control memory storing microinstructions (flexible, easier to modify, CISC).',
          createdBy: 'Dr. Sourav Sengupta',
        },
        {
          branch: 'CSE',
          semester: 3,
          subjectCode: 'PCC-CS302',
          question:
            'How does set-associative cache mapping balance hit ratio and hardware comparator cost compared to direct and fully associative mapping?',
          expectedKeyPoints:
            'Reduces conflict misses compared to direct-mapped while needing only k comparators per set instead of comparing every cache line.',
          createdBy: 'Dr. Sourav Sengupta',
        },
        {
          branch: 'CSE',
          semester: 3,
          subjectCode: 'ESC 301',
          question:
            'How do you eliminate a race-around condition in a JK Flip-Flop when J=1 and K=1?',
          expectedKeyPoints:
            'Use Master-Slave JK Flip-Flop or edge-triggered clocking so the output toggles only once per clock cycle.',
          createdBy: 'Prof. Ananya Chatterjee',
        },
        {
          branch: 'CSE',
          semester: 3,
          subjectCode: 'ESC 301',
          question:
            'Why is a Karnaugh Map (K-Map) ordered in Gray Code instead of standard binary?',
          expectedKeyPoints:
            'Adjacent cells differ by only 1 bit, allowing Boolean adjacency (A + A_bar = 1) to eliminate one variable per paired group.',
          createdBy: 'Prof. Ananya Chatterjee',
        },
      ],
    });
    console.log('[Fix DB] Seeded 6 CustomVivaQuestion records.');
  }

  console.log('[Fix DB] All repairs and seeds completed successfully!');
  process.exit(0);
}

main().catch((err) => {
  console.error('[Fix DB] Error:', err);
  process.exit(1);
});
