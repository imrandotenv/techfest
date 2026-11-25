export type SyllabusBranch = 'CSE' | 'ECE' | 'ME' | 'CE' | 'EE';
export type SubjectCategory = 'PCC' | 'ESC' | 'BS' | 'HSMC' | 'PEC' | 'OEC' | 'MC';

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
  swayamCourses: SwayamCourseRef[];
}

export const SYLLABUS_BRANCHES: Array<{ code: SyllabusBranch; name: string }> = [
  { code: 'CSE', name: 'Computer Science & Engineering' },
  { code: 'ECE', name: 'Electronics & Communication Engineering' },
  { code: 'EE', name: 'Electrical Engineering' },
  { code: 'ME', name: 'Mechanical Engineering' },
  { code: 'CE', name: 'Civil Engineering' },
];

const SEM_1_COMMON: MakautSubject[] = [
  {
    code: 'BS-PH101',
    name: 'Physics-I',
    credits: 4,
    category: 'BS',
    swayamCourses: [
      {
        title: 'Engineering Physics: Oscillations, Waves & Optics',
        instructor: 'Prof. S. Pramanik',
        institute: 'IIT Kharagpur',
        url: 'https://nptel.ac.in/courses/115105099',
        duration: '12 Weeks',
        platform: 'NPTEL',
      },
    ],
  },
  {
    code: 'BS-CH101',
    name: 'Chemistry-I',
    credits: 4,
    category: 'BS',
    swayamCourses: [
      {
        title: 'Engineering Chemistry & Spectroscopy',
        instructor: 'Prof. K. Mangala Sunder',
        institute: 'IIT Madras',
        url: 'https://nptel.ac.in/courses/104106089',
        duration: '12 Weeks',
        platform: 'NPTEL',
      },
    ],
  },
  {
    code: 'BS-M101',
    name: 'Mathematics-IA (Calculus & Linear Algebra)',
    credits: 4,
    category: 'BS',
    swayamCourses: [
      {
        title: 'Engineering Mathematics - I',
        instructor: 'Prof. Jitendra Kumar',
        institute: 'IIT Kharagpur',
        url: 'https://nptel.ac.in/courses/111105121',
        duration: '12 Weeks',
        platform: 'NPTEL',
      },
    ],
  },
  {
    code: 'BS-M102',
    name: 'Mathematics-IB (Multivariable Calculus)',
    credits: 4,
    category: 'BS',
    swayamCourses: [
      {
        title: 'Calculus of Several Real Variables',
        instructor: 'Prof. Joydeep Dutta',
        institute: 'IIT Kanpur',
        url: 'https://nptel.ac.in/courses/111104092',
        duration: '8 Weeks',
        platform: 'NPTEL',
      },
    ],
  },
  {
    code: 'ES-EE101',
    name: 'Basic Electrical Engineering',
    credits: 4,
    category: 'ESC',
    swayamCourses: [
      {
        title: 'Basic Electrical Technology',
        instructor: 'Prof. L. Umanand',
        institute: 'IISc Bangalore',
        url: 'https://nptel.ac.in/courses/108108076',
        duration: '12 Weeks',
        platform: 'NPTEL',
      },
    ],
  },
];

const SEM_2_COMMON: MakautSubject[] = [
  {
    code: 'ES-CS201',
    name: 'Programming for Problem Solving',
    credits: 3,
    category: 'ESC',
    swayamCourses: [
      {
        title: 'Problem Solving Through Programming in C',
        instructor: 'Prof. Anupam Basu',
        institute: 'IIT Kharagpur',
        url: 'https://nptel.ac.in/courses/106105171',
        duration: '12 Weeks',
        platform: 'NPTEL',
      },
    ],
  },
  {
    code: 'BS-M201',
    name: 'Mathematics-IIA (Differential Equations)',
    credits: 4,
    category: 'BS',
    swayamCourses: [
      {
        title: 'Ordinary Differential Equations & Applications',
        instructor: 'Prof. P. N. Agrawal',
        institute: 'IIT Roorkee',
        url: 'https://nptel.ac.in/courses/111107111',
        duration: '12 Weeks',
        platform: 'NPTEL',
      },
    ],
  },
  {
    code: 'BS-M202',
    name: 'Mathematics-IIB (Probability & Statistics)',
    credits: 4,
    category: 'BS',
    swayamCourses: [
      {
        title: 'Probability and Statistics for Engineers',
        instructor: 'Prof. Somesh Kumar',
        institute: 'IIT Kharagpur',
        url: 'https://nptel.ac.in/courses/111105041',
        duration: '12 Weeks',
        platform: 'NPTEL',
      },
    ],
  },
  {
    code: 'HM-HU201',
    name: 'English',
    credits: 2,
    category: 'HSMC',
    swayamCourses: [
      {
        title: 'Technical English for Engineers',
        instructor: 'Prof. Aysha Iqbal Viswamohan',
        institute: 'IIT Madras',
        url: 'https://nptel.ac.in/courses/109106094',
        duration: '8 Weeks',
        platform: 'NPTEL',
      },
    ],
  },
];

export const MAKAUT_SYLLABUS: Record<SyllabusBranch, Record<number, MakautSubject[]>> = {
  CSE: {
    1: SEM_1_COMMON,
    2: SEM_2_COMMON,
    3: [
      {
        code: 'PCC-CS301',
        name: 'Data Structure & Algorithms',
        credits: 3,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Programming, Data Structures and Algorithms',
            instructor: 'Prof. Madhavan Mukund',
            institute: 'CMI / IIT Madras',
            url: 'https://nptel.ac.in/courses/106106145',
            duration: '8 Weeks',
            platform: 'NPTEL',
          },
          {
            title: 'Data Structures and Algorithms',
            instructor: 'Prof. Naveen Garg',
            institute: 'IIT Delhi',
            url: 'https://nptel.ac.in/courses/106102064',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'PCC-CS302',
        name: 'Computer Organisation',
        credits: 3,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Computer Organization and Architecture',
            instructor: 'Prof. Jatindra Kumar Deka',
            institute: 'IIT Guwahati',
            url: 'https://nptel.ac.in/courses/106103180',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'ESC301',
        name: 'Analog & Digital Electronics',
        credits: 3,
        category: 'ESC',
        swayamCourses: [
          {
            title: 'Digital Circuits & Analog Electronic Circuits',
            instructor: 'Prof. Santanu Chattopadhyay',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/108105132',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'BS-M301',
        name: 'Mathematics-III (Differential Calculus)',
        credits: 2,
        category: 'BS',
        swayamCourses: [
          {
            title: 'Differential Calculus & Vector Calculus',
            instructor: 'Prof. Jitendra Kumar',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/111105121',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'HSMC301',
        name: 'Economics for Engineers (Humanities-II)',
        credits: 3,
        category: 'HSMC',
        swayamCourses: [
          {
            title: 'Engineering Econometrics & Financial Accounting',
            instructor: 'Prof. Rudra P. Pradhan',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/110105067',
            duration: '8 Weeks',
            platform: 'SWAYAM',
          },
        ],
      },
    ],
    4: [
      {
        code: 'PCC-CS401',
        name: 'Discrete Mathematics',
        credits: 4,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Discrete Mathematics',
            instructor: 'Prof. Sudarshan Iyengar',
            institute: 'IIT Ropar',
            url: 'https://nptel.ac.in/courses/106106183',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'PCC-CS402',
        name: 'Computer Architecture',
        credits: 3,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Computer Architecture & Pipelining',
            instructor: 'Prof. Smruti R. Sarangi',
            institute: 'IIT Delhi',
            url: 'https://nptel.ac.in/courses/106102229',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'PCC-CS403',
        name: 'Formal Language & Automata Theory',
        credits: 3,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Theory of Computation',
            instructor: 'Prof. Raghunath Tewari',
            institute: 'IIT Kanpur',
            url: 'https://nptel.ac.in/courses/106104148',
            duration: '8 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'PCC-CS404',
        name: 'Design & Analysis of Algorithms',
        credits: 3,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Design and Analysis of Algorithms',
            instructor: 'Prof. Madhavan Mukund',
            institute: 'CMI / IIT Madras',
            url: 'https://nptel.ac.in/courses/106106131',
            duration: '8 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'BS-BIO401',
        name: 'Biology for Engineers',
        credits: 2,
        category: 'BS',
        swayamCourses: [
          {
            title: 'Biology for Engineers and Other Non-Biologists',
            instructor: 'Prof. Madhulika Dixit',
            institute: 'IIT Madras',
            url: 'https://nptel.ac.in/courses/121106008',
            duration: '4 Weeks',
            platform: 'SWAYAM',
          },
        ],
      },
      {
        code: 'MC401',
        name: 'Environmental Sciences',
        credits: 0,
        category: 'MC',
        swayamCourses: [
          {
            title: 'Environmental Studies',
            instructor: 'Prof. T. R. Sreekrishnan',
            institute: 'IIT Delhi',
            url: 'https://onlinecourses.swayam2.ac.in/cec20_ge16/preview',
            duration: '8 Weeks',
            platform: 'SWAYAM',
          },
        ],
      },
    ],
    5: [
      {
        code: 'PCC-CS501',
        name: 'Compiler Design',
        credits: 3,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Compiler Design',
            instructor: 'Prof. Santanu Chattopadhyay',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/106105190',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'PCC-CS502',
        name: 'Operating Systems',
        credits: 3,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Operating System Fundamentals',
            instructor: 'Prof. Santanu Chattopadhyay',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/106105214',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'PCC-CS503',
        name: 'Object Oriented Programming',
        credits: 3,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Programming in Java',
            instructor: 'Prof. Debasis Samanta',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/106105191',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'ESC501',
        name: 'Software Engineering',
        credits: 3,
        category: 'ESC',
        swayamCourses: [
          {
            title: 'Software Engineering',
            instructor: 'Prof. Rajib Mall',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/106105182',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'HSMC501',
        name: 'Introduction to Industrial Management',
        credits: 3,
        category: 'HSMC',
        swayamCourses: [
          {
            title: 'Principles of Management',
            instructor: 'Prof. Usha Lenka',
            institute: 'IIT Roorkee',
            url: 'https://nptel.ac.in/courses/110107150',
            duration: '12 Weeks',
            platform: 'SWAYAM',
          },
        ],
      },
      {
        code: 'PEC-IT501B',
        name: 'Artificial Intelligence',
        credits: 3,
        category: 'PEC',
        swayamCourses: [
          {
            title: 'Artificial Intelligence: Search Methods for Problem Solving',
            instructor: 'Prof. Deepak Khemani',
            institute: 'IIT Madras',
            url: 'https://nptel.ac.in/courses/106106226',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
    ],
    6: [
      {
        code: 'PCC-CS601',
        name: 'Database Management Systems',
        credits: 3,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Database Management System',
            instructor: 'Prof. Partha Pratim Das',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/106105175',
            duration: '8 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'PCC-CS602',
        name: 'Computer Networks',
        credits: 3,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Computer Networks and Internet Protocol',
            instructor: 'Prof. Soumya Kanti Ghosh',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/106105183',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'PEC-IT601D',
        name: 'Image Processing',
        credits: 3,
        category: 'PEC',
        swayamCourses: [
          {
            title: 'Digital Image Processing',
            instructor: 'Prof. Prabir Kumar Biswas',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/117105135',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'PEC-IT602B',
        name: 'Data Warehousing & Data Mining',
        credits: 3,
        category: 'PEC',
        swayamCourses: [
          {
            title: 'Data Mining',
            instructor: 'Prof. Pabitra Mitra',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/106105174',
            duration: '8 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'OEC-IT601A',
        name: 'Numerical Methods',
        credits: 3,
        category: 'OEC',
        swayamCourses: [
          {
            title: 'Numerical Methods for Engineers',
            instructor: 'Prof. Ameeya Kumar Nayak',
            institute: 'IIT Roorkee',
            url: 'https://nptel.ac.in/courses/111107105',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
    ],
    7: [
      {
        code: 'PEC-CS701E',
        name: 'Machine Learning',
        credits: 3,
        category: 'PEC',
        swayamCourses: [
          {
            title: 'Introduction to Machine Learning',
            instructor: 'Prof. Balaraman Ravindran',
            institute: 'IIT Madras',
            url: 'https://nptel.ac.in/courses/106106139',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'PEC-CS702E',
        name: 'Cloud Computing',
        credits: 3,
        category: 'PEC',
        swayamCourses: [
          {
            title: 'Cloud Computing',
            instructor: 'Prof. Soumya Kanti Ghosh',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/106105167',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'OEC-CS701A',
        name: 'Operations Research',
        credits: 3,
        category: 'OEC',
        swayamCourses: [
          {
            title: 'Operations Research',
            instructor: 'Prof. Kusum Deep',
            institute: 'IIT Roorkee',
            url: 'https://nptel.ac.in/courses/111107128',
            duration: '8 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'HSMC701',
        name: 'Project Management & Entrepreneurship',
        credits: 2,
        category: 'HSMC',
        swayamCourses: [
          {
            title: 'Entrepreneurship & Project Management',
            instructor: 'Prof. Manoj Kumar Mondal',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/110105067',
            duration: '8 Weeks',
            platform: 'SWAYAM',
          },
        ],
      },
    ],
    8: [
      {
        code: 'PEC-CS801D',
        name: 'Cryptography & Network Security',
        credits: 3,
        category: 'PEC',
        swayamCourses: [
          {
            title: 'Cryptography and Network Security',
            instructor: 'Prof. Sourav Mukhopadhyay',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/106105162',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'OEC-CS801A',
        name: 'Internet of Things',
        credits: 3,
        category: 'OEC',
        swayamCourses: [
          {
            title: 'Introduction to Internet of Things',
            instructor: 'Prof. Sudip Misra',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/106105166',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
    ],
  },
  ECE: {
    1: SEM_1_COMMON,
    2: SEM_2_COMMON,
    3: [
      {
        code: 'EC301',
        name: 'Electronic Devices',
        credits: 3,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Semiconductor Devices and Circuits',
            instructor: 'Prof. Sanjiv Sambandan',
            institute: 'IISc Bangalore',
            url: 'https://nptel.ac.in/courses/108108112',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'EC302',
        name: 'Digital System Design',
        credits: 3,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Digital Electronic Circuits',
            instructor: 'Prof. Goutam Saha',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/108105132',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'EC303',
        name: 'Signals and Systems',
        credits: 3,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Principles of Signals and Systems',
            instructor: 'Prof. Aditya K. Jagannatham',
            institute: 'IIT Kanpur',
            url: 'https://nptel.ac.in/courses/108104100',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'EC304',
        name: 'Network Theory',
        credits: 3,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Network Analysis',
            instructor: 'Prof. Tapas Kumar Bhattacharya',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/108105159',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
    ],
    4: [
      {
        code: 'EC401',
        name: 'Analog Communication',
        credits: 3,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Analog Communication Systems',
            instructor: 'Prof. Goutam Das',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/117105143',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'EC402',
        name: 'Analog Electronic Circuits',
        credits: 3,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Analog Electronic Circuits',
            instructor: 'Prof. Pradip Mandal',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/108105158',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'EC403',
        name: 'Microprocessor & Microcontrollers',
        credits: 3,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Microprocessors and Microcontrollers',
            instructor: 'Prof. Santanu Chattopadhyay',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/108105102',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
    ],
    5: [
      {
        code: 'EC501',
        name: 'Electromagnetic Waves',
        credits: 3,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Electromagnetic Theory',
            instructor: 'Prof. Pradeep Kumar K',
            institute: 'IIT Kanpur',
            url: 'https://nptel.ac.in/courses/108104087',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'EC502',
        name: 'Digital Communication & Stochastic Process',
        credits: 3,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Digital Communication',
            instructor: 'Prof. Bikash Kumar Dey',
            institute: 'IIT Bombay',
            url: 'https://nptel.ac.in/courses/117101051',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'EC503',
        name: 'Digital Signal Processing',
        credits: 3,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Discrete Time Signal Processing',
            instructor: 'Prof. Mrityunjoy Chakraborty',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/117105134',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
    ],
    6: [
      {
        code: 'EC601',
        name: 'Control Systems & Instrumentation',
        credits: 3,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Control Engineering',
            instructor: 'Prof. Ramkrishna Pasumarthy',
            institute: 'IIT Madras',
            url: 'https://nptel.ac.in/courses/107106081',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'EC602',
        name: 'Computer Network',
        credits: 3,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Computer Networks and Internet Protocol',
            instructor: 'Prof. Soumya Kanti Ghosh',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/106105183',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
    ],
    7: [
      {
        code: 'PE-EC701A',
        name: 'VLSI Design & Embedded Systems',
        credits: 3,
        category: 'PEC',
        swayamCourses: [
          {
            title: 'CMOS Digital VLSI Design',
            instructor: 'Prof. Sudeb Dasgupta',
            institute: 'IIT Roorkee',
            url: 'https://nptel.ac.in/courses/108107129',
            duration: '8 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'PE-EC702A',
        name: 'Microwave & Antenna Engineering',
        credits: 3,
        category: 'PEC',
        swayamCourses: [
          {
            title: 'Microwave Engineering',
            instructor: 'Prof. Ratnajit Bhattacharjee',
            institute: 'IIT Guwahati',
            url: 'https://nptel.ac.in/courses/108103141',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
    ],
    8: [
      {
        code: 'PE-EC801A',
        name: 'Wireless & Mobile Communication',
        credits: 3,
        category: 'PEC',
        swayamCourses: [
          {
            title: 'Introduction to Wireless and Cellular Communications',
            instructor: 'Prof. David Koilpillai',
            institute: 'IIT Madras',
            url: 'https://nptel.ac.in/courses/108106154',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
    ],
  },
  EE: {
    1: SEM_1_COMMON,
    2: SEM_2_COMMON,
    3: [
      {
        code: 'PC-EE301',
        name: 'Electric Circuit Theory',
        credits: 4,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Network Analysis & Circuit Theory',
            instructor: 'Prof. Tapas Kumar Bhattacharya',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/108105159',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'PC-EE302',
        name: 'Analog Electronics',
        credits: 3,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Analog Electronic Circuits',
            instructor: 'Prof. Pradip Mandal',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/108105158',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'PC-EE303',
        name: 'Electromagnetic Fields',
        credits: 3,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Electromagnetic Fields',
            instructor: 'Prof. Harishankar Ramachandran',
            institute: 'IIT Madras',
            url: 'https://nptel.ac.in/courses/108106073',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
    ],
    4: [
      {
        code: 'PC-EE401',
        name: 'Electric Machine-I',
        credits: 4,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Electrical Machines - I',
            instructor: 'Prof. Tapas Kumar Bhattacharya',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/108105155',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'PC-EE402',
        name: 'Digital Electronics',
        credits: 3,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Digital Electronic Circuits',
            instructor: 'Prof. Goutam Saha',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/108105132',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
    ],
    5: [
      {
        code: 'PC-EE501',
        name: 'Electric Machine-II',
        credits: 4,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Electrical Machines - II',
            instructor: 'Prof. Tapas Kumar Bhattacharya',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/108105131',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'PC-EE502',
        name: 'Power System-I',
        credits: 4,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Power System Analysis',
            instructor: 'Prof. Debapriya Das',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/108105067',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'PC-EE503',
        name: 'Control System',
        credits: 3,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Control Systems',
            instructor: 'Prof. C. S. Shankar Ram',
            institute: 'IIT Madras',
            url: 'https://nptel.ac.in/courses/108106098',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
    ],
    6: [
      {
        code: 'PC-EE601',
        name: 'Power System-II',
        credits: 4,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Power System Protection & Switchgear',
            instructor: 'Prof. Bhavesh Bhalja',
            institute: 'IIT Roorkee',
            url: 'https://nptel.ac.in/courses/108107167',
            duration: '8 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'PC-EE602',
        name: 'Power Electronics',
        credits: 3,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Power Electronics',
            instructor: 'Prof. G. Bhuvaneswari',
            institute: 'IIT Delhi',
            url: 'https://nptel.ac.in/courses/108102145',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
    ],
    7: [
      {
        code: 'PE-EE701A',
        name: 'Electric Drives',
        credits: 3,
        category: 'PEC',
        swayamCourses: [
          {
            title: 'Fundamentals of Electric Drives',
            instructor: 'Prof. Shyama Prasad Das',
            institute: 'IIT Kanpur',
            url: 'https://nptel.ac.in/courses/108104140',
            duration: '8 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
    ],
    8: [
      {
        code: 'PE-EE801A',
        name: 'HVDC Transmission & Smart Grid',
        credits: 3,
        category: 'PEC',
        swayamCourses: [
          {
            title: 'Introduction to Smart Grid',
            instructor: 'Prof. N. P. Padhy',
            institute: 'IIT Roorkee',
            url: 'https://nptel.ac.in/courses/108107113',
            duration: '8 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
    ],
  },
  ME: {
    1: SEM_1_COMMON,
    2: SEM_2_COMMON,
    3: [
      {
        code: 'PC-ME301',
        name: 'Thermodynamics',
        credits: 4,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Basic Thermodynamics: Classical & Statistical',
            instructor: 'Prof. Suman Chakraborty',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/112105123',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'PC-ME302',
        name: 'Engineering Mechanics',
        credits: 4,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Engineering Mechanics: Statics and Dynamics',
            instructor: 'Prof. K. Ramesh',
            institute: 'IIT Madras',
            url: 'https://nptel.ac.in/courses/112106286',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'ES-ME301',
        name: 'Materials Engineering',
        credits: 3,
        category: 'ESC',
        swayamCourses: [
          {
            title: 'Materials Science and Engineering',
            instructor: 'Prof. Vivek Pancholi',
            institute: 'IIT Roorkee',
            url: 'https://nptel.ac.in/courses/113107078',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
    ],
    4: [
      {
        code: 'PC-ME401',
        name: 'Applied Thermodynamics',
        credits: 4,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Applied Thermodynamics for Engineers',
            instructor: 'Prof. Dipankar N. Basu',
            institute: 'IIT Guwahati',
            url: 'https://nptel.ac.in/courses/112103277',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'PC-ME402',
        name: 'Fluid Mechanics & Fluid Machines',
        credits: 4,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Fluid Mechanics',
            instructor: 'Prof. Subashisa Dutta',
            institute: 'IIT Guwahati',
            url: 'https://nptel.ac.in/courses/105103192',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'PC-ME403',
        name: 'Strength of Materials',
        credits: 4,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Strength of Materials',
            instructor: 'Prof. S. K. Bhattacharyya',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/105105108',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
    ],
    5: [
      {
        code: 'PC-ME501',
        name: 'Heat Transfer',
        credits: 4,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Heat Transfer',
            instructor: 'Prof. Sunando Dasgupta',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/103105140',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'PC-ME502',
        name: 'Kinematics & Theory of Machines',
        credits: 4,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Kinematics of Mechanisms and Machines',
            instructor: 'Prof. Anirvan Dasgupta',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/112105268',
            duration: '8 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
    ],
    6: [
      {
        code: 'PC-ME601',
        name: 'Manufacturing Technology',
        credits: 4,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Principles of Metal Forming & Machining',
            instructor: 'Prof. Pradeep Kumar Jha',
            institute: 'IIT Roorkee',
            url: 'https://nptel.ac.in/courses/112107250',
            duration: '8 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'PC-ME602',
        name: 'Design of Machine Elements',
        credits: 4,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Design of Machine Elements',
            instructor: 'Prof. G. Chakraborty',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/112105124',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
    ],
    7: [
      {
        code: 'PE-ME701A',
        name: 'Automobile Engineering & IC Engines',
        credits: 3,
        category: 'PEC',
        swayamCourses: [
          {
            title: 'Internal Combustion Engines',
            instructor: 'Prof. Pranab Kumar Mondal',
            institute: 'IIT Guwahati',
            url: 'https://nptel.ac.in/courses/112103262',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
    ],
    8: [
      {
        code: 'PE-ME801A',
        name: 'Finite Element Analysis & CAD/CAM',
        credits: 3,
        category: 'PEC',
        swayamCourses: [
          {
            title: 'Finite Element Method: Variational & Computational',
            instructor: 'Prof. Atanu Banerjee',
            institute: 'IIT Guwahati',
            url: 'https://nptel.ac.in/courses/112103295',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
    ],
  },
  CE: {
    1: SEM_1_COMMON,
    2: SEM_2_COMMON,
    3: [
      {
        code: 'CE(PC)301',
        name: 'Solid Mechanics',
        credits: 4,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Strength of Materials / Solid Mechanics',
            instructor: 'Prof. S. K. Bhattacharyya',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/105105108',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'CE(PC)302',
        name: 'Surveying & Geomatics',
        credits: 3,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Higher Surveying',
            instructor: 'Prof. Ajay Dashora',
            institute: 'IIT Guwahati',
            url: 'https://nptel.ac.in/courses/105103193',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'CE(ES)301',
        name: 'Fluid Mechanics',
        credits: 3,
        category: 'ESC',
        swayamCourses: [
          {
            title: 'Fluid Mechanics for Civil Engineers',
            instructor: 'Prof. Subashisa Dutta',
            institute: 'IIT Guwahati',
            url: 'https://nptel.ac.in/courses/105103192',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
    ],
    4: [
      {
        code: 'CE(PC)401',
        name: 'Structural Analysis-I',
        credits: 4,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Structural Analysis - I',
            instructor: 'Prof. Amit Shaw',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/105105166',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'CE(PC)402',
        name: 'Soil Mechanics-I (Geotechnical Engg)',
        credits: 4,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Geotechnical Engineering - I',
            instructor: 'Prof. Dilip Kumar Baidya',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/105105168',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
    ],
    5: [
      {
        code: 'CE(PC)501',
        name: 'Design of RC Structures',
        credits: 4,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Design of Reinforced Concrete Structures',
            instructor: 'Prof. N. Dhang',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/105105105',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'CE(PC)502',
        name: 'Transportation Engineering',
        credits: 3,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Introduction to Multimodal Urban Transportation',
            instructor: 'Prof. Arkopal K. Goswami',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/105105208',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
    ],
    6: [
      {
        code: 'CE(PC)601',
        name: 'Design of Steel Structures',
        credits: 4,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Design of Steel Structures',
            instructor: 'Prof. Damodar Maity',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/105105162',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
      {
        code: 'CE(PC)602',
        name: 'Environmental Engineering',
        credits: 3,
        category: 'PCC',
        swayamCourses: [
          {
            title: 'Wastewater Treatment and Recycling',
            instructor: 'Prof. Manoj Kumar Tiwari',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/105105178',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
    ],
    7: [
      {
        code: 'CE(PE)701A',
        name: 'Foundation Engineering',
        credits: 3,
        category: 'PEC',
        swayamCourses: [
          {
            title: 'Geotechnical Engineering - II (Foundation Engineering)',
            instructor: 'Prof. Dilip Kumar Baidya',
            institute: 'IIT Kharagpur',
            url: 'https://nptel.ac.in/courses/105105185',
            duration: '12 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
    ],
    8: [
      {
        code: 'CE(PE)801A',
        name: 'Construction Planning & Management',
        credits: 3,
        category: 'PEC',
        swayamCourses: [
          {
            title: 'Construction Methods and Equipment Management',
            instructor: 'Prof. K. N. Jha',
            institute: 'IIT Delhi',
            url: 'https://nptel.ac.in/courses/105102199',
            duration: '8 Weeks',
            platform: 'NPTEL',
          },
        ],
      },
    ],
  },
};

export function normalizeSyllabusBranch(branch?: string | null): SyllabusBranch {
  const upper = (branch || 'CSE').toUpperCase().trim();
  if (upper === 'IT' || upper === 'AIML') return 'CSE';
  if (upper === 'ECE' || upper === 'ME' || upper === 'CE' || upper === 'EE' || upper === 'CSE') {
    return upper;
  }
  return 'CSE';
}

export function getSubjectsForBranchAndSemester(
  branch?: string | null,
  semester?: number | null
): MakautSubject[] {
  const normBranch = normalizeSyllabusBranch(branch);
  const sem = Math.min(8, Math.max(1, Number(semester) || 3));
  return MAKAUT_SYLLABUS[normBranch]?.[sem] || [];
}

export function findSubjectByCode(code: string): (MakautSubject & { branch: SyllabusBranch; semester: number }) | null {
  const upper = code.toUpperCase().trim();
  for (const branch of Object.keys(MAKAUT_SYLLABUS) as SyllabusBranch[]) {
    for (const semStr of Object.keys(MAKAUT_SYLLABUS[branch])) {
      const sem = Number(semStr);
      const found = MAKAUT_SYLLABUS[branch][sem].find((s) => s.code.toUpperCase() === upper);
      if (found) {
        return { ...found, branch, semester: sem };
      }
    }
  }
  return null;
}
