import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const [type, token] = auth.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({ ok: false, error: "Missing auth token." });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res
        .status(500)
        .json({ ok: false, error: "JWT_SECRET is missing on server." });
    }

    const payload = jwt.verify(token, secret);

    // Attach user info to request for later routes
    req.user = payload;

    return next();
  } catch (err) {
    return res.status(401).json({ ok: false, error: "Invalid or expired token." });
  }
}
