const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const axios = require("axios");
const FormData = require("form-data");
const multer = require("multer");
require('dotenv').config();

const IMAGE_SERVICE_URL = `${process.env.IMAGE_SERVER_URL}/api/v1/images`;
const upload = multer();

router.use(authMiddleware);

router.post("", upload.single('file'), async (req, res) => {
    try {
        const fileName = req.fileName;
        const formData = new FormData();
        formData.append("file", req.file.buffer, {
            filename: fileName,
            contentType: req.file.mimetype
        });

        const response = await axios.post(
            `${IMAGE_SERVICE_URL}`,
            formData,
            {headers: {...formData.getHeaders()}}
        );
        res.json(response.data);
    } catch (error) {
        console.error("Upload Image Error forwarding request:", error);
        res.status(error.response?.status || 500).json(error.response?.data || { message: "Server error" });
    }
})

module.exports = router;