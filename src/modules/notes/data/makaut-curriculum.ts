import { MAKAUTSubject } from '../types';

export const MAKAUT_SUBJECTS: MAKAUTSubject[] = [
  // ========================================================
  // SEMESTER 1 (Common First Year AICTE Model Curriculum)
  // ========================================================
  {
    code: 'BS-PH101',
    name: 'Physics-I (Oscillations, Waves and Optics)',
    branch: 'ALL',
    semester: 1,
    credits: 4,
    type: 'Theory',
    syllabusCategory: 'BSC',
  },
  {
    code: 'BS-M101',
    name: 'Mathematics-IA (Calculus and Linear Algebra)',
    branch: 'ALL',
    semester: 1,
    credits: 4,
    type: 'Theory',
    syllabusCategory: 'BSC',
  },
  {
    code: 'ES-EE101',
    name: 'Basic Electrical Engineering',
    branch: 'ALL',
    semester: 1,
    credits: 4,
    type: 'Theory',
    syllabusCategory: 'ESC',
  },
  {
    code: 'BS-PH191',
    name: 'Physics-I Laboratory',
    branch: 'ALL',
    semester: 1,
    credits: 1.5,
    type: 'Practical',
    syllabusCategory: 'BSC',
  },
  {
    code: 'ES-EE191',
    name: 'Basic Electrical Engineering Laboratory',
    branch: 'ALL',
    semester: 1,
    credits: 1,
    type: 'Practical',
    syllabusCategory: 'ESC',
  },
  {
    code: 'ES-ME191',
    name: 'Engineering Graphics & Design / Workshop',
    branch: 'ALL',
    semester: 1,
    credits: 3,
    type: 'Practical',
    syllabusCategory: 'ESC',
  },

  // ========================================================
  // SEMESTER 2
  // ========================================================
  {
    code: 'BS-CH201',
    name: 'Chemistry-I',
    branch: 'ALL',
    semester: 2,
    credits: 4,
    type: 'Theory',
    syllabusCategory: 'BSC',
  },
  {
    code: 'BS-M201',
    name: 'Mathematics-IIA (Differential Equations & Transforms)',
    branch: 'ALL',
    semester: 2,
    credits: 4,
    type: 'Theory',
    syllabusCategory: 'BSC',
  },
  {
    code: 'ES-CS201',
    name: 'Programming for Problem Solving (C / Python)',
    branch: 'ALL',
    semester: 2,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'ESC',
  },
  {
    code: 'HM-HU201',
    name: 'English for Communication & Technical Writing',
    branch: 'ALL',
    semester: 2,
    credits: 2,
    type: 'Theory',
    syllabusCategory: 'HSMC',
  },
  {
    code: 'ES-CS291',
    name: 'Programming for Problem Solving Lab',
    branch: 'ALL',
    semester: 2,
    credits: 1.5,
    type: 'Practical',
    syllabusCategory: 'ESC',
  },

  // ========================================================
  // SEMESTER 3
  // ========================================================
  // CSE
  {
    code: 'PCC-CS301',
    name: 'Data Structures & Algorithms',
    branch: 'CSE',
    semester: 3,
    credits: 4,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },
  {
    code: 'ESC301',
    name: 'Digital Electronics & Logic Design',
    branch: 'CSE',
    semester: 3,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'ESC',
  },
  {
    code: 'BSC301',
    name: 'Mathematics-III (Differential Calculus & Complex Analysis)',
    branch: 'CSE',
    semester: 3,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'BSC',
  },
  {
    code: 'PCC-CS302',
    name: 'Computer Organization & Architecture',
    branch: 'CSE',
    semester: 3,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },
  {
    code: 'HSMC301',
    name: 'Economics for Engineers',
    branch: 'CSE',
    semester: 3,
    credits: 2,
    type: 'Theory',
    syllabusCategory: 'HSMC',
  },
  {
    code: 'PCC-CS391',
    name: 'Data Structures & Algorithms Lab',
    branch: 'CSE',
    semester: 3,
    credits: 1.5,
    type: 'Practical',
    syllabusCategory: 'PCC',
  },

  // ECE
  {
    code: 'EC301',
    name: 'Electronic Devices & Semiconductor Physics',
    branch: 'ECE',
    semester: 3,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },
  {
    code: 'EC302',
    name: 'Digital System Design',
    branch: 'ECE',
    semester: 3,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },
  {
    code: 'EC303',
    name: 'Signals and Systems',
    branch: 'ECE',
    semester: 3,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },
  {
    code: 'EC304',
    name: 'Network Theory & Synthesis',
    branch: 'ECE',
    semester: 3,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },

  // EE
  {
    code: 'PC-EE301',
    name: 'Electric Circuit Theory',
    branch: 'EE',
    semester: 3,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },
  {
    code: 'PC-EE302',
    name: 'Analog Electronics',
    branch: 'EE',
    semester: 3,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },
  {
    code: 'PC-EE303',
    name: 'Electromagnetic Fields',
    branch: 'EE',
    semester: 3,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },

  // ME
  {
    code: 'PC-ME301',
    name: 'Thermodynamics',
    branch: 'ME',
    semester: 3,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },
  {
    code: 'PC-ME302',
    name: 'Manufacturing Processes',
    branch: 'ME',
    semester: 3,
    credits: 4,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },
  {
    code: 'PC-ME303',
    name: 'Strength of Materials',
    branch: 'ME',
    semester: 3,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },

  // CE
  {
    code: 'CE(PC)301',
    name: 'Solid Mechanics',
    branch: 'CE',
    semester: 3,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },
  {
    code: 'CE(PC)302',
    name: 'Surveying and Geomatics',
    branch: 'CE',
    semester: 3,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },

  // ========================================================
  // SEMESTER 4
  // ========================================================
  // CSE
  {
    code: 'PCC-CS401',
    name: 'Discrete Mathematics',
    branch: 'CSE',
    semester: 4,
    credits: 4,
    type: 'Theory',
    syllabusCategory: 'BSC',
  },
  {
    code: 'PCC-CS402',
    name: 'Computer Organization & Architecture',
    branch: 'CSE',
    semester: 4,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },
  {
    code: 'PCC-CS403',
    name: 'Formal Language & Automata Theory (FLAT)',
    branch: 'CSE',
    semester: 4,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },
  {
    code: 'PCC-CS404',
    name: 'Design & Analysis of Algorithms (DAA)',
    branch: 'CSE',
    semester: 4,
    credits: 4,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },
  {
    code: 'MC401',
    name: 'Environmental Sciences & Sustainable Engineering',
    branch: 'ALL',
    semester: 4,
    credits: 0,
    type: 'Theory',
    syllabusCategory: 'MC',
  },

  // ECE
  {
    code: 'EC401',
    name: 'Analog Communication',
    branch: 'ECE',
    semester: 4,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },
  {
    code: 'EC402',
    name: 'Analog Electronic Circuits',
    branch: 'ECE',
    semester: 4,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },
  {
    code: 'EC403',
    name: 'Microprocessors and Microcontrollers (8085/8086/ARM)',
    branch: 'ECE',
    semester: 4,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },

  // EE
  {
    code: 'PC-EE401',
    name: 'Electrical Machines - I',
    branch: 'EE',
    semester: 4,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },
  {
    code: 'PC-EE402',
    name: 'Digital Electronics & Logic Gates',
    branch: 'EE',
    semester: 4,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },
  {
    code: 'PC-EE403',
    name: 'Electrical & Electronic Measurement',
    branch: 'EE',
    semester: 4,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },

  // ME
  {
    code: 'PC-ME401',
    name: 'Fluid Mechanics & Hydraulic Machines',
    branch: 'ME',
    semester: 4,
    credits: 4,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },
  {
    code: 'PC-ME402',
    name: 'Kinematics & Theory of Machines',
    branch: 'ME',
    semester: 4,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },

  // CE
  {
    code: 'CE(PC)401',
    name: 'Fluid Mechanics & Open Channel Flow',
    branch: 'CE',
    semester: 4,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },
  {
    code: 'CE(PC)402',
    name: 'Structural Analysis - I',
    branch: 'CE',
    semester: 4,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },

  // ========================================================
  // SEMESTER 5
  // ========================================================
  // CSE
  {
    code: 'PCC-CS501',
    name: 'Software Engineering & Agile Methodologies',
    branch: 'CSE',
    semester: 5,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },
  {
    code: 'PCC-CS502',
    name: 'Operating Systems & Concurrency',
    branch: 'CSE',
    semester: 5,
    credits: 4,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },
  {
    code: 'PCC-CS503',
    name: 'Object Oriented Programming with Java',
    branch: 'CSE',
    semester: 5,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },
  {
    code: 'PEC-CS501A',
    name: 'Database Management Systems (DBMS)',
    branch: 'CSE',
    semester: 5,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PEC',
  },
  {
    code: 'MC-501',
    name: 'Constitution of India',
    branch: 'ALL',
    semester: 5,
    credits: 0,
    type: 'Theory',
    syllabusCategory: 'MC',
  },

  // ECE
  {
    code: 'EC501',
    name: 'Electromagnetic Waves & Antennas',
    branch: 'ECE',
    semester: 5,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },
  {
    code: 'EC502',
    name: 'Computer Architecture & Embedded Systems',
    branch: 'ECE',
    semester: 5,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },
  {
    code: 'EC503',
    name: 'Digital Communication Systems',
    branch: 'ECE',
    semester: 5,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },

  // EE
  {
    code: 'PC-EE501',
    name: 'Electric Machines - II (Induction & Synchronous)',
    branch: 'EE',
    semester: 5,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },
  {
    code: 'PC-EE502',
    name: 'Power System - I (Transmission & Distribution)',
    branch: 'EE',
    semester: 5,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },
  {
    code: 'PC-EE503',
    name: 'Control Systems Engineering',
    branch: 'EE',
    semester: 5,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },

  // ME
  {
    code: 'PC-ME501',
    name: 'Heat Transfer (Conduction, Convection & Radiation)',
    branch: 'ME',
    semester: 5,
    credits: 4,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },
  {
    code: 'PC-ME502',
    name: 'Design of Machine Elements - I',
    branch: 'ME',
    semester: 5,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },

  // CE
  {
    code: 'CE(PC)501',
    name: 'Design of Reinforced Concrete (RC) Structures',
    branch: 'CE',
    semester: 5,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },
  {
    code: 'CE(PC)502',
    name: 'Geotechnical Engineering - I (Soil Mechanics)',
    branch: 'CE',
    semester: 5,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },

  // ========================================================
  // SEMESTER 6
  // ========================================================
  // CSE
  {
    code: 'PCC-CS601',
    name: 'Computer Networks (OSI, TCP/IP & Socket Programming)',
    branch: 'CSE',
    semester: 6,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },
  {
    code: 'PCC-CS602',
    name: 'Compiler Design & Lexical Syntax Analysis',
    branch: 'CSE',
    semester: 6,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },
  {
    code: 'PEC-CS601A',
    name: 'Machine Learning & Statistical Pattern Recognition',
    branch: 'CSE',
    semester: 6,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PEC',
  },
  {
    code: 'PEC-CS602A',
    name: 'Distributed Systems & Cloud Computing Basics',
    branch: 'CSE',
    semester: 6,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PEC',
  },

  // ECE
  {
    code: 'EC601',
    name: 'Control Systems & Instrumentation',
    branch: 'ECE',
    semester: 6,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },
  {
    code: 'PE-EC601A',
    name: 'VLSI Design & Verilog HDL',
    branch: 'ECE',
    semester: 6,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PEC',
  },

  // EE
  {
    code: 'PC-EE601',
    name: 'Power System - II (Fault Analysis & Stability)',
    branch: 'EE',
    semester: 6,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },
  {
    code: 'PC-EE602',
    name: 'Power Electronics & Inverters',
    branch: 'EE',
    semester: 6,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },

  // ME
  {
    code: 'PC-ME601',
    name: 'Automation in Manufacturing & CNC Systems',
    branch: 'ME',
    semester: 6,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },
  {
    code: 'PC-ME602',
    name: 'Internal Combustion Engines & Gas Turbines',
    branch: 'ME',
    semester: 6,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },

  // CE
  {
    code: 'CE(PC)601',
    name: 'Design of Steel Structures (IS 800)',
    branch: 'CE',
    semester: 6,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },
  {
    code: 'CE(PC)602',
    name: 'Highway & Transportation Engineering',
    branch: 'CE',
    semester: 6,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },

  // ========================================================
  // SEMESTER 7
  // ========================================================
  // CSE
  {
    code: 'PEC-CS701A',
    name: 'Cloud Computing & Serverless Architectures',
    branch: 'CSE',
    semester: 7,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PEC',
  },
  {
    code: 'PEC-CS702A',
    name: 'Cryptography & Cyber Security',
    branch: 'CSE',
    semester: 7,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PEC',
  },
  {
    code: 'OEC-CS701A',
    name: 'Cyber Law, IPR and Ethics in AI',
    branch: 'CSE',
    semester: 7,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'OEC',
  },
  {
    code: 'PROJ-CS701',
    name: 'Project Phase-I / Major Capstone Project',
    branch: 'CSE',
    semester: 7,
    credits: 3,
    type: 'Sessional',
    syllabusCategory: 'PROJ',
  },

  // ECE
  {
    code: 'EC701',
    name: 'Wireless & Cellular Mobile Communication',
    branch: 'ECE',
    semester: 7,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },
  {
    code: 'PE-EC701A',
    name: 'Internet of Things (IoT) & Smart Sensors',
    branch: 'ECE',
    semester: 7,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PEC',
  },

  // EE
  {
    code: 'PC-EE701',
    name: 'Electric Drives & Industrial Traction',
    branch: 'EE',
    semester: 7,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },
  {
    code: 'OE-EE701A',
    name: 'High Voltage Engineering & Substation Design',
    branch: 'EE',
    semester: 7,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'OEC',
  },

  // ME
  {
    code: 'PC-ME701',
    name: 'Advanced Manufacturing Technology & Additive 3D Printing',
    branch: 'ME',
    semester: 7,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },

  // CE
  {
    code: 'CE(PC)701',
    name: 'Geotechnical Engineering - II (Foundation Design)',
    branch: 'CE',
    semester: 7,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },

  // ========================================================
  // SEMESTER 8
  // ========================================================
  // CSE
  {
    code: 'PEC-CS801A',
    name: 'Deep Learning, LLMs & Natural Language Processing',
    branch: 'CSE',
    semester: 8,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PEC',
  },
  {
    code: 'OEC-CS801A',
    name: 'Entrepreneurship Development & Startup Incubation',
    branch: 'ALL',
    semester: 8,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'OEC',
  },
  {
    code: 'PROJ-CS802',
    name: 'Project Phase-II & Comprehensive Defense Viva',
    branch: 'CSE',
    semester: 8,
    credits: 6,
    type: 'Sessional',
    syllabusCategory: 'PROJ',
  },

  // ECE
  {
    code: 'PE-EC801A',
    name: 'Satellite Communication & Radar Systems',
    branch: 'ECE',
    semester: 8,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PEC',
  },

  // EE
  {
    code: 'PC-EE801',
    name: 'Utilization of Electrical Energy & Smart Grids',
    branch: 'EE',
    semester: 8,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },

  // ME
  {
    code: 'PC-ME801',
    name: 'Total Quality Management & Six Sigma (TQM)',
    branch: 'ME',
    semester: 8,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'PCC',
  },

  // CE
  {
    code: 'CE(OE)801A',
    name: 'Disaster Preparedness, Mitigation & Management',
    branch: 'CE',
    semester: 8,
    credits: 3,
    type: 'Theory',
    syllabusCategory: 'OEC',
  },
];

export const BRANCH_NAMES: Record<string, string> = {
  CSE: 'Computer Science & Engineering',
  ECE: 'Electronics & Communication Engineering',
  EE: 'Electrical Engineering',
  ME: 'Mechanical Engineering',
  CE: 'Civil Engineering',
};
