import express from "express";
import { login, verify, verifyToken } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.get("/verify", verify);
router.post("/verify-token", verifyToken);

export default router;
