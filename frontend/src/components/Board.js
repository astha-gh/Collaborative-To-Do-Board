import React, { useEffect, useState } from 'react';
import socket from '../socket'; // adjust path based on your folder structure

const KanbanBoard = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        // Get initial tasks (you'll probably do a fetch here)
        fetch('/api/tasks')
            .then(res => res.json())
            .then(data => setTasks(data));

        // 🔔 Listen to real-time events
        socket.on('taskCreated', (newTask) => {
            setTasks(prev => [...prev, newTask]);
        });

        socket.on('taskUpdated', (updatedTask) => {
            setTasks(prev =>
                prev.map(task => task._id === updatedTask._id ? updatedTask : task)
            );
        });

        socket.on('taskDeleted', (deletedId) => {
            setTasks(prev => prev.filter(task => task._id !== deletedId));
        });

        // 🧹 Clean up on unmount
        return () => {
            socket.off('taskCreated');
            socket.off('taskUpdated');
            socket.off('taskDeleted');
        };
    }, []);

    return (
        <div>
            {/* Your columns and task UI here */}
            <h2>Kanban Board</h2>
            {/* Loop and display tasks by status */}
        </div>
    );
};

export default KanbanBoard;
