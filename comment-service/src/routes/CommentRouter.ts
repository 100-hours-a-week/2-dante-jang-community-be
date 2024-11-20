import { Router } from "express";
import { CommentController } from "../controller/CommentController";
import { validationMiddleware } from "../middleware/ValidateMiddleware";
import { WriteCommentDto } from "../dto/CommentDto";

const router = Router();
const commentController = new CommentController();

router.post("", validationMiddleware(WriteCommentDto), commentController.writeComment);
router.get("/posts/:postId", commentController.getCommentsByPostId);
router.delete("/:commentId/users/:userId", commentController.deleteComment);

export default router;