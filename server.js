const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Store active users and their rooms
const users = new Map(); // socket.id -> { username, room }

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join Room
    socket.on('joinRoom', ({ username, room }) => {
        socket.join(room);
        users.set(socket.id, { username, room });

        // Welcome current user
        socket.emit('message', {
            user: 'System',
            text: `Welcome to the ${room} room, ${username}!`,
            time: new Date().toLocaleTimeString()
        });

        // Broadcast when a user connects to a specific room
        socket.to(room).emit('message', {
            user: 'System',
            text: `${username} has joined the chat.`,
            time: new Date().toLocaleTimeString()
        });

        // Send room users info
        updateRoomInfo(room);
    });

    // Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = users.get(socket.id);
        if (user) {
            io.to(user.room).emit('message', {
                user: user.username,
                text: msg,
                time: new Date().toLocaleTimeString(),
                senderId: socket.id
            });
        }
    });

    // Listen for typing events
    socket.on('typing', (isTyping) => {
        const user = users.get(socket.id);
        if (user) {
            socket.to(user.room).emit('userTyping', {
                username: user.username,
                isTyping
            });
        }
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = users.get(socket.id);
        if (user) {
            socket.to(user.room).emit('message', {
                user: 'System',
                text: `${user.username} has left the chat.`,
                time: new Date().toLocaleTimeString()
            });
            
            const room = user.room;
            users.delete(socket.id);
            updateRoomInfo(room);
        }
        console.log('User disconnected:', socket.id);
    });

    function updateRoomInfo(room) {
        const roomUsers = Array.from(users.values())
            .filter(u => u.room === room)
            .map(u => u.username);
        
        io.to(room).emit('roomUsers', {
            room: room,
            users: roomUsers
        });
    }
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
