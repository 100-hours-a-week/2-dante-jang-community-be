const cors = require('cors');
const express = require('express');
require('dotenv').config();
const { PORT } = process.env;
const imageRouter = require('./routes/imageRouter');

const app = express();
const port = PORT || 9003;

app.use(cors());
app.use(express.json());
app.use('/api/v1/images', imageRouter)

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});