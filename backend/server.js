/**
 * FaceTube Backend Server
 * "Connect. Create. Share."
 * Founder & Creator: Md Foysal Alom
 */
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests from this IP, please try again later.' }
});
app.use('/api', apiLimiter);

// Seed Data & Memory DB
const FOUNDER_PROFILE = {
  id: 'user_mdfoysalalom',
  name: 'Md Foysal Alom',
  username: 'mdfoysalalom',
  role: 'creator_founder',
  verified: true,
  title: 'Creator & Founder of FaceTube',
  bio: 'Building the next generation of social media, video reels & fair creator monetization.',
  followersCount: 128500,
  followingCount: 42,
  monetizationStatus: 'monetized'
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', platform: 'FaceTube', timestamp: new Date() });
});

// Creator Info
app.get('/api/creator/official', (req, res) => {
  res.json({ creator: FOUNDER_PROFILE });
});

// Platform Settings (e.g. Follow Gate requirement & Monetization thresholds)
let platformSettings = {
  requireCreatorFollowOnboarding: true,
  monetizationMinFollowers: 1000,
  monetizationMinViews: 10000,
  revenueSharePercent: 70
};

app.get('/api/settings', (req, res) => {
  res.json(platformSettings);
});

app.put('/api/admin/settings', (req, res) => {
  platformSettings = { ...platformSettings, ...req.body };
  res.json({ success: true, settings: platformSettings });
});

// Real-Time Socket.IO Chat
io.on('connection', (socket) => {
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
  });

  socket.on('send_message', (data) => {
    io.to(data.roomId).emit('receive_message', data);
  });

  socket.on('typing', (data) => {
    socket.to(data.roomId).emit('user_typing', data);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`FaceTube server running on port ${PORT}`);
  console.log(`FaceTube Founder & Creator: Md Foysal Alom`);
});

module.exports = { app, server };
