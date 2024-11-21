const express = require("express");
const likeController = require("../controllers/likeController");

const router = express.Router();

router.post("", likeController.createLike);

router.get("/posts/:postId/users/:userId", likeController.isMyLikePost);
router.get("/posts/:postId", likeController.getLikeCount);

router.delete("/posts/:postId/users/:userId", likeController.deleteLike);

module.exports = router;