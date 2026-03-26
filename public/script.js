const socket = io();

const joinContainer = document.getElementById('join-container');
const chatContainer = document.getElementById('chat-container');
const joinForm = document.getElementById('join-form');
const chatForm = document.getElementById('chat-form');
const chatMessages = document.getElementById('chat-messages');
const roomDisplay = document.getElementById('room-display');
const userCount = document.getElementById('user-count');
const msgInput = document.getElementById('msg');
const leaveBtn = document.getElementById('leave-btn');
const typingIndicator = document.getElementById('typing-indicator');

let currentUsername = '';
let currentRoom = '';
let typingTimeout = null;

// Join room
joinForm.addEventListener('submit', (e) => {
    e.preventDefault();

    currentUsername = document.getElementById('username').value;
    currentRoom = document.getElementById('room').value;

    if (currentUsername && currentRoom) {
        socket.emit('joinRoom', { username: currentUsername, room: currentRoom });
        
        joinContainer.classList.add('hidden');
        chatContainer.classList.remove('hidden');
        roomDisplay.innerText = currentRoom;
        msgInput.focus();
    }
});

// Message from server
socket.on('message', (message) => {
    outputMessage(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Room users info
socket.on('roomUsers', ({ room, users }) => {
    userCount.innerText = `${users.length} user${users.length !== 1 ? 's' : ''} online`;
});

// User typing
socket.on('userTyping', ({ username, isTyping }) => {
    if (isTyping) {
        typingIndicator.innerText = `${username} is typing...`;
    } else {
        typingIndicator.innerText = '';
    }
});

// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = msgInput.value;
    if (msg) {
        socket.emit('chatMessage', msg);
        msgInput.value = '';
        msgInput.focus();
        
        // Clear typing indicator immediately on send
        sendTypingStatus(false);
    }
});

// Typing detection
msgInput.addEventListener('input', () => {
    sendTypingStatus(true);
    
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        sendTypingStatus(false);
    }, 2000);
});

function sendTypingStatus(isTyping) {
    socket.emit('typing', isTyping);
}

// Leave room
leaveBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to leave the chat?')) {
        window.location.reload();
    }
});

// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');

    if (message.user === 'System') {
        div.classList.add('message-system');
        div.innerHTML = `<p>${message.text}</p>`;
    } else {
        const isOwn = message.senderId === socket.id;
        div.classList.add(isOwn ? 'message-own' : 'message-other');
        div.innerHTML = `
            <p class="meta">${isOwn ? 'You' : message.user} <span>${message.time}</span></p>
            <p class="text">${message.text}</p>
        `;
    }

    chatMessages.appendChild(div);
}
