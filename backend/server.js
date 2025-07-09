require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 7777;
const cors = require('cors');
const mongoose = require('mongoose');



const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: '*' }
})

io.on("connection", socket => {
    console.log("User connected : " + socket.id);
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
})

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(
    () => console.log("MongoDB connected")
).catch(err => console.log(err));

app.use("/api/auth", require("./routes/auth"));
app.use('/api/tasks', require('./routes/taskRoutes'));
const activityLogRoutes = require('./routes/activityLogs');
app.use('/api/activity-logs', activityLogRoutes);


app.set("io", io);

app.get('/', (req, res) => {
    res.send('API is working!');
});
  

server.listen(PORT, () => {
    console.log(`Server is listening in ${PORT}`)
})