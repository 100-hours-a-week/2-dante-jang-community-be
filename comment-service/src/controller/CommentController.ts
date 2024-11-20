import { Request, Response } from "express";
import { pool } from "../config/db";
import { fetchUserRequest } from "../api/user/UserApi";

export class CommentController {
    public async writeComment(req: Request, res: Response): Promise<void> {
        const { userId, postId, content } = req.body;

        try {
            const [result]: any = await pool.execute(
                `
                  INSERT INTO comment (user_id, post_id, content, written_at)
                  VALUES (?, ?, ?, NOW())
                `,
                [userId, postId, content]
            );

            if (result.affectedRows > 0) {
                res.status(201).json({
                    message: "Comment created successfully",
                    commentId: result.insertId,
                });
            } else {
                res.status(400).json({ message: "Failed to create comment" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to write comment" });
        }
    }

    public async getCommentsByPostId(req: Request, res: Response): Promise<void> {
        const { postId } = req.params;

        try {
            const [rows]: any = await pool.execute(
                `
            SELECT * FROM comment 
            WHERE post_id = ?
            ORDER BY written_at DESC
            `,
                [postId]
            );

            const filteredRows = await Promise.all(
                rows.map(async (comment: any) => {
                    const user = await fetchUserRequest(comment.user_id);
                    if (user) {
                        comment.user = user;
                        return comment;
                    }
                    return null;
                })
            );

            const validComments = filteredRows.filter((comment) => comment !== null);

            res.status(200).json({
                messsage: `post ${postId} comments fetch successful`,
                comments: validComments
            }
            );
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    public async deleteComment(req: Request, res: Response): Promise<void> {
        const { commentId, userId } = req.params;

        try {
            const [result]: any = await pool.execute(`
                DELETE FROM comment 
                WHERE comment_id = ? AND user_id = ?`,
                [commentId, userId]
            );

            if (result.affectedRows > 0) {
                res.status(200).json({ message: "Comment deleted successfully" });
            } else {
                res.status(404).json({ message: "Comment not found" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to delete comment" });
        }
    }
}

