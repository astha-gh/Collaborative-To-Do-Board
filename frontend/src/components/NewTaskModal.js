import React, {useState , useEffect} from 'react';
import '../styles/NewTaskModal.css';

const NewTaskModal = ({onClose }) => {
    const [form , setForm] = useState({
        title : '',
        description: '',
        assignedTo: '',
        status:'Todo',
        priority:'Medium',
    });

    const [users , setUser] = useState([]);

    useEffect(()=> {
        fetch('http://localhost:7777/api/auth/users')
            .then(res => res.json())
            .then(data => setUser(data))
            .catch(err => console.error('Failed to load users' , err));
    } , []);

    const handleChange = (e) => {
        setForm({...form , [e.target.name]: e.target.value});
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const res = await fetch('http://localhost:7777/api/tasks' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(form),
            });
            const newTask = await res.json();
            onClose();
        }
        catch(err){
            console.error('Error creating Task' , err);
        }
    }

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h2>Create New Task</h2>
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
                        <button type="submit">Create</button>
                        
                    </div>
                </form>
            </div>
        </div>
    );
    
}

export default NewTaskModal;