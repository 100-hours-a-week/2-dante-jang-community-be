const pool = require("../config/db");
const api = require("../api/api");

exports.write = async (req, res) => {
    const { userId, title, content, image_url } = req.body;
  
    if (!userId || !content) {
      return res.status(400).json({ message: "user_id and content are required." });
    }

    console.log(content);
  
    try {
      const [result] = await pool.execute(
        `
          INSERT INTO post (user_id, title, content, writed_at, image_id)
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
  const { postId, userId, title, content, image_url } = req.body;

  if (!userId || !content || !postId) {
    return res.status(400).json({ message: "userId, postId, and content are required." });
  }

  try {
    const [result] = await pool.execute(
      `
        UPDATE post
        SET title = ?, content = ?, image_url = ?, writed_at = NOW()
        WHERE user_id = ? AND post_id = ?
      `,
      [title, content, image_url || null, userId, postId]
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
  try {
      const [posts] = await pool.execute(`
          SELECT post_id, user_id, title, writed_at, image_url, view_count
          FROM post
          ORDER BY writed_at DESC
      `);
      
      const postsWithUserNames = await Promise.all(posts.map(async (post) => {
          const [user_name, profile_url] = await api.fetchUser(post.user_id);
          return {
              ...post,
              user_name,
              profile_url
          };
      }));

      res.status(200).json(postsWithUserNames);
  } catch (error) {
      console.error("Error retrieving posts:", error);
      res.status(500).json({ message: "Failed to retrieve posts" });
  }
};

exports.postDetail = async (req, res) => {
  const userId = req.query.userId;
  const postId = req.query.postId;

  try {
    let isMyPost = false;
    const comment_list = [];

    const [result] = await pool.execute("SELECT * FROM `post` WHERE post_id = ?", [postId]);

    if (result.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    const post = result[0];

    const userResult = await api.fetchUser(post.user_id);
    const [user_name, profile_url] = userResult || [null, null];

    if (Number(userId) === Number(post.user_id)) {
      isMyPost = true;
    }

    return res.status(200).json({
        ...post,
        user_name,
        profile_url,
        isMyPost,
        comment_list
    });
  } catch (error) {
    console.error("Error retrieving post details:", error);
    return res.status(500).json({ error: "Failed to retrieve post details" });
  }
};

exports.modifyPostDetail = async (req, res) => {
  const userId = req.query.userId;
  const postId = req.query.postId;

  try {
    const [result] = await pool.execute("SELECT * FROM `post` WHERE post_id = ?", [postId]);

    if (result.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    const post = result[0];

    if (Number(userId) !== Number(post.user_id)) {
      return res.status(500).json({ error: "Failed to retrieve post details" });
    }

    return res.status(200).json({
        ...post
    });
  } catch (error) {
    console.error("Error retrieving post details:", error);
    return res.status(500).json({ error: "Failed to retrieve post details" });
  }
};