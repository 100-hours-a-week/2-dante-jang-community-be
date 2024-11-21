const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const axios = require("axios");
require('dotenv').config();

const LIKE_SERVICE_URL = `${process.env.LIKE_SERVER_URL}/api/v1/likes`;

router.get("/posts/:postId", (req, res) => {
    const {postId} = req.params;

    axios.get(`${LIKE_SERVICE_URL}/posts/${postId}`)
        .then(response => res.json(response.data))
        .catch(error => res.status(error.response?.status || 500).json(error.response?.data || {}));
});

router.use(authMiddleware);

router.get("/posts/:postId/users", (req, res) => {
    const {postId} = req.params;
    const userId = req.session.userId;

    axios.get(`${LIKE_SERVICE_URL}/posts/${postId}/users/${userId}`)
        .then(response => res.json(response.data))
        .catch(error => res.status(error.response?.status || 500).json(error.response?.data || {}));
});

router.post("", (req, res) => {
    req.body.userId = req.session.userId;

    axios.post(`${LIKE_SERVICE_URL}`, req.body)
        .then(response => res.json(response.data))
        .catch(error => res.status(error.response?.status || 500).json(error.response?.data || {}));
});

router.delete("/posts/:postId/users", (req, res) => {
    const {postId} = req.params;
    const userId = req.session.userId;

    axios.delete(`${LIKE_SERVICE_URL}/posts/${postId}/users/${userId}`)
        .then(response => res.json(response.data))
        .catch(error => res.status(error.response?.status || 500).json(error.response?.data || {}));
});

module.exports = router;