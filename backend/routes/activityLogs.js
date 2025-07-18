const express = require('express');
const router = express.Router();
const ActivityLog = require('../models/ActivityLog');

router.get('/', async (req, res) => {
    try {
        const logs = await ActivityLog.find()
            .sort({ timestamp: -1 })
            .limit(20)
            .populate('user', 'name email')
            .populate('task', 'title');
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch activity logs' });
    }
});

module.exports = router;
