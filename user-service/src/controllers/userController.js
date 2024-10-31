const bcrypt = require("bcrypt");
const pool = require("../config/db");

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
}

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
        const [rows] = await pool.execute("SELECT * FROM `user` WHERE email = ?", [email]);
        const user = rows[0];

        if (!user || !(await bcrypt.compare(password, user.password)) || user.deleted_at !== null) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        req.session.userId = user.user_id;
        res.json({ message: "Login successful" });
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
        const [rows] = await pool.execute("SELECT * FROM user WHERE user_id = ?", [userId]);
        rows[0].password = null;
        res.json({rows});
    } catch (error) {
        console.error("Get user info:", error);
        res.status(500).json({ error: "Get user info failed" });
    }
}

exports.userInfoInternal = async (req, res) => {
    const userId = req.query.userId;

    try {
        const [rows] = await pool.execute("SELECT * FROM user WHERE user_id = ?", [userId]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = rows[0];
        user.password = null;

        res.json(user);
    } catch (error) {
        console.error("Get user info:", error);
        res.status(500).json({ error: "Get user info failed" });
    }
}

exports.modifyUser = async (req, res) => {
    console.log("called");
    const { name } = req.body;
    const userId = req.session.userId;
    try {
        const [result] = await pool.execute(
            "UPDATE `user` SET name = ? WHERE user_id = ?",
            [name, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found or name is unchanged" });
        }

        res.json({ message: "Name updated successfully" });
    } catch (error) {
        console.error("Error updating user name:", error);
        res.status(500).json({ error: "User modification failed" });
    }
}

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
}

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