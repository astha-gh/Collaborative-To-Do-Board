const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const {
    createTask,
    getAllTasks,
    updateTask,
    deleteTask,
} = require('../controllers/taskController');

router.post('/' , authenticate , createTask);
router.get('/', authenticate, getAllTasks);
router.put('/:id', authenticate, updateTask);
router.delete('/:id', authenticate, deleteTask);