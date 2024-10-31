// routes/userRouter.js
const express = require("express");
const postController = require("../controllers/postController");

const router = express.Router();

router.post("", postController.write);

router.get("/list", postController.postList);
router.get("", postController.postDetail);
router.get("/modify", postController.modifyPostDetail);

router.put("", postController.modify);

module.exports = router;