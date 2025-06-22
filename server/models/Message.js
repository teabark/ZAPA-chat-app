import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
  senderId: String,
  recipientId: String,
  room: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});
export default mongoose.model("Message", messageSchema);
