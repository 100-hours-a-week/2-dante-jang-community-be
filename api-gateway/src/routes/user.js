const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const axios = require("axios");
const FormData = require("form-data");
const multer = require("multer");
require('dotenv').config();

const USER_SERVICE_URL = `${process.env.USER_SERVER_URL}/api/v1/users`;
const upload = multer();

router.post("/login", (req, res) => {
    axios.post(`${USER_SERVICE_URL}/login`, req.body)
        .then(response => {
            res.setHeader('Set-Cookie', response.headers['set-cookie']);
            res.json(response.data);
        })
        .catch(error => res.status(error.response?.status || 500).json(error.response?.data || {}));
});

router.post("", (req, res) => {
    axios.post(`${USER_SERVICE_URL}`, req.body)
        .then(response => res.json(response.data))
        .catch(error => res.status(error.response?.status || 500).json(error.response?.data || {}));
});

router.get("/check-email", (req, res) => {
    axios.get(`${USER_SERVICE_URL}/check-email`, {
        params: { email: req.query.email }
    })
        .then(response => res.json(response.data))
        .catch(error => {
            console.error("Error in email check:", error.message);
            res.status(error.response?.status || 500).json(error.response?.data || {})
        });
});

router.get("/check-name", (req, res) => {
    axios.get(`${USER_SERVICE_URL}/check-name`, {
        params: { name: req.query.name }
    })
        .then(response => res.json(response.data))
        .catch(error => {
            console.error("Error in name check:", error.message);
            res.status(error.response?.status || 500).json(error.response?.data || {})
        });
});

router.get("/name/:userName", (req, res) => {
    const {userName} = req.params;
    axios.get(`${USER_SERVICE_URL}/name/${userName}`)
        .then(response => res.json(response.data))
        .catch(error => res.status(error.response?.status || 500).json(error.response?.data || {}));
});

// 인증 후 진행
router.use(authMiddleware);

router.get("", (req, res) => {
    axios.get(`${USER_SERVICE_URL}`, { headers: req.headers })
        .then(response => res.json(response.data))
        .catch(error => res.status(error.response?.status || 500).json(error.response?.data || {}));
});

router.post("/logout", (req, res) => {
    axios.post(`${USER_SERVICE_URL}/logout`, {}, { headers: req.headers })
        .then(response => {
            res.clearCookie("connect.sid", { path: '/', httpOnly: true });
            res.json(response.data);
        })
        .catch(error => {
            console.log(error);
            res.status(error.response?.status || 500).json(error.response?.data || {})
        });
});

router.post("/check-password", (req, res) => {
    axios.post(`${USER_SERVICE_URL}/check-password`, req.body, { headers: req.headers })
        .then(response => res.json(response.data))
        .catch(error => res.status(error.response?.status || 500).json(error.response?.data || {}));
})

router.patch("/change-profile", upload.single("profileImage"), async (req, res) => {
    try {
        const formData = new FormData();

        for (const key in req.body) {
            formData.append(key, req.body[key]);
        }

        if (req.file) {
            formData.append("profileImage", req.file.buffer, {
                filename: req.file.originalname,
                contentType: req.file.mimetype,
            });
        }

        const response = await axios.patch(
            `${USER_SERVICE_URL}/change-profile`,
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    cookie: req.headers.cookie,
                }
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error("Error forwarding request:", error);
        res.status(error.response?.status || 500).json(error.response?.data || { message: "Server error" });
    }
});

router.patch("/change-name", (req, res) => {
    axios.patch(`${USER_SERVICE_URL}/change-name`, req.body, { headers: req.headers })
        .then(response => res.json(response.data))
        .catch(error => res.status(error.response?.status || 500).json(error.response?.data || {}));
})

router.patch("/change-password", (req, res) => {
    axios.patch(`${USER_SERVICE_URL}/change-password`, req.body, { headers: req.headers })
        .then(response => res.json(response.data))
        .catch(error => res.status(error.response?.status || 500).json(error.response?.data || {}));
});

router.delete("", (req, res) => {
    axios.delete(`${USER_SERVICE_URL}`, { headers: req.headers })
        .then(response => {
            res.clearCookie("connect.sid", { path: '/', httpOnly: true });
            res.json(response.data);
        })
        .catch(error => {
            res.status(error.response?.status || 500).json(error.response?.data || {})
        });
});


module.exports = router;