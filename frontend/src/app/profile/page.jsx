"use client";

import React, { useState } from 'react';

const Profile = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [isEditingUsername, setIsEditingUsername] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Profile updated:', { username });
    };

    return (
        <div className="profile-settings">
            <h2>User Profile Settings</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    {isEditingUsername ? (
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    ) : (
                        <span>{username}</span>
                    )}
                    <button type="button" onClick={() => setIsEditingUsername(!isEditingUsername)}>
                        {isEditingUsername ? 'Save' : 'Edit'}
                    </button>
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        disabled
                    />
                </div>
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
};

export default Profile;
