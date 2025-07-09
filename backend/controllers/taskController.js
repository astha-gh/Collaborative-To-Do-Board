const Task = require('../models/Tasks');
const logActivity = require('../utils/logActivity');

const createTask = async (req, res) => {
    try {
        const { title, description, assignedTo, status, priority } = req.body;

        const existing = await Task.findOne({ title });
        if (existing) {
            return res.status(400).json({ error: 'Task already present' });
        }

        const newTask = new Task({ title, description, assignedTo, status, priority });
        await newTask.save();

        await logActivity(req.user._id, 'create', newTask._id );

        const populatedTask = await Task.findById(newTask._id).populate('assignedTo', 'name email');

        const io = req.app.get('io');
        io.emit('taskCreated', populatedTask);

        res.status(201).json(populatedTask);
    } catch (err) {
        return res.status(500).json({ error: 'Server error while creating task' });
    }
};


const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find().populate('assignedTo', 'name email');
        res.json(tasks);
    }
    catch (err) {
        return res.status(500).json({ error: 'Server error while fetching task' });
    }
}

const updateTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const clientTask = req.body;

        const existingTask = await Task.findById(taskId);
        if (!existingTask) {
            return res.status(404).json({ error: 'Task not found' });
        }

        if (!clientTask.isResolution) {
            const clientTimestamp = new Date(clientTask.lastUpdated).getTime();
            const serverTimestamp = new Date(existingTask.lastUpdated).getTime();

            if (clientTimestamp !== serverTimestamp) {
                return res.status(409).json({
                    conflict: true,
                    message: 'Conflict detected',
                    serverVersion: existingTask,
                    clientVersion: clientTask
                });
            }
        }

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            {
                ...clientTask,
                lastUpdated: new Date()
            },
            { new: true }
        ).populate('assignedTo', 'name email');

       
        if (existingTask.status !== updatedTask.status) {
            await logActivity(req.user._id, 'move', taskId);
        } else if (
            existingTask.assignedTo &&
            updatedTask.assignedTo &&
            String(existingTask.assignedTo) !== String(updatedTask.assignedTo._id)
        ) {
            await logActivity(req.user._id, 'assign', taskId );
        } else {
            await logActivity(req.user._id, 'edit', taskId);
        }
        

        const io = req.app.get('io');
        io.emit('taskUpdated', updatedTask);

        res.json(updatedTask);
    } catch (err) {
        console.error('Update error:', err);
        return res.status(500).json({ error: 'Server error while updating task' });
    }
};


const deleteTask = async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);

        await logActivity(req.user._id, 'delete', req.params.id );

        const io = req.app.get('io');
        io.emit('taskDeleted', req.params.id);

        res.json({ message: 'Task deleted' });
    } catch (err) {
        return res.status(500).json({ error: 'Server error while deleting task' });
    }
};


module.exports = { createTask, getAllTasks, updateTask, deleteTask };