import React, { useEffect, useState } from 'react';
import socket from '../socket';
import '../styles/ActivityLog.css';

const ActivityLogPanel = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/activity-logs`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
            .then(res => res.json())
            .then(data => setLogs(data));

        socket.on('newActivityLog', log => {
            setLogs(prev => [log, ...prev.slice(0, 19)]);
        });

        return () => {
            socket.off('newActivityLog');
        };
    }, []);

    return (
        <div className="activity-log-panel">
            <h3>Recent Activity</h3>
            <ul>
                {logs.map((log, index) => (
                    <li key={index}>
                        <strong>{log.user?.name}</strong> {log.action} <em>{log.task?.title}</em>
                        <br />
                        <small>{new Date(log.timestamp).toLocaleString()}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ActivityLogPanel;

