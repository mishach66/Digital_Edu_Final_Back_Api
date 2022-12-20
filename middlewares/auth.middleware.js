import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  let token = req.headers?.authorization;
  if (!token || !token.startsWith("Bearer")) {
    res.status(401).json({ message: "You are not authenticated!" });
    return;
  }
  try {
    token = token.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "token not valid" });
    return;
  }
};
