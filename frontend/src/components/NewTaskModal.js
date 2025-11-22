import React, { useState, useEffect } from 'react';
import '../styles/NewTaskModal.css';
import SmartAssign from './SmartAssignButton';

const NewTaskModal = ({ onClose, taskToEdit, allTasks }) => {
    const [conflictData, setConflictData] = useState(null);
    const [form, setForm] = useState({
        title: '',
        description: '',
        assignedTo: '',
        status: 'Todo',
        priority: 'Medium',
        lastUpdated: '',
    });

    const [users, setUser] = useState([]);

    useEffect(() => {
        if (taskToEdit) {
            setForm({
                title: taskToEdit.title,
                description: taskToEdit.description,
                assignedTo: taskToEdit.assignedTo?._id,
                status: taskToEdit.status,
                priority: taskToEdit.priority,
                lastUpdated: taskToEdit.lastUpdated,
            });
        }
    }, [taskToEdit]);

    useEffect(() => {
        fetch('https://to-do-backend-1-ihwt.onrender.com/api/auth/users')
            .then(res => res.json())
            .then(data => setUser(data))
            .catch(err => console.error('Failed to load users', err));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = taskToEdit
            ? `https://to-do-backend-1-ihwt.onrender.com/api/tasks/${taskToEdit._id}`
            : `https://to-do-backend-1-ihwt.onrender.com/api/tasks`;

        const method = taskToEdit ? 'PUT' : 'POST';

        const taskDataToSend = {
            ...form,
            lastUpdated: form.lastUpdated || new Date().toISOString()
        };

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(taskDataToSend),
            });

            if (res.status === 409) {
                const data = await res.json();
                setConflictData({
                    serverVersion: data.serverVersion,
                    clientVersion: taskDataToSend,
                });
                return;
            }

            if (!res.ok) throw new Error('Failed to save task');

            await res.json();
            onClose();
        } catch (err) {
            console.error('Error creating/updating task:', err);
            alert('Something went wrong');
        }
    };



    const handleOverwrite = async () => {
        try {
            const response = await fetch(`https://to-do-backend-1-ihwt.onrender.com/api/tasks/${taskToEdit._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    ...conflictData.clientVersion,
                    lastUpdated: new Date().toISOString(),
                    isResolution: true
                }),
            });

            if (!response.ok) throw new Error('Overwrite failed');
            onClose();
        } catch (err) {
            console.error('Overwrite error:', err);
            alert('Overwrite failed. Please try again.');
        }
    };

    const handleMerge = async () => {
        try {

            const mergedTask = {
                ...conflictData.serverVersion,
                description: `${conflictData.serverVersion.description} ${conflictData.clientVersion.description}`,
                lastUpdated: new Date().toISOString(),
                isResolution: true
            };

            const response = await fetch(`/${taskToEdit._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(mergedTask),
            });

            if (!response.ok) throw new Error('Merge failed');
            onClose();
        } catch (err) {
            alert('Merge failed. Please try again.');
        }
    };



    const handleSmartAssign = () => {
        const user = SmartAssign(allTasks, users);
        if (user) {
            setForm(prev => ({ ...prev, assignedTo: user._id }));
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h2>{taskToEdit ? 'Edit Task' : 'Create New Task'}</h2>
                {conflictData && (
                    <div className="conflict-warning">
                        <h3> Conflict Detected</h3>
                        <p>This task was updated by someone else. Choose how to resolve:</p>

                        <div className="conflict-boxes">
                            <div className="conflict-version">
                                <h4>Server Version</h4>
                                <p><strong>Title:</strong> {conflictData.serverVersion.title}</p>
                                <p><strong>Description:</strong> {conflictData.serverVersion.description}</p>
                                <p><strong>Status:</strong> {conflictData.serverVersion.status}</p>
                                <p><strong>Priority:</strong> {conflictData.serverVersion.priority}</p>
                            </div>
                            <div className="conflict-version">
                                <h4>Your Version</h4>
                                <p><strong>Title:</strong> {conflictData.clientVersion.title}</p>
                                <p><strong>Description:</strong> {conflictData.clientVersion.description}</p>
                                <p><strong>Status:</strong> {conflictData.clientVersion.status}</p>
                                <p><strong>Priority:</strong> {conflictData.clientVersion.priority}</p>
                            </div>
                        </div>

                        <div className="conflict-actions">
                            <button
                                type="button"
                                onClick={handleOverwrite}
                                className="overwrite-btn"
                            >
                                Overwrite
                            </button>
                            <button
                                type="button"
                                onClick={handleMerge}
                                className="merge-btn"
                            >
                                Merge & Edit
                            </button>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        required
                        value={form.title}
                        onChange={handleChange}
                    />
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                    />
                    <div className="assign-controls">
                        <select
                            name="assignedTo"
                            value={form.assignedTo}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Assign To</option>
                            {users.map(user => (
                                <option key={user._id} value={user._id}>
                                    {user.name} ({user.email})
                                </option>
                            ))}
                        </select>
                        <button type="button" className="smart-assign-btn" onClick={handleSmartAssign}>
                            Smart Assign
                        </button>
                    </div>

                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                    >
                        <option value="Todo">Todo</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                    </select>
                    <select
                        name="priority"
                        value={form.priority}
                        onChange={handleChange}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="cancel-btn">
                            Cancel
                        </button>
                        <button type="submit">{taskToEdit ? 'Update' : 'Create'}</button>

                    </div>
                </form>
            </div>
        </div>
    );

}

export default NewTaskModal;