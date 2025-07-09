import React from "react";
import { Trash2, Pencil } from "lucide-react";
import "../styles/TaskCard.css";

const TaskCard = ({ task, onDragStart, onDelete, onEdit }) => {
    return (
        <div
            className="kanban-task"
            draggable
            onDragStart={(e) => onDragStart(e, task._id)}
        >
            <div className="task-header">
                <div className="task-title">{task.title}</div>
                <div className="task-actions">
                    <Pencil size={16} className="icon edit" onClick={() => onEdit(task)} />
                    <Trash2 size={16} className="icon delete" onClick={() => onDelete(task._id)} />
                </div>
            </div>

            <div className="task-desc">{task.description}</div>

            <div className="task-details">
                <div className="task-meta">
                    <strong>Assigned:</strong> {task.assignedTo?.name || "Unassigned"}
                </div>
                <div className={`task-priority ${task.priority.toLowerCase()}`}>
                    <strong>Priority:</strong> {task.priority}
                </div>
            </div>
        </div>
    );
};

export default TaskCard;


