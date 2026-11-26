import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('[Exhibition Seed] Starting Neon DB seed for /forum and /lectures...');

  // 1. Ensure demo student & faculty authors exist
  const studentAuthor = await prisma.user.upsert({
    where: { email: 'arjun.btech26@setgoi.ac.in' },
    update: {},
    create: {
      clerkId: 'seed_student_arjun',
      email: 'arjun.btech26@setgoi.ac.in',
      fullName: 'Arjun Chatterjee',
      role: 'STUDENT',
      degree: 'B.Tech',
      branch: 'CSE',
      department: 'CSE',
      semester: 3,
      passoutYear: 2028,
      onboardingCompleted: true,
    },
  });

  const facultyAuthor = await prisma.user.upsert({
    where: { email: 'sourav.sengupta@setgoi.ac.in' },
    update: {},
    create: {
      clerkId: 'seed_faculty_sourav',
      email: 'sourav.sengupta@setgoi.ac.in',
      fullName: 'Dr. Sourav Sengupta',
      role: 'FACULTY',
      designation: 'Associate Professor',
      department: 'CSE',
      degree: 'B.Tech',
      branch: 'CSE',
      semester: 3,
      approvalStatus: 'APPROVED',
      onboardingCompleted: true,
    },
  });

  // 2. Seed 5 realistic MAKAUT B.Tech Q&A threads in /forum (3 Resolved with Verified Faculty Answer, 2 Open)
  const forumSeeds = [
    {
      title: '[PCC-CS301] How to decide between LL, RR, LR, and RL rotations in AVL Trees?',
      content:
        'During MAKAUT Sem 3 DSA numericals, I keep confusing LR vs RL double rotations when inserting keys like 30, 10, 20. Is there a reliable rule of thumb for finding the pivot node and choosing the exact rotation?',
      category: 'Coding & DSA',
      tags: 'PCC-CS301, AVL Tree, DSA, Sem 3',
      branch: 'CSE',
      semester: 3,
      upvotes: 18,
      isResolved: true,
      facultyReply: `### Rule of Thumb for AVL Rotations\n\nAlways trace the **first two edges** from the **first unbalanced ancestor (Balance Factor = ±2)** toward the newly inserted node:\n\n1. **LL (Left-Left):** Inserted in left subtree of left child → **Single Right Rotation**.\n2. **RR (Right-Right):** Inserted in right subtree of right child → **Single Left Rotation**.\n3. **LR (Left-Right):** Inserted in right subtree of left child (e.g. \`30 → 10 → 20\`) → **Left Rotation on child (\`10\`), then Right Rotation on pivot (\`30\`)**.\n4. **RL (Right-Left):** Inserted in left subtree of right child → **Right Rotation on child, then Left Rotation on pivot**.\n\n*Exam Tip:* Write Balance Factors \`BF = height(L) - height(R)\` after every insertion in MAKAUT 10-mark problems.`,
    },
    {
      title: "[PCC-CS302] Why is arithmetic right shift (ARS) mandatory in Booth's Multiplication Algorithm?",
      content:
        "In Computer Organization & Architecture (PCC-CS302), when multiplying signed 2's complement numbers like (-7) × (+3), why can't we use a logical right shift on the [AC, Q] register pair?",
      category: 'Academics & Syllabus',
      tags: 'PCC-CS302, COA, Booth Algorithm, Sem 3',
      branch: 'CSE',
      semester: 3,
      upvotes: 14,
      isResolved: true,
      facultyReply: `### Sign Extension via Arithmetic Right Shift (ARS)\n\nIn Booth's Algorithm, \`AC\` holds the **signed partial product** in 2's complement form:\n\n- A **Logical Right Shift** always inserts \`0\` at the MSB, which flips a negative partial product into a positive number.\n- An **Arithmetic Right Shift (ARS)** duplicates the **MSB (sign bit)** of \`AC\` into itself while shifting \`AC → Q → Q₋₁\`.\n\nThis preserves negative values across every iteration and guarantees the final \`2n\`-bit signed product is exact.`,
    },
    {
      title: "[ESC 301] Can a Don't-Care (X) cell be left ungrouped in a 4-variable K-Map?",
      content:
        "While simplifying F(A,B,C,D) = Σm(1,3,7,11,15) + d(0,2,5) in Analog & Digital Electronics, do we have to cover all Don't-Care terms or only the ones that enlarge a group of 1s?",
      category: 'Academics & Syllabus',
      tags: 'ESC 301, K-Map, Digital Electronics, Sem 3',
      branch: 'CSE',
      semester: 3,
      upvotes: 11,
      isResolved: true,
      facultyReply: `### Golden Rule for Don't-Care (X) Grouping\n\n**Never** form a group consisting *only* of Don't-Care (\`X\`) cells—that adds unnecessary literals.\n\n- Include an \`X\` cell **only if it helps expand an existing group of \`1\`s** into a larger power-of-2 implicant (e.g., pair → quad → octet).\n- Any remaining \`X\` cells that do not enlarge a group of \`1\`s should be treated as \`0\` and left ungrouped.`,
    },
    {
      title: '[EC301] Why does Voltage Divider Bias give better Q-point stability than Fixed Bias in BJT?',
      content:
        'For Analog Electronic Circuits (EC301), how does adding the emitter resistor R_E and potential divider R1/R2 reduce the stability factor S against temperature variations in β and I_CO?',
      category: 'Labs & Viva',
      tags: 'EC301, BJT, Q-Point, ECE Sem 3',
      branch: 'ECE',
      semester: 3,
      upvotes: 7,
      isResolved: false,
      facultyReply: null,
    },
    {
      title: '[PC-ME301] Steady Flow Energy Equation (SFEE) sign convention for Turbine vs Compressor',
      content:
        'In Engineering Thermodynamics (PC-ME301), when applying the First Law to an open system (control volume), what assumptions simplify SFEE for a steam nozzle vs an adiabatic turbine?',
      category: 'Academics & Syllabus',
      tags: 'PC-ME301, Thermodynamics, SFEE, ME Sem 3',
      branch: 'ME',
      semester: 3,
      upvotes: 5,
      isResolved: false,
      facultyReply: null,
    },
  ];

  let forumCreated = 0;
  for (const item of forumSeeds) {
    const existing = await prisma.forumPost.findFirst({
      where: { title: item.title },
    });
    if (!existing) {
      const post = await prisma.forumPost.create({
        data: {
          title: item.title,
          content: item.content,
          category: item.category,
          tags: item.tags,
          branch: item.branch,
          semester: item.semester,
          upvotes: item.upvotes,
          isResolved: item.isResolved,
          authorId: studentAuthor.id,
        },
      });
      forumCreated += 1;

      if (item.facultyReply) {
        await prisma.forumReply.create({
          data: {
            postId: post.id,
            content: item.facultyReply,
            authorId: facultyAuthor.id,
            isOfficialAnswer: true,
            isVerifiedFaculty: true,
            facultyName: 'Dr. Sourav Sengupta (SETGOI Faculty)',
            upvotes: 9,
          },
        });
      }
    }
  }

  // 3. Ensure Sem 3 SWAYAM / NPTEL lectures cover CSE-AIML, CSE-DS, and EEE as well
  const extraLectures = [
    {
      title: 'Programming, Data Structures & Algorithms',
      subjectCode: 'PCC-CS301',
      subjectName: 'Data Structure & Algorithms',
      branch: 'CSE-AIML',
      semester: 3,
      platform: 'NPTEL',
      courseUrl: 'https://onlinecourses.nptel.ac.in/noc24_cs44/preview',
      instructor: 'Prof. Madhavan Mukund',
      institute: 'CMI / IIT Madras',
      duration: '8 Weeks',
    },
    {
      title: 'Computer Organization and Architecture',
      subjectCode: 'PCC-CS302',
      subjectName: 'Computer Organisation',
      branch: 'CSE-AIML',
      semester: 3,
      platform: 'NPTEL',
      courseUrl: 'https://onlinecourses.nptel.ac.in/noc24_cs22/preview',
      instructor: 'Prof. Indranil Sengupta',
      institute: 'IIT Kharagpur',
      duration: '12 Weeks',
    },
    {
      title: 'Programming, Data Structures & Algorithms',
      subjectCode: 'PCC-CS301',
      subjectName: 'Data Structure & Algorithms',
      branch: 'CSE-DS',
      semester: 3,
      platform: 'NPTEL',
      courseUrl: 'https://onlinecourses.nptel.ac.in/noc24_cs44/preview',
      instructor: 'Prof. Madhavan Mukund',
      institute: 'CMI / IIT Madras',
      duration: '8 Weeks',
    },
    {
      title: 'Computer Organization and Architecture',
      subjectCode: 'PCC-CS302',
      subjectName: 'Computer Organisation',
      branch: 'CSE-DS',
      semester: 3,
      platform: 'NPTEL',
      courseUrl: 'https://onlinecourses.nptel.ac.in/noc24_cs22/preview',
      instructor: 'Prof. Indranil Sengupta',
      institute: 'IIT Kharagpur',
      duration: '12 Weeks',
    },
    {
      title: 'Basic Electrical Circuits',
      subjectCode: 'PC-EEE 301',
      subjectName: 'Electric Circuit Theory',
      branch: 'EEE',
      semester: 3,
      platform: 'NPTEL',
      courseUrl: 'https://onlinecourses.nptel.ac.in/noc24_ee18/preview',
      instructor: 'Prof. Gajendranath Chowdary',
      institute: 'IIT Hyderabad',
      duration: '12 Weeks',
    },
    {
      title: 'Analog Electronic Circuits',
      subjectCode: 'PC-EEE 302',
      subjectName: 'Analog Electronics',
      branch: 'EEE',
      semester: 3,
      platform: 'NPTEL',
      courseUrl: 'https://onlinecourses.nptel.ac.in/noc24_ee34/preview',
      instructor: 'Prof. Nagendra Krishnapura',
      institute: 'IIT Madras',
      duration: '12 Weeks',
    },
  ];

  let lecturesCreated = 0;
  for (const lec of extraLectures) {
    const exists = await prisma.courseLecture.findFirst({
      where: {
        branch: lec.branch,
        semester: lec.semester,
        subjectCode: lec.subjectCode,
      },
    });
    if (!exists) {
      await prisma.courseLecture.create({
        data: { ...lec, verified: true },
      });
      lecturesCreated += 1;
    }
  }

  console.log(
    `[Exhibition Seed] Done! Forum threads created: ${forumCreated}, Extra Sem 3 lectures created: ${lecturesCreated}`
  );
  process.exit(0);
}

main().catch((err) => {
  console.error('[Exhibition Seed] Failed:', err);
  process.exit(1);
});
