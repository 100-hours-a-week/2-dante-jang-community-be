const redisClient = require("../config/redis");

const authMiddleware = async (req, res, next) => {
  if (req.session && req.session.userId) {
    try {
      const sessionExists = await redisClient.exists(`sess:${req.sessionID}`);
      if (sessionExists) {
        next();
      } else {
        res.status(412).json({ message: "Precondition Failed: Session expired or not found" });
      }
    } catch (error) {
      console.error("Redis error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(412).json({ message: "Precondition Failed" });
  }
};

module.exports = authMiddleware;