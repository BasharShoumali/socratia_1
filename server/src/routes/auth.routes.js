import express from "express";
import { signup, signin } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);

// Protected test route
router.get("/me", requireAuth, (req, res) => {
  return res.status(200).json({ ok: true, user: req.user });
});

export default router;
