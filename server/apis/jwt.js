import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    req.user = decoded; 
    next();
  });
};