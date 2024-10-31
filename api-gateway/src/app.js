const cors = require('cors');
const express = require("express");
const session = require("express-session");
const app = express();
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const commentRoutes = require("./routes/comment");
const sessionMiddleware = require("./config/session");

app.use(cors({
    origin: 'http://cummnity-study.duckdns.org',
    credentials: true
  }
));
app.use(express.json());

// 세션 설정
app.use(sessionMiddleware);

// 서비스 라우팅
app.use("/user", userRoutes);
app.use("/post", postRoutes);
// app.use("/comment", commentRoutes);

const PORT = 9000;
app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});
