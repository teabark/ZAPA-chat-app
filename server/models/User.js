import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  uid: { type: String, required: true },
  photo: { type: String, required: true },
  verified: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

export default User;
