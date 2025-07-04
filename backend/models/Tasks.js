const { MongoGridFSChunkError } = require('mongodb');
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    status: {
        type: String,
        enum: ['Todo' , 'In Progress' , 'Done'],
        default: 'Todo',
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium',
    },
}, {timestamps: true});

module.exports = mongoose.model('Task' , taskSchema);