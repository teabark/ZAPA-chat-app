import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/connectMongo.js';
import authRoutes from './routes/auth.js';
import messageRoutes from './routes/messageRoutes.js';
import userRoutes from './routes/userRoutes.js';
import Message from './models/Message.js';
import uploadRoutes from './routes/upload.js';
import groupRoutes from "./routes/groupRoutes.js"
import path from "path";
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

const userSocketMap = {}; // { uid: socketId }
const onlineUsers = new Set();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: '10mb' })); // support for base64 images
connectDB();

app.use(express.static(path.join(__dirname, "frontend")));
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/groups", groupRoutes);

io.on("connection", (socket) => {
  console.log("🟢 Connected:", socket.id);

    socket.on("userOnline", (userId) => {
    onlineUsers.add(userId);
    io.emit("onlineUsers", Array.from(onlineUsers));
  });

  socket.on("register", (uid) => {
    userSocketMap[uid] = socket.id;
    io.emit("onlineUsers", Object.keys(userSocketMap));
    console.log(`🔗 Registered ${uid} → ${socket.id}`);
  });

  socket.on("joinRoom", (roomId) => {
  socket.join(roomId);
  console.log(`👥 User ${socket.id} joined room: ${roomId}`);
});


  socket.on("sendMessage", async (msg) => {
    try {
      const savedMsg = await Message.create(msg);

      const { recipientId, room, senderId } = savedMsg;

      if (room) {
        // Group chat
        io.to(room).emit("receiveMessage", savedMsg);
      } else if (recipientId && userSocketMap[recipientId]) {
        // Private chat to recipient
        io.to(userSocketMap[recipientId]).emit("receiveMessage", savedMsg);
      }

      // Also echo back to sender
      if (senderId && userSocketMap[senderId]) {
        io.to(userSocketMap[senderId]).emit("receiveMessage", savedMsg);
      }
    } catch (err) {
      console.error("❌ Error saving message:", err);
    }
  });

  socket.on("typing", ({ senderId, recipientId }) => {
    if (recipientId && userSocketMap[recipientId]) {
      io.to(userSocketMap[recipientId]).emit("typing", senderId);
    }
  });

  socket.on("markAsRead", async ({ senderId, recipientId }) => {
    try {
      const updated = await Message.updateMany(
        { senderId, recipientId, read: false },
        { $set: { read: true } }
      );

      // notify sender to update ticks
      if (userSocketMap[senderId]) {
        io.to(userSocketMap[senderId]).emit("messagesRead", { from: recipientId });
      }

      console.log(`✔ Read receipts updated: ${updated.modifiedCount} messages`);
    } catch (err) {
      console.error("❌ Failed to mark messages as read:", err);
    }
  });

  socket.on("disconnect", () => {
    for (const [uid, socketId] of Object.entries(userSocketMap)) {
      if (socketId === socket.id) {
        delete userSocketMap[uid];
        break;
      }
    }
    io.emit("onlineUsers", Object.keys(userSocketMap));
    console.log("🔴 Disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
