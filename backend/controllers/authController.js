const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;;

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(422).json({ error: "Please enter all fields" });
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
        res.status(201).json({ token, user: { id: user._id, name: user.name } });
    }
    catch {
        res.status(500).json({ message: "Server error" });
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "Please enter all fields" });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
        res.status(200).json({ token, user: { id: user._id, name: user.name } });
    }
    catch {
        res.status(500).json({ message: "Server error" });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'name email'); // Only return name & email
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error while fetching users' });
    }
};

module.exports = { registerUser, loginUser, getAllUsers };
