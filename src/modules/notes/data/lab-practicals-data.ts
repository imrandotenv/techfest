import { BranchCode } from '../types';

export interface VivaQuestionPair {
  question: string;
  answer: string;
}

export interface LabPracticalItem {
  id: string;
  courseCode: string;
  title: string;
  departmentCode: BranchCode;
  semester: number;
  credits: number;
  labLocation: string;
  manualUrl: string;
  manualFileFormat?: 'PDF' | 'Repo' | 'Doc';
  vivaQuestions: VivaQuestionPair[];
}

export const LAB_PRACTICALS: LabPracticalItem[] = [
  // ==========================================
  // CSE - COMPUTER SCIENCE & ENGINEERING
  // ==========================================
  {
    id: 'lab-cse-301',
    courseCode: 'PCC-CS391',
    title: 'Data Structures & Algorithms Laboratory',
    departmentCode: 'CSE',
    semester: 3,
    credits: 2,
    labLocation: 'Computing Lab 304, Academic Core Block',
    manualUrl: 'https://github.com/imrandotenv/techfest/blob/main/docs/lab-manuals/PCC-CS391-DSA-Lab-Manual.md',
    manualFileFormat: 'PDF',
    vivaQuestions: [
      {
        question: 'Why does an Array offer O(1) random access while a Singly Linked List requires O(n)?',
        answer: 'Arrays allocate contiguous physical memory blocks where the memory address is calculated instantly using Base Address + (Index × Size). Linked lists store nodes in arbitrary heap locations with each node referencing the next via pointer traversal.',
      },
      {
        question: 'What is the minimum number of Queues required to implement a FIFO Stack?',
        answer: 'Two queues are required. In push-friendly design, enqueue to Q1. On pop, dequeue all elements except the last from Q1 to Q2, then return the remaining element.',
      },
      {
        question: 'What is the primary difference between Linear Probing and Quadratic Probing in Open Addressing hash tables?',
        answer: 'Linear probing searches indices with step size i (h(k) + i) % m, which causes primary clustering. Quadratic probing steps quadratically (h(k) + c1*i + c2*i²) % m, spreading collided keys across the table.',
      },
      {
        question: 'Why can comparison-based sorting algorithms not beat O(n log n) in the worst case?',
        answer: 'Any comparison sort can be modeled as a decision tree with n! possible permutations as leaves. A binary tree with n! leaves must have a minimum depth of log2(n!) = O(n log n) by Stirling approximation.',
      },
      {
        question: 'How do you detect a cycle in a linked list in O(n) time and O(1) auxiliary memory?',
        answer: 'Use Floyd’s Cycle Detection (Tortoise and Hare algorithm): advance a slow pointer by 1 node and a fast pointer by 2 nodes. If they ever point to the identical node, a cycle exists.',
      },
    ],
  },
  {
    id: 'lab-cse-302',
    courseCode: 'PCC-CS392',
    title: 'Computer Organization & Architecture Laboratory',
    departmentCode: 'CSE',
    semester: 3,
    credits: 2,
    labLocation: 'Digital Hardware Lab 308, Academic Core Block',
    manualUrl: 'https://github.com/imrandotenv/techfest/blob/main/docs/lab-manuals/PCC-CS392-COA-Lab-Manual.md',
    manualFileFormat: 'PDF',
    vivaQuestions: [
      {
        question: 'What is the difference between a Ripple Carry Adder and a Carry Lookahead Adder?',
        answer: 'Ripple carry adders wait for carry propagation sequentially through each full adder stage (O(n) delay). Carry lookahead adders compute carries in parallel using Generate (G=A·B) and Propagate (P=A⊕B) logic in O(log n) gate delay.',
      },
      {
        question: 'Explain the 3 types of pipeline hazards in a 5-stage MIPS processor.',
        answer: 'Structural hazards occur when hardware resources conflict. Data hazards occur when an instruction depends on results of a prior in-flight instruction (RAW, WAR, WAW). Control hazards arise from branch and jump decisions.',
      },
      {
        question: 'What is the distinction between Write-Through and Write-Back cache policies?',
        answer: 'Write-Through updates both cache and main memory simultaneously on every write. Write-Back updates only cache and sets a Dirty Bit, deferring main memory write until the cache line is evicted.',
      },
      {
        question: 'Why is Booth’s Multiplication Algorithm efficient for 2’s complement negative numbers?',
        answer: 'Booth’s algorithm treats strings of consecutive 1s as a single subtraction followed by an addition (2^(k+1) - 2^m), reducing the number of partial product additions without manual sign extension.',
      },
      {
        question: 'What is the purpose of the Program Counter (PC) and Memory Address Register (MAR)?',
        answer: 'The PC holds the memory address of the next instruction to fetch. During fetch, PC contents are transferred into the MAR, which drives the address bus to retrieve the instruction byte.',
      },
    ],
  },
  {
    id: 'lab-cse-401',
    courseCode: 'PCC-CS492',
    title: 'Operating Systems Laboratory',
    departmentCode: 'CSE',
    semester: 4,
    credits: 2,
    labLocation: 'Systems & Networking Lab 402, Academic Core Block',
    manualUrl: 'https://github.com/imrandotenv/techfest/blob/main/docs/lab-manuals/PCC-CS492-OS-Lab-Manual.md',
    manualFileFormat: 'PDF',
    vivaQuestions: [
      {
        question: 'What happens in memory during a fork() system call in Linux?',
        answer: 'fork() creates an exact duplicate child process with identical registers and page tables. Modern kernels use Copy-On-Write (COW), marking pages read-only so physical memory is duplicated only when either process writes.',
      },
      {
        question: 'What are the 4 Coffman conditions for a deadlock to exist?',
        answer: '1. Mutual Exclusion (non-shareable resources), 2. Hold and Wait, 3. No Preemption (resources cannot be forcibly confiscated), and 4. Circular Wait (closed loop chain of processes waiting for each other).',
      },
      {
        question: 'What is the difference between a Binary Semaphore and a Mutex Lock?',
        answer: 'A Mutex has ownership semantics—only the thread that locked it may unlock it. A Semaphore is a signaling mechanism with no ownership; any thread or interrupt service routine can increment (signal) it.',
      },
      {
        question: 'Why does Belady’s Anomaly occur in FIFO page replacement?',
        answer: 'FIFO does not belong to the stack algorithm family. Increasing the number of frame allocations can paradoxically cause more page faults because FIFO evicts pages purely by arrival order, not recency or frequency.',
      },
      {
        question: 'What is the role of the translation lookaside buffer (TLB)?',
        answer: 'The TLB is an on-chip associative cache that stores recent virtual-to-physical page frame translations, avoiding two memory accesses per virtual address lookup.',
      },
    ],
  },
  {
    id: 'lab-cse-501',
    courseCode: 'PCC-CS591',
    title: 'Database Management Systems Laboratory',
    departmentCode: 'CSE',
    semester: 5,
    credits: 2,
    labLocation: 'Database Systems Lab 501, Academic Core Block',
    manualUrl: 'https://github.com/imrandotenv/techfest/blob/main/docs/lab-manuals/PCC-CS591-DBMS-Lab-Manual.md',
    manualFileFormat: 'PDF',
    vivaQuestions: [
      {
        question: 'What is the fundamental difference between B-Tree and B+ Tree in database storage engines?',
        answer: 'In a B-Tree, keys and record pointers are stored in both internal and leaf nodes. In a B+ Tree, internal nodes store only routing keys, while all actual data pointers reside in leaf nodes linked sequentially for O(log n + k) range queries.',
      },
      {
        question: 'Explain the difference between 3NF and Boyce-Codd Normal Form (BCNF).',
        answer: 'Both require 2NF and zero transitive functional dependencies. For every functional dependency X → Y in BCNF, X must strictly be a Super Key. 3NF relaxes this by allowing Y to be a Prime Attribute even if X is not a super key.',
      },
      {
        question: 'What does the ACID property "Isolation" guarantee against Dirty Reads?',
        answer: 'Dirty reads occur when a transaction reads uncommitted modifications of another concurrent transaction. Isolation levels like "Read Committed" and "Repeatable Read" enforce shared locks or MVCC snapshots to prevent this.',
      },
      {
        question: 'What is the difference between a Clustered Index and a Non-Clustered Index?',
        answer: 'A Clustered Index physically sorts table rows on disk in matching key order (hence only one per table). A Non-Clustered Index is a separate structure containing index keys and row pointers (RID) pointing to the heap or clustered index.',
      },
      {
        question: 'Explain the Write-Ahead Logging (WAL) protocol.',
        answer: 'WAL mandates that any change log record must be flushed to non-volatile disk before the corresponding dirty data page is written to disk. This ensures Atomicity and Durability during unexpected system crashes.',
      },
    ],
  },

  // ==========================================
  // ECE - ELECTRONICS & COMMUNICATION
  // ==========================================
  {
    id: 'lab-ece-301',
    courseCode: 'ESC391',
    title: 'Analog & Digital Electronics Laboratory',
    departmentCode: 'ECE',
    semester: 3,
    credits: 2,
    labLocation: 'Analog Circuit Lab 202, ECE Wing',
    manualUrl: 'https://github.com/imrandotenv/techfest/blob/main/docs/lab-manuals/ESC391-ADE-Lab-Manual.md',
    manualFileFormat: 'PDF',
    vivaQuestions: [
      {
        question: 'What is the Barkhausen criterion for sustained oscillations?',
        answer: '1. The magnitude of the loop gain |Aβ| must equal exactly 1. 2. The total phase shift around the feedback loop must be 0° or an integral multiple of 360° (positive feedback).',
      },
      {
        question: 'Why does a Common Emitter (CE) BJT amplifier introduce a 180° phase inversion?',
        answer: 'An increase in base voltage increases base and collector currents (Ic). Because Vce = Vcc - Ic·Rc, the higher voltage drop across Rc pulls the collector voltage downward, producing an inverted output waveform.',
      },
      {
        question: 'What is the purpose of the virtual ground in an Op-Amp inverting amplifier?',
        answer: 'Due to near-infinite open-loop gain (A_ol ≈ 10⁵) and negative feedback, the differential input voltage (V+ - V-) must equal 0V. Since non-inverting terminal is grounded (0V), the inverting terminal is held at virtual ground potential.',
      },
      {
        question: 'Explain setup time (t_setup) and hold time (t_hold) of a flip-flop.',
        answer: 'Setup time is the minimum time data input must remain stable before the clock transition edge. Hold time is the minimum duration data must remain stable after the clock transition edge to prevent metastability.',
      },
      {
        question: 'How does a Master-Slave J-K flip-flop eliminate the race-around condition?',
        answer: 'The master flip-flop triggers on the active clock pulse while the slave is disabled. When the clock inverts, the master isolates its inputs and transfers state to the slave, preventing multiple toggling in one clock cycle.',
      },
    ],
  },
  {
    id: 'lab-ece-501',
    courseCode: 'PCC-EC592',
    title: 'Microprocessor & Microcontroller Laboratory',
    departmentCode: 'ECE',
    semester: 5,
    credits: 2,
    labLocation: 'Embedded Systems Lab 301, ECE Wing',
    manualUrl: 'https://github.com/imrandotenv/techfest/blob/main/docs/lab-manuals/PCC-EC592-Microprocessor-Lab-Manual.md',
    manualFileFormat: 'PDF',
    vivaQuestions: [
      {
        question: 'What is the function of the ALE (Address Latch Enable) pin in Intel 8085?',
        answer: '8085 multiplexes the lower 8-bit address and data lines (AD0–AD7). ALE is pulsed high during machine cycle T1 to signal an external latch (IC 74LS373) to latch and hold the lower address byte.',
      },
      {
        question: 'What is the difference between CALL/RET instructions and PUSH/POP in 8085?',
        answer: 'CALL automatically pushes the 16-bit Program Counter (PC) address onto the stack and branches to a subroutine; RET pops it back into PC. PUSH and POP manually save and restore general-purpose register pairs.',
      },
      {
        question: 'What are the 5 hardware interrupts in 8085 and their priority order?',
        answer: '1. TRAP (Non-maskable, vectored 24H), 2. RST 7.5 (3CH), 3. RST 6.5 (34H), 4. RST 5.5 (2CH), and 5. INTR (Non-vectored, lowest priority).',
      },
      {
        question: 'Explain the difference between Harvard architecture in 8051 and Von Neumann architecture.',
        answer: 'The 8051 microcontroller separates program memory (ROM) and data memory (RAM) with distinct address and control buses (EA, PSEN vs RD, WR), enabling concurrent instruction fetch and data read.',
      },
      {
        question: 'What is the purpose of the Program Status Word (PSW) register in 8051?',
        answer: 'PSW holds condition flags: Carry (CY), Auxiliary Carry (AC), Register Bank Select bits (RS1, RS0), Overflow (OV), and Parity (P) flags, reflecting arithmetic/logic ALU outcomes.',
      },
    ],
  },

  // ==========================================
  // EE - ELECTRICAL ENGINEERING
  // ==========================================
  {
    id: 'lab-ee-301',
    courseCode: 'PC-EE391',
    title: 'Electric Circuit Theory Laboratory',
    departmentCode: 'EE',
    semester: 3,
    credits: 2,
    labLocation: 'Circuit Theory Lab 105, Electrical Block',
    manualUrl: 'https://github.com/imrandotenv/techfest/blob/main/docs/lab-manuals/PC-EE391-Circuit-Theory-Lab-Manual.md',
    manualFileFormat: 'PDF',
    vivaQuestions: [
      {
        question: 'What are the conditions for the Maximum Power Transfer Theorem in AC circuits?',
        answer: 'Maximum active power is transferred from source to load when the load impedance is equal to the complex conjugate of the Thevenin source impedance (Z_L = Z_th*), matching resistance and canceling reactance.',
      },
      {
        question: 'What is the physical significance of resonance in a series RLC circuit?',
        answer: 'At resonance frequency (f0 = 1 / (2π√LC)), inductive reactance equals capacitive reactance (X_L = X_C). Circuit impedance is purely resistive and minimal (Z = R), producing maximum current in phase with voltage.',
      },
      {
        question: 'Why cannot the Superposition Theorem be applied to power calculations directly?',
        answer: 'Superposition applies strictly to linear systems (V = I·R). Electrical power is a non-linear quadratic function of current/voltage (P = I²R = V²/R), so total power is not the algebraic sum of individual powers.',
      },
      {
        question: 'What is the difference between active power, reactive power, and apparent power?',
        answer: 'Active power (P = VI cos θ in Watts) does real thermodynamic work. Reactive power (Q = VI sin θ in VAR) sustains alternating electromagnetic fields. Apparent power (S = VI in VA) is the vector hypotenuse.',
      },
      {
        question: 'How do you determine the Thevenin equivalent resistance (R_th) when dependent sources exist?',
        answer: 'Deactivate all independent sources (short voltage, open current). Connect an external test source (V_test) at load terminals and calculate R_th = V_test / I_test including dependent source contributions.',
      },
    ],
  },
  {
    id: 'lab-ee-401',
    courseCode: 'PC-EE491',
    title: 'Electrical Machines-I Laboratory',
    departmentCode: 'EE',
    semester: 4,
    credits: 2,
    labLocation: 'Heavy Electrical Machines Bay 101, Electrical Block',
    manualUrl: 'https://github.com/imrandotenv/techfest/blob/main/docs/lab-manuals/PC-EE491-Machines-I-Lab-Manual.md',
    manualFileFormat: 'PDF',
    vivaQuestions: [
      {
        question: 'Why is a DC series motor never started under no-load condition?',
        answer: 'In a series motor, field flux is proportional to armature current (Φ ∝ Ia). At no-load, Ia is negligible, causing flux Φ → 0. Since speed N ∝ Eb / Φ, the motor accelerates dangerously to destructive speeds.',
      },
      {
        question: 'Why are Open Circuit and Short Circuit tests conducted on transformers?',
        answer: 'The Open Circuit (OC) test measures core iron losses (hysteresis and eddy current) and shunt parameters at rated voltage. The Short Circuit (SC) test measures copper winding losses and equivalent impedance at rated current.',
      },
      {
        question: 'What is the condition for maximum efficiency in an electrical transformer?',
        answer: 'Maximum efficiency occurs at the load where variable copper losses (I²·R_eq) equal constant core iron losses (W_cu = W_i).',
      },
      {
        question: 'What is the function of the Commutator in a DC generator?',
        answer: 'The commutator acts as a mechanical rectifier, converting alternating electromotive force (AC) induced in rotating armature coils into unidirectional direct current (DC) across external brushes.',
      },
      {
        question: 'What is the difference between Lap Winding and Wave Winding?',
        answer: 'In Lap winding, number of parallel paths equals number of poles (A = P), ideal for high-current low-voltage machines. In Wave winding, parallel paths are always 2 (A = 2), ideal for high-voltage low-current machines.',
      },
    ],
  },

  // ==========================================
  // ME - MECHANICAL ENGINEERING
  // ==========================================
  {
    id: 'lab-me-301',
    courseCode: 'PC-ME391',
    title: 'Thermodynamics & Fluid Mechanics Laboratory',
    departmentCode: 'ME',
    semester: 3,
    credits: 2,
    labLocation: 'Fluid Mechanics Lab 102, Mechanical Workshop',
    manualUrl: 'https://github.com/imrandotenv/techfest/blob/main/docs/lab-manuals/PC-ME391-Thermodynamics-Lab-Manual.md',
    manualFileFormat: 'PDF',
    vivaQuestions: [
      {
        question: 'What is the operating principle of a Venturimeter, and why does it have a convergent-divergent cone?',
        answer: 'It applies Bernoulli’s equation to relate pressure drop at the throat to fluid velocity. The convergent cone accelerates flow, while the longer divergent cone (5°–7°) minimizes boundary layer separation and eddy head loss.',
      },
      {
        question: 'What is the Reynolds number, and what are the critical limits for pipe flow?',
        answer: 'Reynolds number (Re = ρvD/μ) is the ratio of fluid inertia forces to viscous forces. For pipe flow, Re < 2000 is laminar, 2000 < Re < 4000 is transitional, and Re > 4000 is fully turbulent flow.',
      },
      {
        question: 'What is the difference between an Intensive property and an Extensive property?',
        answer: 'Intensive properties do not depend on the system mass (temperature, pressure, density). Extensive properties scale directly with system mass (total volume, enthalpy, internal energy, entropy).',
      },
      {
        question: 'Explain the Joule-Thomson coefficient (μ_JT) and the inversion temperature.',
        answer: 'The Joule-Thomson coefficient μ_JT = (∂T/∂P)_h represents temperature change during isenthalpic throttling. At temperatures below the inversion curve, throttling causes cooling; above it, throttling causes heating.',
      },
      {
        question: 'What does dryness fraction (x) signify in thermodynamics?',
        answer: 'Dryness fraction (quality) is the ratio of dry vapor mass to total mixture mass (x = m_v / (m_v + m_l)). It equals 0 for saturated liquid and 1 for dry saturated vapor.',
      },
    ],
  },
  {
    id: 'lab-me-401',
    courseCode: 'PC-ME491',
    title: 'CAD/CAM & Machine Drawing Laboratory',
    departmentCode: 'ME',
    semester: 4,
    credits: 2,
    labLocation: 'CAD/CAM Computation Centre, Mechanical Workshop',
    manualUrl: 'https://github.com/imrandotenv/techfest/blob/main/docs/lab-manuals/PC-ME491-CAD-CAM-Lab-Manual.md',
    manualFileFormat: 'PDF',
    vivaQuestions: [
      {
        question: 'What is the difference between First Angle and Third Angle projection?',
        answer: 'In First Angle projection, the object lies between the observer and plane of projection (plan view drawn below elevation). In Third Angle, the projection plane lies between observer and object (plan view drawn above elevation).',
      },
      {
        question: 'Explain the difference between G-codes and M-codes in CNC programming.',
        answer: 'G-codes (Preparatory codes) control tool motion kinematics (e.g., G00 rapid positioning, G01 linear interpolation, G02/G03 circular). M-codes (Miscellaneous codes) control machine auxiliary functions (e.g., M03 spindle on, M08 coolant on, M30 end of program).',
      },
      {
        question: 'What are the three classes of engineering tolerance fits?',
        answer: '1. Clearance fit (hole always larger than shaft), 2. Interference fit (shaft always larger than hole, requires press fitting), and 3. Transition fit (tolerance zones overlap, allowing either clearance or interference).',
      },
      {
        question: 'What is the difference between Parametric modeling and Direct modeling in CAD?',
        answer: 'Parametric modeling records design intent via sequential feature trees and geometric constraints (dimensions, tangents), allowing easy updates. Direct modeling modifies geometry on-the-fly without feature history.',
      },
      {
        question: 'What is the role of post-processors in CAM software?',
        answer: 'A post-processor converts universal toolpath cutter location data (CLDATA) generated in CAM into machine-specific G/M code formatted for the target CNC controller (e.g., Fanuc, Siemens, Haas).',
      },
    ],
  },

  // ==========================================
  // CE - CIVIL ENGINEERING
  // ==========================================
  {
    id: 'lab-ce-301',
    courseCode: 'CE(ES)391',
    title: 'Surveying Practice Laboratory',
    departmentCode: 'CE',
    semester: 3,
    credits: 2,
    labLocation: 'Surveying Equipment Ground, Civil Engineering Block',
    manualUrl: 'https://github.com/imrandotenv/techfest/blob/main/docs/lab-manuals/CE391-Surveying-Lab-Manual.md',
    manualFileFormat: 'PDF',
    vivaQuestions: [
      {
        question: 'What is Local Attraction in Prismatic Compass surveying, and how is it detected?',
        answer: 'Local attraction is the deviation of the magnetic needle from magnetic meridian caused by nearby magnetic objects (iron pipes, steel poles, electric lines). It is detected when the difference between fore bearing (FB) and back bearing (BB) is not 180°.',
      },
      {
        question: 'What is the difference between Height of Instrument (HI) method and Rise & Fall method in leveling?',
        answer: 'The HI method (HI = RL + BS) is faster for many intermediate sights but provides no check on intermediate RL calculations. The Rise & Fall method provides an independent arithmetic check on all sights including intermediate sights.',
      },
      {
        question: 'What is the purpose of Reciprocal Leveling across a river or ravine?',
        answer: 'Reciprocal leveling completely eliminates errors due to earth curvature, atmospheric refraction, and collimation axis errors when sights across wide obstacles cannot be equalized.',
      },
      {
        question: 'What is a Contour Line, and what does close contour spacing indicate?',
        answer: 'A contour line connects points of equal elevation above a datum. Closely spaced contour lines indicate a steep slope or cliff; widely spaced lines indicate gentle or flat terrain.',
      },
      {
        question: 'Explain the 3-point resection problem in Plane Table surveying.',
        answer: 'Resection determines the plotted position of an unknown plane table station by sighting toward three already plotted landmarks (using Bessel’s method, mechanical tracing paper, or Lehmann’s trial & error method).',
      },
    ],
  },
  {
    id: 'lab-ce-401',
    courseCode: 'CE(PC)491',
    title: 'Concrete Technology & Solid Mechanics Laboratory',
    departmentCode: 'CE',
    semester: 4,
    credits: 2,
    labLocation: 'Structural & Concrete Testing Bay 104, Civil Block',
    manualUrl: 'https://github.com/imrandotenv/techfest/blob/main/docs/lab-manuals/CE491-Concrete-Lab-Manual.md',
    manualFileFormat: 'PDF',
    vivaQuestions: [
      {
        question: 'What is the standard dimension of a concrete cube for compressive strength testing, and when is it tested?',
        answer: 'Standard concrete specimens are 150 mm × 150 mm × 150 mm cubes. They are tested under a Compression Testing Machine (CTM) at 7 days (achieving ~67% strength) and 28 days (achieving 100% characteristic strength).',
      },
      {
        question: 'What does the Slump Test measure in fresh concrete, and what are the slump profiles?',
        answer: 'The Slump Cone test measures the workability and consistency of fresh concrete. The profiles are: True Slump (satisfactory workability), Shear Slump (lacks cohesion), and Collapse Slump (excessive water-cement ratio).',
      },
      {
        question: 'What is the significance of the Water-Cement ratio according to Abram’s Law?',
        answer: 'Abram’s Law states that the compressive strength of fully compacted concrete depends exclusively on the water-cement ratio by weight. Lower W/C increases compressive strength and impermeability but reduces workability.',
      },
      {
        question: 'What is the difference between Nominal Concrete Mix and Design Concrete Mix under IS 456?',
        answer: 'Nominal mixes (up to M20) use fixed arbitrary volumetric ratios (e.g., M15 is 1:2:4, M20 is 1:1.5:3). Design mixes (M25 and above) calculate exact aggregate gradation, moisture, and cement paste based on target mean strength.',
      },
      {
        question: 'Explain the yield point and ultimate tensile strength on a mild steel stress-strain curve.',
        answer: 'The yield point is where steel begins plastic deformation without a marked increase in load (upper/lower yield points). Ultimate tensile strength (UTS) is the maximum engineering stress the material withstands before necking occurs.',
      },
    ],
  },
];
