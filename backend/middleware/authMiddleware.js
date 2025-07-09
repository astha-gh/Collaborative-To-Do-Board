const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

module.exports = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Access Denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id); 

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        req.user = user; 
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid Token' });
    }
};
