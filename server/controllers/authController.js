import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../utils/sendEmail.js";

export const login = async (req, res) => {
  try {
    const { email, name, uid, photo } = req.body;

    if (!email || !name || !uid || !photo) {
      return res.status(400).json({ error: "Missing required user fields" });
    }

    let user = await User.findOne({ email });

    if (user && user.verified) {
      const token = jwt.sign({ email, name, uid, photo }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      return res.status(200).json({ message: "User logged in", user, token });
    }

    // Create or update the user if not verified
    if (!user) {
      user = new User({ email, name, uid, photo, verified: false });
      await user.save();
    }

    // Send verification email
    const token = jwt.sign({ email, name, uid, photo }, process.env.JWT_SECRET, {
      expiresIn: "7h",
    });

    await sendVerificationEmail(email, token);
    return res.status(200).json({ message: "Verification email sent" });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};


export const verify = async (req, res) => {
  const { token } = req.query;

  try {
    await connectMongo();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email, name, uid, photo } = decoded;

    let existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
    }

    const newUser = new User({ email, name, uid, photo });
    await newUser.save();

    res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
  } catch (err) {
    console.error("Verification error:", err);
    res.status(400).send("Invalid or expired verification link.");
  }
};

export const verifyToken = async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ user: decoded });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};


