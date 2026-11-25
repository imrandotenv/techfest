export type SyllabusBranch =
  | 'CSE'
  | 'CSE-AIML'
  | 'CSE-DS'
  | 'ECE'
  | 'EE'
  | 'EEE'
  | 'ME'
  | 'CE';

export type SubjectCategory =
  | 'PCC'
  | 'ESC'
  | 'BS'
  | 'BSC'
  | 'HSMC'
  | 'PEC'
  | 'OEC'
  | 'MC'
  | 'PROJ';

export type SubjectType =
  | 'THEORY'
  | 'LAB'
  | 'SESSIONAL'
  | 'ELECTIVE'
  | 'MANDATORY';

export interface SwayamCourseRef {
  title: string;
  instructor: string;
  institute: string;
  url: string;
  duration: string;
  platform: 'NPTEL' | 'SWAYAM';
}

export interface MakautSubject {
  code: string;
  name: string;
  credits: number;
  category: SubjectCategory;
  type: SubjectType;
  swayamCourses: SwayamCourseRef[];
}

export const SYLLABUS_BRANCHES: Array<{ code: SyllabusBranch; name: string }> = [
  { code: 'CSE', name: 'Computer Science & Engineering' },
  { code: 'CSE-AIML', name: 'CSE (Artificial Intelligence & Machine Learning)' },
  { code: 'CSE-DS', name: 'CSE (Data Science)' },
  { code: 'ECE', name: 'Electronics & Communication Engineering' },
  { code: 'EE', name: 'Electrical Engineering' },
  { code: 'EEE', name: 'Electrical & Electronics Engineering' },
  { code: 'ME', name: 'Mechanical Engineering' },
  { code: 'CE', name: 'Civil Engineering' },
];

function inferCategory(code: string, type: SubjectType): SubjectCategory {
  const c = code.toUpperCase();
  if (c.startsWith('PROJ')) return 'PROJ';
  if (c.startsWith('MC')) return 'MC';
  if (c.startsWith('HSMC') || c.startsWith('HS-HU') || c.startsWith('HM-HU')) return 'HSMC';
  if (c.startsWith('OEC') || c.startsWith('OE-')) return 'OEC';
  if (c.startsWith('PEC') || c.startsWith('PE-')) return 'PEC';
  if (c.startsWith('ESC') || c.startsWith('ES-')) return 'ESC';
  if (c.startsWith('BSC') || c.startsWith('BS-')) return 'BS';
  if (type === 'ELECTIVE') return 'PEC';
  if (type === 'MANDATORY') return 'MC';
  if (type === 'SESSIONAL') return 'PROJ';
  return 'PCC';
}

function sub(
  code: string,
  name: string,
  type: SubjectType,
  credits: number,
  swayamCourses: SwayamCourseRef[] = [],
  category?: SubjectCategory
): MakautSubject {
  return {
    code,
    name,
    type,
    credits,
    category: category ?? inferCategory(code, type),
    swayamCourses,
  };
}

const SEM_1_COMMON: MakautSubject[] = [
  sub('BS-PH101', 'Physics-I', 'THEORY', 4, [
    {
      title: 'Engineering Physics: Oscillations, Waves & Optics',
      instructor: 'Prof. S. Pramanik',
      institute: 'IIT Kharagpur',
      url: 'https://nptel.ac.in/courses/115105099',
      duration: '12 Weeks',
      platform: 'NPTEL',
    },
  ]),
  sub('BS-CH101', 'Chemistry-I', 'THEORY', 4, [
    {
      title: 'Engineering Chemistry & Spectroscopy',
      instructor: 'Prof. K. Mangala Sunder',
      institute: 'IIT Madras',
      url: 'https://nptel.ac.in/courses/104106089',
      duration: '12 Weeks',
      platform: 'NPTEL',
    },
  ]),
  sub('BS-M101', 'Mathematics-IA', 'THEORY', 4, [
    {
      title: 'Engineering Mathematics - I',
      instructor: 'Prof. Jitendra Kumar',
      institute: 'IIT Kharagpur',
      url: 'https://nptel.ac.in/courses/111105121',
      duration: '12 Weeks',
      platform: 'NPTEL',
    },
  ]),
  sub('BS-M102', 'Mathematics-IB', 'THEORY', 4, [
    {
      title: 'Calculus of Several Real Variables',
      instructor: 'Prof. Joydeep Dutta',
      institute: 'IIT Kanpur',
      url: 'https://nptel.ac.in/courses/111104092',
      duration: '8 Weeks',
      platform: 'NPTEL',
    },
  ]),
  sub('ES-EE101', 'Basic Electrical Engineering', 'THEORY', 4, [
    {
      title: 'Basic Electrical Technology',
      instructor: 'Prof. L. Umanand',
      institute: 'IISc Bangalore',
      url: 'https://nptel.ac.in/courses/108108076',
      duration: '12 Weeks',
      platform: 'NPTEL',
    },
  ]),
];

const SEM_2_COMMON: MakautSubject[] = [
  sub('ES-CS201', 'Programming for Problem Solving', 'THEORY', 3, [
    {
      title: 'Problem Solving Through Programming in C',
      instructor: 'Prof. Anupam Basu',
      institute: 'IIT Kharagpur',
      url: 'https://nptel.ac.in/courses/106105171',
      duration: '12 Weeks',
      platform: 'NPTEL',
    },
  ]),
  sub('BS-M201', 'Mathematics-IIA', 'THEORY', 4, [
    {
      title: 'Ordinary Differential Equations & Applications',
      instructor: 'Prof. P. D. Srivastava',
      institute: 'IIT Kharagpur',
      url: 'https://nptel.ac.in/courses/111105093',
      duration: '12 Weeks',
      platform: 'NPTEL',
    },
  ]),
  sub('BS-M202', 'Mathematics-IIB', 'THEORY', 4, [
    {
      title: 'Probability and Statistics for Engineers',
      instructor: 'Prof. Somesh Kumar',
      institute: 'IIT Kharagpur',
      url: 'https://nptel.ac.in/courses/111105041',
      duration: '12 Weeks',
      platform: 'NPTEL',
    },
  ]),
  sub('HM-HU201', 'English', 'THEORY', 2, [
    {
      title: 'Technical English for Engineers',
      instructor: 'Prof. Aysha Iqbal Viswamohan',
      institute: 'IIT Madras',
      url: 'https://nptel.ac.in/courses/109106094',
      duration: '8 Weeks',
      platform: 'NPTEL',
    },
  ]),
];

const CSE_SYLLABUS: Record<number, MakautSubject[]> = {
  1: SEM_1_COMMON,
  2: SEM_2_COMMON,
  3: [
    sub('ESC 301', 'Analog and Digital Electronics', 'THEORY', 3, [
      {
        title: 'Digital Electronic Circuits',
        instructor: 'Prof. Goutam Saha',
        institute: 'IIT Kharagpur',
        url: 'https://nptel.ac.in/courses/108105132',
        duration: '12 Weeks',
        platform: 'NPTEL',
      },
    ]),
    sub('PCC-CS301', 'Data Structure & Algorithms', 'THEORY', 3, [
      {
        title: 'Programming, Data Structures and Algorithms',
        instructor: 'Prof. Madhavan Mukund',
        institute: 'CMI / IIT Madras',
        url: 'https://nptel.ac.in/courses/106106145',
        duration: '8 Weeks',
        platform: 'NPTEL',
      },
    ]),
    sub('PCC-CS302', 'Computer Organisation', 'THEORY', 3, [
      {
        title: 'Computer Organization and Architecture',
        instructor: 'Prof. Jatindra Kumar Deka',
        institute: 'IIT Guwahati',
        url: 'https://nptel.ac.in/courses/106103180',
        duration: '12 Weeks',
        platform: 'NPTEL',
      },
    ]),
    sub('BSC 301', 'Mathematics-III (Differential Calculus)', 'THEORY', 2, [
      {
        title: 'Transform Calculus and its Applications',
        instructor: 'Prof. Adrijit Goswami',
        institute: 'IIT Kharagpur',
        url: 'https://nptel.ac.in/courses/111105123',
        duration: '12 Weeks',
        platform: 'NPTEL',
      },
    ]),
    sub('HSMC 301', 'Economics for Engineers (Humanities-II)', 'THEORY', 3),
    sub('PCC-CS393', 'IT Workshop (Sci Lab/MATLAB/Python/R)', 'LAB', 2),
    sub('ESC 391', 'Analog and Digital Electronics Lab', 'LAB', 2),
    sub('PCC-CS391', 'Data Structure & Algorithms Lab', 'LAB', 2),
    sub('PCC-CS392', 'Computer Organisation Lab', 'LAB', 2),
  ],
  4: [
    sub('PCC-CS401', 'Discrete Mathematics', 'THEORY', 4, [
      {
        title: 'Discrete Mathematics',
        instructor: 'Prof. Sudarshan Iyengar',
        institute: 'IIT Ropar',
        url: 'https://nptel.ac.in/courses/106106183',
        duration: '12 Weeks',
        platform: 'NPTEL',
      },
    ]),
    sub('PCC-CS402', 'Computer Architecture', 'THEORY', 3),
    sub('PCC-CS403', 'Formal Language & Automata Theory', 'THEORY', 3),
    sub('PCC-CS404', 'Design & Analysis of Algorithms', 'THEORY', 3, [
      {
        title: 'Design and Analysis of Algorithms',
        instructor: 'Prof. Madhavan Mukund',
        institute: 'IIT Madras',
        url: 'https://nptel.ac.in/courses/106106131',
        duration: '8 Weeks',
        platform: 'NPTEL',
      },
    ]),
    sub('BSC 401', 'Biology', 'THEORY', 3),
    sub('MC401', 'Environmental Sciences', 'MANDATORY', 1),
    sub('PCC-CS492', 'Computer Architecture Lab', 'LAB', 2),
    sub('PCC-CS494', 'Design & Analysis of Algorithms Lab', 'LAB', 2),
  ],
  5: [
    sub('ESC501', 'Software Engineering', 'THEORY', 3),
    sub('PCC-CS501', 'Compiler Design', 'THEORY', 3),
    sub('PCC-CS502', 'Operating Systems', 'THEORY', 3, [
      {
        title: 'Introduction to Operating Systems',
        instructor: 'Prof. Chester Rebeiro',
        institute: 'IIT Madras',
        url: 'https://nptel.ac.in/courses/106106144',
        duration: '8 Weeks',
        platform: 'NPTEL',
      },
    ]),
    sub('PCC-CS503', 'Object Oriented Programming', 'THEORY', 3),
    sub('HSMC-501', 'Introduction to Industrial Management (Humanities III)', 'THEORY', 3),
    sub('PEC-IT501A', 'Theory of Computation', 'ELECTIVE', 3),
    sub('PEC-IT501B', 'Artificial Intelligence', 'ELECTIVE', 3),
    sub('PEC-IT501C', 'Advanced Computer Architecture', 'ELECTIVE', 3),
    sub('PEC-IT501D', 'Computer Graphics', 'ELECTIVE', 3),
    sub('MC-CS501A', 'Constitution of India', 'MANDATORY', 0),
    sub('MC-CS501B', 'Essence of Indian Knowledge Tradition', 'MANDATORY', 0),
    sub('ESC-591', 'Software Engineering Lab', 'LAB', 2),
    sub('PCC-CS592', 'Operating Systems Lab', 'LAB', 2),
    sub('PCC-CS593', 'Object Oriented Programming Lab', 'LAB', 2),
  ],
  6: [
    sub('PCC-CS601', 'Database Management Systems', 'THEORY', 3, [
      {
        title: 'Data Base Management System',
        instructor: 'Prof. Partha Pratim Das',
        institute: 'IIT Kharagpur',
        url: 'https://nptel.ac.in/courses/106105175',
        duration: '8 Weeks',
        platform: 'NPTEL',
      },
    ]),
    sub('PCC-CS602', 'Computer Networks', 'THEORY', 3, [
      {
        title: 'Computer Networks and Internet Protocol',
        instructor: 'Prof. Soumya Kanti Ghosh',
        institute: 'IIT Kharagpur',
        url: 'https://nptel.ac.in/courses/106105183',
        duration: '12 Weeks',
        platform: 'NPTEL',
      },
    ]),
    sub('PEC-IT601A', 'Advanced Algorithms', 'ELECTIVE', 3),
    sub('PEC-IT601B', 'Distributed Database Management System', 'ELECTIVE', 3),
    sub('PEC-IT601C', 'Signals & Systems', 'ELECTIVE', 3),
    sub('PEC-IT601D', 'Image Processing', 'ELECTIVE', 3),
    sub('PEC-IT602A', 'Parallel and Distributed Algorithms', 'ELECTIVE', 3),
    sub('PEC-IT602B', 'Data Warehousing & Data Mining', 'ELECTIVE', 3),
    sub('PEC-IT602C', 'Human Computer Interaction', 'ELECTIVE', 3),
    sub('PEC-IT602D', 'Pattern Recognition', 'ELECTIVE', 3),
    sub('OEC-IT601A', 'Numerical Methods', 'ELECTIVE', 3),
    sub('OEC-IT601B', 'Human Resource Development and Organizational Behavior', 'ELECTIVE', 3),
    sub('PROJ-CS601', 'Research Methodology', 'THEORY', 3),
    sub('PCC-CS691', 'Database Management Systems Lab', 'LAB', 2),
    sub('PCC-CS692', 'Computer Networks Lab', 'LAB', 2),
  ],
  7: [
    sub('PEC-CS701A', 'Quantum Computing', 'ELECTIVE', 3),
    sub('PEC-CS701B', 'Cloud Computing', 'ELECTIVE', 3),
    sub('PEC-CS701C', 'Digital Signal Processing', 'ELECTIVE', 3),
    sub('PEC-CS701D', 'Multi-agent Intelligent Systems', 'ELECTIVE', 3),
    sub('PEC-CS701E', 'Machine Learning', 'ELECTIVE', 3),
    sub('PEC-CS702A', 'Neural Networks and Deep Learning', 'ELECTIVE', 3),
    sub('PEC-CS702B', 'Soft Computing', 'ELECTIVE', 3),
    sub('PEC-CS702C', 'Ad-Hoc and Sensor Networks', 'ELECTIVE', 3),
    sub('PEC-CS702D', 'Information Theory and Coding', 'ELECTIVE', 3),
    sub('PEC-CS702E', 'Cyber Security', 'ELECTIVE', 3),
    sub('OEC-CS701A', 'Operations Research', 'ELECTIVE', 3),
    sub('OEC-CS701B', 'Multimedia Systems', 'ELECTIVE', 3),
    sub('OEC-CS701C', 'Introduction to Philosophical Thoughts', 'ELECTIVE', 3),
    sub('HSMC701', 'Project Management and Entrepreneurship', 'THEORY', 3),
    sub('PROJ-CS781', 'Project-II', 'SESSIONAL', 6),
  ],
  8: [
    sub('PEC-CS801A', 'Signals and Networks', 'ELECTIVE', 3),
    sub('PEC-CS801B', 'Cryptography & Network Security', 'ELECTIVE', 3),
    sub('PEC-CS801C', 'Speech and Natural Language Processing', 'ELECTIVE', 3),
    sub('PEC-CS801D', 'Web and Internet Technology', 'ELECTIVE', 3),
    sub('PEC-CS801E', 'Internet of Things', 'ELECTIVE', 3),
    sub('OEC-CS801A', 'Big Data Analysis', 'ELECTIVE', 3),
    sub('OEC-CS801B', 'Cyber Law and Ethics', 'ELECTIVE', 3),
    sub('OEC-CS801C', 'Mobile Computing', 'ELECTIVE', 3),
    sub('OEC-CS801D', 'Robotics', 'ELECTIVE', 3),
    sub('OEC-CS801E', 'Soft Skill & Interpersonal Communication', 'ELECTIVE', 3),
    sub('OEC-CS802A', 'E-Commerce and ERP', 'ELECTIVE', 3),
    sub('OEC-CS802B', 'Micro-electronics and VLSI Design', 'ELECTIVE', 3),
    sub('OEC-CS802C', 'Economic Policies in India', 'ELECTIVE', 3),
    sub('PROJ-CS881', 'Project-III', 'SESSIONAL', 6),
  ],
};

const CSE_AIML_SYLLABUS: Record<number, MakautSubject[]> = {
  1: SEM_1_COMMON,
  2: SEM_2_COMMON,
  3: [
    sub('ESC301', 'Analog and Digital Electronics', 'THEORY', 3),
    sub('PCC-CS301', 'Data Structure & Algorithms', 'THEORY', 3),
    sub('PCC-CS302', 'Computer Organization', 'THEORY', 3),
    sub('BSC AIML301', 'Linear Algebra', 'THEORY', 2),
    sub('HSMC 301', 'Economics for Engineers (Humanities-II)', 'THEORY', 3),
    sub('PCC-CS391', 'Data Structure & Algorithms Lab', 'LAB', 2),
    sub('ESC391', 'Analog and Digital Electronics Lab', 'LAB', 2),
    sub('PCC-CS392', 'Computer Organization Lab', 'LAB', 2),
    sub('PCC-CS393', 'IT Workshop (Python I)', 'LAB', 2),
  ],
  4: [
    sub('PCCCS401', 'Discrete Mathematics', 'THEORY', 3),
    sub('PCCAIML401', 'Artificial Intelligence', 'THEORY', 3),
    sub('PCCAIML402', 'Optimization Techniques', 'THEORY', 3),
    sub('PCCCS404', 'Design and Analysis of Algorithm', 'THEORY', 3),
    sub('BSC401', 'Biology', 'THEORY', 2),
    sub('MC401', 'Environmental Science', 'MANDATORY', 2),
    sub('PCCAIML491', 'Artificial Intelligence Lab', 'LAB', 2),
    sub('PCCCS494', 'Design and Analysis of Algorithm Lab', 'LAB', 2),
    sub('PCCAIML492', 'Python II / R Programming Language Lab', 'LAB', 2),
  ],
  5: [
    sub('PCCAIML501', 'Probability and Statistics', 'THEORY', 3),
    sub('PCCCS502', 'Operating System', 'THEORY', 3),
    sub('PCCCS503', 'Object Oriented Programming', 'THEORY', 3),
    sub('PCCAIML502', 'Introduction to Machine Learning', 'THEORY', 3),
    sub('HSMC501', 'Introduction to Industrial Management', 'THEORY', 2),
    sub('PECAIML501A', 'Cloud Computing', 'ELECTIVE', 3),
    sub('PECAIML501B', 'Pattern Recognition', 'ELECTIVE', 3),
    sub('PECAIML501C', 'Graph Theory', 'ELECTIVE', 3),
    sub('PCCCS592', 'Operating System Lab', 'LAB', 2),
    sub('PCCCS593', 'Object Oriented Programming & Java Lab', 'LAB', 2),
    sub('PCCAIML592', 'Machine Learning Lab', 'LAB', 2),
  ],
  6: [
    sub('PCCAIML601', 'Machine Learning Applications', 'THEORY', 2),
    sub('PCCAIML602', 'Deep Learning', 'THEORY', 3),
    sub('PCCAIML603', 'Soft Computing', 'THEORY', 3),
    sub('PCCCS602', 'Computer Networks', 'THEORY', 3),
    sub('PECAIML601A', 'Big Data Analytics', 'ELECTIVE', 3),
    sub('PECAIML601B', 'Data Mining', 'ELECTIVE', 3),
    sub('PECAIML601C', 'Distributed System', 'ELECTIVE', 3),
    sub('PECAIML601D', 'Game Theory', 'ELECTIVE', 3),
    sub('OECAIML601A', 'Database Management System', 'ELECTIVE', 3),
    sub('OECAIML601B', 'Human Computer Interaction', 'ELECTIVE', 3),
    sub('OECAIML601C', 'Neural Network', 'ELECTIVE', 3),
    sub('OECAIML601D', 'Cryptography and Network Security', 'ELECTIVE', 3),
    sub('PCCAIML691', 'Machine Learning Applications Lab', 'LAB', 2),
    sub('PCCAIML693', 'Soft Computing Lab', 'LAB', 2),
    sub('PCCCS692', 'Computer Networks Lab', 'LAB', 2),
  ],
  7: [
    sub('PECAIML701A', 'Social Network Analysis', 'ELECTIVE', 3),
    sub('PECAIML701B', 'Computer Vision', 'ELECTIVE', 3),
    sub('PECAIML701C', 'Quantum Computing', 'ELECTIVE', 3),
    sub('PECAIML701D', 'Multi Agent Intelligent System', 'ELECTIVE', 3),
    sub('PECAIML702A', 'Ecommerce and ERP', 'ELECTIVE', 3),
    sub('PECAIML702B', 'Information Theory and Coding', 'ELECTIVE', 3),
    sub('PECAIML702C', 'Computer Aided Design', 'ELECTIVE', 3),
    sub('PECAIML702D', 'Digital Signal Processing', 'ELECTIVE', 3),
    sub('OECAIML701A', 'Internet of Things', 'ELECTIVE', 3),
    sub('OECAIML701B', 'Bio Informatics', 'ELECTIVE', 3),
    sub('OECAIML701C', 'Robotics', 'ELECTIVE', 3),
    sub('OECAIML701D', 'Compiler Design', 'ELECTIVE', 3),
    sub('HSMC701', 'Project Management and Entrepreneurship', 'THEORY', 2),
    sub('PROJAIML781', 'Project I', 'SESSIONAL', 6),
  ],
  8: [
    sub('PECAIML801A', 'Natural Language Processing', 'ELECTIVE', 3),
    sub('PECAIML801B', 'Cyber Law and Ethics', 'ELECTIVE', 3),
    sub('PECAIML801C', 'Mobile Computing', 'ELECTIVE', 3),
    sub('OECAIML801A', 'Economic Policies in India', 'ELECTIVE', 3),
    sub('OECAIML801B', 'Microelectronics and VLSI', 'ELECTIVE', 3),
    sub('OECAIML801C', 'Software Engineering', 'ELECTIVE', 3),
    sub('OECAIML802A', 'Organization Behaviour', 'ELECTIVE', 3),
    sub('OECAIML802B', 'Research Methodology', 'ELECTIVE', 3),
    sub('OECAIML802C', 'Soft Skill and Interpersonal Communication', 'ELECTIVE', 3),
    sub('PROJAIML881', 'Project II', 'SESSIONAL', 6),
  ],
};

const CSE_DS_SYLLABUS: Record<number, MakautSubject[]> = {
  1: SEM_1_COMMON,
  2: SEM_2_COMMON,
  3: [
    sub('ESC301', 'Analog and Digital Electronics', 'THEORY', 3),
    sub('PCC-CS301', 'Data Structure & Algorithms', 'THEORY', 3),
    sub('PCC-CS302', 'Computer Organization', 'THEORY', 3),
    sub('PCC-DS301', 'Introduction to Data Science', 'THEORY', 3),
    sub('BSC 301', 'Mathematics-III (Differential Calculus)', 'THEORY', 2),
    sub('HSMC 301', 'Economics for Engineers (Humanities-II)', 'THEORY', 3),
    sub('PCC-CS391', 'Data Structure & Algorithms Lab', 'LAB', 2),
    sub('ESC391', 'Analog and Digital Electronics Lab', 'LAB', 2),
    sub('PCC-CS392', 'Computer Organization Lab', 'LAB', 2),
    sub('PCC-DS391', 'Data Science Lab using Python', 'LAB', 2),
  ],
  4: [
    sub('PCC-CS401', 'Discrete Mathematics', 'THEORY', 4),
    sub('PCC-DS401', 'Database Management System', 'THEORY', 3),
    sub('PCC-CS403', 'Formal Language & Automata Theory', 'THEORY', 3),
    sub('PCC-CS404', 'Design & Analysis of Algorithms', 'THEORY', 3),
    sub('PCC-DS402', 'Data Mining', 'THEORY', 3),
    sub('BSC 401', 'Biology', 'THEORY', 3),
    sub('MC401', 'Environmental Sciences', 'MANDATORY', 0),
    sub('PCC-DS491', 'Database Management System Lab', 'LAB', 2),
    sub('PCC-CS494', 'Design & Analysis of Algorithms Lab', 'LAB', 2),
    sub('PCC-DS492', 'Data Mining Lab', 'LAB', 2),
  ],
  5: [
    sub('ESC501', 'Software Engineering', 'THEORY', 3),
    sub('PCC-DS501', 'Statistics for Data Science', 'THEORY', 3),
    sub('PCC-CS502', 'Operating Systems', 'THEORY', 3),
    sub('PCC-CS503', 'Object Oriented Programming', 'THEORY', 3),
    sub('HSMC-501', 'Introduction to Industrial Management (Humanities III)', 'THEORY', 3),
    sub('PEC-DS501A', 'Theory of Computation', 'ELECTIVE', 3),
    sub('PEC-DS501B', 'Mobile Computing and Applications', 'ELECTIVE', 3),
    sub('PEC-DS501C', 'Advanced Computer Architecture', 'ELECTIVE', 3),
    sub('PEC-DS501D', 'Computer Graphics', 'ELECTIVE', 3),
    sub('PEC-DS501E', 'Compiler Design', 'ELECTIVE', 3),
    sub('MC-CS501', 'Constitution of India / Essence of Indian Knowledge Tradition', 'MANDATORY', 0),
    sub('ESC-591', 'Software Engineering Lab', 'LAB', 2),
    sub('PCC-CS592', 'Operating Systems Lab', 'LAB', 2),
    sub('PCC-CS593', 'Object Oriented Programming Lab', 'LAB', 2),
  ],
  6: [
    sub('PCC-DS601', 'Artificial Intelligence', 'THEORY', 3),
    sub('PCC-DS602', 'Data Communication and Computer Networks', 'THEORY', 3),
    sub('PCC-DS603', 'Big Data Technology', 'THEORY', 3),
    sub('PEC-DS601A', 'Advanced Algorithms', 'ELECTIVE', 3),
    sub('PEC-DS601B', 'Distributed Systems', 'ELECTIVE', 3),
    sub('PEC-DS601C', 'Information Security', 'ELECTIVE', 3),
    sub('PEC-DS601D', 'Image Processing', 'ELECTIVE', 3),
    sub('PEC-DS601E', 'Machine Learning', 'ELECTIVE', 3),
    sub('PEC-DS602A', 'Parallel and Distributed Algorithms', 'ELECTIVE', 3),
    sub('PEC-DS602B', 'Data Warehousing', 'ELECTIVE', 3),
    sub('PEC-DS602C', 'Human Computer Interaction', 'ELECTIVE', 3),
    sub('PEC-DS602D', 'Data Analysis and Modeling Technique', 'ELECTIVE', 3),
    sub('OEC-DS601A', 'Numerical Methods', 'ELECTIVE', 3),
    sub('OEC-DS601B', 'Human Resource Development and Organizational Behavior', 'ELECTIVE', 3),
    sub('OEC-DS601C', 'Social Computing', 'ELECTIVE', 3),
    sub('PROJ-DS601', 'Research Methodology', 'THEORY', 3),
    sub('PCC-CS(DS)691', 'Artificial Intelligence Lab', 'LAB', 2),
    sub('PCC-CS692', 'Data Communication and Computer Networks Lab', 'LAB', 2),
    sub('PCC-DS693', 'Big Data Technology and OLAP Lab', 'LAB', 2),
  ],
  7: [
    sub('PEC-DS701A', 'Quantum Computing', 'ELECTIVE', 3),
    sub('PEC-DS701B', 'Cloud Computing', 'ELECTIVE', 3),
    sub('PEC-DS701C', 'Digital Signal Processing', 'ELECTIVE', 3),
    sub('PEC-DS701D', 'Multi-agent Intelligent Systems', 'ELECTIVE', 3),
    sub('PEC-DS701E', 'Time Series Analysis and Forecasting', 'ELECTIVE', 3),
    sub('PEC-DS701F', 'Data Visualization', 'ELECTIVE', 3),
    sub('PEC-DS702A', 'Neural Networks and Deep Learning', 'ELECTIVE', 3),
    sub('PEC-DS702B', 'Soft Computing', 'ELECTIVE', 3),
    sub('PEC-DS702C', 'Ad-Hoc and Sensor Networks', 'ELECTIVE', 3),
    sub('PEC-DS702D', 'Information Theory and Coding', 'ELECTIVE', 3),
    sub('PEC-DS702E', 'Surveillance and Cyber Security', 'ELECTIVE', 3),
    sub('PEC-DS702F', 'Pattern Recognition', 'ELECTIVE', 3),
    sub('OEC-DS701A', 'Operations Research', 'ELECTIVE', 3),
    sub('OEC-DS701B', 'Multimedia Technology', 'ELECTIVE', 3),
    sub('OEC-DS701C', 'Soft Skill & Interpersonal Communication', 'ELECTIVE', 3),
    sub('HSMC701', 'Project Management and Entrepreneurship', 'THEORY', 3),
    sub('PROJ-CS781', 'Project-II', 'SESSIONAL', 6),
  ],
  8: [
    sub('PEC-DS801A', 'Signals and Networks', 'ELECTIVE', 3),
    sub('PEC-DS801B', 'Quantum Cryptography and Network Security', 'ELECTIVE', 3),
    sub('PEC-DS801C', 'Natural Language Processing', 'ELECTIVE', 3),
    sub('PEC-DS801D', 'Computer Vision', 'ELECTIVE', 3),
    sub('PEC-DS801E', 'Web and Internet Technology', 'ELECTIVE', 3),
    sub('PEC-DS801F', 'Internet of Things', 'ELECTIVE', 3),
    sub('OEC-DS801A', 'Big Data Analysis', 'ELECTIVE', 3),
    sub('OEC-DS801B', 'Cyber Law and Ethics', 'ELECTIVE', 3),
    sub('OEC-DS801C', 'Mobile Computing', 'ELECTIVE', 3),
    sub('OEC-DS801D', 'Robotics', 'ELECTIVE', 3),
    sub('OEC-DS802A', 'Business Analytics', 'ELECTIVE', 3),
    sub('OEC-DS802B', 'Data Science Ethics', 'ELECTIVE', 3),
    sub('OEC-DS802C', 'Number Theory', 'ELECTIVE', 3),
    sub('PROJ-DS881', 'Project-III', 'SESSIONAL', 6),
  ],
};

const ECE_SYLLABUS: Record<number, MakautSubject[]> = {
  1: SEM_1_COMMON,
  2: SEM_2_COMMON,
  3: [
    sub('EC301', 'Electronic Devices', 'THEORY', 3, [
      {
        title: 'Semiconductor Devices and Circuits',
        instructor: 'Prof. Sanjiv Sambandan',
        institute: 'IISc Bangalore',
        url: 'https://nptel.ac.in/courses/108108112',
        duration: '12 Weeks',
        platform: 'NPTEL',
      },
    ]),
    sub('EC302', 'Digital System Design', 'THEORY', 3),
    sub('EC303', 'Signals and Systems', 'THEORY', 3),
    sub('EC304', 'Network Theory', 'THEORY', 3),
    sub('ES-CS301', 'Data Structure & Algorithm (ES)', 'THEORY', 3),
    sub('BS-M301', 'Probability & Statistics (BS)', 'THEORY', 3),
    sub('EC391', 'Electronic Devices Lab', 'LAB', 1),
    sub('EC392', 'Digital System Design Lab', 'LAB', 1),
    sub('ES-CS391', 'Data Structure Lab (ES)', 'LAB', 1),
    sub('MC381', 'Environmental Science', 'MANDATORY', 0),
  ],
  4: [
    sub('EC401', 'Analog Communication', 'THEORY', 3),
    sub('EC402', 'Analog Electronic Circuits', 'THEORY', 3),
    sub('EC403', 'Microprocessor & Microcontrollers', 'THEORY', 3),
    sub('ES-CS401', 'Design and Analysis of Algorithm (ES)', 'THEORY', 3),
    sub('BS-M401', 'Numerical Methods (BS)', 'THEORY', 2),
    sub('BS-B401', 'Biology for Engineers', 'THEORY', 3),
    sub('EC491', 'Analog Communication Lab', 'LAB', 1),
    sub('EC492', 'Analog Electronic Circuits Lab', 'LAB', 1),
    sub('EC493', 'Microprocessor & Microcontrollers Lab', 'LAB', 1),
    sub('BS-M(CS)491', 'Numerical Methods Lab', 'LAB', 1),
    sub('HS-HU481', 'Soft Skill Development Lab', 'LAB', 1),
  ],
  5: [
    sub('EC501', 'Electromagnetic Waves', 'THEORY', 3),
    sub('EC502', 'Computer Architecture', 'THEORY', 3),
    sub('EC503', 'Digital Communication & Stochastic Process', 'THEORY', 3.5),
    sub('EC504', 'Digital Signal Processing', 'THEORY', 3),
    sub('PE-EC505A', 'Nano Electronics', 'ELECTIVE', 3),
    sub('PE-EC505B', 'Speech and Audio Processing', 'ELECTIVE', 3),
    sub('PE-EC505C', 'Power Electronics', 'ELECTIVE', 3),
    sub('PE-EC505D', 'Scientific Computing', 'ELECTIVE', 3),
    sub('OE-EC506A', 'Soft Skill and Interpersonal Communication', 'ELECTIVE', 3),
    sub('OE-EC506B', 'Cyber Law & Intellectual Property Rights', 'ELECTIVE', 3),
    sub('OE-EC506C', 'Human Resource Management', 'ELECTIVE', 3),
    sub('EC591', 'Electromagnetic Wave Lab', 'LAB', 1),
    sub('EC592', 'Digital Communication Lab', 'LAB', 1),
    sub('EC593', 'Digital Signal Processing Lab', 'LAB', 1),
    sub('MC-HU581', 'Effective Technical Communication', 'SESSIONAL', 0),
  ],
  6: [
    sub('EC601', 'Control System & Instrumentation', 'THEORY', 3),
    sub('EC602', 'Computer Network', 'THEORY', 3),
    sub('PE-EC603A', 'Introduction to MEMS', 'ELECTIVE', 3),
    sub('PE-EC603B', 'Bio-Medical Electronics', 'ELECTIVE', 3),
    sub('PE-EC603C', 'CMOS VLSI Design', 'ELECTIVE', 3),
    sub('PE-EC603D', 'Information Theory & Coding', 'ELECTIVE', 3),
    sub('OE-EC604A', 'Electronic Measurements and Measuring Instruments', 'ELECTIVE', 3),
    sub('OE-EC604B', 'Operating System', 'ELECTIVE', 3),
    sub('OE-EC604C', 'Object Oriented Programming', 'ELECTIVE', 3),
    sub('HS-HU601', 'Economics for Engineers', 'THEORY', 3),
    sub('EC691', 'Control System and Instrumentation Lab', 'LAB', 1),
    sub('EC692', 'Computer Network Lab', 'LAB', 1),
    sub('EC681', 'Mini Project / Electronic Design Workshop', 'SESSIONAL', 2),
    sub('MC681', 'Universal Human Values', 'MANDATORY', 0),
  ],
  7: [
    sub('PE-EC701A', 'Microwave Theory and Techniques', 'ELECTIVE', 3),
    sub('PE-EC701B', 'Satellite Communication', 'ELECTIVE', 3),
    sub('PE-EC701C', 'Mobile Communication and Networks', 'ELECTIVE', 3),
    sub('PE-EC702A', 'Adaptive Signal Processing', 'ELECTIVE', 3),
    sub('PE-EC702B', 'Digital Image and Video Processing', 'ELECTIVE', 3),
    sub('PE-EC702C', 'Neural Network and Fuzzy Logic Control', 'ELECTIVE', 3),
    sub('PE-EC703A', 'Embedded System', 'ELECTIVE', 3),
    sub('PE-EC703B', 'Wireless Sensor Networks', 'ELECTIVE', 3),
    sub('PE-EC703C', 'Wavelet Transforms', 'ELECTIVE', 3),
    sub('OE-EC704A', 'Web Technology', 'ELECTIVE', 3),
    sub('OE-EC704B', 'Optimisation Technique', 'ELECTIVE', 3),
    sub('OE-EC704C', 'Entrepreneurship', 'ELECTIVE', 3),
    sub('HS-HU701', 'Principles of Management', 'THEORY', 2),
    sub('EC781', 'Industrial Training', 'SESSIONAL', 1),
    sub('EC782', 'Project Stage - I', 'SESSIONAL', 4),
  ],
  8: [
    sub('PE-EC801A', 'Antennas and Propagation', 'ELECTIVE', 3),
    sub('PE-EC801B', 'Fibre Optic Communication', 'ELECTIVE', 3),
    sub('PE-EC801C', 'Error Correcting Codes', 'ELECTIVE', 3),
    sub('PE-EC802A', 'Mixed Signal Design', 'ELECTIVE', 3),
    sub('PE-EC802B', 'Industrial Automation and Control', 'ELECTIVE', 3),
    sub('PE-EC802C', 'VLSI Design Automation', 'ELECTIVE', 3),
    sub('OE-EC803A', 'Internet of Things (IoT)', 'ELECTIVE', 3),
    sub('OE-EC803B', 'Big Data Analysis', 'ELECTIVE', 3),
    sub('OE-EC803C', 'Cyber Security', 'ELECTIVE', 3),
    sub('OE-EC804A', 'Artificial Intelligence', 'ELECTIVE', 3),
    sub('OE-EC804B', 'Microwave Integrated Circuits', 'ELECTIVE', 3),
    sub('OE-EC804C', 'Organisational Behaviour', 'ELECTIVE', 3),
    sub('EC881', 'Project Stage - II', 'SESSIONAL', 7.5),
    sub('EC882', 'Grand Viva', 'SESSIONAL', 1.5),
  ],
};

const EE_SYLLABUS: Record<number, MakautSubject[]> = {
  1: SEM_1_COMMON,
  2: SEM_2_COMMON,
  3: [
    sub('PC-EE 301', 'Electric Circuit Theory', 'THEORY', 4),
    sub('PC-EE 302', 'Analog Electronics', 'THEORY', 3),
    sub('PC-EE 303', 'Electromagnetic Field Theory', 'THEORY', 3),
    sub('ES-ME 301', 'Engineering Mechanics', 'THEORY', 3),
    sub('BS-M 301', 'Mathematics-III', 'THEORY', 3),
    sub('BS-EE301', 'Biology for Engineers', 'THEORY', 3),
    sub('MC-EE 301', 'Indian Constitution', 'MANDATORY', 0),
    sub('PC-EE 391', 'Electric Circuit Theory Laboratory', 'LAB', 1),
    sub('PC-EE 392', 'Analog Electronics Laboratory', 'LAB', 1),
    sub('PC-CS 391', 'Numerical Methods Laboratory', 'LAB', 1),
  ],
  4: [
    sub('PC-EE 401', 'Electric Machine-I', 'THEORY', 3),
    sub('PC-EE 402', 'Digital Electronic', 'THEORY', 3),
    sub('PC-EE 403', 'Electrical and Electronics Measurement', 'THEORY', 3),
    sub('ES-EE 401', 'Thermal Power Engineering', 'THEORY', 3),
    sub('HM-EE401', 'Values and Ethics in Profession', 'THEORY', 3),
    sub('MC-EE401', 'Environmental Science', 'MANDATORY', 0),
    sub('PC-EE 491', 'Electric Machine-I Laboratory', 'LAB', 1),
    sub('PC-EE 492', 'Digital Electronics Laboratory', 'LAB', 1),
    sub('PC-EE 493', 'Electrical and Electronic Measurement Laboratory', 'LAB', 1),
    sub('ES-ME 491', 'Thermal Power Engineering Laboratory', 'LAB', 1),
  ],
  5: [
    sub('PC-EE 501', 'Electric Machine-II', 'THEORY', 3),
    sub('PC-EE 502', 'Power System-I', 'THEORY', 3),
    sub('PC-EE 503', 'Control System', 'THEORY', 3),
    sub('PC-EE 504', 'Power Electronics', 'THEORY', 3),
    sub('PE-EE 501A', 'High Voltage Engineering', 'ELECTIVE', 3),
    sub('PE-EE 501B', 'Power Plant Engineering', 'ELECTIVE', 3),
    sub('PE-EE 501C', 'Renewable & Non-Conventional Energy', 'ELECTIVE', 3),
    sub('OE-EE 501A', 'Data Structure & Algorithm', 'ELECTIVE', 3),
    sub('OE-EE 501B', 'Object Oriented Programming', 'ELECTIVE', 3),
    sub('OE-EE 501C', 'Computer Organization & Architecture', 'ELECTIVE', 3),
    sub('PC-EE 591', 'Electric Machine-II Laboratory', 'LAB', 1),
    sub('PC-EE 592', 'Power System-I Laboratory', 'LAB', 1),
    sub('PC-EE 593', 'Control System Laboratory', 'LAB', 1),
    sub('PC-EE 594', 'Power Electronics Laboratory', 'LAB', 1),
  ],
  6: [
    sub('PC-EE 601', 'Power System-II', 'THEORY', 3),
    sub('PC-EE-602', 'Microprocessor & Microcontroller', 'THEORY', 3),
    sub('PE-EE 601A', 'Digital Control System', 'ELECTIVE', 3),
    sub('PE-EE 601B', 'HVDC Transmission', 'ELECTIVE', 3),
    sub('PE-EE 601C', 'Electrical Machine Design', 'ELECTIVE', 3),
    sub('PE-EE 602A', 'Electrical and Hybrid Vehicle', 'ELECTIVE', 3),
    sub('PE-EE 602B', 'Power Quality & FACTS', 'ELECTIVE', 3),
    sub('PE-EE 602C', 'Industrial Electrical Systems', 'ELECTIVE', 3),
    sub('OE-EE 601A', 'Digital Signal Processing', 'ELECTIVE', 3),
    sub('OE-EE 601B', 'Communication Engineering', 'ELECTIVE', 3),
    sub('OE-EE 601C', 'VLSI & Microelectronics', 'ELECTIVE', 3),
    sub('HM-EE 601', 'Economics for Engineers', 'THEORY', 3),
    sub('PC-EE 691', 'Power System-II Laboratory', 'LAB', 1),
    sub('PC-EE692', 'Microprocessor & Microcontroller Laboratory', 'LAB', 1),
    sub('PC-EE 681', 'Electrical & Electronic Design Laboratory', 'LAB', 3),
  ],
  7: [
    sub('PC-EE 701', 'Electric Drive', 'THEORY', 3),
    sub('PE-EE 701A', 'Control System Design', 'ELECTIVE', 3),
    sub('PE-EE 701B', 'Electrical Energy Conservation & Auditing', 'ELECTIVE', 3),
    sub('PE-EE 701C', 'Power Generation Economics', 'ELECTIVE', 3),
    sub('OE-EE701A', 'Artificial Intelligence', 'ELECTIVE', 3),
    sub('OE-EE701B', 'Internet of Things', 'ELECTIVE', 3),
    sub('OE-EE701C', 'Computer Graphics', 'ELECTIVE', 3),
    sub('OE-EE702A', 'Embedded System', 'ELECTIVE', 3),
    sub('OE-EE702B', 'Digital Image Processing', 'ELECTIVE', 3),
    sub('OE-EE702C', 'Computer Network', 'ELECTIVE', 3),
    sub('HM-EE701', 'Principle of Management', 'THEORY', 3),
    sub('PC-EE 791', 'Electric Drive Laboratory', 'LAB', 1),
    sub('PW-EE 781', 'Project Stage-I', 'SESSIONAL', 2),
    sub('PW-EE782', 'Seminar', 'SESSIONAL', 1),
  ],
  8: [
    sub('PC-EE 801', 'Utilization of Electric Power', 'THEORY', 3),
    sub('PE-EE 801A', 'Line-commutated and Active PWM Rectifiers', 'ELECTIVE', 3),
    sub('PE-EE 801B', 'Power System Dynamics & Control', 'ELECTIVE', 3),
    sub('PE-EE 801C', 'Advanced Electric Drives', 'ELECTIVE', 3),
    sub('PE-EE 801D', 'Industrial Automation and Control', 'ELECTIVE', 3),
    sub('OE-EE 801A', 'Soft Computing Techniques', 'ELECTIVE', 3),
    sub('OE-EE 801B', 'Biomedical Instrumentation', 'ELECTIVE', 3),
    sub('OE-EE 801C', 'Introduction to Machine Learning', 'ELECTIVE', 3),
    sub('OE-EE 801D', 'Sensors and Transducers', 'ELECTIVE', 3),
    sub('PW-EE 881', 'Project Stage-II', 'SESSIONAL', 8),
  ],
};

const EEE_SYLLABUS: Record<number, MakautSubject[]> = {
  1: SEM_1_COMMON,
  2: SEM_2_COMMON,
  3: [
    sub('PC-EEE-301', 'Electric Circuit Theory', 'THEORY', 4),
    sub('PC-EEE-302', 'Analog Electronics', 'THEORY', 3),
    sub('PC-EEE-303', 'Electromagnetic Field Theory', 'THEORY', 3),
    sub('ES-ME-301', 'Engineering Mechanics', 'THEORY', 3),
    sub('BS-M-301', 'Mathematics-III', 'THEORY', 3),
    sub('BS-EEE-301', 'Biology for Engineers', 'THEORY', 3),
    sub('MC-EEE-301', 'Indian Constitution', 'MANDATORY', 0),
    sub('PC-EEE-391', 'Electric Circuit Theory Laboratory', 'LAB', 1),
    sub('PC-EEE-392', 'Analog Electronics Laboratory', 'LAB', 1),
    sub('PC-CS-391', 'Numerical Methods Laboratory', 'LAB', 1),
  ],
  4: [
    sub('PC-EEE-401', 'Electric Machine-I', 'THEORY', 3),
    sub('PC-EEE-402', 'Digital Electronics', 'THEORY', 3),
    sub('PC-EEE-403', 'Electrical and Electronic Measurement', 'THEORY', 3),
    sub('ES-EEE-401', 'Thermal Power Engineering', 'THEORY', 3),
    sub('HM-EEE-401', 'Values and Ethics in Profession', 'THEORY', 3),
    sub('MC-EEE-401', 'Environmental Science', 'MANDATORY', 0),
    sub('PC-EEE-491', 'Electric Machine-I Laboratory', 'LAB', 1),
    sub('PC-EEE-492', 'Digital Electronics Laboratory', 'LAB', 1),
    sub('PC-EEE-493', 'Electrical and Electronic Measurement Laboratory', 'LAB', 1),
    sub('ES-ME-491', 'Thermal Power Engineering Laboratory', 'LAB', 1),
  ],
  5: [
    sub('PC-EEE-501', 'Electric Machine-II', 'THEORY', 3),
    sub('PC-EEE-502', 'Power System-I', 'THEORY', 3),
    sub('PC-EEE-503', 'Control System', 'THEORY', 3),
    sub('PC-EEE-504', 'Power Electronics', 'THEORY', 3),
    sub('PE-EEE-501A', 'High Voltage Engineering', 'ELECTIVE', 3),
    sub('PE-EEE-501B', 'Power Plant Engineering', 'ELECTIVE', 3),
    sub('PE-EEE-501C', 'Renewable & Non-Conventional Energy', 'ELECTIVE', 3),
    sub('OE-EEE-501A', 'Data Structure & Algorithm', 'ELECTIVE', 3),
    sub('OE-EEE-501B', 'Object Oriented Programming', 'ELECTIVE', 3),
    sub('OE-EEE-501C', 'Computer Organization', 'ELECTIVE', 3),
    sub('PC-EEE-591', 'Electric Machine-II Laboratory', 'LAB', 1),
    sub('PC-EEE-592', 'Control System Laboratory', 'LAB', 1),
    sub('PC-EEE-593', 'Power Electronics Laboratory', 'LAB', 1),
  ],
  6: [
    sub('PC-EEE-601', 'Power System-II', 'THEORY', 3),
    sub('PC-EEE-602', 'Microprocessor & Microcontroller', 'THEORY', 3),
    sub('PE-EEE-601A', 'Nano Electronics', 'ELECTIVE', 3),
    sub('PE-EEE-601B', 'Electrical Machine Design', 'ELECTIVE', 3),
    sub('PE-EEE-601C', 'VLSI & Microelectronics', 'ELECTIVE', 3),
    sub('PE-EEE-602A', 'Electrical & Hybrid Vehicle', 'ELECTIVE', 3),
    sub('PE-EEE-602B', 'Power Quality & FACTS', 'ELECTIVE', 3),
    sub('PE-EEE-602C', 'Industrial Electrical Systems', 'ELECTIVE', 3),
    sub('OE-EEE-601A', 'Artificial Intelligence', 'ELECTIVE', 3),
    sub('OE-EEE-601B', 'Database Management Systems', 'ELECTIVE', 3),
    sub('OE-EEE-601C', 'Analytical Instrumentation', 'ELECTIVE', 3),
    sub('HM-EEE-601', 'Economics for Engineers', 'THEORY', 3),
    sub('PC-EEE-691', 'Power System Laboratory', 'LAB', 1),
    sub('PC-EEE-692', 'Microprocessor & Microcontroller Laboratory', 'LAB', 1),
    sub('PC-EEE-681', 'Electrical & Electronic Design Laboratory', 'LAB', 3),
  ],
  7: [
    sub('PC-EEE-701', 'Analog and Digital Communication', 'THEORY', 3),
    sub('PE-EEE-701A', 'Electric Drive', 'ELECTIVE', 3),
    sub('PE-EEE-701B', 'Digital Control System', 'ELECTIVE', 3),
    sub('PE-EEE-701C', 'HVDC Transmission System', 'ELECTIVE', 3),
    sub('OE-EEE-701A', 'Embedded System', 'ELECTIVE', 3),
    sub('OE-EEE-701B', 'Computer Network', 'ELECTIVE', 3),
    sub('OE-EEE-701C', 'Introduction to Machine Learning', 'ELECTIVE', 3),
    sub('OE-EEE-702A', 'Internet of Things', 'ELECTIVE', 3),
    sub('OE-EEE-702B', 'Computer Graphics', 'ELECTIVE', 3),
    sub('OE-EEE-702C', 'Soft Computing Techniques', 'ELECTIVE', 3),
    sub('HM-EEE-701', 'Principle of Management', 'THEORY', 3),
    sub('PC-EEE-791', 'Analog and Digital Communication Laboratory', 'LAB', 1),
    sub('PW-EEE-781', 'Project Stage-I', 'SESSIONAL', 2),
    sub('PW-EEE-782', 'Seminar', 'SESSIONAL', 1),
  ],
  8: [
    sub('PC-EEE-801', 'Digital Signal Processing', 'THEORY', 3),
    sub('PE-EEE-801A', 'Utilization of Electric Power', 'ELECTIVE', 3),
    sub('PE-EEE-801B', 'Advanced Electric Drives', 'ELECTIVE', 3),
    sub('PE-EEE-801C', 'Power System Dynamics and Control', 'ELECTIVE', 3),
    sub('PE-EEE-801D', 'Industrial Automation and Control', 'ELECTIVE', 3),
    sub('OE-EEE-801A', 'Digital Image Processing', 'ELECTIVE', 3),
    sub('OE-EEE-801B', 'Biomedical Instrumentation', 'ELECTIVE', 3),
    sub('OE-EEE-801C', 'Cryptography and Network Security', 'ELECTIVE', 3),
    sub('OE-EEE-801D', 'Sensors and Transducers', 'ELECTIVE', 3),
    sub('PC-EEE-891', 'Digital Signal Processing Laboratory', 'LAB', 1),
    sub('PW-EEE-881', 'Project Stage-II', 'SESSIONAL', 8),
  ],
};

const ME_SYLLABUS: Record<number, MakautSubject[]> = {
  1: SEM_1_COMMON,
  2: SEM_2_COMMON,
  3: [
    sub('BS-M301', 'Mathematics III', 'THEORY', 4),
    sub('BS-BIO301', 'Biology', 'THEORY', 3),
    sub('ES-ECE301', 'Basic Electronics Engineering', 'THEORY', 3),
    sub('ES-ME301', 'Engineering Mechanics', 'THEORY', 4),
    sub('PC-ME301', 'Thermodynamics', 'THEORY', 4),
    sub('PC-ME302', 'Manufacturing Processes', 'THEORY', 4),
    sub('PC-ME391', 'Practice of Manufacturing Processes', 'LAB', 1.5),
  ],
  4: [
    sub('ES-ME401', 'Materials Engineering', 'THEORY', 3),
    sub('PC-ME401', 'Applied Thermodynamics', 'THEORY', 4),
    sub('PC-ME402', 'Fluid Mechanics & Fluid Machines', 'THEORY', 4),
    sub('PC-ME403', 'Strength of Materials', 'THEORY', 4),
    sub('PC-ME404', 'Metrology and Instrumentation', 'THEORY', 4),
    sub('PC-ME491', 'Practice of Manufacturing Processes and Systems Laboratory', 'LAB', 1.5),
    sub('PC-ME492', 'Machine Drawing-I', 'LAB', 1.5),
    sub('MC 481', 'Environmental Science', 'MANDATORY', 0),
  ],
  5: [
    sub('PC-ME501', 'Heat Transfer', 'THEORY', 4),
    sub('PC-ME502', 'Solid Mechanics', 'THEORY', 4),
    sub('PC-ME503', 'Kinematics & Theory of Machines', 'THEORY', 4),
    sub('HM-HU501', 'Effective Technical Communication', 'THEORY', 3),
    sub('MC501', 'Essence of Indian Knowledge Tradition', 'MANDATORY', 0),
    sub('PC-ME591', 'Mechanical Engineering Laboratory I (Thermal)', 'LAB', 1.5),
    sub('PC-ME592', 'Machine Drawing-II', 'LAB', 1.5),
    sub('PW-ME581', 'Project-I', 'SESSIONAL', 1),
  ],
  6: [
    sub('PC-ME601', 'Manufacturing Technology', 'THEORY', 4),
    sub('PC-ME602', 'Design of Machine Elements', 'THEORY', 4),
    sub('PE-ME601A', 'Internal Combustion Engines and Gas Turbines', 'ELECTIVE', 3),
    sub('PE-ME601B', 'Refrigeration and Air Conditioning', 'ELECTIVE', 3),
    sub('PE-ME601C', 'Turbo Machinery', 'ELECTIVE', 3),
    sub('PE-ME601D', 'Fluid Power Control', 'ELECTIVE', 3),
    sub('PE-ME601E', 'Advanced Fluid Mechanics', 'ELECTIVE', 3),
    sub('PE-ME602F', 'Composite Materials', 'ELECTIVE', 3),
    sub('PE-ME602G', 'Mechatronics', 'ELECTIVE', 3),
    sub('PE-ME602H', 'Robotics', 'ELECTIVE', 3),
    sub('PE-ME602I', 'Material Handling', 'ELECTIVE', 3),
    sub('PE-ME602J', 'Principles and Practices of Management', 'ELECTIVE', 3),
    sub('HM-HU601', 'Operations Research', 'THEORY', 3),
    sub('MC601', 'Constitution of India', 'MANDATORY', 0),
    sub('PC-ME691', 'Mechanical Engineering Laboratory II (Design)', 'LAB', 1.5),
    sub('PW-ME681', 'Project-II', 'SESSIONAL', 2),
  ],
  7: [
    sub('PC-ME701', 'Advanced Manufacturing Technology', 'THEORY', 3),
    sub('PE-ME701A', 'Automobile Engineering', 'ELECTIVE', 3),
    sub('PE-ME701B', 'Gas Dynamics and Jet Propulsion', 'ELECTIVE', 3),
    sub('PE-ME701C', 'Computational Fluid Dynamics', 'ELECTIVE', 3),
    sub('PE-ME701D', 'Elements of Atmospheric Fluid Dynamics', 'ELECTIVE', 3),
    sub('PE-ME702E', 'Selection and Testing of Materials', 'ELECTIVE', 3),
    sub('PE-ME702F', 'Mechanical Vibration', 'ELECTIVE', 3),
    sub('PE-ME702G', 'Finite Element Analysis', 'ELECTIVE', 3),
    sub('PE-ME702H', 'Advanced Welding Technology', 'ELECTIVE', 3),
    sub('PE-ME702I', 'Quantity Production Methods', 'ELECTIVE', 3),
    sub('PE-ME702J', 'CAD/CAM', 'ELECTIVE', 3),
    sub('OE-ME701A', 'Industrial Engineering', 'ELECTIVE', 3),
    sub('OE-ME701B', 'Project Management', 'ELECTIVE', 3),
    sub('OE-ME701C', 'Introduction to Product Design and Development', 'ELECTIVE', 3),
    sub('OE-ME701D', 'Non-conventional Energy Sources', 'ELECTIVE', 3),
    sub('OE-ME701E', 'Biomechanics and Biomaterials', 'ELECTIVE', 3),
    sub('OE-ME701F', 'Computational Methods in Engineering', 'ELECTIVE', 3),
    sub('OE-ME701G', 'Artificial Intelligence (AI)', 'ELECTIVE', 3),
    sub('OE-ME701H', 'Machine Learning', 'ELECTIVE', 3),
    sub('OE-ME701I', 'Water Resource Engineering', 'ELECTIVE', 3),
    sub('HM-HU701', 'Economics for Engineers', 'THEORY', 2),
    sub('PC-ME791', 'Mechanical Engineering Laboratory III (Manufacturing)', 'LAB', 1.5),
    sub('PW-ME781', 'Project-III', 'SESSIONAL', 3),
  ],
  8: [
    sub('PE-ME801A', 'Analysis and Performance of Fluid Machines', 'ELECTIVE', 3),
    sub('PE-ME801B', 'Power Plant Engineering', 'ELECTIVE', 3),
    sub('PE-ME801C', 'Cryogenics', 'ELECTIVE', 3),
    sub('PE-ME801D', 'Introduction to Wind Engineering', 'ELECTIVE', 3),
    sub('PE-ME802E', 'Tribology', 'ELECTIVE', 3),
    sub('PE-ME802F', '3D Printing and Design', 'ELECTIVE', 3),
    sub('PE-ME802G', 'Micro and Nano Manufacturing', 'ELECTIVE', 3),
    sub('PE-ME802H', 'Process Planning and Cost Estimation', 'ELECTIVE', 3),
    sub('PE-ME802I', 'Maintenance Engineering', 'ELECTIVE', 3),
    sub('OE-ME801A', 'Total Quality Management', 'ELECTIVE', 3),
    sub('OE-ME801B', 'Entrepreneurship Development', 'ELECTIVE', 3),
    sub('OE-ME801C', 'Safety and Occupational Health', 'ELECTIVE', 3),
    sub('OE-ME801D', 'Industrial Pollution and Control', 'ELECTIVE', 3),
    sub('OE-ME801E', 'Energy Conservation and Management', 'ELECTIVE', 3),
    sub('OE-ME801F', 'Waste to Energy - An Overview', 'ELECTIVE', 3),
    sub('OE-ME802G', 'Automation & Control', 'ELECTIVE', 3),
    sub('OE-ME802H', 'Internet of Things (IoT)', 'ELECTIVE', 3),
    sub('OE-ME802I', 'Block Chain', 'ELECTIVE', 3),
    sub('OE-ME802J', 'Cyber Security', 'ELECTIVE', 3),
    sub('OE-ME802K', 'Quantum Computing', 'ELECTIVE', 3),
    sub('OE-ME802L', 'Data Sciences', 'ELECTIVE', 3),
    sub('OE-ME802M', 'Virtual Reality (VR)', 'ELECTIVE', 3),
    sub('PW-ME881', 'Project-IV', 'SESSIONAL', 5),
    sub('PW-ME882', 'Comprehensive Viva', 'SESSIONAL', 1.5),
  ],
};

const CE_SYLLABUS: Record<number, MakautSubject[]> = {
  1: SEM_1_COMMON,
  2: SEM_2_COMMON,
  3: [
    sub('CE(BS)301', 'Biology for Engineers', 'THEORY', 3),
    sub('CE(ES)301', 'Engineering Mechanics', 'THEORY', 4),
    sub('CE(ES)302', 'Energy Science & Engineering', 'THEORY', 2),
    sub('CE(BS)301-M', 'Mathematics-III (Transform & Discrete Mathematics)', 'THEORY', 2),
    sub('CE(HS)301', 'Humanities-I (Effective Technical Communication)', 'THEORY', 3),
    sub('CE(HS)302', 'Introduction to Civil Engineering', 'THEORY', 2),
    sub('CE(ES)391', 'Basic Electronics', 'LAB', 2),
    sub('CE(ES)392', 'Computer-aided Civil Engineering Drawing', 'LAB', 2),
    sub('CE(ES)393', 'Life Science', 'LAB', 2),
  ],
  4: [
    sub('CE(ES)401', 'Introduction to Fluid Mechanics', 'THEORY', 2),
    sub('CE(ES)402', 'Introduction to Solid Mechanics', 'THEORY', 2),
    sub('CE(PC)401', 'Soil Mechanics - I', 'THEORY', 3),
    sub('CE(PC)402', 'Environmental Engineering - I', 'THEORY', 3),
    sub('CE(PC)403', 'Surveying & Geomatics', 'THEORY', 3),
    sub('CE(PC)404', 'Concrete Technology', 'THEORY', 3),
    sub('CE(HS)401', 'Civil Engineering - Societal & Global Impact', 'THEORY', 2),
    sub('CE(MC)401', 'Management I (Organizational Behavior)', 'MANDATORY', 0),
    sub('CE(ES)491', 'Fluid Mechanics Laboratory', 'LAB', 1),
    sub('CE(ES)492', 'Solid Mechanics Laboratory', 'LAB', 1),
    sub('CE(ES)493', 'Engineering Geology Laboratory', 'LAB', 1),
    sub('CE(PC)493', 'Surveying & Geomatics Laboratory', 'LAB', 1),
    sub('CE(PC)494', 'Concrete Technology Laboratory', 'LAB', 1),
  ],
  5: [
    sub('CE(PC)501', 'Design of RC Structures', 'THEORY', 3),
    sub('CE(PC)502', 'Engineering Hydrology', 'THEORY', 3),
    sub('CE(PC)503', 'Structural Analysis - I', 'THEORY', 3),
    sub('CE(PC)504', 'Soil Mechanics - II', 'THEORY', 3),
    sub('CE(PC)505', 'Environmental Engineering - II', 'THEORY', 3),
    sub('CE(PC)506', 'Transportation Engineering', 'THEORY', 3),
    sub('CE(MC)501', 'Constitution of India / Essence of Indian Knowledge Tradition', 'MANDATORY', 0),
    sub('CE(PC)591', 'RC Design Sessional', 'LAB', 1),
    sub('CE(PC)594', 'Soil Mechanics Laboratory', 'LAB', 1),
    sub('CE(PC)595', 'Environmental Engineering Laboratory', 'LAB', 1),
    sub('CE(PC)596', 'Transportation Engineering Laboratory', 'LAB', 1),
    sub('CE(PC)597', 'Computer Application in CE', 'LAB', 1),
  ],
  6: [
    sub('CE(PC)601', 'Construction Engineering & Management', 'THEORY', 2),
    sub('CE(PC)602', 'Engineering Economics, Estimation & Costing', 'THEORY', 2),
    sub('CE(PC)603', 'Water Resources Engineering', 'THEORY', 2),
    sub('CE(PC)604', 'Design of Steel Structures', 'THEORY', 2),
    sub('CE(PE)601A', 'Stability of Slopes', 'ELECTIVE', 2),
    sub('CE(PE)601B', 'Foundation Engineering', 'ELECTIVE', 2),
    sub('CE(PE)601C', 'Ground Improvement Technique', 'ELECTIVE', 2),
    sub('CE(PE)602A', 'Building Construction Practice', 'ELECTIVE', 2),
    sub('CE(PE)602B', 'Structural Analysis-II', 'ELECTIVE', 2),
    sub('CE(PE)602C', 'Industrial Structures', 'ELECTIVE', 2),
    sub('CE(OE)601A', 'Soft Skills and Interpersonal Communication - I', 'ELECTIVE', 2),
    sub('CE(OE)601B', 'Introduction to Philosophical Thoughts', 'ELECTIVE', 2),
    sub('CE(PC)693', 'Water Resource Engineering Laboratory', 'LAB', 1),
    sub('CE(PC)694', 'Steel Structure Design Sessional', 'LAB', 1),
    sub('CE(PC)695', 'Quantity Survey Estimation and Valuation Sessional', 'LAB', 2),
  ],
  7: [
    sub('CE(OE)701A', 'Metro Systems & Engineering', 'ELECTIVE', 2),
    sub('CE(OE)701B', 'ICT for Development', 'ELECTIVE', 2),
    sub('CE(OE)701C', 'Cyber Law & Ethics', 'ELECTIVE', 2),
    sub('CE(PE)701A', 'Computational Hydraulics', 'ELECTIVE', 3),
    sub('CE(PE)701B', 'Disaster Preparedness and Planning', 'ELECTIVE', 3),
    sub('CE(PE)701C', 'Hydraulic Structure', 'ELECTIVE', 3),
    sub('CE(PE)702A', 'Prestressed Concrete', 'ELECTIVE', 3),
    sub('CE(PE)702B', 'Repairs & Rehabilitation of Structures', 'ELECTIVE', 3),
    sub('CE(PE)702C', 'Finite Element Method', 'ELECTIVE', 3),
    sub('CE(PE)703A', 'Air and Noise Pollution and Control', 'ELECTIVE', 3),
    sub('CE(PE)703B', 'Physico-Chemical Processes for Water and Wastewater Treatment', 'ELECTIVE', 3),
    sub('CE(PE)703C', 'Water and Air Quality Modelling', 'ELECTIVE', 3),
    sub('CE(PE)704A', 'Structural Dynamics', 'ELECTIVE', 3),
    sub('CE(PE)704B', 'Advanced Structural Analysis', 'ELECTIVE', 3),
    sub('CE(PE)704C', 'Coastal Hydraulics and Sediment Transport', 'ELECTIVE', 3),
    sub('CE(PE)705A', 'Railway and Airport Engineering', 'ELECTIVE', 2),
    sub('CE(PE)705B', 'Pavement Design', 'ELECTIVE', 2),
    sub('CE(PE)705C', 'Transport System Planning', 'ELECTIVE', 2),
    sub('CE(IN)791', 'Industrial Internship', 'SESSIONAL', 1),
    sub('CE(PROJ)792', 'Project-1', 'SESSIONAL', 5),
  ],
  8: [
    sub('CE(HS)801', 'Professional Practice, Law & Ethics', 'THEORY', 2),
    sub('CE(PE)801A', 'GIS & Remote Sensing', 'ELECTIVE', 2),
    sub('CE(PE)801B', 'Rock Mechanics', 'ELECTIVE', 2),
    sub('CE(PE)801C', 'Environmental Laws and Policy', 'ELECTIVE', 2),
    sub('CE(PE)801D', 'Pavement Materials and Design', 'ELECTIVE', 2),
    sub('CE(OE)801A', 'Human Resource Development and Organizational Behavior', 'ELECTIVE', 2),
    sub('CE(OE)801B', 'Bridge Engineering', 'ELECTIVE', 2),
    sub('CE(OE)801C', 'Deep Foundations', 'ELECTIVE', 2),
    sub('CE(OE)801D', 'Groundwater Contamination', 'ELECTIVE', 2),
    sub('CE(OE)802A', 'Soft Skills and Personality Development', 'ELECTIVE', 2),
    sub('CE(OE)802B', 'Earthquake Engineering', 'ELECTIVE', 2),
    sub('CE(OE)802C', 'Urban Transport Planning', 'ELECTIVE', 2),
    sub('CE(OE)802D', 'Environmental Impact Assessment and Life Cycle Analysis', 'ELECTIVE', 2),
    sub('CE(CV)881', 'Comprehensive Viva Voce', 'SESSIONAL', 1),
    sub('CE(PROJ)882', 'Project-2', 'SESSIONAL', 5),
  ],
};

export const MAKAUT_SYLLABUS: Record<SyllabusBranch, Record<number, MakautSubject[]>> = {
  CSE: CSE_SYLLABUS,
  'CSE-AIML': CSE_AIML_SYLLABUS,
  'CSE-DS': CSE_DS_SYLLABUS,
  ECE: ECE_SYLLABUS,
  EE: EE_SYLLABUS,
  EEE: EEE_SYLLABUS,
  ME: ME_SYLLABUS,
  CE: CE_SYLLABUS,
};

export function normalizeSyllabusBranch(branch?: string | null): SyllabusBranch {
  const upper = (branch || 'CSE').toUpperCase().trim();
  if (upper === 'AIML' || upper === 'CSE-AIML' || upper === 'CSE_AIML') return 'CSE-AIML';
  if (upper === 'DS' || upper === 'CSE-DS' || upper === 'CSE_DS') return 'CSE-DS';
  if (upper === 'IT') return 'CSE';
  if (
    upper === 'CSE' ||
    upper === 'CSE-AIML' ||
    upper === 'CSE-DS' ||
    upper === 'ECE' ||
    upper === 'EE' ||
    upper === 'EEE' ||
    upper === 'ME' ||
    upper === 'CE'
  ) {
    return upper;
  }
  return 'CSE';
}

export function resolveSubjectType(
  subItem: Pick<MakautSubject, 'type' | 'category' | 'code'>
): SubjectType {
  if (subItem.type) return subItem.type;
  if (subItem.category === 'PEC' || subItem.category === 'OEC') return 'ELECTIVE';
  if (subItem.category === 'MC') return 'MANDATORY';
  if (subItem.category === 'PROJ') return 'SESSIONAL';
  return 'THEORY';
}

export function getSubjectsForBranchAndSemester(
  branch?: string | null,
  semester?: number | null
): Array<MakautSubject & { type: SubjectType }> {
  const normBranch = normalizeSyllabusBranch(branch);
  const sem = Math.min(8, Math.max(1, Number(semester) || 3));
  const raw = MAKAUT_SYLLABUS[normBranch]?.[sem] || [];
  return raw.map((item) => ({
    ...item,
    type: resolveSubjectType(item),
  }));
}

export function findSubjectByCode(
  code: string
): (MakautSubject & { branch: SyllabusBranch; semester: number }) | null {
  const upper = code.toUpperCase().trim();
  for (const branch of Object.keys(MAKAUT_SYLLABUS) as SyllabusBranch[]) {
    for (const semStr of Object.keys(MAKAUT_SYLLABUS[branch])) {
      const sem = Number(semStr);
      const found = MAKAUT_SYLLABUS[branch][sem].find(
        (s) => s.code.toUpperCase() === upper
      );
      if (found) {
        return { ...found, branch, semester: sem };
      }
    }
  }
  return null;
}
