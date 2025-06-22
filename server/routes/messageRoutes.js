import express from "express";
import { getPrivateMessages, getRoomMessages } from "../controllers/messageController.js";

const router = express.Router();

router.get("/private", getPrivateMessages);
router.get("/room/:room", getRoomMessages);

// Mark messages in a room as read by user
router.post("/mark-read", async (req, res) => {
  const { userId, roomId } = req.body;
  try {
    await Message.updateMany(
      {
        room: roomId,
        readBy: { $ne: userId }
      },
      { $addToSet: { readBy: userId } }
    );
    res.sendStatus(200);
  } catch (err) {
    console.error("Failed to mark messages as read", err);
    res.status(500).json({ error: "Failed to mark as read" });
  }
});

// Get unread counts for each group chat for a user
router.get("/unread-counts/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const messages = await Message.find({ readBy: { $ne: userId }, room: { $ne: null } });

    const unreadCounts = {};
    messages.forEach(msg => {
      if (msg.room) {
        unreadCounts[msg.room] = (unreadCounts[msg.room] || 0) + 1;
      }
    });

    res.json(unreadCounts);
  } catch (err) {
    console.error("Failed to fetch unread counts", err);
    res.status(500).json({ error: "Failed to get unread counts" });
  }
});

// GET /api/messages/unread/:uid
router.get("/unread/:uid", async (req, res) => {
  const { uid } = req.params;

  try {
    const privateUnread = await Message.aggregate([
      { $match: { recipientId: uid, read: false } },
      { $group: { _id: "$senderId", count: { $sum: 1 } } },
    ]);

    const groupUnread = await Message.aggregate([
      { $match: { room: { $ne: null }, readBy: { $ne: uid } } },
      { $group: { _id: "$room", count: { $sum: 1 } } },
    ]);

    res.json({ privateUnread, groupUnread });
  } catch (err) {
    console.error("❌ Failed to fetch unread counts:", err);
    res.status(500).json({ error: "Server error" });
  }
});


export default router;
