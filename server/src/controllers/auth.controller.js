import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

console.log("[CONTROLLER] Auth controller loaded");

/* =========================
   REGISTER
========================= */
export async function register(req, res) {
  console.log("[AUTH][REGISTER] Request received");

  try {
    const {
      username,
      firstName,
      lastName,
      dateOfBirth,
      email,
      password,
      confirmPassword,
    } = req.body;

    if (
      !username ||
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      console.log("[AUTH][REGISTER] Missing fields");
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    if (password !== confirmPassword) {
      console.log("[AUTH][REGISTER] Passwords do not match");
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    console.log("[AUTH][REGISTER] Checking existing user");

    const exists = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (exists) {
      console.log("[AUTH][REGISTER] User already exists");
      return res.status(400).json({
        message: "User already exists",
      });
    }

    console.log("[AUTH][REGISTER] Hashing password");

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("[AUTH][REGISTER] Creating user");

    const user = await User.create({
      username,
      firstName,
      lastName,
      dateOfBirth,
      email,
      password: hashedPassword,
    });

    console.log("[AUTH][REGISTER] Success:", user._id.toString());

    return res.status(201).json({
      message: "User created successfully",
    });
  } catch (err) {
    console.error("[AUTH][REGISTER] ERROR");
    console.error(err);

    return res.status(500).json({
      message: "Server error",
    });
  }
}

/* =========================
   LOGIN
========================= */
export async function login(req, res) {
  console.log("[AUTH][LOGIN] Request received");

  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      console.log("[AUTH][LOGIN] Missing credentials");
      return res.status(400).json({
        message: "Missing credentials",
      });
    }

    console.log("[AUTH][LOGIN] Searching for user");

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).select("+password");

    if (!user) {
      console.log("[AUTH][LOGIN] User not found");
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    console.log("[AUTH][LOGIN] Comparing passwords");

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("[AUTH][LOGIN] Password mismatch");
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    console.log("[AUTH][LOGIN] Creating JWT");

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role || "user", // ⬅️ هذا هو الإصلاح
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("[AUTH][LOGIN] Success:", user._id.toString());

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role || "user",
      },
    });
  } catch (err) {
    console.error("[AUTH][LOGIN] ERROR");
    console.error(err);

    return res.status(500).json({
      message: "Server error",
    });
  }
}
