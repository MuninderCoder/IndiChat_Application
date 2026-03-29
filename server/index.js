const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');

const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/message');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Online users map: userId -> socketId
const onlineUsers = new Map();

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId && userId !== "undefined") {
    onlineUsers.set(userId, socket.id);
    io.emit('getOnlineUsers', Array.from(onlineUsers.keys()));
    console.log(`User connected: ${userId} (${socket.id})`);
  }

  socket.on('disconnect', () => {
    if (userId && userId !== "undefined") {
      onlineUsers.delete(userId);
      io.emit('getOnlineUsers', Array.from(onlineUsers.keys()));
      console.log(`User disconnected: ${userId}`);
    }
  });

  socket.on('sendMessage', async (data) => {
    const { senderId, receiverId, text, image, tempId } = data;
    const receiverSocketId = onlineUsers.get(receiverId);
    
    const messageData = {
      ...data,
      createdAt: new Date(),
      status: receiverSocketId ? 'delivered' : 'sent'
    };

    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', messageData);
      socket.emit('messageStatusUpdate', { tempId, status: 'delivered' });
    } else {
      socket.emit('messageStatusUpdate', { tempId, status: 'sent' });
    }
  });

  socket.on('markAsSeen', ({ messageId, senderId }) => {
    const senderSocketId = onlineUsers.get(senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit('messageStatusUpdate', { messageId, status: 'seen' });
    }
  });

  socket.on('typing', ({ receiverId, isTyping }) => {
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('displayTyping', { senderId: userId, isTyping });
    }
  });
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of default (30s)
})
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Could not connect to MongoDB. Check your whitelists.');
    console.error('Error Type:', err.name);
    console.error('Error Details:', err.message);
    process.exit(1);
  });

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../client/dist")));

// Keep an API entry point
app.get('/api', (req, res) => {
  res.send('IndiChat API is running');
});

// Catch-all route to serve the SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});
