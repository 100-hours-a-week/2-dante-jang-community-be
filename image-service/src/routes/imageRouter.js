const express = require("express");
const multer = require('multer');
const imageController = require("../controllers/imageController");

const router = express.Router();
const upload = multer();

router.post(``, upload.single('file'), imageController.uploadFile);

router.get(`/:id`, imageController.getImage);

router.put(`/:id`, upload.single('file'), imageController.updateImage);

router.delete(`/:id`, imageController.deleteImage);

module.exports = router;