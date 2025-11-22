import React, { useState, useEffect } from 'react';
import socket from '../socket';
import '../styles/OnlineUsers.css';

const OnlineUsers = () => {
    const [onlineUsers, setOnlineUsers] = useState(0);

    useEffect(() => {
        const handleUserCount = (count) => {
            setOnlineUsers(count);
        };

        socket.on('userCount', handleUserCount);

        return () => {
            socket.off('userCount', handleUserCount);
        };
    }, []);

    return (
        <div className="online-users">
            <div className="online-indicator">
                <span className="status-dot">●</span>
                {onlineUsers} user{onlineUsers !== 1 ? 's' : ''} online
            </div>
        </div>
    );
};

export default OnlineUsers;