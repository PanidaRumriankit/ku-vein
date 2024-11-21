const notifications = [
  {
    id: 1,
    title: "Notification 1",
    description: "This is the first notification",
    type: "success",
    duration: 5000,
    isRead: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    title: "Notification 2",
    description: "This is the second notification",
    type: "error",
    duration: 5000,
    isRead: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    title: "Notification 3",
    description: "This is the third notification",
    type: "info",
    duration: 5000,
    isRead: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    title: "Notification 4",
    description: "This is the fourth notification",
    type: "warning",
    duration: 5000,
    isRead: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const usersDropdown = [
  {
    key: "profile",
    label: "Profile",
  },
  {
    key: "bookmarks",
    label: "Bookmarks",
  },
  {
    key: "setting",
    label: "Setting",
  },
  {
    key: "logout",
    label: "Logout",
  },
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

// Example usage:
const grade = "B+";
const gradeColor = gradeColors[grade]; // "#9CCC65"


export {
  notifications,
  usersDropdown,
  colorPallet,
  sortOption,
  courseType,
  facultyColor,
  faculties,
  gradeColors,
};
