const express = require("express");
const postRouter = require("./routes/postRouter");

const app = express();
const PORT = 9002;

app.use(express.json());
app.use("/post", postRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
