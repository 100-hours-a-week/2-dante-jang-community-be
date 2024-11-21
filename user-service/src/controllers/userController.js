const axios = require("axios")
const bcrypt = require("bcrypt");
const pool = require("../config/db");
require('dotenv').config();
const { IMAGE_SERVER_URL } = process.env;
const FormData = require("form-data");

exports.emailDuplicatedCheck = async (req, res) => {
    const { email } = req.query;
    try {
        const [result] = await pool.execute("SELECT email FROM `user` WHERE email = ?", [email]);

        if (result.length > 0) {
            res.status(200).json({ message: "Email already exists", isDuplicated: true });
        } else {
            res.status(200).json({ message: "Email is available", isDuplicated: false });
        }
    } catch (error) {
        console.error("Error in email duplicated check:", error);
        res.status(500).json({ error: "email duplicated check failed" });
    }
};

exports.nameDuplicatedCheck = async (req, res) => {
    const { name } = req.query;
    try {
        const [result] = await pool.execute("SELECT name FROM `user` WHERE name = ?", [name]);

        if (result.length > 0) {
            res.status(200).json({ message: "name already exists", isDuplicated: true });
        } else {
            res.status(200).json({ message: "name is available", isDuplicated: false });
        }
    } catch (error) {
        console.error("Error in name duplicated check:", error);
        res.status(500).json({ error: "name duplicated check failed" });
    }
};

exports.register = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.execute(
            "INSERT INTO `user` (name, email, password, created_at) VALUES (?, ?, ?, NOW())",
            [name, email, hashedPassword]
        );
        res.status(201).json({ message: "User registered successfully", userId: result.insertId });
    } catch (error) {
        console.error("Error in registration:", error);
        res.status(500).json({ error: "Registration failed" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await pool.execute("SELECT * FROM `user` WHERE email = ? AND deleted_at IS NULL", [email]);
        const user = rows[0];

        if (!user || !(await bcrypt.compare(password, user.password)) || user.deleted_at !== null) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        req.session.userId = user.user_id;

        let profileUrl = null;
        if (user.profile_id) {
            try {
                const profileResponse = await axios.get(`${IMAGE_SERVER_URL}/api/v1/images/${user.profile_id}`);
                profileUrl = profileResponse.data.url;
            } catch (profileError) {
                console.error("Error fetching profile image URL:", profileError);
            }
        }

        res.json({
            name: user.name,
            email: user.email,
            profile_url: profileUrl,
            message: "Login successful",
        });
        console.log("login success:", email);
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ error: "Login failed" });
    }
};

exports.logout = async (req, res) => {
    console.log("Logout :" + req.session.userId);
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Logout failed" });
        }
        res.clearCookie("connect.sid");
        res.json({ message: "Logout successful" });
    });
};

exports.userInfo = async (req, res) => {
    const userId = req.session.userId;
    console.log("User Info :" + req.session.userId);
    try {
        const [rows] = await pool.execute("SELECT * FROM user WHERE user_id = ? AND deleted_at IS NULL", [userId]);
        if (rows.length == 0) {
            return res.status(404).json({ message: "user not found" });
        }
        const user = rows[0];
        user.password = null;

        if (user.profile_id) {
            try {
                const profileResponse = await axios.get(`${IMAGE_SERVER_URL}/api/v1/images/${user.profile_id}`);
                user.profile_url = profileResponse.data.url;
            } catch (profileError) {
                console.error("Error fetching profile image URL:", profileError);
                user.profile_url = null;
            }
        } else {
            user.profile_url = null;
        }

        res.json({ user });
    } catch (error) {
        console.error("Get user info:", error);
        res.status(500).json({ error: "Get user info failed" });
    }
};

exports.userInfoInternal = async (req, res) => {
    const { userId } = req.params;

    try {
        const [rows] = await pool.execute("SELECT * FROM user WHERE user_id = ?", [userId]);        
        if (rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        const user = rows[0];
        user.password = null;

        if (user.profile_id) {
            try {
                const profileResponse = await axios.get(`${IMAGE_SERVER_URL}/api/v1/images/${user.profile_id}`);
                user.profile_url = profileResponse.data.url;
            } catch (profileError) {
                console.error("Error fetching profile image URL:", profileError);
                user.profile_url = null;
            }
        } else {
            user.profile_url = null;
        }
        res.json({user});
    } catch (error) {
        console.error("Get user info:", error);
        res.status(500).json({ error: "Get user info failed" });
    }
};

exports.changeProfile = async (req, res) => {
    const file = req.file;
    const userId = req.session.userId;

    try {
        const [userResult] = await pool.execute("SELECT user_id, profile_id FROM `user` WHERE user_id = ?", [userId]);
        if (userResult.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = userResult[0];
        let profileImageId = user.profile_id;
        let profileUrl = null;

        const formData = new FormData();
        formData.append("file", file.buffer, {
            filename: `${userId}-profile-${file.originalname}`,
            contentType: file.mimetype,
        });

        if (profileImageId) {
            const imageUpdateUrl = `${IMAGE_SERVER_URL}/api/v1/images/${profileImageId}`;
            const uploadResult = await axios.put(imageUpdateUrl, formData, {
                headers: formData.getHeaders(),
            });

            if (!uploadResult.data) {
                return res.status(500).json({ message: "Image update failed" });
            }
            profileUrl = uploadResult.data.url;
        } else {
            const imageUploadUrl = `${IMAGE_SERVER_URL}/api/v1/images`;
            const uploadResult = await axios.post(imageUploadUrl, formData, {
                headers: formData.getHeaders(),
            });

            if (!uploadResult.data) {
                return res.status(500).json({ message: "Image upload failed" });
            }

            profileImageId = uploadResult.data.image_id;
            profileUrl = updateResult.data.url;
        }

        const [updateResult] = await pool.execute(
            "UPDATE `user` SET profile_id = ? WHERE user_id = ?",
            [profileImageId, userId]
        );

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ message: "User not found or no changes made" });
        }
        res.json({ message: "User profile updated successfully", user: { userId, profile_url: profileUrl } });
    } catch (error) {
        console.error("Error change user profile:", error);
        res.status(500).json({ error: "User modification failed" });
    }
}

exports.changeName = async (req, res) => {
    const { name } = req.body;
    const userId = req.session.userId;

    try {
        const [nameCheckResult] = await pool.execute(
            "SELECT user_id FROM `user` WHERE name = ? AND user_id != ?",
            [name, userId]
        );

        if (nameCheckResult.length > 0) {
            return res.status(409).json({ message: "Nickname is already in use by another user" });
        }

        const [updateResult] = await pool.execute(
            "UPDATE `user` SET name = ? WHERE user_id = ?",
            [name, userId]
        );

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ message: "User not found or no changes made" });
        }

        res.json({ message: "User updated successfully", user: { userId, name } });
    } catch (error) {
        console.error("Error change user name:", error);
        res.status(500).json({ error: "User modification failed" });
    }
}

exports.checkPassword = async (req, res) => {
    const { password } = req.body;
    const userId = req.session.userId;

    try {
        const [rows] = await pool.execute("SELECT password FROM `user` WHERE user_id = ?", [userId]);
        if (rows.length <= 0) {
            return res.status(404).json({ message: "User not found" });
        }
        const userPassword = rows[0];

        if (await bcrypt.compare(password, userPassword.password)) {
            res.json({ message: "Password match", isMatch: true });
        } else {
            res.status(403).json({ message: "Password not match", isMatch: false });
        }
    } catch(error) {
        console.error("Error check password:", error);
        res.status(500).json({ error: "Password check failed" });
    }
};

exports.changePassword = async (req, res) => {
    const { password, checkPassword } = req.body;
    const userId = req.session.userId;

    if (password !== checkPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.execute(
            "UPDATE `user` SET password = ? WHERE user_id = ?",
            [hashedPassword, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found or password is unchanged" });
        }

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ error: "Password change failed" });
    }
};

exports.deleteUser = async (req, res) => {
    const userId = req.session.userId;

    try {
        const [result] = await pool.execute(
            "UPDATE `user` SET deleted_at = NOW() WHERE user_id = ?", 
            [userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: "Failed to delete user session" });
            }
            res.clearCookie("connect.sid");
            res.json({ message: "User deleted successfully" });
        });
    } catch (error) {
        console.error("Error in deleting user:", error);
        res.status(500).json({ error: "User deletion failed" });
    }
};

exports.userInfoWithName = async (req, res) => {
    const { userName } = req.params;

    try {
        const [rows] = await pool.execute("SELECT * FROM user WHERE name = ? AND deleted_at IS NULL", [userName]);
        if (rows.length == 0) {
            return res.status(404).json({ message: "user not found" });
        }
        const user = rows[0];
        user.password = null;

        if (user.profile_id) {
            try {
                const profileResponse = await axios.get(`${IMAGE_SERVER_URL}/api/v1/images/${user.profile_id}`);
                user.profile_url = profileResponse.data.url;
            } catch (profileError) {
                console.error("Error fetching profile image URL:", profileError);
                user.profile_url = null;
            }
        } else {
            user.profile_url = null;
        }

        res.status(200).json({ message: `Name : ${userName} find success`, user: user });
    } catch (error) {
        console.error("Get user info:", error);
        res.status(500).json({ error: `Get Name : ${userName} info failed` });
    }
};