const usersDropdown = [
  {
    key: "profile",
    label: "Profile",
  },
  {
    key: "logout",
    label: "Logout",
  },
]

const question = [
  {
    qanda_id: 1,
    title: "จริงรึเปล่าที่เขาบอกว่าข้าวไข่ดาว 2 ฟองมกราคา 19 บาท",
    description: "This is the first question",
    isBookmarked: true,
    isAnswered: false,
    createdAt: new Date("November 3, 2024 11:13:00"),
    updatedAt: new Date(),
    username: "John Doe",
  },
  {
    qanda_id: 2,
    title: "1234567891234567891234567891234567891234567891234567891234567891234567891234567891234567891234567891234567890123456789123456789123456789",
    description: "This is the second question",
    isBookmarked: false,
    isAnswered: false,
    createdAt: new Date("November 6, 2024 11:13:00"),
    updatedAt: new Date(),
    username: "Jane Doe",
  },
  {
    qanda_id: 3,
    title: "Question 3",
    description: "This is the third question",
    isBookmarked: false,
    isAnswered: false,
    createdAt: new Date("November 9, 2024 11:13:00"),
    updatedAt: new Date(),
    username: "Apple"
  },
  {
    qanda_id: 4,
    title: "Question 4",
    description: "This is the fourth question",
    isBookmarked: false,
    isAnswered: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    username: "Japan"
  }
]

const answer = [
  {
    ans_id: 1,
    questionId: 1,
    description: "This is the first answer",
    isCorrect: false,
    createdAt: new Date("October 13, 2024 11:13:00"),
    updatedAt: new Date(),
  },
  {
    ans_id: 2,
    questionId: 2,
    description: "This is the second answer",
    isCorrect: false,
    createdAt: new Date("October 14, 2024 11:13:00"),
    updatedAt: new Date(),
  },
  {
    ans_id: 3,
    questionId: 3,
    description: "This is the third answer",
    isCorrect: false,
    createdAt: new Date("October 15, 2024 11:13:00"),
    updatedAt: new Date(),
  },
  {
    ans_id: 4,
    questionId: 4,
    description: "This is the fourth answer",
    isCorrect: false,
    createdAt: new Date("October 13, 2024 11:13:00"),
    updatedAt: new Date(),
  },
  {
    ans_id: 5,
    questionId: 1,
    description: "This is the fifth answer",
    isCorrect: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    ans_id: 6,
    questionId: 2,
    description: "This is the sixth answer",
    isCorrect: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    ans_id: 7,
    questionId: 3,
    description: "This is the seventh answer",
    isCorrect: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    ans_id: 8,
    questionId: 4,
    description: "This is the eighth answer",
    isCorrect: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
]

const sortOption = [
    {
      key: "earliest",
      value: "earliest"
    },
    {
      key: "latest",
      value: "latest"
    },
    {
      key: "upvote",
      value: "upvote"
    }
  ]

const colorPallet = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFBE0C"
]

const faculties = [
  'คณะเกษตร', 'คณะเทคนิคการสัตวแพทย์',
  'คณะบริหารธุรกิจ', 'คณะประมง',
  'คณะพยาบาลศาสตร์', 'คณะแพทยศาสตร์',
  'คณะมนุษยศาสตร์', 'คณะวนศาสตร์',
  'คณะวิทยาศาสตร์', 'คณะวิศวกรรมศาสตร์',
  'คณะศึกษาศาสตร์', 'คณะเศรษฐศาสตร์',
  'คณะสถาปัตยกรรมศาสตร์', 'คณะสหวิทยาการจัดการและเทคโนโลยี',
  'คณะสังคมศาสตร์', 'คณะสัตวแพทยศาสตร์',
  'คณะสิ่งแวดล้อม', 'คณะอุตสาหกรรมเกษตร'
]

const facultyColor = {
  'คณะเกษตร': '#4caf50',
  'คณะเทคนิคการสัตวแพทย์': '#ff9800',
  'คณะบริหารธุรกิจ': '#2196F3',
  'คณะประมง': '#00BCD4',
  'คณะพยาบาลศาสตร์': '#FF5722',
  'คณะแพทยศาสตร์': '#9C27B0',
  'คณะมนุษยศาสตร์': '#FF7043',
  'คณะวนศาสตร์': '#388E3C',
  'คณะวิทยาศาสตร์': '#673AB7',
  'คณะวิศวกรรมศาสตร์': '#FF5722',
  'คณะศึกษาศาสตร์': '#8BC34A',
  'คณะเศรษฐศาสตร์': '#3F51B5',
  'คณะสถาปัตยกรรมศาสตร์': '#FFEB3B',
  'คณะสหวิทยาการจัดการและเทคโนโลยี': '#009688',
  'คณะสังคมศาสตร์': '#F44336',
  'คณะสัตวแพทยศาสตร์': '#8E24AA',
  'คณะสิ่งแวดล้อม': '#388E3C',
  'คณะอุตสาหกรรมเกษตร': '#FF9800',
};


const courseType = [
  {
    thai: "อินเตอร์",
    eng: "inter"
  },
  {
    thai: "พิเศษ",
    eng: "special"
  },
  {
    thai: "ปกติ",
    eng: "normal"
  }
]

const gradeColors = {
  A: "#4CAF50",
  "B+": "#9CCC65",
  B: "#8BC34A",
  "C+": "#FFD54F",
  C: "#FFC107",
  "D+": "#FFB74D",
  D: "#FF9800",
  F: "#F44336",
  W: "#9E9E9E",
};

export {
  usersDropdown,
  colorPallet,
  sortOption,
  courseType,
  facultyColor,
  faculties,
  gradeColors,
  question,
  answer
};
