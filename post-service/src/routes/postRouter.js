// routes/userRouter.js
const express = require("express");
const postController = require("../controllers/postController");

const router = express.Router();

router.post("", postController.write);

router.get("", postController.postList);
router.get("/:postId", postController.postDetail);

router.put("/:postId", postController.modify);

router.delete("/:postId/users/:userId", postController.deletePost);

module.exports = router;