import { user } from "@nextui-org/react";

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



export {
  notifications,
  usersDropdown,
  question,
  answer
};

export const sortOption = [
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

export const colorPallet = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFBE0C"
]