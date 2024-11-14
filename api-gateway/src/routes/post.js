const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const axios = require("axios");
require('dotenv').config();

const POST_SERVICE_URL = `${process.env.POST_SERVER_URL}/api/v1/posts`;

router.get("/list", (req, res)  => {
    axios.get(`${POST_SERVICE_URL}/list`, {})
        .then(response => res.json(response.data))
        .catch(error => res.status(error.response?.status || 500).json(error.response?.data || {}));
});

router.get("", (req, res) => {
    axios.get(`${POST_SERVICE_URL}`, {
        params: {
            postId: req.query.postId,
            userId: req.session.userId || null
        }
    })
        .then(response => res.json(response.data))
        .catch(error => res.status(error.response?.status || 500).json(error.response?.data || {}));
});

router.use(authMiddleware);

router.get("/modify", (req, res) => {
    axios.get(`${POST_SERVICE_URL}`, {
        params: {
            postId: req.query.postId,
            userId: req.session.userId
        }
    })
        .then(response => res.json(response.data))
        .catch(error => res.status(error.response?.status || 500).json(error.response?.data || {}));
});


router.post("", (req, res) => {
    req.body.userId = req.session.userId;

    axios.post(`${POST_SERVICE_URL}`, req.body)
        .then(response => res.json(response.data))
        .catch(error => res.status(error.response?.status || 500).json(error.response?.data || {}));
});

router.put("", (req, res) => {
    req.body.userId = req.session.userId;
    req.body.postId = req.query.postId;

    axios.put(`${POST_SERVICE_URL}`, req.body)
        .then(response => res.json(response.data))
        .catch(error => res.status(error.response?.status || 500).json(error.response?.data || {}));
});

module.exports = router;