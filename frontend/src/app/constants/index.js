const notifications = [
    {
        id: 1,
        title: "Notification 1",
        description: "This is the first notification",
        isRead: true,
        createdAt: new Date(),
    },
    {
        id: 2,
        title: "Notification 2",
        description: "This is the second notification",
        isRead: false,
        createdAt: new Date(),
    },
    {
        id: 3,
        title: "Notification 3",
        description: "This is the third notification",
        isRead: false,
        createdAt: new Date(),
    },
    {
        id: 4,
        title: "Notification 4",
        description: "This is the fourth notification",
        isRead: false,
        createdAt: new Date(),
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
