const notifications = [
  {
    id: 1,
    title: "Notification 1",
    description: "This is the first notification",
    type: "success",
    duration: 5000,
    isRead: false,
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
    key: "history",
    label: "History",
  },
  {
    key: "settings",
    label: "Settings",
  },
  {
    key: "logout",
    label: "Logout",
  },
]

export {
  notifications,
  usersDropdown,
};

const bacon = "Bacon ipsum dolor amet prosciutto buffalo corned beef beef ham " +
  "hock. Landjaeger sausage boudin bresaola andouille bacon turkey" +
  "pastrami buffalo short loin swine. Short ribs sirloin pork beef" +
  "cow pork chop bresaola swine. Swine sausage turducken hamburger" +
  "tongue shankle tenderloin porchetta picanha frankfurter short" +
  "ribs andouille ham hock bresaola alcatra."

export const demoReview = {
  "course": {
    "course_id": "1346012",
    "course_name": "Bacon Ipsum 101",
  },
  "reviews": bacon,
  "reviewer": "Ichi"
}

export const sortOption = [
    {
      key: "earliest",
      value: "Earliest"
    },
    {
      key: "latest",
      value: "Latest"
    },
    {
      key: "upvote",
      value: "Upvote"
    }
  ]