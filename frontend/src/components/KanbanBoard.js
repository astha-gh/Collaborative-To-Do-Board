import React, { useState, useEffect } from "react";
import socket from '../socket';
import '../styles/KanbanBoard.css';
import TaskCard from './TaskCard';
import NewTaskModal from "./NewTaskModal";
import OnlineUsers from './OnlineUsers';


const KanbanBoard = () => {
    const [tasks, setTasks] = useState([]);
    const [draggedTaskId, setdraggedTaskId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);

    useEffect(() => {
        fetch('https://to-do-backend-1-ihwt.onrender.com/api/tasks', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(data => setTasks(data))

        socket.on('taskCreated', (newTask) => {
            setTasks(prev => [...prev, newTask]);
        })

        socket.on('taskUpdated', (update) => {
            setTasks(prev =>
                prev.map(task => task._id === update._id ? update : task)
            )
        })

        socket.on('taskDeleted', (deleteId) => {
            setTasks(prev => prev.filter(task => task._id !== deleteId))
        });

        return () => {
            socket.off('taskCreated');
            socket.off('taskUpdated');
            socket.off('taskDeleted');
        }

    }, [])

    const handleDragStart = (e, taskId) => {
        setdraggedTaskId(taskId);
    }

    const handleDrop = async (e, newStatus) => {
        e.preventDefault();
        const draggedTask = tasks.find(task => task._id === draggedTaskId);
        if (!draggedTask || draggedTask.status === newStatus) return;

        const update = { ...draggedTask, status: newStatus };

        try {
            const res = await fetch(`https://to-do-backend-1-ihwt.onrender.com/api/tasks/${draggedTaskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(update),
            });
            await res.json();
        }
        catch (err) {
            console.error('Failed to update task status:', err);
        }
        setdraggedTaskId(null);
    }

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDeleteTask = async (taskId) => {
        await fetch(`https://to-do-backend-1-ihwt.onrender.com/api/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
    };

    const handleEditTask = (task) => {
        setTaskToEdit(task);
        setShowModal(true);
    };

    const columns = [
        { key: 'Todo', label: 'TODO' },
        { key: 'In Progress', label: 'IN PROGRESS' },
        { key: 'Done', label: 'DONE' },
    ];


    return (

        <div>

            <div className="kanban-board-header">
                <h2>Kanban Board</h2>
                <div className="header-controls">
                    <OnlineUsers />
                    <button className="create-task-btn" onClick={() => setShowModal(true)}>
                        New Task
                    </button>
                </div>
            </div>

            {showModal && (
                <NewTaskModal
                    onClose={() => {
                        setShowModal(false);
                        setTaskToEdit(null);
                    }
                    }
                    taskToEdit={taskToEdit}
                    allTasks={tasks}
                />
            )}

            <div className="kanban-container">
                {columns.map(col => (
                    <div key={col.key} className="kanban-column"
                        onDrop={(e) => handleDrop(e, col.key)}
                        onDragOver={handleDragOver}
                    >
                        <h3>{col.label}</h3>
                        {
                            tasks
                                .filter(task => task.status === col.key)
                                .map(task => (
                                    <TaskCard
                                        key={task._id}
                                        task={task}
                                        onDragStart={handleDragStart}
                                        onDelete={handleDeleteTask}
                                        onEdit={handleEditTask}
                                    />
                                ))
                        }
                    </div>
                ))}

            </div>
        </div>
    );

}

export default KanbanBoard;