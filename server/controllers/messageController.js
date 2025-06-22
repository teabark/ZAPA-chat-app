import Message from "../models/Message.js";

// Fetch private messages between two users
export const getPrivateMessages = async (req, res) => {
  const { user1, user2 } = req.query;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: user1, recipientId: user2 },
        { senderId: user2, recipientId: user1 },
      ],
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    console.error("Error fetching private messages:", err);
    res.status(500).json({ error: "Failed to fetch private messages" });
  }
};

// Fetch messages from a specific room
export const getRoomMessages = async (req, res) => {
  const { room } = req.params;

  try {
    const messages = await Message.find({ room }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    console.error("Error fetching room messages:", err);
    res.status(500).json({ error: "Failed to fetch room messages" });
  }
};
