const cors = require('cors');
const express = require("express");
const userRouter = require("./routes/userRouter");
const sessionMiddleware = require("./config/session");

const app = express();
const PORT = 9001;

app.use(cors());
app.use(express.json());
app.use(sessionMiddleware);
app.use("/api/v1/users", userRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
