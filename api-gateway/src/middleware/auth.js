const session = require("express-session");

const authMiddleware = (req, res, next) => {
  if (req.session && req.session.userId) {
    next(); // 인증된 경우 다음으로 진행
  } else {
    res.status(412).json({ message: "Precondition Failed" });
  }
};

module.exports = authMiddleware;