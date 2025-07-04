import React, {useState , useEffect } from "react";
import socket from '../socket';
import '../styles/KanbanBoard.css'; 

const KanbanBoard = () => {
    const [tasks , setTasks] = useState([]);

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

    const columns = ['Todo' , 'In Progress' , 'Done'];

    return(
        <div className="kanban-container">
            {
                columns.map(col => (
                    <div key={col} className="kanban-column">
                        <h3>{col.toUpperCase()}</h3>
                        {
                            tasks
                                .filter(task => task.status === col)
                                .map(task => (
                                    <div key={task._id} className="kanban-task">
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