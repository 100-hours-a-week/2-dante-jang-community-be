import "reflect-metadata";
import express from 'express';
import commentRouter from './routes/CommentRouter'
require('dotenv').config();

const app = express();
const { PORT } = process.env;

app.use(express.json());

app.use('/api/v1/comments', commentRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});