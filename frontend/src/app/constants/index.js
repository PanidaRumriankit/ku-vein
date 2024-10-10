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
