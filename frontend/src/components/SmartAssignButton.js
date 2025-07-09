const SmartAssign = (tasks, users) => {
    if (!users.length) {
        return null;
    }
    const taskCount = {};

    tasks.forEach(task => {
        const userId = task.assignedTo?._id;
        if (userId && (task.status === 'Todo' || task.status === 'In Progress')) {
            taskCount[userId] = (taskCount[userId] || 0) + 1;
        }
    })

    const userTask = users.map(user => ({
        user,
        taskCount: taskCount[user._id] || 0
    }));

    const minCount = Math.min(...userTask.map(u => u.taskCount));
    const leastBusy = userTask.filter(u => u.taskCount === minCount);
    const selected = leastBusy[Math.floor(Math.random() * leastBusy.length)];

    return selected.user;
}

export default SmartAssign;


