export function requireAdmin(req, res, next) {
  // requireAuth must run before this (so req.user exists)
  if (!req.user) {
    return res.status(401).json({ ok: false, error: "Missing auth." });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ ok: false, error: "Admin access required." });
  }

  return next();
}
