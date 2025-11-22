require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8888;
const cors = require('cors');
const mongoose = require('mongoose');


const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
})

app.use(cors({
    origin: "*",
    credentials: true
}));

let onlineUsers = 0;

io.on("connection", socket => {
    onlineUsers++;
    console.log("User connected : " + socket.id);

    io.emit('userCount', onlineUsers);

    socket.on("disconnect", () => {
        onlineUsers--;
        console.log("User disconnected");
        io.emit('userCount', onlineUsers);
    });
});
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(
    () => console.log("MongoDB connected")
).catch(err => console.log(err));

app.use("/api/auth", require("./routes/auth"));
app.use('/api/tasks', require('./routes/taskRoutes'));

app.set("io", io);

server.listen(PORT, () => {
    console.log(`Server is listening in ${PORT}`)
})