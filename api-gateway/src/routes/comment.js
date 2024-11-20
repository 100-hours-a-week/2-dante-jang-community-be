const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const axios = require("axios");
require('dotenv').config();

const COMMENT_SERVICE_URL = `${process.env.COMMENT_SERVER_URL}/api/v1/comments`;

router.get("/posts/:postId", (req, res) => {
    const { postId } = req.params;

    axios.get(`${COMMENT_SERVICE_URL}/posts/${postId}`)
        .then(response => res.json(response.data))
        .catch(error => res.status(error.response?.status || 500).json(error.response?.data || {}));
});

router.use(authMiddleware);

router.post("", (req, res) => {
    req.body.userId = req.session.userId;

    axios.post(`${COMMENT_SERVICE_URL}`, req.body)
        .then(response => res.json(response.data))
        .catch(error => res.status(error.response?.status || 500).json(error.response?.data || {}));
});

router.delete("/:commentId", (req, res) => {
    const { commentId } = req.params;
    const userId = req.session.userId;
    axios.delete(`${COMMENT_SERVICE_URL}/${commentId}/users/${userId}`)
        .then(response => res.json(response.data))
        .catch(error => res.status(error.response?.status || 500).json(error.response?.data || {}));
})

module.exports = router;