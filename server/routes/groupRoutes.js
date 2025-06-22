import express from "express";
import Group from "../models/Group.js";
const router = express.Router();

// Create group
router.post("/create", async (req, res) => {
  const { name, creator, members } = req.body;
  try {
    const group = new Group({ name, creator, members: [creator, ...members] });
    await group.save();
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: "Failed to create group" });
  }
});

// Get all groups for a user
router.get("/my-groups/:uid", async (req, res) => {
  const { uid } = req.params;
  try {
    const groups = await Group.find({ members: uid });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch groups" });
  }
});

// Add member to group
router.put("/:groupId/add-member", async (req, res) => {
  const { groupId } = req.params;
  const { uid } = req.body;
  try {
    const group = await Group.findById(groupId);
    if (!group.members.includes(uid)) {
      group.members.push(uid);
      await group.save();
    }
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: "Failed to add member" });
  }
});

// Get a specific group by ID
router.get("/:id", async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ error: "Group not found" });
    res.json(group);
  } catch (err) {
    console.error("Failed to fetch group by ID:", err);
    res.status(500).json({ error: "Failed to fetch group" });
  }
});


export default router;