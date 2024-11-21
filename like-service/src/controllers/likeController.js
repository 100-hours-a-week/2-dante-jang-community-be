const pool = require('../config/db');

exports.createLike = async (req, res) => {
    const { userId, postId } = req.body;
    if (!userId || !postId) {
        return res.status(400).json({ message: "userId and postId are required." });
    }

    try {
        const [result] = await pool.execute(
            `INSERT INTO \`like\` (user_id, post_id, create_at) VALUES (?, ?, NOW())`,
            [userId, postId]
        );

        res.status(201).json({
            message: "like created successfully",
            likeId: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create like" });
    }
}

exports.isMyLikePost = async (req, res) => {
    const { userId, postId } = req.params;
    if (!userId || !postId) {
        return res.status(400).json({ message: "userId and postId are required." });
    }

    try {
        const [result] = await pool.execute(
            `SELECT like_id FROM \`like\` WHERE user_id = ? AND post_id = ?`,
            [userId, postId]
        );

        res.status(200).json({
            message: "My like check successfully",
            isMyLikePost: (result.length > 0)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to check like" });
    }
}

exports.deleteLike = async (req, res) => {
    const { userId, postId } = req.params;

    if (!userId || !postId) {
        return res.status(400).json({ message: "userId and postId are required." });
    }

    try {
        const [result] = await pool.execute(
            `DELETE FROM \`like\` WHERE user_id = ? AND post_id = ?`,
            [userId, postId]
        );

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: "Like deleted successfully" });
        } else {
            return res.status(404).json({ message: "Like not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete like" });
    }
};

exports.getLikeCount = async (req, res) => {
    const { postId } = req.params;

    if (!postId) {
        return res.status(400).json({ message: "postId is required." });
    }

    try {
        const [result] = await pool.execute(
            `SELECT COUNT(*) AS likeCount FROM \`like\` WHERE post_id = ?`,
            [postId]
        );

        res.status(200).json({
            message: "Like count fetched successfully",
            likeCount: result[0].likeCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch like count" });
    }
};