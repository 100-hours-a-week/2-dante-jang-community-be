const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const axios = require("axios");
require('dotenv').config();

const POST_SERVICE_URL = `${process.env.POST_SERVER_URL}/api/v1/posts`;

router.get("/users/:userId", (req, res)  => {
    const { userId } = req.params;

    axios.get(`${POST_SERVICE_URL}/users/${userId}`, {params: req.query})
        .then(response => res.json(response.data))
        .catch(error => res.status(error.response?.status || 500).json(error.response?.data || {}));
});

router.get("", (req, res)  => {
    axios.get(`${POST_SERVICE_URL}`, {params: req.query})
        .then(response => res.json(response.data))
        .catch(error => res.status(error.response?.status || 500).json(error.response?.data || {}));
});

router.get("/:postId", (req, res) => {
    const { postId } = req.params;

    axios.get(`${POST_SERVICE_URL}/${postId}`)
        .then(response => res.json(response.data))
        .catch(error => res.status(error.response?.status || 500).json(error.response?.data || {}));
});

router.use(authMiddleware);


router.post("", (req, res) => {
    req.body.userId = req.session.userId;

    axios.post(`${POST_SERVICE_URL}`, req.body)
        .then(response => res.json(response.data))
        .catch(error => res.status(error.response?.status || 500).json(error.response?.data || {}));
});

router.put("/:postId", (req, res) => {
    const { postId } = req.params;

    req.body.userId = req.session.userId;
    axios.put(`${POST_SERVICE_URL}/${postId}`, req.body)
        .then(response => res.json(response.data))
        .catch(error => res.status(error.response?.status || 500).json(error.response?.data || {}));
});

router.delete("/:postId", (req, res) => {
    const { postId } = req.params;
    const userId = req.session.userId;

    axios.delete(`${POST_SERVICE_URL}/${postId}/users/${userId}`)
        .then(response => res.json(response.data))
        .catch(error => res.status(error.response?.status || 500).json(error.response?.data || {}));
})

module.exports = router;