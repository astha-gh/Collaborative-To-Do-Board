# Real-Time Collaborative To-Do Board

## Project Overview

A full-stack Kanban-style to-do board that supports real-time collaboration using WebSockets. Users can create, edit, move, assign, and delete tasks live, with smart user assignment and conflict resolution.

## Tech stack

- MongoDB
- Node.js
- Express.js
- React.js
- SOCKET.IO

## Setup and installation instructions

### Clone Repository
```bash
git clone https://github.com/your-username/real-time-todo-board.git
cd real-time-todo-board
```

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Frontend Setup 
```bash
cd ../frontend
npm install
npm start
```

## Features and Usage Guide

- 🔐 Authentication: Register and log in securely using JWT.
- 🧱 Kanban View: Tasks displayed across columns – To Do, In Progress, Done.
- 📋 Create/Edit/Delete Tasks: Modal-based UI for adding and updating tasks.
- 🧠 Smart Assign: Automatically assign tasks to the user with the fewest current assignments.
- 🔄 Real-Time Sync: All task actions (create, update, move, delete) are reflected instantly across all connected users using Socket.IO.
- 👥 User Assignment: Assign/reassign tasks to any user.
- ⚔️ Conflict Handling: Detect and resolve concurrent task edits using overwrite or merge options.
- 📜 Activity Log: Track task-related actions in a scrollable activity panel (requires refresh to update, planned for real-time).

## Live Demo And Video

- Live Demo: [https://realtime-todo-6b9279.netlify.app/](https://realtime-todo-6b9279.netlify.app/)
- Video Link: [https://www.loom.com/share/de2cc3ef0c8e419e9bab652f7bb8f833?sid=d52c8f63-bd2e-42b7-bdfa-b04df9348176](https://www.loom.com/share/de2cc3ef0c8e419e9bab652f7bb8f833?sid=d52c8f63-bd2e-42b7-bdfa-b04df9348176)
