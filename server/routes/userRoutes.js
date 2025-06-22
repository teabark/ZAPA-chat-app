import express from "express";
import { getAllUsers } from "../controllers/userController.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/all", getAllUsers);
router.get("/:uid", async (req, res) => {
  const { uid } = req.params;
  try {
    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});


export default router;
