import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Không có token hoặc định dạng sai" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Gắn thông tin user vào request
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token không hợp lệ" });
  }
}
