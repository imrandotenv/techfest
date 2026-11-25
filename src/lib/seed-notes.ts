import { prisma } from '@/lib/prisma';

let seedingPromise: Promise<void> | null = null;

export interface RichSeedNote {
  title: string;
  subjectCode: string;
  subjectName: string;
  branch: string;
  semester: number;
  category: 'LECTURE_NOTE' | 'MAKAUT_PYQ' | 'LAB_MANUAL';
  fileKey: string;
  content: string;
}

export const RICH_SEM3_NOTES: RichSeedNote[] = [
  // =========================================================================
  // 1. CSE SEM 3 — ALL 5 THEORY SUBJECTS (NOTES + SOLVED PYQS)
  // =========================================================================
  {
    title: 'Data Structure & Algorithms — Complete Module 1–5 Study Guide',
    subjectCode: 'PCC-CS301',
    subjectName: 'Data Structure & Algorithms',
    branch: 'CSE',
    semester: 3,
    category: 'LECTURE_NOTE',
    fileKey: 'seed/cse-sem3-pcc-cs301-notes.html',
    content: `# PCC-CS301: Data Structure & Algorithms — Complete Module 1–5 Study Guide

## 1. Asymptotic Complexity & Recurrences
- **Big-O O(f(n)):** Upper bound (worst-case guarantee): ∃ c > 0, n₀ such that 0 ≤ T(n) ≤ c·f(n) for all n ≥ n₀.
- **Big-Omega Ω(f(n)):** Lower bound (best-case guarantee): T(n) ≥ c·f(n).
- **Big-Theta Θ(f(n)):** Tight bound: c₁·f(n) ≤ T(n) ≤ c₂·f(n).
- **Master Theorem:** For T(n) = aT(n/b) + f(n) with a ≥ 1, b > 1:
  - Case 1: f(n) = O(n^(log_b(a) - ε)) ⇒ T(n) = Θ(n^(log_b(a))).
  - Case 2: f(n) = Θ(n^(log_b(a))) ⇒ T(n) = Θ(n^(log_b(a)) · log n).
  - Case 3: f(n) = Ω(n^(log_b(a) + ε)) ⇒ T(n) = Θ(f(n)).

## 2. Stacks, Infix-to-Postfix & Queues
- **Stack (LIFO):** Push, Pop, Peek run in O(1) time. Used in function call frames, DFS, expression evaluation, and balanced parentheses checking.
- **Infix to Postfix Algorithm:**
  1. Scan expression left to right. If operand, output immediately.
  2. If \`(\`, push onto operator stack. If \`)\`, pop and output until \`(\`.
  3. If operator, pop operators with higher or equal precedence (for left-associative \`+ - * /\`), then push current operator. (^ is right-associative).
- **Circular Queue:** Eliminates false overflow in linear array queues using modulo wrap-around:
  - Empty: \`front == -1\`
  - Full: \`(rear + 1) % SIZE == front\`
- **Priority Queue:** Implemented via Binary Max/Min Heap giving O(log n) insert & extract-max/min and O(1) peek.

## 3. Linked Lists (Singly, Doubly, Circular)
- Singly Linked List: O(1) insert/delete at head, O(n) search.
- Doubly Linked List: \`prev\` and \`next\` pointers allow O(1) deletion given node pointer and bidirectional traversal (used in LRU Cache).
- Circular Linked List: Last node points back to head; ideal for Round-Robin CPU scheduling.

## 4. Binary Search Trees & AVL Rotations
- **BST Property:** Left subtree keys < Root < Right subtree keys. Inorder traversal yields sorted order.
- **AVL Tree Balance Factor:** BF(node) = height(left) - height(right) ∈ {-1, 0, +1}.
- **4 Rotation Cases (all O(1) pointer updates):**
  - **LL (Left-Left):** Single Right Rotation at unbalanced ancestor.
  - **RR (Right-Right):** Single Left Rotation at unbalanced ancestor.
  - **LR (Left-Right):** Left Rotate left child, then Right Rotate ancestor.
  - **RL (Right-Left):** Right Rotate right child, then Left Rotate ancestor.

## 5. Hashing & Graph Traversals
- **Collision Resolution:** Separate Chaining (linked lists at buckets) vs Open Addressing (Linear Probing \`(h(k)+i)%m\`, Quadratic Probing \`(h(k)+i²)%m\`, Double Hashing).
- **BFS (Queue):** O(V + E) — finds shortest path in unweighted graphs.
- **DFS (Stack/Recursion):** O(V + E) — cycle detection, topological sort, strongly connected components.
- **Dijkstra's Algorithm:** Greedy shortest path for non-negative edge weights in O((V + E) log V) with Min-Heap.`,
  },
  {
    title: 'Data Structure & Algorithms — Solved MAKAUT Exam Bank (PYQs)',
    subjectCode: 'PCC-CS301',
    subjectName: 'Data Structure & Algorithms',
    branch: 'CSE',
    semester: 3,
    category: 'MAKAUT_PYQ',
    fileKey: 'seed/cse-sem3-pcc-cs301-pyq.html',
    content: `# PCC-CS301: Solved MAKAUT Previous Year Questions

## Q1. Insert keys 10, 20, 30, 40, 50, 25 into an initially empty AVL Tree showing balance factors. (15 Marks)
**Step-by-Step Solution:**
1. **Insert 10:** Root = 10 (BF = 0).
2. **Insert 20:** 20 goes right of 10. BF(10) = -1, BF(20) = 0.
3. **Insert 30:** 30 goes right of 20. BF(10) = -2 (RR imbalance at 10).
   - **Apply Left Rotation (RR) at 10:** 20 becomes root, 10 is left child, 30 is right child. All BFs = 0.
4. **Insert 40:** Goes right of 30. BF(20) = -1, BF(30) = -1, BF(40) = 0.
5. **Insert 50:** Goes right of 40. BF(30) = -2 (RR imbalance at 30).
   - **Apply Left Rotation at 30:** 40 becomes right child of 20, with children 30 (left) and 50 (right).
6. **Insert 25:** Goes left of 30. Heights: left(20)=1, right(20)=3 ⇒ BF(20) = -2 (RL imbalance: right child 40 has BF = +1).
   - **Apply RL Rotation:** Right Rotate at 40 (30 moves up), then Left Rotate at 20 ⇒ **Final Root = 30**, Left = 20 (right child 25), Right = 40 (right child 50). Tree is balanced!

## Q2. Convert Infix \`A + (B * C - (D / E ^ F) * G) * H\` to Postfix using Stack Trace. (10 Marks)
**Trace Summary:**
- Output operands immediately; push \`(\`, \`+\`, \`(\`, \`*\`.
- At \`-\`, pop \`*\` (higher precedence) → output \`ABC*\`, push \`-\`.
- Inside \`(D / E ^ F)\`: \`^\` has higher precedence than \`/\`, so \`DEF^/\` is emitted on \`)\`.
- Multiply by \`G\`: \`*\` pops at \`)\`, producing \`ABC*DEF^/G*-\`.
- Multiply by \`H\` and add \`+\`: **Final Postfix:** \`ABC*DEF^/G*-H*+\`.

## Q3. Write the exact Full & Empty conditions for a Circular Queue of size N. (5 Marks)
- **Empty:** \`front == -1\` (or \`front == rear\` if sacrificing 1 slot).
- **Full:** \`(rear + 1) % N == front\`.
- **Enqueue:** If full, Overflow. Else if \`front == -1\`, set \`front = rear = 0\`; else \`rear = (rear + 1) % N\`; \`q[rear] = x\`.

## Q4. Compare QuickSort vs MergeSort Recurrences & Space Complexity. (10 Marks)
- **MergeSort:** Always splits in half ⇒ T(n) = 2T(n/2) + O(n) = Θ(n log n) in best, average, and worst cases. Requires **O(n) auxiliary array** space. Stable sort.
- **QuickSort:** Average T(n) = 2T(n/2) + O(n) = O(n log n), but Worst Case (already sorted with first/last pivot) gives T(n) = T(n-1) + O(n) = **O(n²)**. In-place O(log n) stack space. Randomized pivot prevents worst-case degradation.`,
  },
  {
    title: 'Computer Organisation — Complete Module 1–5 Study Guide',
    subjectCode: 'PCC-CS302',
    subjectName: 'Computer Organisation',
    branch: 'CSE',
    semester: 3,
    category: 'LECTURE_NOTE',
    fileKey: 'seed/cse-sem3-pcc-cs302-notes.html',
    content: `# PCC-CS302: Computer Organisation — Complete Module Study Guide

## 1. IEEE-754 Floating-Point Representation
- **Single Precision (32-bit):** 1 Sign bit (S) + 8 Exponent bits (Bias = 127) + 23 Mantissa/Fraction bits (M).
  - Value = (-1)^S × (1.M) × 2^(E - 127).
- **Double Precision (64-bit):** 1 Sign bit + 11 Exponent bits (Bias = 1023) + 52 Mantissa bits.

## 2. Booth's Signed Multiplication Algorithm
Handles 2's complement signed integers (M × Q) by inspecting \`(Q₀, Q₋₁)\`:
- **00 or 11:** No arithmetic operation, just Arithmetic Right Shift (ARS) of \`(A, Q, Q₋₁)\`.
- **10:** \`A ← A - M\`, then ARS \`(A, Q, Q₋₁)\`.
- **01:** \`A ← A + M\`, then ARS \`(A, Q, Q₋₁)\`.
- Repeat for \`n\` cycles (for n-bit operands).

## 3. Restoring vs Non-Restoring Division
- **Restoring Division:** Shift Left (A, Q); \`A ← A - M\`. If A < 0, set \`Q₀ = 0\` and **restore** \`A ← A + M\`. Else \`Q₀ = 1\`.
- **Non-Restoring Division:** Avoids restore step; if A < 0 next cycle shifts left and performs \`A ← A + M\`.

## 4. Hardwired vs Microprogrammed Control Unit
- **Hardwired Control:** Implemented using combinational logic gates & FSM. Extremely fast (RISC), but difficult to modify.
- **Microprogrammed Control:** Control signals stored as microinstructions in Control Memory (ROM/PLA). Easy to update/debug (CISC), slightly slower due to control store fetch.

## 5. Cache Memory Mapping & AMAT
- **Direct Mapping:** Each main memory block maps to exactly 1 cache line: \`Line = Block mod (Cache Lines)\`. Address = \`[Tag | Line Index | Block Offset]\`.
- **Fully Associative:** Any block can go in any line. Address = \`[Tag | Block Offset]\`. Requires parallel comparators.
- **k-way Set Associative:** Cache divided into S sets of k lines each. \`Set = Block mod S\`.
- **AMAT Formula:** \`AMAT = Hit Time + (Miss Rate × Miss Penalty)\`.

## 6. 5-Stage Instruction Pipelining (IF, ID, EX, MEM, WB)
- **Ideal Speedup:** \`S = k\` for k stages (for n ≫ k instructions). Real speedup: \`(n · k) / (k + n - 1)\`.
- **Pipeline Hazards:**
  - **Structural Hazard:** Hardware resource conflict (solved by separate I-Cache & D-Cache).
  - **Data Hazard:** RAW (Read After Write), WAR, WAW (solved by Operand Forwarding & Stalling).
  - **Control Hazard:** Branch instructions (solved by Branch Prediction & Delayed Branching).`,
  },
  {
    title: 'Computer Organisation — Solved MAKAUT Numericals & PYQs',
    subjectCode: 'PCC-CS302',
    subjectName: 'Computer Organisation',
    branch: 'CSE',
    semester: 3,
    category: 'MAKAUT_PYQ',
    fileKey: 'seed/cse-sem3-pcc-cs302-pyq.html',
    content: `# PCC-CS302: Solved MAKAUT Numericals & Exam Questions

## Q1. Multiply (-6) × (+3) using 4-bit Booth's Algorithm. (10 Marks)
- M = -6 = \`1010\` (2's complement), -M = +6 = \`0110\`, Q = +3 = \`0011\`, A = \`0000\`, Q₋₁ = \`0\`.
- **Cycle 1:** Q₀Q₋₁ = \`10\` ⇒ A = A - M = \`0110\`. ARS ⇒ A=\`0011\`, Q=\`0001\`, Q₋₁=\`1\`.
- **Cycle 2:** Q₀Q₋₁ = \`11\` ⇒ ARS ⇒ A=\`0001\`, Q=\`1000\`, Q₋₁=\`1\`.
- **Cycle 3:** Q₀Q₋₁ = \`01\` ⇒ A = A + M = \`0001 + 1010 = 1011\`. ARS ⇒ A=\`1101\`, Q=\`1100\`, Q₋₁=\`0\`.
- **Cycle 4:** Q₀Q₋₁ = \`00\` ⇒ ARS ⇒ A=\`1110\`, Q=\`1110\`, Q₋₁=\`0\`.
- **Result:** AQ = \`1110 1110\`₂ = -18₁₀. Verified!

## Q2. A 32-bit byte-addressable CPU has a 64 KB 4-way set-associative cache with 64-byte blocks. Find Tag, Set Index, and Offset bits. (10 Marks)
- **Block Size** = 64 B = 2⁶ B ⇒ **Offset bits = 6**.
- **Number of Cache Lines** = 64 KB / 64 B = 1024 lines = 2¹⁰ lines.
- **Number of Sets** = 1024 / 4 = 256 sets = 2⁸ sets ⇒ **Set Index bits = 8**.
- **Tag bits** = 32 - (8 + 6) = **18 bits**.

## Q3. Calculate Speedup of a 5-stage pipeline with stage delay 10 ns vs non-pipelined 45 ns for 100 instructions. (5 Marks)
- Non-pipelined time = 100 × 45 ns = **4500 ns**.
- Pipelined time = (5 + 100 - 1) × 10 ns = 104 × 10 ns = **1040 ns**.
- **Speedup** = 4500 / 1040 = **4.33×**.`,
  },
  {
    title: 'Analog and Digital Electronics — Complete Module Study Guide',
    subjectCode: 'ESC 301',
    subjectName: 'Analog and Digital Electronics',
    branch: 'CSE',
    semester: 3,
    category: 'LECTURE_NOTE',
    fileKey: 'seed/cse-sem3-esc301-notes.html',
    content: `# ESC 301: Analog and Digital Electronics — Complete Study Guide

## 1. BJT Biasing & Common Emitter (CE) Amplifier
- **Voltage-Divider Biasing:** Provides highest thermal stability (lowest stability factor S) independent of β variations.
- **CE Amplifier:** High voltage & current gain, moderate input/output impedance, **180° phase inversion** between base input and collector output.
- **Barkhausen Criterion (Oscillators):** Loop gain |Aβ| = 1 and total phase shift = 0° or 360°.

## 2. Operational Amplifier (IC 741) Linear Applications
- Ideal Op-Amp assumptions: Infinite open-loop gain (A_OL → ∞), Infinite input impedance, Zero output impedance, Virtual Short (V₊ ≈ V₋).
- **Inverting Amplifier:** \`V_out = -(R_f / R_in) · V_in\`.
- **Non-Inverting Amplifier:** \`V_out = (1 + R_f / R_1) · V_in\`.
- **Summing Amplifier (Inverting):** \`V_out = -R_f (V_1/R_1 + V_2/R_2 + ...)\`.
- **Integrator:** \`V_out = -(1 / R C) ∫ V_in dt\` | **Differentiator:** \`V_out = -R C (dV_in / dt)\`.

## 3. Boolean Algebra & 4-Variable K-Map Minimization
- **De Morgan's Laws:** \`(A·B)' = A' + B'\`, \`(A+B)' = A'·B'\`.
- **SOP (Sum of Products):** Group 1s (and helpful Don't-Cares X) in powers of 2 (16, 8, 4, 2, 1).
- **POS (Product of Sums):** Group 0s (and Don't-Cares X) to form maxterms.

## 4. Combinational & Sequential Circuits
- **Half Adder:** Sum = A ⊕ B, Carry = A·B. **Full Adder:** Sum = A ⊕ B ⊕ C_in, C_out = AB + BC_in + AC_in.
- **4:1 Multiplexer:** \`Y = S₁'S₀'I₀ + S₁'S₀I₁ + S₁S₀'I₂ + S₁S₀I₃\`.
- **Flip-Flop Excitation Tables:**
  - **JK:** 0→0 (0,X), 0→1 (1,X), 1→0 (X,1), 1→1 (X,0).
  - **T:** 0→0 (0), 0→1 (1), 1→0 (1), 1→1 (0).
  - **Race-Around Condition:** In level-triggered JK FF with J=K=1, output toggles continuously when t_pulse > t_pd. Eliminated by Master-Slave or Edge-Triggered FF.
- **Counters:** Asynchronous Ripple Counter (clock ripples through FFs, propagation delay accumulates) vs Synchronous Counter (common clock, parallel logic). Mod-N counter needs ⌈log₂ N⌉ FFs.`,
  },
  {
    title: 'Analog and Digital Electronics — Solved MAKAUT PYQs',
    subjectCode: 'ESC 301',
    subjectName: 'Analog and Digital Electronics',
    branch: 'CSE',
    semester: 3,
    category: 'MAKAUT_PYQ',
    fileKey: 'seed/cse-sem3-esc301-pyq.html',
    content: `# ESC 301: Solved MAKAUT Previous Year Questions

## Q1. Minimize F(A, B, C, D) = Σm(0, 1, 2, 5, 8, 9, 10) + d(3, 7, 11, 15) using 4-Variable K-Map. (10 Marks)
- **Quad 1 (m0, m1, m2, d3):** Covers A'B'.
- **Quad 2 (m0, m2, m8, m10):** Covers B'D'.
- **Quad 3 (m1, d3, m5, d7):** Covers A'D.
- **Quad 4 (m8, m9, m10, d11):** Covers AB'.
- Combining minimal prime implicants covering all 1s: **F = B' + A'D** (since m0,m1,m2,m8,m9,m10 are all in B' and m5 is covered by A'D).

## Q2. Design a Mod-6 Synchronous Counter using JK Flip-Flops. (10 Marks)
- States: 000 → 001 → 010 → 011 → 100 → 101 → 000 (States 110, 111 are Don't-Cares).
- Number of FFs = 3 (Q₂, Q₁, Q₀).
- Using JK excitation table & K-maps:
  - \`J₀ = 1, K₀ = 1\`
  - \`J₁ = Q₂'·Q₀, K₁ = Q₀\`
  - \`J₂ = Q₁·Q₀, K₂ = Q₀\`

## Q3. Calculate V_out for an Inverting Summing Op-Amp with Rf = 10 kΩ, R1 = 2 kΩ (V1 = 1V), R2 = 5 kΩ (V2 = 2V). (5 Marks)
- \`V_out = -Rf (V1/R1 + V2/R2) = -10k (1/2k + 2/5k) = -10 (0.5 + 0.4) = -9.0 V\`.`,
  },
  {
    title: 'Mathematics-III (Differential Calculus) — Complete Study Guide',
    subjectCode: 'BSC 301',
    subjectName: 'Mathematics-III (Differential Calculus)',
    branch: 'CSE',
    semester: 3,
    category: 'LECTURE_NOTE',
    fileKey: 'seed/cse-sem3-bsc301-notes.html',
    content: `# BSC 301: Mathematics-III (Differential Calculus) — Complete Study Guide

## 1. Convergence of Infinite Series
- **D'Alembert's Ratio Test:** Let L = lim(n→∞) |u_{n+1} / u_n|. Converges if L < 1, diverges if L > 1, inconclusive if L = 1.
- **Cauchy's Root Test:** Let L = lim(n→∞) (u_n)^(1/n). Converges if L < 1, diverges if L > 1.
- **Leibnitz Alternating Series Test:** ∑(-1)^(n-1) u_n converges if (i) u_n ≥ u_{n+1} > 0 and (ii) lim(n→∞) u_n = 0.

## 2. Mean Value Theorems & Expansions
- **Rolle's Theorem:** f continuous on [a,b], differentiable on (a,b), f(a)=f(b) ⇒ ∃ c ∈ (a,b) with f'(c)=0.
- **Lagrange's MVT:** ∃ c ∈ (a,b) such that \`f'(c) = [f(b) - f(a)] / (b - a)\`.
- **Taylor's Expansion:** \`f(a+h) = f(a) + h f'(a) + (h²/2!) f''(a) + ...\`. (Maclaurin when a = 0).

## 3. Partial Derivatives, Euler's Theorem & Jacobians
- **Euler's Theorem:** If u(x,y) is homogeneous of degree n, then \`x(∂u/∂x) + y(∂u/∂y) = n·u\`.
- **Corollary:** \`x²(∂²u/∂x²) + 2xy(∂²u/∂x∂y) + y²(∂²u/∂y²) = n(n-1)u\`.
- **Jacobian:** \`J(u,v / x,y) = det([[u_x, u_y], [v_x, v_y]])\`. Property: \`J · J' = 1\`.

## 4. Maxima & Minima of Two Variables
- Find stationary points where \`r_x = f_x = 0\` and \`f_y = 0\`.
- Compute \`r = f_{xx}\`, \`s = f_{xy}\`, \`t = f_{yy}\`, and \`Δ = r·t - s²\`:
  - **Δ > 0 and r < 0:** Local Maximum.
  - **Δ > 0 and r > 0:** Local Minimum.
  - **Δ < 0:** Saddle Point. **Δ = 0:** Further investigation needed.

## 5. Double & Triple Integrals
- **Change of Order of Integration:** Sketch the region R bounded by curves, switch limits from \`dy dx\` to \`dx dy\` (or vice versa) to simplify integration.`,
  },
  {
    title: 'Mathematics-III — Solved MAKAUT PYQs & Proofs',
    subjectCode: 'BSC 301',
    subjectName: 'Mathematics-III (Differential Calculus)',
    branch: 'CSE',
    semester: 3,
    category: 'MAKAUT_PYQ',
    fileKey: 'seed/cse-sem3-bsc301-pyq.html',
    content: `# BSC 301: Solved MAKAUT Previous Year Questions

## Q1. If u = sin⁻¹((x² + y²) / (x + y)), prove x(∂u/∂x) + y(∂u/∂y) = tan u. (10 Marks)
**Solution:**
- Let \`z = sin(u) = (x² + y²) / (x + y)\`.
- Notice \`z(tx, ty) = t¹ · z(x, y)\` ⇒ z is a homogeneous function of degree **n = 1**.
- By Euler's Theorem on z: \`x(∂z/∂x) + y(∂z/∂y) = 1 · z\`.
- Since \`∂z/∂x = cos(u) · ∂u/∂x\` and \`∂z/∂y = cos(u) · ∂u/∂y\`:
  \`cos(u) · [x(∂u/∂x) + y(∂u/∂y)] = sin(u)\` ⇒ **\`x(∂u/∂x) + y(∂u/∂y) = tan u\`**. Proved!

## Q2. Find the stationary points and extrema of f(x, y) = x³ + y³ - 3xy. (10 Marks)
**Solution:**
- \`f_x = 3x² - 3y = 0 ⇒ y = x²\`. \`f_y = 3y² - 3x = 0 ⇒ x⁴ - x = 0 ⇒ x = 0 or x = 1\`.
- Stationary points: **(0, 0)** and **(1, 1)**.
- \`r = 6x, s = -3, t = 6y\`.
- At **(0, 0)**: r=0, s=-3, t=0 ⇒ Δ = rt - s² = -9 < 0 ⇒ **Saddle Point**.
- At **(1, 1)**: r=6 > 0, s=-3, t=6 ⇒ Δ = 36 - 9 = 27 > 0 ⇒ **Local Minimum** with value \`f(1,1) = -1\`.

## Q3. Evaluate ∫₀¹ ∫_x¹ e^(y²) dy dx by changing order of integration. (10 Marks)
- Original region: \`0 ≤ x ≤ 1\` and \`x ≤ y ≤ 1\` (upper triangle above y = x).
- Reversing limits: \`0 ≤ y ≤ 1\` and \`0 ≤ x ≤ y\`.
- \`∫₀¹ (∫₀^y e^(y²) dx) dy = ∫₀¹ y · e^(y²) dy = [½ e^(y²)]₀¹ = (e - 1) / 2\`.`,
  },
  {
    title: 'Economics for Engineers (Humanities-II) — Complete Study Guide',
    subjectCode: 'HSMC 301',
    subjectName: 'Economics for Engineers (Humanities-II)',
    branch: 'CSE',
    semester: 3,
    category: 'LECTURE_NOTE',
    fileKey: 'seed/cse-sem3-hsmc301-notes.html',
    content: `# HSMC 301: Economics for Engineers — Complete Study Guide

## 1. Time Value of Money & Interest Formulas
- **Single Payment Compound Amount:** \`F = P(1 + i)^n\` | Present Worth: \`P = F / (1 + i)^n\`.
- **Uniform Series Compound Amount:** \`F = A [((1+i)^n - 1) / i]\`.
- **Capital Recovery Factor (A/P):** \`A = P [i(1+i)^n / ((1+i)^n - 1)]\`.
- **Effective Annual Interest Rate:** \`i_eff = (1 + r/m)^m - 1\`.

## 2. Break-Even Analysis & Margin of Safety
- **Fixed Cost (FC):** Rent, salaries, machinery depreciation (independent of output Q).
- **Variable Cost (VC):** Raw material, direct labor per unit (\`v · Q\`).
- **Break-Even Point (Units):** \`BEP_Q = FC / (SP - VC_per_unit)\` where \`(SP - VC)\` is Contribution Margin.
- **Break-Even Sales (₹):** \`BEP_Sales = FC / (P/V Ratio)\`.
- **Margin of Safety:** \`MOS = Actual Sales - BEP Sales\`.

## 3. Depreciation Accounting Methods
- **Straight-Line Method (SLM):** Annual Depreciation \`D = (P - S) / N\`.
- **Declining Balance Method:** \`D_t = d · BookValue_{t-1}\`.
- **Sum-of-Years'-Digits (SYD):** \`D_t = [(N - t + 1) / (N(N+1)/2)] × (P - S)\`.
- **Sinking Fund Method:** Annual deposit \`A = (P - S) × [i / ((1+i)^N - 1)]\`.

## 4. Capital Budgeting & Project Evaluation
- **Net Present Value (NPV):** \`NPV = Σ [CF_t / (1+i)^t] - Initial Investment\`. Accept if NPV > 0.
- **Internal Rate of Return (IRR):** Discount rate \`i*\` at which NPV = 0. Accept if IRR > MARR.
- **Payback Period:** Time required to recover initial investment.
- **Benefit-Cost Ratio (B/C):** \`PV(Benefits) / PV(Costs)\`. Accept if B/C > 1.`,
  },
  {
    title: 'Economics for Engineers — Solved MAKAUT Numericals & PYQs',
    subjectCode: 'HSMC 301',
    subjectName: 'Economics for Engineers (Humanities-II)',
    branch: 'CSE',
    semester: 3,
    category: 'MAKAUT_PYQ',
    fileKey: 'seed/cse-sem3-hsmc301-pyq.html',
    content: `# HSMC 301: Solved MAKAUT Numericals & Exam Questions

## Q1. A factory has Fixed Cost ₹2,00,000, Variable Cost ₹30/unit, Selling Price ₹50/unit. Find BEP (units), BEP (₹), and profit at 15,000 units. (10 Marks)
**Solution:**
- Contribution per unit = SP - VC = 50 - 30 = **₹20/unit**.
- **BEP (Units)** = FC / Contribution = 2,00,000 / 20 = **10,000 units**.
- **BEP (Sales ₹)** = 10,000 × 50 = **₹5,00,000**.
- **Profit at 15,000 units:** (15,000 × 20) - 2,00,000 = 3,00,000 - 2,00,000 = **₹1,00,000**.

## Q2. A CNC machine costs ₹5,00,000 with salvage value ₹50,000 after 5 years. Compute depreciation in Year 1 & Year 2 using SYD method. (10 Marks)
**Solution:**
- Depreciable base = P - S = 5,00,000 - 50,000 = **₹4,50,000**.
- Sum of years' digits = 5(5+1)/2 = **15**.
- **Year 1 Depreciation:** (5 / 15) × 4,50,000 = **₹1,50,000** (Book Value = ₹3,50,000).
- **Year 2 Depreciation:** (4 / 15) × 4,50,000 = **₹1,20,000** (Book Value = ₹2,30,000).

## Q3. Compare Machine A (Cost ₹1,00,000, annual inflow ₹40,000 for 4 yrs) at i = 10% using NPV. (10 Marks)
- PV Factor (P/A, 10%, 4) = \`[(1.1)⁴ - 1] / [0.1 × (1.1)⁴] = 3.1699\`.
- PV of Inflows = 40,000 × 3.1699 = **₹1,26,796**.
- **NPV** = 1,26,796 - 1,00,000 = **+₹26,796 > 0** ⇒ Machine A is economically viable!`,
  },

  // =========================================================================
  // 2. CSE SEM 3 — ALL 4 LAB MANUALS (COMPLETE EXECUTABLE CODE & VIVA Q&A)
  // =========================================================================
  {
    title: 'Data Structure & Algorithms Lab — Complete C Programs & Viva Manual',
    subjectCode: 'PCC-CS391',
    subjectName: 'Data Structure & Algorithms Lab',
    branch: 'CSE',
    semester: 3,
    category: 'LAB_MANUAL',
    fileKey: 'seed/cse-sem3-pcc-cs391-lab.html',
    content: `# PCC-CS391: Data Structure & Algorithms Lab Manual

## Experiment 1: Circular Queue Implementation in C
**Aim:** Implement Enqueue, Dequeue, and Display on a Circular Queue using arrays.
\`\`\`c
#include <stdio.h>
#define SIZE 5
int cq[SIZE], front = -1, rear = -1;

void enqueue(int val) {
    if ((rear + 1) % SIZE == front) { printf("Queue Overflow\\n"); return; }
    if (front == -1) front = 0;
    rear = (rear + 1) % SIZE;
    cq[rear] = val;
}

int dequeue() {
    if (front == -1) { printf("Queue Underflow\\n"); return -1; }
    int val = cq[front];
    if (front == rear) front = rear = -1;
    else front = (front + 1) % SIZE;
    return val;
}
\`\`\`

## Experiment 2: Binary Search Tree (Insert, Inorder, Delete)
\`\`\`c
struct Node { int key; struct Node *left, *right; };
struct Node* insert(struct Node* root, int k) {
    if (!root) {
        struct Node* n = malloc(sizeof(struct Node));
        n->key = k; n->left = n->right = NULL; return n;
    }
    if (k < root->key) root->left = insert(root->left, k);
    else if (k > root->key) root->right = insert(root->right, k);
    return root;
}
void inorder(struct Node* r) {
    if (!r) return;
    inorder(r->left); printf("%d ", r->key); inorder(r->right);
}
\`\`\`

## Experiment 3: QuickSort Partition & Recursion
\`\`\`c
int partition(int a[], int low, int high) {
    int pivot = a[high], i = low - 1, tmp;
    for (int j = low; j < high; j++) {
        if (a[j] <= pivot) { i++; tmp = a[i]; a[i] = a[j]; a[j] = tmp; }
    }
    tmp = a[i+1]; a[i+1] = a[high]; a[high] = tmp;
    return i + 1;
}
\`\`\`

## Top 5 Viva Questions
1. **Why Circular Queue?** Reuses freed slots at the front without shifting elements.
2. **Inorder of BST gives?** Sorted ascending sequence.
3. **Worst-case of QuickSort?** O(n²) on already sorted input with boundary pivot.
4. **Dangling pointer vs Memory leak?** Freeing without NULLing vs losing pointer before \`free()\`.
5. **Stack via 2 queues?** Push O(n) by rotating previous elements, Pop O(1).`,
  },
  {
    title: 'Computer Organisation Lab — Verilog HDL Modules & Truth Tables',
    subjectCode: 'PCC-CS392',
    subjectName: 'Computer Organisation Lab',
    branch: 'CSE',
    semester: 3,
    category: 'LAB_MANUAL',
    fileKey: 'seed/cse-sem3-pcc-cs392-lab.html',
    content: `# PCC-CS392: Computer Organisation Lab Manual (Verilog HDL)

## Experiment 1: 4-Bit Ripple Carry Adder
**Aim:** Design a 1-bit Full Adder and cascade 4 instances into a 4-bit Ripple Carry Adder.
\`\`\`verilog
module full_adder(input a, b, cin, output sum, cout);
  assign sum  = a ^ b ^ cin;
  assign cout = (a & b) | (b & cin) | (a & cin);
endmodule

module ripple_adder_4bit(input [3:0] A, B, input Cin, output [3:0] Sum, output Cout);
  wire c1, c2, c3;
  full_adder fa0(A[0], B[0], Cin, Sum[0], c1);
  full_adder fa1(A[1], B[1], c1,  Sum[1], c2);
  full_adder fa2(A[2], B[2], c2,  Sum[2], c3);
  full_adder fa3(A[3], B[3], c3,  Sum[3], Cout);
endmodule
\`\`\`

## Experiment 2: 4-Bit ALU (AND, OR, ADD, SUB)
\`\`\`verilog
module alu_4bit(input [3:0] A, B, input [1:0] op, output reg [3:0] Y, output reg Carry);
  always @(*) begin
    Carry = 0;
    case (op)
      2'b00: Y = A & B;
      2'b01: Y = A | B;
      2'b10: {Carry, Y} = A + B;
      2'b11: {Carry, Y} = A - B;
    endcase
  end
endmodule
\`\`\`

## Experiment 3: 4:1 Multiplexer & 4-Bit D-Register
- **4:1 MUX Select Table:** \`00 -> I0\`, \`01 -> I1\`, \`10 -> I2\`, \`11 -> I3\`.
- **D-Register:** Synchronous rising-edge \`always @(posedge clk)\` with active-high reset.

## Top 5 Viva Questions
1. **Ripple Carry vs Carry Lookahead Adder?** CLA eliminates O(n) carry propagation delay using Generate (G=AB) and Propagate (P=A⊕B).
2. **Blocking \`=\` vs Non-blocking \`<=\` in Verilog?** Blocking for combinational \`always @(*)\`; non-blocking for sequential \`always @(posedge clk)\`.
3. **Why 2's complement for subtraction?** Turns \`A - B\` into \`A + (~B + 1)\` using the same adder hardware.`,
  },
  {
    title: 'Analog & Digital Electronics Lab — IC Pinouts, Truth Tables & Circuits',
    subjectCode: 'ESC 391',
    subjectName: 'Analog and Digital Electronics Lab',
    branch: 'CSE',
    semester: 3,
    category: 'LAB_MANUAL',
    fileKey: 'seed/cse-sem3-esc391-lab.html',
    content: `# ESC 391: Analog & Digital Electronics Lab Manual

## Essential TTL IC Pinouts (14-Pin DIP, Pin 7 = GND, Pin 14 = +5V Vcc)
- **IC 7400:** Quad 2-Input NAND Gate
- **IC 7402:** Quad 2-Input NOR Gate
- **IC 7486:** Quad 2-Input XOR Gate
- **IC 7474:** Dual D-Type Positive-Edge Flip-Flop
- **IC 74151:** 8:1 Multiplexer (16-Pin DIP)
- **IC 741:** 8-Pin Op-Amp (Pin 2 = Inverting -, Pin 3 = Non-Inverting +, Pin 6 = Output, Pin 7 = +Vcc, Pin 4 = -Vee)

## Experiment 1: Realization of Basic Gates using NAND (IC 7400)
- **NOT Gate:** Short both inputs of NAND (\`Y = (A·A)' = A'\`).
- **AND Gate:** Invert NAND output using another NAND (\`Y = ((A·B)')' = A·B\`).
- **OR Gate:** Invert inputs A, B first, then NAND (\`Y = (A'·B')' = A + B\`).

## Experiment 2: Full Subtractor Truth Table
- **Difference:** \`D = A ⊕ B ⊕ Bin\`
- **Borrow:** \`Bout = A'B + B·Bin + A'·Bin\`

## Experiment 3: Op-Amp (IC 741) Inverting & Non-Inverting Amplifier
- Inverting (\`Rf = 10kΩ, Rin = 1kΩ\`): Gain = \`-10\`. Input 0.5Vpp sine ⇒ Output 5.0Vpp inverted by 180°.
- Non-Inverting (\`Rf = 9kΩ, R1 = 1kΩ\`): Gain = \`1 + 9/1 = +10\`. Output in-phase (0°).

## Top 5 Viva Questions
1. **Why are NAND & NOR universal gates?** Any Boolean function can be built using only NAND or only NOR.
2. **Slew Rate of IC 741?** ~0.5 V/μs (limits high-frequency large-signal output).
3. **Race-around prevention?** Master-Slave JK or edge-triggered D FF (IC 7474).`,
  },
  {
    title: 'IT Workshop (Python / SciLab / MATLAB) — Lab Experiments & Code',
    subjectCode: 'PCC-CS393',
    subjectName: 'IT Workshop (Sci Lab/MATLAB/Python/R)',
    branch: 'CSE',
    semester: 3,
    category: 'LAB_MANUAL',
    fileKey: 'seed/cse-sem3-pcc-cs393-lab.html',
    content: `# PCC-CS393: IT Workshop (Python & SciLab) Lab Manual

## Experiment 1: Matrix Operations & Eigenvalues (NumPy / SciLab)
\`\`\`python
import numpy as np

A = np.array([[4, 2], [1, 3]])
B = np.array([[1, 0], [2, 5]])
print("Product:\\n", A @ B)
vals, vecs = np.linalg.eig(A)
print("Eigenvalues:", vals)
\`\`\`

## Experiment 2: CSV File Parsing & Student Record OOP System
\`\`\`python
import csv

class Student:
    def __init__(self, roll, name, sgpa):
        self.roll = roll
        self.name = name
        self.sgpa = float(sgpa)

    def percentage(self):
        return round((self.sgpa - 0.75) * 10, 2)

with open("students.csv", newline="") as f:
    for row in csv.DictReader(f):
        s = Student(row["roll"], row["name"], row["sgpa"])
        print(f"{s.name}: {s.percentage()}%")
\`\`\`

## Experiment 3: Data Visualization with Matplotlib
\`\`\`python
import matplotlib.pyplot as plt
sems = [1, 2, 3]
sgpas = [8.2, 8.6, 9.1]
plt.plot(sems, sgpas, marker='o')
plt.title("MAKAUT Semester SGPA Trend")
plt.xlabel("Semester"); plt.ylabel("SGPA")
plt.grid(True); plt.show()
\`\`\`

## Top 5 Viva Questions
1. **List vs Tuple in Python?** Lists are mutable \`[]\`; tuples are immutable \`()\`.
2. **Why NumPy arrays over Python lists?** Contiguous C memory layout & vectorized SIMD operations (50× faster).
3. **What is \`__init__\`?** Constructor method called automatically on object instantiation.`,
  },

  // =========================================================================
  // 3. CORE SEM 3 NOTES & LABS FOR REMAINING 7 SETGOI BRANCHES
  // =========================================================================
  // CSE-AIML
  {
    title: 'Linear Algebra for AI & ML — Vector Spaces, SVD & Eigenvalues',
    subjectCode: 'BSC AIML301',
    subjectName: 'Linear Algebra',
    branch: 'CSE-AIML',
    semester: 3,
    category: 'LECTURE_NOTE',
    fileKey: 'seed/aiml-sem3-bsc-aiml301-notes.html',
    content: `# BSC AIML301: Linear Algebra — Complete Study Guide\n\n## Vector Spaces, Rank & Basis\n- A set of vectors V forms a vector space if closed under vector addition and scalar multiplication.\n- Rank-Nullity Theorem: \`rank(A) + nullity(A) = n\` (number of columns).\n- Orthogonal matrices satisfy \`Q^T Q = I\` and preserve Euclidean norms.\n\n## Eigenvalues, Eigenvectors & SVD\n- Characteristic equation: \`det(A - λI) = 0\`.\n- Singular Value Decomposition (SVD): \`A = U Σ V^T\` factorizes any m×n matrix, powering PCA dimensionality reduction and recommender systems.\n- Positive Definite Matrices have all eigenvalues > 0 (critical for convex gradient descent).`,
  },
  {
    title: 'Data Structure & Algorithms — CSE-AIML Sem 3 Complete Notes',
    subjectCode: 'PCC-CS301',
    subjectName: 'Data Structure & Algorithms',
    branch: 'CSE-AIML',
    semester: 3,
    category: 'LECTURE_NOTE',
    fileKey: 'seed/aiml-sem3-pcc-cs301-notes.html',
    content: `# PCC-CS301: Data Structure & Algorithms (CSE-AIML)\n\n## Complexity, Trees & Graphs\n- Asymptotic Bounds: Big-O, Omega, Theta.\n- Stacks (Infix-Postfix), Circular Queues, Priority Queues (Min/Max Heap).\n- AVL Rotations (LL, RR, LR, RL), BST Traversals, BFS/DFS, Dijkstra Shortest Path, and Hash Collision Probing.`,
  },
  {
    title: 'IT Workshop (Python I) — CSE-AIML Lab Manual & Programs',
    subjectCode: 'PCC-CS393',
    subjectName: 'IT Workshop (Python I)',
    branch: 'CSE-AIML',
    semester: 3,
    category: 'LAB_MANUAL',
    fileKey: 'seed/aiml-sem3-pcc-cs393-lab.html',
    content: `# PCC-CS393: IT Workshop (Python I) Lab Manual\n\n## Python Data Structures, NumPy & File I/O\n\`\`\`python\nimport numpy as np\nX = np.array([[1, 2], [3, 4]])\nprint("Determinant:", np.linalg.det(X))\nprint("Inverse:\\n", np.linalg.inv(X))\n\`\`\`\n- Covers List Comprehensions, Dictionaries, Exception Handling, and Matrix Calculus for ML.`,
  },

  // CSE-DS
  {
    title: 'Introduction to Data Science — Wrangling, EDA & Visualization Notes',
    subjectCode: 'PCC-DS301',
    subjectName: 'Introduction to Data Science',
    branch: 'CSE-DS',
    semester: 3,
    category: 'LECTURE_NOTE',
    fileKey: 'seed/ds-sem3-pcc-ds301-notes.html',
    content: `# PCC-DS301: Introduction to Data Science — Study Guide\n\n## Data Science Lifecycle & EDA\n- Stages: Problem Formulation → Data Collection → Cleaning/Imputation → Exploratory Data Analysis (EDA) → Modeling → Deployment.\n- Handling Missing Values: Mean/Median imputation, KNN imputation, dropping high-null columns.\n- Outlier Detection: IQR method (\`Q1 - 1.5·IQR\`, \`Q3 + 1.5·IQR\`) and Z-score (\`|z| > 3\`).\n- Feature Scaling: Min-Max Normalization vs Standardization (Z-score).`,
  },
  {
    title: 'Data Structure & Algorithms — CSE-DS Sem 3 Complete Notes',
    subjectCode: 'PCC-CS301',
    subjectName: 'Data Structure & Algorithms',
    branch: 'CSE-DS',
    semester: 3,
    category: 'LECTURE_NOTE',
    fileKey: 'seed/ds-sem3-pcc-cs301-notes.html',
    content: `# PCC-CS301: Data Structure & Algorithms (CSE-DS)\n\n## Core Structures & Algorithms\n- Arrays, Linked Lists, Stacks, Circular Queues, Heaps, AVL Trees, B+ Trees, Hashing, and Graph Algorithms (BFS, DFS, Dijkstra, Kruskal).`,
  },
  {
    title: 'Data Science Lab using Python — Pandas & NumPy Lab Manual',
    subjectCode: 'PCC-DS391',
    subjectName: 'Data Science Lab using Python',
    branch: 'CSE-DS',
    semester: 3,
    category: 'LAB_MANUAL',
    fileKey: 'seed/ds-sem3-pcc-ds391-lab.html',
    content: `# PCC-DS391: Data Science Lab using Python\n\n## Pandas DataFrame EDA & Cleaning\n\`\`\`python\nimport pandas as pd\ndf = pd.read_csv("makaut_results.csv")\ndf["sgpa"].fillna(df["sgpa"].median(), inplace=True)\nprint(df.describe())\n\`\`\``,
  },

  // ECE
  {
    title: 'Electronic Devices (EC301) — Semiconductor Physics, PN Junction & MOSFET Notes',
    subjectCode: 'EC301',
    subjectName: 'Electronic Devices',
    branch: 'ECE',
    semester: 3,
    category: 'LECTURE_NOTE',
    fileKey: 'seed/ece-sem3-ec301-notes.html',
    content: `# EC301: Electronic Devices — Complete Study Guide\n\n## Semiconductor Carriers & PN Junction\n- Mass Action Law: \`n · p = n_i²\`.\n- Einstein Relation: \`D_n / μ_n = D_p / μ_p = V_T = kT/q ≈ 26 mV\` at 300 K.\n- Diode Current Equation: \`I = I_0 (e^(V / η V_T) - 1)\`.\n- BJT Modes: Active (EB forward, CB reverse), Saturation, Cutoff.\n- MOSFET Drain Current (Saturation): \`I_D = ½ μ_n C_ox (W/L) (V_GS - V_TH)²\`.`,
  },
  {
    title: 'Digital System Design (EC302) — K-Maps, FSMs & VHDL Notes',
    subjectCode: 'EC302',
    subjectName: 'Digital System Design',
    branch: 'ECE',
    semester: 3,
    category: 'LECTURE_NOTE',
    fileKey: 'seed/ece-sem3-ec302-notes.html',
    content: `# EC302: Digital System Design — Study Guide\n\n## Combinational, Sequential & FSM Design\n- Quine-McCluskey & 4/5-Variable K-Map minimization.\n- Mealy vs Moore Finite State Machines (Mealy depends on state + input; Moore depends on state only).\n- Setup time (t_su), Hold time (t_h), and Metastability avoidance.`,
  },
  {
    title: 'Electronic Devices Lab (EC391) — Diode, BJT & MOSFET Characteristics Manual',
    subjectCode: 'EC391',
    subjectName: 'Electronic Devices Lab',
    branch: 'ECE',
    semester: 3,
    category: 'LAB_MANUAL',
    fileKey: 'seed/ece-sem3-ec391-lab.html',
    content: `# EC391: Electronic Devices Lab Manual\n\n## Experiments\n1. Forward & Reverse V-I Characteristics of PN Junction & Zener Diode.\n2. BJT Common Emitter (CE) Input/Output Characteristics & h-parameters.\n3. MOSFET Transfer & Drain Characteristics (Determine V_TH and g_m).`,
  },

  // EE
  {
    title: 'Electric Circuit Theory (PC-EE 301) — KVL/KCL, Laplace & Two-Port Networks',
    subjectCode: 'PC-EE 301',
    subjectName: 'Electric Circuit Theory',
    branch: 'EE',
    semester: 3,
    category: 'LECTURE_NOTE',
    fileKey: 'seed/ee-sem3-pc-ee301-notes.html',
    content: `# PC-EE 301: Electric Circuit Theory — Study Guide\n\n## Network Theorems & Transient Analysis\n- Thevenin, Norton, Superposition, and Maximum Power Transfer (\`R_L = R_th\`).\n- RL & RC First-Order Transients: \`i(t) = i(∞) + [i(0⁺) - i(∞)] e^(-t/τ)\`.\n- Two-Port Parameters: Z (Open-circuit), Y (Short-circuit), ABCD (Transmission), and h-parameters.`,
  },
  {
    title: 'Analog Electronics (PC-EE 302) — BJT Amplifiers, Oscillators & Op-Amp Notes',
    subjectCode: 'PC-EE 302',
    subjectName: 'Analog Electronics',
    branch: 'EE',
    semester: 3,
    category: 'LECTURE_NOTE',
    fileKey: 'seed/ee-sem3-pc-ee302-notes.html',
    content: `# PC-EE 302: Analog Electronics — Study Guide\n\n## Amplifiers & Op-Amp Circuits\n- CE, CB, CC BJT configurations, hybrid-pi small-signal model.\n- Barkhausen criterion for Wein Bridge and RC Phase-Shift Oscillators.\n- IC 741 Inverting, Non-Inverting, Schmitt Trigger & Active Filters.`,
  },
  {
    title: 'Electric Circuit Theory Lab (PC-EE 391) — Theorems & Resonance Manual',
    subjectCode: 'PC-EE 391',
    subjectName: 'Electric Circuit Theory Laboratory',
    branch: 'EE',
    semester: 3,
    category: 'LAB_MANUAL',
    fileKey: 'seed/ee-sem3-pc-ee391-lab.html',
    content: `# PC-EE 391: Electric Circuit Theory Lab Manual\n\n## Experiments\n1. Verification of Thevenin's & Norton's Theorems.\n2. Series & Parallel RLC Resonance Frequency (\`f₀ = 1 / (2π√LC)\`) & Bandwidth.\n3. Determination of Z and Y parameters of a Two-Port Network.`,
  },

  // EEE
  {
    title: 'Electric Circuit Theory (PC-EEE-301) — Network Theorems & AC Transients',
    subjectCode: 'PC-EEE-301',
    subjectName: 'Electric Circuit Theory',
    branch: 'EEE',
    semester: 3,
    category: 'LECTURE_NOTE',
    fileKey: 'seed/eee-sem3-pc-eee301-notes.html',
    content: `# PC-EEE-301: Electric Circuit Theory — Study Guide\n\n## Mesh, Nodal, Laplace & Two-Port Networks\n- Thevenin/Norton equivalents, Superposition, Reciprocity, and Millman's Theorem.\n- Laplace-domain impedance: \`Z_L(s) = sL\`, \`Z_C(s) = 1/(sC)\`.\n- Three-Phase Balanced Star/Delta power: \`P = √3 V_L I_L cos φ\`.`,
  },
  {
    title: 'Analog Electronics (PC-EEE-302) — BJT Biasing, Feedback & Op-Amp Notes',
    subjectCode: 'PC-EEE-302',
    subjectName: 'Analog Electronics',
    branch: 'EEE',
    semester: 3,
    category: 'LECTURE_NOTE',
    fileKey: 'seed/eee-sem3-pc-eee302-notes.html',
    content: `# PC-EEE-302: Analog Electronics — Study Guide\n\n## Feedback Topologies & Oscillators\n- Voltage-Series, Voltage-Shunt, Current-Series, Current-Shunt feedback.\n- Class A, B, AB Power Amplifiers and thermal runaway prevention.`,
  },
  {
    title: 'Electric Circuit Theory Lab (PC-EEE-391) — Lab Manual & Viva Guide',
    subjectCode: 'PC-EEE-391',
    subjectName: 'Electric Circuit Theory Laboratory',
    branch: 'EEE',
    semester: 3,
    category: 'LAB_MANUAL',
    fileKey: 'seed/eee-sem3-pc-eee391-lab.html',
    content: `# PC-EEE-391: Electric Circuit Theory Lab Manual\n\n## Experiments\n1. Verification of Superposition & Maximum Power Transfer Theorem.\n2. Transient response of RC & RL circuits on CRO/DSO.\n3. Series RLC Resonance & Quality Factor Q measurement.`,
  },

  // ME
  {
    title: 'Thermodynamics (PC-ME301) — Laws, Entropy, Carnot & Rankine Cycles',
    subjectCode: 'PC-ME301',
    subjectName: 'Thermodynamics',
    branch: 'ME',
    semester: 3,
    category: 'LECTURE_NOTE',
    fileKey: 'seed/me-sem3-pc-me301-notes.html',
    content: `# PC-ME301: Thermodynamics — Complete Study Guide\n\n## First & Second Laws of Thermodynamics\n- First Law (SFEE): \`h₁ + V₁²/2 + gz₁ + q = h₂ + V₂²/2 + gz₂ + w\`.\n- Carnot Efficiency: \`η = 1 - T_L / T_H\`.\n- Clausius Inequality: \`∮ (δQ / T) ≤ 0\`; Entropy \`dS = (δQ_rev / T)\`.\n- Rankine, Otto (\`η = 1 - 1/r^(γ-1)\`), and Diesel air-standard cycles.`,
  },
  {
    title: 'Engineering Mechanics (ES-ME301) — Statics, Friction, Trusses & Dynamics',
    subjectCode: 'ES-ME301',
    subjectName: 'Engineering Mechanics',
    branch: 'ME',
    semester: 3,
    category: 'LECTURE_NOTE',
    fileKey: 'seed/me-sem3-es-me301-notes.html',
    content: `# ES-ME301: Engineering Mechanics — Study Guide\n\n## Equilibrium, Moment of Inertia & Kinetics\n- Lami's Theorem, Method of Joints & Sections for Trusses.\n- Parallel Axis Theorem: \`I = I_G + A d²\`.\n- D'Alembert's Principle & Work-Energy Theorem.`,
  },
  {
    title: 'Practice of Manufacturing Processes Lab (PC-ME391) — Workshop Manual',
    subjectCode: 'PC-ME391',
    subjectName: 'Practice of Manufacturing Processes',
    branch: 'ME',
    semester: 3,
    category: 'LAB_MANUAL',
    fileKey: 'seed/me-sem3-pc-me391-lab.html',
    content: `# PC-ME391: Practice of Manufacturing Processes Lab Manual\n\n## Shop Jobs & Viva\n1. Lathe Turning, Facing & Taper Turning Job.\n2. Sand Casting Mould Preparation & Pattern Making.\n3. Arc & Gas Welding Butt Joint Fabrication.`,
  },

  // CE
  {
    title: 'Engineering Mechanics (CE(ES)301) — Trusses, Shear Force & Bending Moment',
    subjectCode: 'CE(ES)301',
    subjectName: 'Engineering Mechanics',
    branch: 'CE',
    semester: 3,
    category: 'LECTURE_NOTE',
    fileKey: 'seed/ce-sem3-ce-es301-notes.html',
    content: `# CE(ES)301: Engineering Mechanics — Complete Study Guide\n\n## Force Systems, Centroid & Moment of Inertia\n- Free-Body Diagrams, Coulomb Dry Friction (\`F_max = μ_s N\`), Belt Friction (\`T₁/T₂ = e^(μβ)\`).\n- Centroids of composite sections & Parallel/Perpendicular Axis Theorems.\n- Virtual Work & Kinetics of Rigid Bodies.`,
  },
  {
    title: 'Mathematics-III (CE(BS)301-M) — Transform & Discrete Mathematics Notes',
    subjectCode: 'CE(BS)301-M',
    subjectName: 'Mathematics-III (Transform & Discrete Mathematics)',
    branch: 'CE',
    semester: 3,
    category: 'LECTURE_NOTE',
    fileKey: 'seed/ce-sem3-ce-bs301m-notes.html',
    content: `# CE(BS)301-M: Mathematics-III — Study Guide\n\n## Laplace Transforms, Fourier Series & Propositional Logic\n- Laplace transforms of derivatives & ODEs.\n- Fourier Series expansion on [-π, π] and Half-Range Sine/Cosine series.\n- Propositional Logic, Equivalence, and Graph Theory fundamentals.`,
  },
  {
    title: 'Computer-aided Civil Engineering Drawing Lab (CE(ES)392) — AutoCAD Manual',
    subjectCode: 'CE(ES)392',
    subjectName: 'Computer-aided Civil Engineering Drawing',
    branch: 'CE',
    semester: 3,
    category: 'LAB_MANUAL',
    fileKey: 'seed/ce-sem3-ce-es392-lab.html',
    content: `# CE(ES)392: Computer-aided Civil Engineering Drawing Lab Manual\n\n## AutoCAD Drafting Experiments\n1. Plan, Elevation & Section of a Single-Storey Residential Building.\n2. Detailing of Isolated RCC Footing & Column Reinforcement.\n3. Staircase & Roof Truss Drafting using Layers, Blocks & Dimensioning.`,
  },
];

let reseeded = false;

export async function ensureStarterNotesSeeded(): Promise<void> {
  if (seedingPromise) return seedingPromise;

  seedingPromise = (async () => {
    try {
      const count = await prisma.note.count();
      if (count > 0 && reseeded) return;
      if (count >= 25) return;

      const facultyUser = await prisma.user.upsert({
        where: { email: 'hod.cse@setgoi.ac.in' },
        update: {},
        create: {
          clerkId: 'seed_faculty_setgoi_cse',
          email: 'hod.cse@setgoi.ac.in',
          fullName: 'Prof. Subhash Mukherjee (SETGOI Faculty)',
          role: 'FACULTY',
          degree: 'B.Tech',
          branch: 'CSE',
          semester: 3,
          onboardingCompleted: true,
        },
      });

      await prisma.note.createMany({
        data: RICH_SEM3_NOTES.map((n) => ({
          title: n.title,
          subjectCode: n.subjectCode,
          subjectName: n.subjectName,
          branch: n.branch,
          semester: n.semester,
          category: n.category,
          content: n.content,
          fileUrl: `/notes?read=${encodeURIComponent(n.subjectCode)}`,
          fileKey: n.fileKey,
          fileSize: Buffer.byteLength(n.content, 'utf8') * 120,
          verified: true,
          uploaderId: facultyUser.id,
        })),
        skipDuplicates: true,
      });
      reseeded = true;
    } catch (err) {
      console.warn('[SeedNotes] Starter notes seed warning:', err);
    } finally {
      seedingPromise = null;
    }
  })();

  return seedingPromise;
}
