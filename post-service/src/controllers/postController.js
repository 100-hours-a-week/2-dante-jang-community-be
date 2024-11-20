const pool = require("../config/db");
const fetchUserRequest = require("../api/user/userApi");
const { getImageRequest, deleteImageRequest } = require("../api/image/ImageApi");
const { JSDOM } = require("jsdom");

exports.write = async (req, res) => {
    const { userId, title, content, image_url } = req.body;

    if (!userId || !content) {
        return res.status(400).json({ message: "user_id and content are required." });
    }

    try {
        const [result] = await pool.execute(
            `
          INSERT INTO post (user_id, title, content, written_at, image_id)
          VALUES (?, ?, ?, NOW(), ?)
        `
            , [userId, title, content, image_url || null]
        );

        res.status(201).json({
            message: "Post created successfully",
            postId: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create post" });
    }
};

exports.modify = async (req, res) => {
    const { postId } = req.params;
    const { userId, title, content, image_id } = req.body;

    if (!userId || !content || !postId) {
        return res.status(400).json({ message: "userId, postId, and content are required." });
    }

    try {
        const [prev] = await pool.execute(
            `SELECT image_id, content, user_id FROM post WHERE post_id = ?`,
            [postId]
        );

        if (userId != prev[0].user_id) {
            return res.status(403).json({ message: "You are not authorized to access this post." });
        }

        const prevDom = new JSDOM(prev[0].content);
        const prevDoc = prevDom.window.document;
        const prevImgTags = prevDoc.querySelectorAll('img');

        const dom = new JSDOM(content);
        const doc = dom.window.document;
        const imgTags = doc.querySelectorAll('img');

        prevImgTags.forEach(async (img) => {
            const imgId = img.getAttribute('src');
            if (!isNaN(imgId) && !imgTags[imgId]) {
                const deleteResponse = await deleteImageRequest(imgId);
                console.log(deleteResponse.message);
            }
        });

        if (prev[0].image_id && image_id != prev[0].image_id) {
            const deleteResponse = await deleteImageRequest(prev[0].image_id);
            console.log(deleteResponse.message);
        }

        const [result] = await pool.execute(
            `
                UPDATE post
                SET title = ?, content = ?, image_id = ?, written_at = NOW()
                WHERE user_id = ? AND post_id = ?
            `,
            [title, content, image_id || null, userId, postId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Post not found or user unauthorized." });
        }

        res.status(200).json({
            message: "Post modified successfully",
            postId: postId
        });
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ message: "Failed to modify post" });
    }
};

exports.postList = async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 30;
    const offset = (page - 1) * limit;

    try {
        const [posts] = await pool.execute(`
            SELECT post_id, user_id, title, written_at, image_id, view_count
            FROM post
            WHERE deleted_at IS NULL
            ORDER BY written_at DESC
            LIMIT ? OFFSET ?
        `, [limit, offset]);

        const postsWithUserNames = await Promise.all(posts.map(async (post) => {
            if (post.image_id) {
                const getImageResponse = await getImageRequest(post.image_id);
                if (getImageResponse.imgUrl) {
                    post.image_url = getImageResponse.imgUrl;
                } else {
                    post.image_url = null;
                }
            }

            const userResult = await fetchUserRequest(post.user_id);
            if (!userResult) {
                res.status(404).json({ message: "User has been deleted" });
            }

            return {
                post: {...post},
                user: userResult.user
            };
        }));

        res.status(200).json({message: `post list get success count : ${postsWithUserNames.length}`, posts : postsWithUserNames});
    } catch (error) {
        console.error("Error retrieving posts:", error);
        res.status(500).json({ message: "Failed to retrieve posts" });
    }
};

exports.postDetail = async (req, res) => {
    const { postId } = req.params;

    const imageProcessing = async (content) => {
        const dom = new JSDOM(content);
        const doc = dom.window.document;
        const imgTags = doc.querySelectorAll('img');

        const promises = Array.from(imgTags).map(async (img) => {
            const src = img.getAttribute('src');
            if (src && !isNaN(src)) {
                const getImageReposne = await getImageRequest(src);
                if (getImageReposne) {
                    img.setAttribute('src', getImageReposne.imgUrl);
                }
            }
        });

        await Promise.all(promises);
        return dom.serialize();
    }

    try {
        const [result] = await pool.execute("SELECT * FROM `post` WHERE post_id = ? AND deleted_at IS NULL", [postId]);
        if (result.length === 0) {
            return res.status(404).json({ error: "Post not found" });
        }
        const post = result[0];
        post.content = await imageProcessing(post.content);
        if (post.image_id) {
            const getImageReposne = await getImageRequest(post.image_id);
            if (getImageReposne) {
                post.image_url = getImageReposne.imgUrl;
            }
        }

        const userResult = await fetchUserRequest(post.user_id);
        if (!userResult) {
            return res.status(404).json({ error: "writter not found" });
        }

        await pool.execute(`
            UPDATE post
            SET view_count = ?
            WHERE post_id = ?`,
            [post.view_count+1, post.post_id]
        );

        return res.status(200).json({
            message: `post : ${post.post_id}`,
            post: {...post},
            user: userResult.user
        });
    } catch (error) {
        console.error("Error retrieving post details:", error);
        return res.status(500).json({ error: "Failed to retrieve post details" });
    }
};

exports.deletePost = async (req, res) => {
    const { postId, userId } = req.params;
    try {
        const [result] = await pool.execute(
            `
                UPDATE post
                SET deleted_at = NOW()
                WHERE user_id = ? AND post_id = ?
            `,
            [userId, postId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Post not found or user unauthorized." });
        }

        res.status(200).json({message: "Post delete successfully", postId: postId});
    } catch (error) {
        console.error("Error retrieving post details:", error);
        return res.status(500).json({ error: "Failed to retrieve post details" });
    }
};