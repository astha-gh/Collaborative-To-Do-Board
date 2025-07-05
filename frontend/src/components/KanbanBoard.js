import React, {useState , useEffect} from "react";
import socket from '../socket';
import '../styles/KanbanBoard.css'; 


const KanbanBoard = () => {
    const [tasks , setTasks] = useState([]);
    const [draggedTaskId , setdraggedTaskId] = useState(null);

    useEffect(() => {
        fetch('/api/tasks')
            .then(res => res.json())
            .then(data => setTasks(data))

        socket.on('taskCreated' , (newTask) => {
            setTasks(prev => [...prev , newTask]);
        })

        socket.on('taskUpdated' , (update) => {
            setTasks(prev => 
                prev.map(task => task._id === update._id ? update : task)
            )
        })

        socket.on('taskDeleted' , (deleteId) => {
            setTasks(prev => prev.filter(task => task._id !== deleteId))
        });

        return () => {
            socket.off('taskCreated');
            socket.off('taskUpdated');
            socket.off('taskDeleted');
        }

    }, [])

    //Storing dragged taskId when drag starts
    const handleDragStart = (e, taskId) => {
        setdraggedTaskId(taskId);
    }

    const handleDrop = async (e, newStatus) => {
        e.preventDefault();
        const draggedTask = tasks.find(task => task._id === draggedTaskId);
        if (!draggedTask || draggedTask.status === newStatus) return;

        const update = { ...draggedTask, status: newStatus };
        setTasks(prev =>
            prev.map(task => task._id === draggedTaskId ? update : task)
        )

        try {
            const res = await fetch(`/api/tasks/${draggedTaskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json();
            socket.emit('taskUpdated', data);
        }
        catch (err) {
            console.error('Failed to update task status:', err);
        }
        setdraggedTaskId(null);
    }

    const handleDragOver = (e) => {
        e.preventDefault();
    };


    const columns = ['todo', 'in-progress', 'done'];

    return(
        <div className="kanban-container">
            {
                columns.map(col => (
                    <div key={col} className="kanban-column"
                    onDrop = {(e) => {
                        handleDrop(e  , col)
                    }}
                    onDragOver={handleDragOver}
                    >
                        <h3>{col.replace('-', ' ').toUpperCase()}</h3>
                        {
                            tasks
                                .filter(task => task.status === col)
                                .map(task => (
                                    <div key={task._id} className="kanban-task"
                                    draggable 
                                    onDragStart={(e) => handleDragStart(e , task._id)}>
                                        <h4>{task.title}</h4>
                                        <p>{task.description}</p>
                                    </div>
                            ))
                        }
                    </div>
                ))
            }
        </div>
    )
}

export default KanbanBoard;