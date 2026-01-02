import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { verifyRecaptcha } from "../utils/verifyRecaptcha.js";

function signToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is missing in server/.env");

  return jwt.sign(
    { sub: user._id.toString(), email: user.email, role: user.role },
    secret,
    { expiresIn: "7d" }
  );
}

export async function signup(req, res) {
  try {
    const { fullName = "", email, password, captchaToken } = req.body ?? {};

    if (!email || !password) {
      return res
        .status(400)
        .json({ ok: false, error: "Email and password are required." });
    }
    if (typeof password !== "string" || password.length < 8) {
      return res
        .status(400)
        .json({ ok: false, error: "Password must be at least 8 characters." });
    }

    const captchaOk = await verifyRecaptcha(captchaToken);
    if (!captchaOk) {
      return res
        .status(400)
        .json({ ok: false, error: "Captcha verification failed." });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const existing = await User.findOne({ email: normalizedEmail }).lean();
    if (existing) {
      return res
        .status(409)
        .json({ ok: false, error: "Email already in use." });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      fullName: String(fullName).trim(),
      email: normalizedEmail,
      passwordHash,
      role: "user",
    });

    const token = signToken(user);

    return res.status(201).json({
      ok: true,
      token,
      user: {
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
    } catch (err) {
    console.error("🔥 SIGNUP ERROR:", err);

    if (err?.code === 11000) {
      return res
        .status(409)
        .json({ ok: false, error: "Email already in use." });
    }

    return res.status(500).json({ ok: false, error: "Server error." });
  }
}

export async function signin(req, res) {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res
        .status(400)
        .json({ ok: false, error: "Email and password are required." });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        ok: false,
        error: "No account found with this email.",
      });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);

    if (!ok) {
      return res.status(401).json({
        ok: false,
        error: "Incorrect password.",
      });
    }

    const token = signToken(user);

    return res.status(200).json({
      ok: true,
      token,
      user: {
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: "Server error." });
  }
}
