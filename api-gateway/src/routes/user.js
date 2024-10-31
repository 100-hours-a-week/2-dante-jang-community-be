const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const axios = require("axios");

const USER_SERVICE_URL = "http://localhost:9001/user";

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
      res.status(error.response?.status || 500).json(error.response?.data || {})
    });
});

router.patch("", (req, res) => {
  axios.patch(`${USER_SERVICE_URL}`, req.body, {headers: req.headers})
    .then(response => res.json(response.data))
    .catch(error => res.status(error.response?.status || 500).json(error.response?.data || {}));
});

router.patch("/change-password", (req, res) => {
  axios.patch(`${USER_SERVICE_URL}/change-password`, req.body, {headers: req.headers})
    .then(response => res.json(response.data))
    .catch(error => res.status(error.response?.status || 500).json(error.response?.data || {}));
});

router.delete("", (req, res) => {
  axios.delete(`${USER_SERVICE_URL}`, {headers: req.headers})
    .then(response => {
      res.clearCookie("connect.sid", { path: '/', httpOnly: true });
      res.json(response.data);
    })
    .catch(error => {
      res.status(error.response?.status || 500).json(error.response?.data || {})
    });
});


module.exports = router;