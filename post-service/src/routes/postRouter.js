// routes/userRouter.js
const express = require("express");
const postController = require("../controllers/postController");

const router = express.Router();

router.post("", postController.write);

router.get("/:postId", postController.postDetail);
router.get("/users/:userId", postController.userPostList);
router.get("", postController.postList);

router.put("/:postId", postController.modify);

router.delete("/:postId/users/:userId", postController.deletePost);

module.exports = router;