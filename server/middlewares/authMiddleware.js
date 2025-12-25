import jwt from "jsonwebtoken";

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing or malformed",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId; // consistent with your controller
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized or invalid token",
    });
  }
};

export default protect;
