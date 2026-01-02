import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  console.log('token',token)
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const verified = jwt.verify(token, 'TOKEN');
    console.log("verified",verified)
    req.user = verified;
    
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
}
