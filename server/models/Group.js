import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  creator: { type: String, required: true }, // UID of creator
  members: [{ type: String }], // UIDs of members
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Group", groupSchema);
