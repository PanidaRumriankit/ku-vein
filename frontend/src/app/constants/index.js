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

const facultyColor = [
  {
    name:'คณะเกษตร',
    color:'#4caf50'
  },
  {
    name:'คณะเทคนิคการสัตวแพทย์',
    color:'#ff9800'
  },
  {
    name:'คณะบริหารธุรกิจ',
    color:'#2196F3'
  },
  {
    name:'คณะประมง',
    color:'#00BCD4'
  },
  {
    name:'คณะพยาบาลศาสตร์',
    color:'#FF5722'
  },
  {
    name:'คณะแพทยศาสตร์',
    color:'#9C27B0'
  },
  {
    name:'คณะมนุษยศาสตร์',
    color:'#FF7043'
  },
  {
    name:'คณะวนศาสตร์',
    color:'#388E3C'
  },
  {
    name:'คณะวิทยาศาสตร์',
    color:'#673AB7'
  },
  {
    name:'คณะวิศวกรรมศาสตร์',
    color:'#FF5722'
  },
  {
    name:'คณะศึกษาศาสตร์',
    color:'#8BC34A'
  },
  {
    name:'คณะเศรษฐศาสตร์',
    color:'#3F51B5'
  },
  {
    name:'คณะสถาปัตยกรรมศาสตร์',
    color:'#FFEB3B'
  },
  {
    name:'คณะสหวิทยาการจัดการและเทคโนโลยี',
    color:'#009688'
  },
  {
    name:'คณะสังคมศาสตร์',
    color:'#F44336'
  },
  {
    name:'คณะสัตวแพทยศาสตร์',
    color:'#8E24AA'
  },
  {
    name:'คณะสิ่งแวดล้อม',
    color:'#388E3C'
  },
  {
    name:'คณะอุตสาหกรรมเกษตร',
    color:'#FF9800'
  }
]


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

export {
  notifications,
  usersDropdown,
  colorPallet,
  sortOption,
  courseType,
  facultyColor,
};
