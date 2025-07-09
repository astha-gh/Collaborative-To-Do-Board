const ActivityLog = require('../models/ActivityLog');

const logActivity = async (userId, action, taskId, io = null) => {
    try {
        const newLog = await ActivityLog.create({
            user: userId,
            action,
            task: taskId
        });

        const populatedLog = await newLog.populate('user', 'name').populate('task', 'title');

        if (io) {
            io.emit('newActivityLog', populatedLog);
        }
    } catch (err) {
        console.error('Error logging activity:', err.message);
    }
};


module.exports = logActivity;

