const cors = require('cors');
const express = require("express");
const session = require("express-session");
const app = express();
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const imageRoutes = require("./routes/image");
const commentRoutes = require("./routes/comment");
const likeRoutes = require("./routes/like");
const sessionMiddleware = require("./config/session");
require('dotenv').config();

app.use(cors(
    {
        origin: process.env.DOMAIN_URL,
        credentials: true
    }
));
app.use(express.json());

// 세션 설정
app.use(sessionMiddleware);

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/images", imageRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/likes", likeRoutes);

const PORT = 9000;
app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});
