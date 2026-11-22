export type BTechBranch = 'CSE' | 'ECE' | 'EE' | 'ME' | 'CE' | 'IT' | 'AIML';

export interface SubjectItem {
  code: string;
  name: string;
  type: 'Theory' | 'Lab' | 'Core' | 'Basic Science' | 'Elective';
  credits: number;
  description?: string;
}

export interface BranchInfo {
  code: BTechBranch;
  name: string;
  fullTitle: string;
  hod: string;
  departmentOffice: string;
  color: string;
  badgeBg: string;
  badgeText: string;
}

export const BTECH_BRANCHES: Record<BTechBranch, BranchInfo> = {
  CSE: {
    code: 'CSE',
    name: 'Computer Science',
    fullTitle: 'Computer Science & Engineering',
    hod: 'Dr. P. Roy',
    departmentOffice: 'Aryabhatta Block • 3rd Floor',
    color: '#2563EB',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-[#2563EB]',
  },
  ECE: {
    code: 'ECE',
    name: 'Electronics & Comm.',
    fullTitle: 'Electronics & Communication Engineering',
    hod: 'Dr. S. Mukherjee',
    departmentOffice: 'Bhabha Block • 2nd Floor',
    color: '#10B981',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
  },
  EE: {
    code: 'EE',
    name: 'Electrical Engg.',
    fullTitle: 'Electrical Engineering',
    hod: 'Prof. A. Banerjee',
    departmentOffice: 'Tesla Block • Ground Floor',
    color: '#F59E0B',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
  },
  ME: {
    code: 'ME',
    name: 'Mechanical Engg.',
    fullTitle: 'Mechanical Engineering',
    hod: 'Dr. K. Dasgupta',
    departmentOffice: 'Mechanical Workshop Complex',
    color: '#EC4899',
    badgeBg: 'bg-pink-50',
    badgeText: 'text-pink-700',
  },
  CE: {
    code: 'CE',
    name: 'Civil Engg.',
    fullTitle: 'Civil Engineering',
    hod: 'Prof. R. Sengupta',
    departmentOffice: 'Visvesvaraya Block • 1st Floor',
    color: '#8B5CF6',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-700',
  },
  IT: {
    code: 'IT',
    name: 'Information Tech.',
    fullTitle: 'Information Technology',
    hod: 'Dr. A. Ghosh',
    departmentOffice: 'Aryabhatta Block • 4th Floor',
    color: '#06B6D4',
    badgeBg: 'bg-cyan-50',
    badgeText: 'text-cyan-700',
  },
  AIML: {
    code: 'AIML',
    name: 'AI & Machine Learning',
    fullTitle: 'CSE (Artificial Intelligence & Machine Learning)',
    hod: 'Dr. S. K. Mondal',
    departmentOffice: 'Aryabhatta Block • 3rd Floor East',
    color: '#6366F1',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700',
  },
};

/**
 * Standard MAKAUT B.Tech Curriculum mapped by Branch and Semester (1 to 8).
 * Semester 1 & 2 share foundational engineering curriculum across all branches.
 */
export const MAKAUT_CURRICULUM: Record<BTechBranch, Record<number, SubjectItem[]>> = {
  CSE: {
    1: [
      { code: 'BS-PH101', name: 'Physics-I', type: 'Basic Science', credits: 4, description: 'Electromagnetism, Quantum mechanics & optics' },
      { code: 'BS-M101', name: 'Mathematics-IB', type: 'Basic Science', credits: 4, description: 'Calculus, Linear algebra & multivariable functions' },
      { code: 'ES-EE101', name: 'Basic Electrical Engg.', type: 'Core', credits: 3, description: 'DC/AC circuits, transformers & electric machines' },
      { code: 'ES-EE191', name: 'Basic Electrical Engg. Lab', type: 'Lab', credits: 1, description: 'Practical circuit wiring & measurements' },
    ],
    2: [
      { code: 'BS-CH201', name: 'Chemistry-I', type: 'Basic Science', credits: 4, description: 'Atomic structure, spectroscopy & organic synthesis' },
      { code: 'BS-M201', name: 'Mathematics-IIB', type: 'Basic Science', credits: 4, description: 'Differential equations & complex variables' },
      { code: 'ES-CS201', name: 'Programming for Problem Solving', type: 'Core', credits: 3, description: 'C programming, pointers, arrays & files' },
      { code: 'ES-CS291', name: 'Programming Lab', type: 'Lab', credits: 1.5, description: 'Hands-on C programming assignments' },
    ],
    3: [
      { code: 'PCC-CS301', name: 'Data Structures & Algorithms', type: 'Core', credits: 4, description: 'Arrays, Stacks, Queues, Trees, Graphs, Sorting & Hashing' },
      { code: 'PCC-CS302', name: 'Computer Organization & Architecture', type: 'Core', credits: 4, description: 'CPU pipelining, cache hierarchy, MIPS, bus architecture' },
      { code: 'ESC301', name: 'Analog & Digital Electronics', type: 'Core', credits: 3, description: 'Op-amps, oscillators, logic gates, flip-flops, counters' },
      { code: 'BS-M301', name: 'Mathematics-III (Differential Calculus)', type: 'Basic Science', credits: 2, description: 'Fourier series, Laplace transforms & probability' },
      { code: 'PCC-CS391', name: 'DSA Lab in C/C++', type: 'Lab', credits: 2, description: 'Implementing tree traversals, shortest paths & AVL trees' },
    ],
    4: [
      { code: 'PCC-CS401', name: 'Discrete Mathematics', type: 'Core', credits: 4, description: 'Set theory, recurrence relations, graph theory, combinatorics' },
      { code: 'PCC-CS402', name: 'Operating Systems', type: 'Core', credits: 3, description: 'Process management, Deadlocks, memory paging, file systems' },
      { code: 'PCC-CS403', name: 'Design & Analysis of Algorithms', type: 'Core', credits: 4, description: 'Divide & conquer, greedy, dynamic programming, NP-complete' },
      { code: 'PCC-CS404', name: 'Formal Language & Automata Theory', type: 'Core', credits: 3, description: 'DFA, NFA, context-free grammars, Turing machines' },
      { code: 'PCC-CS492', name: 'Operating Systems Lab (Linux)', type: 'Lab', credits: 1.5, description: 'Shell scripting, fork(), semaphores & IPC' },
    ],
    5: [
      { code: 'PCC-CS501', name: 'Database Management Systems', type: 'Core', credits: 4, description: 'ER model, Relational algebra, Normalization (1NF-BCNF), SQL, ACID' },
      { code: 'PCC-CS502', name: 'Computer Networks', type: 'Core', credits: 3, description: 'OSI 7 layers, TCP/IP, sliding window, routing algorithms, DNS' },
      { code: 'PCC-CS503', name: 'Software Engineering', type: 'Core', credits: 3, description: 'Agile methodologies, SDLC models, UML diagrams, testing' },
      { code: 'PEC-IT501', name: 'Object Oriented Programming in Java', type: 'Elective', credits: 3, description: 'Inheritance, interfaces, JVM memory model, multithreading' },
      { code: 'PCC-CS591', name: 'DBMS Lab (MySQL / PostgreSQL)', type: 'Lab', credits: 2, description: 'Complex queries, triggers, stored procedures & indexing' },
    ],
    6: [
      { code: 'PCC-CS601', name: 'Compiler Design', type: 'Core', credits: 3, description: 'Lexical analysis, LL/LR parsing, syntax-directed translation, code generation' },
      { code: 'PCC-CS602', name: 'Computer Networks Lab', type: 'Lab', credits: 1.5, description: 'Socket programming in C/Python, packet analysis via Wireshark' },
      { code: 'PEC-CS601', name: 'Machine Learning', type: 'Elective', credits: 3, description: 'Supervised/unsupervised models, regression, decision trees, neural nets' },
      { code: 'PEC-CS602', name: 'Cloud Computing & Distributed Systems', type: 'Elective', credits: 3, description: 'AWS, containerization with Docker, Kubernetes, RPC' },
      { code: 'PROJ-CS601', name: 'Minor Project - 1', type: 'Core', credits: 3, description: 'Full-stack engineering prototype or research implementation' },
    ],
    7: [
      { code: 'PEC-CS701', name: 'Information Security & Cryptography', type: 'Elective', credits: 3, description: 'RSA, AES, SHA-256, public key infrastructure, zero-trust' },
      { code: 'PEC-CS702', name: 'Big Data Analytics', type: 'Elective', credits: 3, description: 'Hadoop, MapReduce, Apache Spark, distributed processing' },
      { code: 'OEC-CS701', name: 'Entrepreneurship & Engineering Economics', type: 'Elective', credits: 3, description: 'Break-even analysis, startup bootstrapping & patent law' },
      { code: 'PROJ-CS701', name: 'Major Project Phase-I', type: 'Core', credits: 4, description: 'Literature review, architecture design & sprint 1 execution' },
    ],
    8: [
      { code: 'PEC-CS801', name: 'Internet of Things (IoT) & Edge Computing', type: 'Elective', credits: 3, description: 'Sensors, MQTT protocol, ESP32, edge model inference' },
      { code: 'OEC-CS801', name: 'Cyber Law, Ethics & Intellectual Property', type: 'Elective', credits: 3, description: 'IT Act 2000, compliance, digital privacy, patent filing' },
      { code: 'PROJ-CS802', name: 'Major Project Phase-II (Final Defense)', type: 'Core', credits: 6, description: 'Production deployment, MAKAUT external viva presentation' },
      { code: 'VIVA-CS801', name: 'Grand Comprehensive Viva Voce', type: 'Core', credits: 2, description: 'Department-wide technical defense across all 8 semesters' },
    ],
  },
  ECE: {
    1: [
      { code: 'BS-PH101', name: 'Physics-I', type: 'Basic Science', credits: 4, description: 'Wave optics, laser, semiconductor physics' },
      { code: 'BS-M101', name: 'Mathematics-I', type: 'Basic Science', credits: 4, description: 'Calculus & matrix theory' },
      { code: 'ES-EE101', name: 'Basic Electrical Engg.', type: 'Core', credits: 3, description: 'Network theorems & AC circuits' },
    ],
    2: [
      { code: 'BS-CH201', name: 'Chemistry-I', type: 'Basic Science', credits: 4, description: 'Thermodynamics & materials' },
      { code: 'ES-CS201', name: 'Programming for Problem Solving', type: 'Core', credits: 3, description: 'C programming fundamentals' },
    ],
    3: [
      { code: 'EC301', name: 'Electronic Devices & Circuits', type: 'Core', credits: 3, description: 'BJT, MOSFET, small signal models, amplifiers' },
      { code: 'EC302', name: 'Digital System Design', type: 'Core', credits: 4, description: 'Verilog HDL, combinational/sequential logic, FSM' },
      { code: 'EC303', name: 'Signals & Systems', type: 'Core', credits: 3, description: 'LTI systems, Fourier transform, Z-transform, convolution' },
      { code: 'EC304', name: 'Network Theory', type: 'Core', credits: 3, description: 'Two-port parameters, transient analysis, Laplace domains' },
    ],
    4: [
      { code: 'EC401', name: 'Analog Communication', type: 'Core', credits: 3, description: 'AM, FM, PM, superheterodyne receivers, noise analysis' },
      { code: 'EC402', name: 'Analog Electronic Circuits', type: 'Core', credits: 3, description: 'Differential amplifiers, feedback, 555 timers, op-amps' },
      { code: 'EC403', name: 'Microprocessor & Microcontrollers', type: 'Core', credits: 3, description: '8085/8086 architecture, 8051, assembly programming' },
      { code: 'EC404', name: 'Electromagnetic Fields', type: 'Core', credits: 3, description: 'Maxwell equations, Poynting vector, wave guides' },
    ],
    5: [
      { code: 'EC501', name: 'Digital Communication', type: 'Core', credits: 3, description: 'PCM, QPSK, eye diagrams, error control codes' },
      { code: 'EC502', name: 'Digital Signal Processing', type: 'Core', credits: 4, description: 'FFT algorithms, FIR/IIR filters, bilinear transform' },
      { code: 'EC503', name: 'Control Systems', type: 'Core', credits: 3, description: 'Root locus, Bode plots, Nyquist criterion, PID' },
    ],
    6: [
      { code: 'EC601', name: 'VLSI Design', type: 'Core', credits: 3, description: 'CMOS inverter delay, stick diagrams, FPGA flow' },
      { code: 'EC602', name: 'Antenna & Wave Propagation', type: 'Core', credits: 3, description: 'Dipole antennas, radiation patterns, radar equation' },
    ],
    7: [
      { code: 'EC701', name: 'Wireless & Mobile Communication', type: 'Core', credits: 3, description: 'Cellular concept, 4G/5G, fading channels' },
      { code: 'EC702', name: 'Optical Fiber Communication', type: 'Core', credits: 3, description: 'Total internal reflection, attenuation, laser diodes' },
    ],
    8: [
      { code: 'EC801', name: 'Satellite Communication & Radar', type: 'Core', credits: 3, description: 'Orbital mechanics, link budget, Doppler radar' },
      { code: 'VIVA-EC801', name: 'Grand Comprehensive Viva', type: 'Core', credits: 2, description: 'Comprehensive B.Tech ECE defense' },
    ],
  },
  EE: {
    1: [{ code: 'BS-PH101', name: 'Physics-I', type: 'Basic Science', credits: 4 }],
    2: [{ code: 'ES-CS201', name: 'Programming in C', type: 'Core', credits: 3 }],
    3: [
      { code: 'PC-EE301', name: 'Electric Circuit Theory', type: 'Core', credits: 4, description: 'Graph theory, resonance, state-variable approach' },
      { code: 'PC-EE302', name: 'Analog Electronics', type: 'Core', credits: 3, description: 'Diodes, BJTs, voltage regulators' },
      { code: 'PC-EE303', name: 'Electromagnetic Field Theory', type: 'Core', credits: 3, description: 'Electrostatics, magnetostatics, boundary values' },
    ],
    4: [
      { code: 'PC-EE401', name: 'Electrical Machines - I', type: 'Core', credits: 4, description: 'DC machines, transformers, testing' },
      { code: 'PC-EE402', name: 'Electrical & Electronic Measurement', type: 'Core', credits: 3, description: 'Galvanometers, bridges, digital multimeters, CRO' },
      { code: 'PC-EE403', name: 'Thermal Power Engineering', type: 'Core', credits: 3, description: 'Boilers, turbines, Rankine cycles' },
    ],
    5: [
      { code: 'PC-EE501', name: 'Power Systems - I', type: 'Core', credits: 4, description: 'Transmission lines, sag calculation, insulators' },
      { code: 'PC-EE502', name: 'Control Systems', type: 'Core', credits: 4, description: 'Stability analysis, frequency domain response' },
      { code: 'PC-EE503', name: 'Electrical Machines - II', type: 'Core', credits: 4, description: 'Induction motors, synchronous generators' },
    ],
    6: [
      { code: 'PC-EE601', name: 'Power Electronics', type: 'Core', credits: 4, description: 'SCR, inverters, buck-boost converters' },
      { code: 'PC-EE602', name: 'Microprocessor & Microcontrollers', type: 'Core', credits: 3, description: 'Embedded automation and control' },
    ],
    7: [
      { code: 'PC-EE701', name: 'Power Systems - II', type: 'Core', credits: 4, description: 'Fault analysis, load flow (Gauss-Seidel, NR), protection' },
    ],
    8: [
      { code: 'PC-EE801', name: 'Renewable & Distributed Energy', type: 'Core', credits: 3, description: 'Solar PV, wind grid integration' },
      { code: 'VIVA-EE801', name: 'Grand Comprehensive Viva', type: 'Core', credits: 2 },
    ],
  },
  ME: {
    1: [{ code: 'BS-PH101', name: 'Physics-I', type: 'Basic Science', credits: 4 }],
    2: [{ code: 'ES-ME201', name: 'Engineering Graphics & Design', type: 'Core', credits: 3 }],
    3: [
      { code: 'PC-ME301', name: 'Thermodynamics', type: 'Core', credits: 4, description: 'First and second laws, entropy, exergy, steam tables' },
      { code: 'PC-ME302', name: 'Manufacturing Processes', type: 'Core', credits: 4, description: 'Casting, welding, forming, lathe operations' },
      { code: 'PC-ME303', name: 'Strength of Materials', type: 'Core', credits: 4, description: 'Stress-strain tensors, Mohr circle, bending moment' },
    ],
    4: [
      { code: 'PC-ME401', name: 'Fluid Mechanics', type: 'Core', credits: 4, description: 'Bernoulli equation, Navier-Stokes, boundary layer' },
      { code: 'PC-ME402', name: 'Kinematics & Theory of Machines', type: 'Core', credits: 4, description: 'Gear trains, cams, governors, flywheel' },
      { code: 'PC-ME403', name: 'Materials Engineering', type: 'Core', credits: 3, description: 'Iron-carbon phase diagram, heat treatment, TTT curves' },
    ],
    5: [
      { code: 'PC-ME501', name: 'Heat Transfer', type: 'Core', credits: 4, description: 'Conduction, convection, radiation, heat exchangers' },
      { code: 'PC-ME502', name: 'Design of Machine Elements', type: 'Core', credits: 4, description: 'Shafts, keys, bolted joints, bearings' },
    ],
    6: [
      { code: 'PC-ME601', name: 'IC Engines & Gas Turbines', type: 'Core', credits: 3, description: 'Otto, Diesel, dual cycles, emissions' },
      { code: 'PC-ME602', name: 'Automation in Manufacturing (CAD/CAM)', type: 'Core', credits: 3, description: 'G-codes, CNC milling, robotics' },
    ],
    7: [
      { code: 'PC-ME701', name: 'Power Plant Engineering', type: 'Core', credits: 3, description: 'Hydro, thermal & nuclear power cycles' },
    ],
    8: [
      { code: 'PC-ME801', name: 'Refrigeration & Air Conditioning (RAC)', type: 'Core', credits: 3, description: 'VCR cycles, psychrometry, cooling loads' },
      { code: 'VIVA-ME801', name: 'Grand Comprehensive Viva', type: 'Core', credits: 2 },
    ],
  },
  CE: {
    1: [{ code: 'BS-PH101', name: 'Physics-I', type: 'Basic Science', credits: 4 }],
    2: [{ code: 'ES-CE201', name: 'Basic Environmental Engg.', type: 'Core', credits: 3 }],
    3: [
      { code: 'CE301', name: 'Solid Mechanics', type: 'Core', credits: 4, description: 'Shear force, bending moment diagrams, torsion' },
      { code: 'CE302', name: 'Surveying & Geomatics', type: 'Core', credits: 3, description: 'Theodolite, total station, levelling, GIS' },
      { code: 'CE303', name: 'Fluid Mechanics', type: 'Core', credits: 3, description: 'Pipe flow, laminar and turbulent flow' },
    ],
    4: [
      { code: 'CE401', name: 'Structural Analysis - I', type: 'Core', credits: 4, description: 'Slope deflection method, moment distribution' },
      { code: 'CE402', name: 'Soil Mechanics & Geotechnical Engg.', type: 'Core', credits: 4, description: 'Compaction, consolidation, Terzaghi theory' },
      { code: 'CE403', name: 'Concrete Technology', type: 'Core', credits: 3, description: 'Mix design (IS 10262), admixtures, workability' },
    ],
    5: [
      { code: 'CE501', name: 'Design of Reinforced Concrete Structures (RCC)', type: 'Core', credits: 4, description: 'Limit state design (IS 456), beams, slabs, columns' },
      { code: 'CE502', name: 'Hydrology & Water Resources', type: 'Core', credits: 3, description: 'Hydrographs, dams, reservoirs, runoff' },
    ],
    6: [
      { code: 'CE601', name: 'Design of Steel Structures', type: 'Core', credits: 4, description: 'IS 800:2007, trusses, welded joints, gantry girders' },
      { code: 'CE602', name: 'Transportation Engineering', type: 'Core', credits: 3, description: 'Geometric design of highways (IRC), traffic volume' },
    ],
    7: [
      { code: 'CE701', name: 'Environmental Engineering', type: 'Core', credits: 3, description: 'BOD, COD, sewage treatment, sedimentation tanks' },
    ],
    8: [
      { code: 'CE801', name: 'Construction Management & Estimation', type: 'Core', credits: 3, description: 'CPM/PERT, rate analysis, bill of quantities' },
      { code: 'VIVA-CE801', name: 'Grand Comprehensive Viva', type: 'Core', credits: 2 },
    ],
  },
  IT: {
    1: [{ code: 'BS-PH101', name: 'Physics-I', type: 'Basic Science', credits: 4 }],
    2: [{ code: 'ES-CS201', name: 'Programming in C', type: 'Core', credits: 3 }],
    3: [
      { code: 'PCC-IT301', name: 'Data Structures & Algorithms', type: 'Core', credits: 4 },
      { code: 'PCC-IT302', name: 'Digital Logic & Computer Design', type: 'Core', credits: 3 },
      { code: 'BS-M301', name: 'Mathematics-III', type: 'Basic Science', credits: 3 },
    ],
    4: [
      { code: 'PCC-IT401', name: 'Operating Systems', type: 'Core', credits: 3 },
      { code: 'PCC-IT402', name: 'Object Oriented Programming with Java', type: 'Core', credits: 3 },
      { code: 'PCC-IT403', name: 'Discrete Mathematics', type: 'Core', credits: 3 },
    ],
    5: [
      { code: 'PCC-IT501', name: 'Database Management Systems', type: 'Core', credits: 4 },
      { code: 'PCC-IT502', name: 'Computer Networks', type: 'Core', credits: 4 },
      { code: 'PCC-IT503', name: 'Design & Analysis of Algorithms', type: 'Core', credits: 3 },
    ],
    6: [
      { code: 'PCC-IT601', name: 'Web Technology & Frameworks', type: 'Core', credits: 3 },
      { code: 'PCC-IT602', name: 'Information Security', type: 'Core', credits: 3 },
    ],
    7: [
      { code: 'PCC-IT701', name: 'Cloud Computing & Virtualization', type: 'Core', credits: 3 },
    ],
    8: [
      { code: 'PCC-IT801', name: 'Mobile Computing & Android', type: 'Core', credits: 3 },
      { code: 'VIVA-IT801', name: 'Grand Comprehensive Viva', type: 'Core', credits: 2 },
    ],
  },
  AIML: {
    1: [{ code: 'BS-PH101', name: 'Physics-I', type: 'Basic Science', credits: 4 }],
    2: [{ code: 'ES-CS201', name: 'Programming in C & Python', type: 'Core', credits: 3 }],
    3: [
      { code: 'PCC-AI301', name: 'Data Structures & Algorithms in Python', type: 'Core', credits: 4, description: 'Pythonic implementation of trees, graphs, heaps' },
      { code: 'PCC-AI302', name: 'Mathematical Foundations for AI', type: 'Core', credits: 4, description: 'Linear algebra, vector calculus, probability, SVD' },
      { code: 'PCC-AI303', name: 'Digital Electronics & Microcontrollers', type: 'Core', credits: 3 },
    ],
    4: [
      { code: 'PCC-AI401', name: 'Operating Systems', type: 'Core', credits: 3 },
      { code: 'PCC-AI402', name: 'Artificial Intelligence Principles', type: 'Core', credits: 4, description: 'A* search, minimax, CSP, knowledge representation' },
      { code: 'PCC-AI403', name: 'Design & Analysis of Algorithms', type: 'Core', credits: 4 },
    ],
    5: [
      { code: 'PCC-AI501', name: 'Machine Learning Fundamentals', type: 'Core', credits: 4, description: 'Scikit-learn, SVM, boosting, PCA, loss optimization' },
      { code: 'PCC-AI502', name: 'Database Systems & Data Warehousing', type: 'Core', credits: 3 },
      { code: 'PCC-AI503', name: 'Computer Networks', type: 'Core', credits: 3 },
    ],
    6: [
      { code: 'PCC-AI601', name: 'Deep Learning & Neural Networks', type: 'Core', credits: 4, description: 'PyTorch, CNNs, RNNs, backpropagation, transformers' },
      { code: 'PCC-AI602', name: 'Computer Vision', type: 'Core', credits: 3, description: 'OpenCV, object detection, segmentation, YOLO' },
    ],
    7: [
      { code: 'PCC-AI701', name: 'Natural Language Processing & LLMs', type: 'Core', credits: 3, description: 'Tokenization, attention mechanisms, BERT, prompt engineering' },
      { code: 'PCC-AI702', name: 'Reinforcement Learning', type: 'Core', credits: 3, description: 'MDPs, Q-learning, policy gradients' },
    ],
    8: [
      { code: 'PCC-AI801', name: 'Generative AI & MLOps', type: 'Core', credits: 3, description: 'Diffusion models, LangChain, vector DBs, MLflow' },
      { code: 'VIVA-AI801', name: 'Grand Comprehensive Viva', type: 'Core', credits: 2 },
    ],
  },
};

/**
 * Calculates standard expected passout year given current B.Tech semester.
 * Assuming 4-year degree (Sem 1-2 = 1st yr, Sem 3-4 = 2nd yr, Sem 5-6 = 3rd yr, Sem 7-8 = 4th yr).
 */
export function getSuggestedPassoutYear(currentSemester: number = 3): number {
  const currentYear = new Date().getFullYear();
  // If sem 1 or 2 -> 3.5 years left
  if (currentSemester <= 2) return currentYear + 3;
  if (currentSemester <= 4) return currentYear + 2;
  if (currentSemester <= 6) return currentYear + 1;
  return currentYear;
}

export function getSemesterSubjects(branch: string = 'CSE', semester: number = 3): SubjectItem[] {
  const normalizedBranch = (branch.toUpperCase() as BTechBranch) || 'CSE';
  const branchMap = MAKAUT_CURRICULUM[normalizedBranch] || MAKAUT_CURRICULUM.CSE;
  return branchMap[semester] || branchMap[3] || [];
}

export function getBranchDetails(branch: string = 'CSE'): BranchInfo {
  const normalized = (branch.toUpperCase() as BTechBranch) || 'CSE';
  return BTECH_BRANCHES[normalized] || BTECH_BRANCHES.CSE;
}
