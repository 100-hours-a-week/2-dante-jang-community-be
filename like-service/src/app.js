const express = require("express");
const postRouter = require("./routes/likeRouter");
require('dotenv').config();

const app = express();
const { PORT } = process.env;

app.use(express.json());
app.use("/api/v1/likes", postRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
